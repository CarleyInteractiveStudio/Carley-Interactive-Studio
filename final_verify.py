import asyncio
from playwright.async_api import async_playwright
import os
import http.server
import threading
import socketserver

PORT = 8001

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
        await page.goto(f"http://localhost:{PORT}/index.html")
        await page.wait_for_selector('.footer-section')
        await page.screenshot(path="final_index_footer.png", full_page=True)

        # 2. Check sidebar scrolling and back button in creative-engine.html
        await page.goto(f"http://localhost:{PORT}/creative-engine.html")
        await page.wait_for_selector('.sidebar-content')
        # Check if logo-back-btn exists
        btn = await page.query_selector('.logo-back-btn')
        print(f"Back button found: {btn is not None}")
        await page.screenshot(path="final_ce_sidebar.png")

        # 3. Check search functionality (search "Creative Engine" and see if it redirects)
        await page.goto(f"http://localhost:{PORT}/index.html")
        await page.fill('input[data-i18n-ph="search_placeholder"]', 'Creative Engine')
        # Click the first result
        await page.wait_for_selector('.search-results-container div')
        await page.click('.search-results-container div')
        await asyncio.sleep(1)
        print(f"Current URL after search: {page.url}")
        await page.screenshot(path="final_search_result.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
