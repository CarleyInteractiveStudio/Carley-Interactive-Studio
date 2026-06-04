import asyncio
from playwright.async_api import async_playwright
import os

async def verify_premium_visuals():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # High resolution for high-quality certificate capture
        context = await browser.new_context(viewport={'width': 1280, 'height': 800}, device_scale_factor=2)
        page = await context.new_page()

        # 1. Access the site
        await page.goto("http://localhost:8080/curso-scripting.html")

        # 2. Mock state and fill certificate data
        await page.evaluate("""() => {
            // Populate the certificate template directly for the screenshot
            document.getElementById('cert-display-name').innerText = 'JUAN PÉREZ';
            document.getElementById('cert-display-score').innerText = '98%';
            document.getElementById('cert-display-rank').innerText = 'S (Leyenda)';
            document.getElementById('cert-seal-id-display').innerText = 'CE-2026-X79B2';
            document.getElementById('cert-display-date').innerText = '25/05/2026';

            // Show the certificate container
            const cert = document.getElementById('certificate-container');
            cert.style.position = 'fixed';
            cert.style.top = '0';
            cert.style.left = '0';
            cert.style.zIndex = '9999';
            cert.style.display = 'block';

            // Hide other UI elements
            document.body.style.overflow = 'hidden';
        }""")

        # 3. Capture the Final Certificate
        await page.wait_for_selector("#certificate-container")
        # Give it a moment for fonts to load
        await asyncio.sleep(2)
        await page.locator("#certificate-container").screenshot(path="/home/jules/verification/certificate_final_view.png")

        # 4. Capture the Home Page Portal
        await page.goto("http://localhost:8080/index.html")
        await page.locator(".verification-portal-section").scroll_into_view_if_needed()
        await page.screenshot(path="/home/jules/verification/home_portal_final.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_premium_visuals())
