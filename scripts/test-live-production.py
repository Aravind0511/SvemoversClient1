import re
import requests
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = 'https://svem01.github.io/svem'

print(f'=== LIVE PRODUCTION HTTP END-TO-END AUDIT ===\nTarget: {BASE_URL}\n')

passed = 0
failures = 0

def assert_check(condition, msg):
    global passed, failures
    if condition:
        print(f'[PASS] {msg}')
        passed += 1
    else:
        print(f'[FAIL] {msg}')
        failures += 1

session = requests.Session()
session.headers.update({
    'User-Agent': 'SVEM-Professional-QA-TestSuite/1.0'
})

# 1. Test Root Index Page
try:
    r_index = session.get(BASE_URL + '/', timeout=15)
    assert_check(r_index.status_code == 200, f'Root URL returns HTTP 200 (Got {r_index.status_code})')
    assert_check('Sri Venkateshwara Earth Movers' in r_index.text, 'Root HTML contains Brand Title')
    assert_check('id="root"' in r_index.text, 'Root HTML contains React mount node #root')
    assert_check('name="viewport"' in r_index.text, 'Root HTML contains mobile responsive viewport meta')
except Exception as e:
    assert_check(False, f'Failed to request Root URL: {e}')

# 2. Test 404 SPA Fallback Page
try:
    r_404 = session.get(BASE_URL + '/404.html', timeout=15)
    assert_check(r_404.status_code == 200, f'404.html returns HTTP 200 (Got {r_404.status_code})')
    assert_check('id="root"' in r_404.text, '404.html contains React mount node #root')
except Exception as e:
    assert_check(False, f'Failed to request 404.html: {e}')

# 3. Extract and Test Bundled JS and CSS Assets
try:
    scripts = re.findall(r'<script[^>]+src="([^">]+)"', r_index.text)
    styles = re.findall(r'<link[^>]+href="([^">]+\.css)"', r_index.text)

    for s in scripts:
        full_s = s if s.startswith('http') else 'https://svem01.github.io' + s
        r_s = session.get(full_s, timeout=10)
        assert_check(r_s.status_code == 200, f'Live JS bundle accessible: {s} ({len(r_s.content)} bytes)')
        # Check that the bundle contains updated service states and owner phone
        assert_check('9944745410' in r_s.text, 'Live JS bundle contains owner phone +91 9944745410')
        assert_check('Tamil Nadu' in r_s.text, 'Live JS bundle contains Tamil Nadu service coverage')
        assert_check('Karnataka' in r_s.text, 'Live JS bundle contains Karnataka service coverage')
        assert_check('Kerala' in r_s.text, 'Live JS bundle contains Kerala service coverage')
        assert_check('Andhra Pradesh' in r_s.text, 'Live JS bundle contains Andhra Pradesh service coverage')

        # Check dynamic route chunks
        dynamic_chunks = re.findall(r'["\']([a-zA-Z0-9_\-\.\/]*ServicesPage-[a-zA-Z0-9_\-]+\.js)["\']', r_s.text)
        if dynamic_chunks:
            chunk_rel = dynamic_chunks[0].lstrip('./')
            if not chunk_rel.startswith('assets/'):
                chunk_rel = 'assets/' + chunk_rel
            chunk_url = f'{BASE_URL}/{chunk_rel}'
            r_chunk = session.get(chunk_url, timeout=10)
            assert_check(r_chunk.status_code == 200, f'Dynamic ServicesPage chunk accessible: {chunk_rel}')
            assert_check('50ft-long-reach-service.jpg' in r_chunk.text, 'ServicesPage chunk references updated 50ft long reach service image')
        else:
            assert_check('50ft-long-reach-service.jpg' in r_s.text, 'Live JS bundle references updated 50ft long reach service image')

    for c in styles:
        full_c = c if c.startswith('http') else 'https://svem01.github.io' + c
        r_c = session.get(full_c, timeout=10)
        assert_check(r_c.status_code == 200, f'Live CSS bundle accessible: {c} ({len(r_c.content)} bytes)')
except Exception as e:
    assert_check(False, f'Failed to parse/fetch bundles: {e}')

# 4. Test All Primary Live Equipment, Service & Worksite Media Assets
live_assets = [
    ('/logo.jpg', 10000),
    ('/services/50ft-long-reach-service.jpg', 10000),
    ('/equipment/hitachi-50ft-long-reach-v2.jpg', 10000),
    ('/equipment/hitachi-long-reach-50ft.jpg', 10000),
    ('/equipment/all-vehicles-fleet.jpg', 10000),
    ('/equipment/all-vehicles-fleet-v2.jpg', 10000),
    ('/equipment/hitachi-140.jpg', 10000),
    ('/equipment/hitachi-215.jpg', 10000),
    ('/equipment/hitachi-220.jpg', 10000),
    ('/equipment/rock-breaker.jpg', 10000),
    ('/equipment/tipper-lorry.jpg', 10000),
    ('/equipment/compressor-blasting.jpg', 10000),
    ('/equipment/jcb-3dx.jpg', 10000),
    ('/gallery/long-reach-50ft-trench.jpg', 10000),
    ('/gallery/long-reach-50ft-action.jpg', 10000),
    ('/gallery/rock-breaker-action.jpg', 10000),
    ('/gallery/hitachi-220-quarry.jpg', 10000),
    ('/gallery/hitachi-140-hilltop.jpg', 10000),
    ('/gallery/tipper-fleet-site.jpg', 10000),
    ('/gallery/kobelco-220-field.jpg', 10000),
    ('/gallery/robex-215-earthwork.jpg', 10000),
    ('/gallery/sany-breaker-quarry.jpg', 10000),
    ('/gallery/compressor-tractor.jpg', 10000),
    ('/gallery/bharatbenz-tipper-front.jpg', 10000),
    ('/gallery/kobelco-220-closeup.jpg', 10000)
]

for path_suffix, min_bytes in live_assets:
    try:
        r = session.get(BASE_URL + path_suffix, timeout=10)
        assert_check(r.status_code == 200, f'Asset {path_suffix} returns HTTP 200')
        assert_check(len(r.content) >= min_bytes, f'Asset {path_suffix} has non-empty payload ({len(r.content)} bytes)')
    except Exception as e:
        assert_check(False, f'Failed to request {path_suffix}: {e}')

print(f'\nLive Production Audit Summary: {passed} passed, {failures} failed.')
if failures > 0:
    sys.exit(1)
