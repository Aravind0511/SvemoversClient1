import concurrent.futures
import math
import statistics
import sys
import time
import requests

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def run_stress_test(base_url: str, concurrency_levels=[10, 25, 50], requests_per_level=100, label=""):
    print(f"\n=======================================================")
    print(f"  PROFESSIONAL LOAD & STRESS BENCHMARK: {label}")
    print(f"  Target: {base_url}")
    print(f"=======================================================")

    test_paths = [
        '/',
        '/services/50ft-long-reach-service.jpg',
        '/equipment/hitachi-50ft-long-reach-v2.jpg',
        '/logo.jpg'
    ]

    session = requests.Session()
    # Warmup connection
    try:
        r = session.get(base_url + '/', timeout=5)
        if r.status_code != 200:
            print(f"[WARN] Target returned status code {r.status_code}")
    except Exception as e:
        print(f"[FAIL] Unable to connect to target {base_url}: {e}")
        return False

    all_results = {}

    for c in concurrency_levels:
        print(f"\n--- Running Load Stage: {c} Concurrent Virtual Users ({requests_per_level} requests) ---")
        latencies = []
        statuses = []
        errors = 0

        def worker(req_idx):
            path = test_paths[req_idx % len(test_paths)]
            url = base_url.rstrip('/') + path
            t0 = time.perf_counter()
            try:
                resp = requests.get(url, timeout=10)
                elapsed = (time.perf_counter() - t0) * 1000.0  # in ms
                return resp.status_code, elapsed, None
            except Exception as err:
                elapsed = (time.perf_counter() - t0) * 1000.0
                return 0, elapsed, str(err)

        start_time = time.perf_counter()
        with concurrent.futures.ThreadPoolExecutor(max_workers=c) as executor:
            futures = [executor.submit(worker, i) for i in range(requests_per_level)]
            for f in concurrent.futures.as_completed(futures):
                code, elapsed, err = f.result()
                statuses.append(code)
                latencies.append(elapsed)
                if code < 200 or code >= 400:
                    errors += 1

        total_wall_time = time.perf_counter() - start_time
        latencies.sort()

        p50 = latencies[int(math.floor(len(latencies) * 0.50))]
        p90 = latencies[int(math.floor(len(latencies) * 0.90))]
        p95 = latencies[int(math.floor(len(latencies) * 0.95))]
        p99 = latencies[min(int(math.floor(len(latencies) * 0.99)), len(latencies) - 1)]

        mean_lat = statistics.mean(latencies)
        min_lat = min(latencies)
        max_lat = max(latencies)
        rps = requests_per_level / total_wall_time
        error_pct = (errors / requests_per_level) * 100.0

        print(f"  Throughput:           {rps:.2f} Requests/sec")
        print(f"  Duration:             {total_wall_time:.3f} s")
        print(f"  Error Rate:           {error_pct:.2f}% ({errors}/{requests_per_level})")
        print(f"  Mean Latency:         {mean_lat:.2f} ms")
        print(f"  Min / Max Latency:    {min_lat:.2f} ms / {max_lat:.2f} ms")
        print(f"  Percentile p50:       {p50:.2f} ms")
        print(f"  Percentile p90:       {p90:.2f} ms")
        print(f"  Percentile p95:       {p95:.2f} ms")
        print(f"  Percentile p99:       {p99:.2f} ms")

        all_results[c] = {
            'rps': rps,
            'mean': mean_lat,
            'p50': p50,
            'p90': p90,
            'p95': p95,
            'p99': p99,
            'error_pct': error_pct
        }

    return all_results

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else 'https://svem01.github.io/svem'
    run_stress_test(target, concurrency_levels=[10, 25, 50], requests_per_level=100, label="Production CDN")
