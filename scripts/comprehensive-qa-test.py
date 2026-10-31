import asyncio
import http.server
import json
import os
import shutil
import socketserver
import subprocess
import sys
import tempfile
import threading
import time
import urllib.request
import websockets

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PORT = 4182
DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dist'))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
SCREENSHOTS_DIR = r"C:\Users\aravi\.gemini\antigravity\brain\50b1d332-dfab-4a07-b7be-01db7a3bca4f\scratch\screenshots"

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

class SilentHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        pass

# Start HTTP server
httpd = socketserver.TCPServer(("", PORT), SilentHandler)
server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
server_thread.start()
time.sleep(0.5)

passed = 0
failed = 0

def record(ok, name, detail=""):
    global passed, failed
    if ok:
        print(f"✅ PASS: {name}", flush=True)
        passed += 1
    else:
        print(f"❌ FAIL: {name} - {detail}", flush=True)
        failed += 1

class CDPClient:
    def __init__(self, ws_url):
        self.ws_url = ws_url
        self.msg_id = 0
        self.ws = None

    async def connect(self):
        self.ws = await websockets.connect(self.ws_url, max_size=50_000_000)

    async def call(self, method, params=None):
        self.msg_id += 1
        payload = {"id": self.msg_id, "method": method, "params": params or {}}
        await self.ws.send(json.dumps(payload))
        while True:
            try:
                resp_raw = await asyncio.wait_for(self.ws.recv(), timeout=15)
            except asyncio.TimeoutError:
                raise Exception(f"CDP timeout waiting for response to {method}")
            resp = json.loads(resp_raw)
            if resp.get("id") == self.msg_id:
                if "error" in resp:
                    raise Exception(f"CDP Error in {method}: {resp['error']}")
                return resp.get("result", {})

    async def evaluate(self, expr):
        res = await self.call("Runtime.evaluate", {
            "expression": expr,
            "returnByValue": True,
            "awaitPromise": True
        })
        val = res.get("result", {})
        return val.get("value")

    async def set_viewport(self, width, height):
        await self.call("Emulation.setDeviceMetricsOverride", {
            "width": width,
            "height": height,
            "deviceScaleFactor": 1,
            "mobile": width <= 768
        })

    async def navigate(self, url):
        if "#" in url:
            hash_part = url.split("#")[1]
            cur = await self.evaluate("window.location.href")
            if not cur or f":{PORT}" not in cur:
                await self.call("Page.navigate", {"url": f"http://localhost:{PORT}/index.html#{hash_part}"})
                await asyncio.sleep(0.7)
            else:
                await self.evaluate(f"window.location.hash = '#{hash_part}'")
                await asyncio.sleep(0.5)
        else:
            await self.call("Page.navigate", {"url": url})
            await asyncio.sleep(0.7)

    async def screenshot(self, filename):
        res = await self.call("Page.captureScreenshot", {"format": "png"})
        import base64
        data = base64.b64decode(res["data"])
        path = os.path.join(SCREENSHOTS_DIR, filename)
        with open(path, "wb") as f:
            f.write(data)
        return path

async def run_tests():
    user_data_dir = tempfile.mkdtemp(prefix="chrome_qa_")
    chrome_proc = subprocess.Popen([
        CHROME_PATH,
        "--headless=new",
        f"--user-data-dir={user_data_dir}",
        "--remote-debugging-port=9225",
        "--remote-allow-origins=*",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--hide-scrollbars",
        "about:blank"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    try:
        # Wait for Chrome CDP endpoint
        time.sleep(1.2)
        target_info = None
        for _ in range(20):
            try:
                with urllib.request.urlopen("http://localhost:9225/json") as r:
                    targets = json.loads(r.read().decode())
                    pages = [t for t in targets if t.get('type') == 'page']
                    if pages:
                        target_info = pages[0]
                        break
            except Exception:
                await asyncio.sleep(0.3)

        if not target_info:
            print("❌ FAIL: Could not connect to Chrome DevTools endpoint")
            return

        ws_url = target_info["webSocketDebuggerUrl"]
        cdp = CDPClient(ws_url)
        await cdp.connect()
        await cdp.call("Page.enable")
        await cdp.call("Runtime.enable")
        await cdp.call("Page.navigate", {"url": f"http://localhost:{PORT}/index.html#/"})
        await asyncio.sleep(1.2)

        print("\n=== 1. MOBILE RESPONSIVENESS & HORIZONTAL OVERFLOW AUDIT ===")
        viewports = [
            (320, 640), (360, 640), (375, 667), (390, 844),
            (414, 896), (430, 932), (768, 1024), (1024, 768),
            (1280, 800), (1440, 900)
        ]

        pages = [
            ("Home", f"http://localhost:{PORT}/#/"),
            ("About Us", f"http://localhost:{PORT}/#/about"),
            ("Equipment", f"http://localhost:{PORT}/#/equipment"),
            ("Services", f"http://localhost:{PORT}/#/services"),
            ("Gallery", f"http://localhost:{PORT}/#/gallery"),
            ("Booking", f"http://localhost:{PORT}/#/booking"),
            ("Contact", f"http://localhost:{PORT}/#/contact")
        ]

        for w, h in viewports:
            await cdp.set_viewport(w, h)
            # Test key pages for horizontal overflow
            for pname, purl in pages:
                await cdp.navigate(purl)
                await asyncio.sleep(0.15)
                is_overflow = await cdp.evaluate("""
                    (() => {
                        const root = document.documentElement;
                        const body = document.body;
                        const maxW = Math.max(root.scrollWidth, body.scrollWidth);
                        return maxW > window.innerWidth + 1;
                    })()
                """)
                scroll_w = await cdp.evaluate("Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)")
                record(not is_overflow, f"Viewport {w}px ({pname}): No horizontal overflow", f"scrollWidth={scroll_w} > innerWidth={w}")

        print("\n=== 2. MOBILE NAVIGATION DRAWER & TOUCH INTERACTION ===")
        await cdp.set_viewport(375, 812)
        await cdp.navigate(f"http://localhost:{PORT}/#/")
        await asyncio.sleep(0.2)

        # Click hamburger menu
        drawer_opened = await cdp.evaluate("""
            (() => {
                const btn = document.querySelector('.svem-mobile-toggle');
                if (!btn) return false;
                btn.click();
                return true;
            })()
        """)
        await asyncio.sleep(0.3)
        drawer_visible = await cdp.evaluate("""
            (() => {
                const drawer = document.querySelector('.svem-mobile-drawer-open');
                const backdrop = document.querySelector('.svem-mobile-backdrop');
                const bodyLocked = document.body.style.overflow === 'hidden';
                return !!(drawer && backdrop && bodyLocked);
            })()
        """)
        record(drawer_opened and drawer_visible, "Mobile Hamburger opens navigation drawer & locks body scroll")

        # Click nav link inside drawer to navigate to Equipment
        link_navigated = await cdp.evaluate("""
            (() => {
                const link = Array.from(document.querySelectorAll('.svem-mobile-nav-link')).find(el => el.textContent.trim() === 'Equipment');
                if (!link) return false;
                link.click();
                return true;
            })()
        """)
        await asyncio.sleep(0.4)
        drawer_closed = await cdp.evaluate("""
            (() => {
                const drawerOpen = document.querySelector('.svem-mobile-drawer-open');
                const bodyUnlocked = document.body.style.overflow !== 'hidden';
                const onEq = window.location.hash.includes('equipment');
                return !drawerOpen && bodyUnlocked && onEq;
            })()
        """)
        record(link_navigated and drawer_closed, "Selecting nav link closes drawer, unlocks body scroll & navigates cleanly")

        print("\n=== 3. WHATSAPP & EMAIL BOOKING SYSTEM VALIDATION ===")
        await cdp.navigate(f"http://localhost:{PORT}/#/booking")
        await asyncio.sleep(0.5)

        # 3a: Verify top direct booking channels: WhatsApp, Email, and Phone
        has_wa_channel = await cdp.evaluate("!!document.querySelector('.svem-channel-whatsapp, a[href*=\"wa.me\"]')")
        record(has_wa_channel, "Booking page displays dedicated Instant WhatsApp Booking channel")

        has_email_channel = await cdp.evaluate("!!document.querySelector('.svem-channel-email, a[href*=\"mailto:\"]')")
        record(has_email_channel, "Booking page displays dedicated Official Email Quote channel")

        # 3b: Verify native mobile-friendly date inputs (Start Date & End Date)
        has_native_dates = await cdp.evaluate("""
            (() => {
                const s = document.querySelector('#calStartDate');
                const e = document.querySelector('#calEndDate');
                return s && e && s.type === 'date' && e.type === 'date';
            })()
        """)
        record(has_native_dates, "Booking form uses clean native HTML5 date pickers without calendar clutter")

        # 3c: Check Email field presence
        has_email_field = await cdp.evaluate("!!document.querySelector('#custEmail, input[type=\"email\"]')")
        record(has_email_field, "Booking form includes mobile-friendly Email input field")

        # 3d: Validation on empty form
        await cdp.evaluate("""
            (() => {
                const submitBtn = document.querySelector('.svem-btn-primary-submit');
                if (submitBtn) submitBtn.click();
            })()
        """)
        await asyncio.sleep(0.4)
        empty_val = await cdp.evaluate("!!document.querySelector('.svem-form-error-alert')")
        record(empty_val, "Booking form enforces required fields and displays validation message")

        # 3e: Valid submission
        await cdp.evaluate("""
            (() => {
                function setVal(id, val) {
                    const el = document.getElementById(id);
                    if (!el) return;
                    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                    setter.call(el, val);
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }
                setVal('custName', 'Ramesh Construction Corp');
                setVal('custPhone', '9876543210');
                setVal('custEmail', 'ramesh@construction.com');
                setVal('custLoc', 'Hosur SIPCOT Phase 2');

                const submitBtn = document.querySelector('.svem-btn-primary-submit');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                }
            })()
        """)
        await asyncio.sleep(1.1)
        confirmation_shown = await cdp.evaluate("""
            (() => {
                const text = document.body.textContent;
                const modal = document.querySelector('.svem-confirm-modal-card');
                return text.includes('Booking Request Submitted') || !!modal;
            })()
        """)
        record(confirmation_shown, "Valid booking submission processes and displays confirmation modal")

        # Close confirmation modal
        await cdp.evaluate("""
            (() => {
                const closeBtn = document.querySelector('.svem-modal-close, button[aria-label*="Close"]');
                if (closeBtn) closeBtn.click();
            })()
        """)
        await asyncio.sleep(0.3)

        print("\n=== 4. CONTACT FORM & VALIDATION TESTING ===")
        await cdp.navigate(f"http://localhost:{PORT}/#/contact")
        await asyncio.sleep(0.5)

        await cdp.evaluate("""
            (() => {
                const submitBtn = document.querySelector('.svem-contactpage-form button[type="submit"]');
                if (submitBtn) submitBtn.click();
            })()
        """)
        await asyncio.sleep(0.4)
        contact_validation = await cdp.evaluate("!!document.querySelector('.svem-form-error-banner')")
        record(contact_validation, "Contact form prevents empty submission with error notice")

        contact_submission = await cdp.evaluate("""
            (() => {
                function setVal(id, val, isTextarea = false) {
                    const el = document.getElementById(id);
                    if (!el) return false;
                    const proto = isTextarea ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
                    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
                    setter.call(el, val);
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    return true;
                }
                setVal('contactFullName', 'Vikram Infrastructure');
                setVal('contactPhone', '9840123456');
                setVal('contactEmail', 'vikram@infrastructure.in');
                setVal('contactLocation', 'Salem Highway Bypass');
                setVal('contactMessage', 'Requirement for 50ft Long Reach Excavator for canal desilting.', true);

                const submitBtn = document.querySelector('.svem-contactpage-form button[type="submit"]');
                if (submitBtn) {
                    submitBtn.click();
                    return true;
                }
                return false;
            })()
        """)
        await asyncio.sleep(0.6)
        contact_success = await cdp.evaluate("""
            (() => {
                const card = document.querySelector('.svem-contactpage-success-card');
                const text = document.body.textContent;
                return text.includes('Enquiry Received Successfully') || !!card;
            })()
        """)
        record(contact_submission and contact_success, "Contact form successfully submits and displays dispatched confirmation")

        print("\n=== 5. LEGAL MODALS (PRIVACY POLICY & TERMS) ===")
        await cdp.navigate(f"http://localhost:{PORT}/#/")
        await asyncio.sleep(0.3)

        # Open Privacy Modal
        privacy_opened = await cdp.evaluate("""
            (() => {
                const btns = Array.from(document.querySelectorAll('.svem-footer-legal-btn, .about-footer-legal-links a'));
                const privBtn = btns.find(b => b.textContent.includes('Privacy Policy'));
                if (privBtn) {
                    privBtn.click();
                    return true;
                }
                return false;
            })()
        """)
        await asyncio.sleep(0.3)
        privacy_title = await cdp.evaluate("""
            (() => {
                const title = document.querySelector('.svem-legal-modal-title');
                const bodyLocked = document.body.style.overflow === 'hidden';
                return title && title.textContent.includes('Privacy Policy') && bodyLocked;
            })()
        """)
        record(privacy_opened and privacy_title, "Privacy Policy modal opens with accessible dialogue and locks body scroll")

        # Close via close button
        await cdp.evaluate("""
            (() => {
                const closeBtn = document.querySelector('.svem-legal-modal-card .svem-modal-close');
                if (closeBtn) closeBtn.click();
            })()
        """)
        await asyncio.sleep(0.2)

        # Open Terms Modal
        terms_opened = await cdp.evaluate("""
            (() => {
                const btns = Array.from(document.querySelectorAll('.svem-footer-legal-btn'));
                const termsBtn = btns.find(b => b.textContent.includes('Terms & Conditions'));
                if (termsBtn) {
                    termsBtn.click();
                    return true;
                }
                return false;
            })()
        """)
        await asyncio.sleep(0.3)
        terms_title = await cdp.evaluate("""
            (() => {
                const title = document.querySelector('.svem-legal-modal-title');
                return title && title.textContent.includes('Terms & Conditions');
            })()
        """)
        record(terms_opened and terms_title, "Terms & Conditions modal opens with official rental protocols")

        # Close Terms modal
        await cdp.evaluate("""
            (() => {
                const closeBtn = document.querySelector('.svem-legal-close-btn');
                if (closeBtn) closeBtn.click();
            })()
        """)
        await asyncio.sleep(0.2)

        print("\n=== 6. CAPTURING EVIDENCE SCREENSHOTS ===")
        # Capture mobile screenshots (375x812)
        await cdp.set_viewport(375, 812)
        pages_to_snap = [
            ("mobile-home.png", f"http://localhost:{PORT}/#/"),
            ("mobile-equipment.png", f"http://localhost:{PORT}/#/equipment"),
            ("mobile-booking.png", f"http://localhost:{PORT}/#/booking"),
            ("mobile-services.png", f"http://localhost:{PORT}/#/services"),
            ("mobile-gallery.png", f"http://localhost:{PORT}/#/gallery"),
            ("mobile-contact.png", f"http://localhost:{PORT}/#/contact"),
            ("mobile-about.png", f"http://localhost:{PORT}/#/about")
        ]
        for fname, url in pages_to_snap:
            await cdp.navigate(url)
            await asyncio.sleep(0.3)
            p = await cdp.screenshot(fname)
            print(f"📸 Captured: {fname}")

        # Capture desktop screenshots (1280x800)
        await cdp.set_viewport(1280, 800)
        desktop_snaps = [
            ("desktop-home.png", f"http://localhost:{PORT}/#/"),
            ("desktop-equipment.png", f"http://localhost:{PORT}/#/equipment"),
            ("desktop-booking.png", f"http://localhost:{PORT}/#/booking"),
            ("desktop-contact.png", f"http://localhost:{PORT}/#/contact")
        ]
        for fname, url in desktop_snaps:
            await cdp.navigate(url)
            await asyncio.sleep(0.3)
            p = await cdp.screenshot(fname)
            print(f"📸 Captured: {fname}")

        record(True, "All desktop and mobile screenshots captured and saved to scratch/screenshots")

    finally:
        chrome_proc.terminate()
        try:
            chrome_proc.wait(timeout=3)
        except Exception:
            chrome_proc.kill()
        shutil.rmtree(user_data_dir, ignore_errors=True)
        httpd.shutdown()
        httpd.server_close()

    print(f"\n==========================================")
    print(f"COMPREHENSIVE QA AUDIT SUMMARY: {passed} PASSED, {failed} FAILED")
    print(f"==========================================")
    if failed > 0:
        sys.exit(1)

asyncio.run(run_tests())
