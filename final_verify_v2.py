import asyncio
from playwright.async_api import async_playwright
import os
import http.server
import threading
import socketserver

PORT = 8002

def start_server():
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()

async def verify():
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    await asyncio.sleep(2)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # 1. Check index.html footer categorization and Ads button
        print("Checking index.html...")
        await page.goto(f"http://localhost:{PORT}/index.html")
        await page.wait_for_selector('.footer-section')
        # Check for "Disponibles" text
        has_disponibles = await page.evaluate("() => document.body.innerText.includes('Disponibles')")
        print(f"Has 'Disponibles' in footer: {has_disponibles}")
        # Check for Ads button
        ads_btn = await page.query_selector('#footer-ad-btn')
        print(f"Ads button found on index: {ads_btn is not None}")
        await page.screenshot(path="final_index_check.png", full_page=True)

        # 2. Check sidebar and back button in creative-engine.html
        print("Checking creative-engine.html...")
        await page.goto(f"http://localhost:{PORT}/creative-engine.html")
        await page.wait_for_selector('.sidebar-nav')
        # Check if logo back button exists
        back_btn = await page.query_selector('.home-btn img.mini-logo')
        print(f"Back button (logo) found: {back_btn is not None}")
        await page.screenshot(path="final_ce_check.png")

        # 3. Check search functionality
        print("Checking search...")
        await page.goto(f"http://localhost:{PORT}/index.html")
        await page.fill('input[data-i18n-ph="search_placeholder"]', 'Creative Engine')
        await page.wait_for_selector('.search-results-container div')
        # Click the result
        await page.click('.search-results-container div')
        await asyncio.sleep(1)
        print(f"URL after search: {page.url}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
