import asyncio
from playwright.async_api import async_playwright
import os
import http.server
import threading
import socketserver

PORT = 8005

def start_server():
    Handler = http.server.SimpleHTTPRequestHandler
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()

async def verify():
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    await asyncio.sleep(2)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # 1. Verify index.html header icon and footer ad removal
        print("Checking index.html...")
        await page.goto(f"http://localhost:{PORT}/index.html")
        header_link = await page.get_attribute('a.icon-btn', 'href')
        print(f"Header account link: {header_link}")
        ad_btn = await page.query_selector('#ce-ad-btn')
        print(f"Ad button on index (should be None): {ad_btn is None}")
        await page.screenshot(path="verify_index.png", full_page=True)

        # 2. Verify account page
        print("Checking cuenta.html...")
        await page.goto(f"http://localhost:{PORT}/cuenta.html")
        await page.wait_for_selector('.account-card')
        # Click Register tab
        await page.click('button[data-tab="register"]')
        await asyncio.sleep(0.5)
        await page.screenshot(path="verify_account_register.png")

        # Check policy modal
        await page.click('a[onclick="openPolicy()"]')
        await asyncio.sleep(0.5)
        await page.screenshot(path="verify_account_policy.png")

        # 3. Verify Creative Engine back button
        print("Checking creative-engine.html back button...")
        await page.goto(f"http://localhost:{PORT}/creative-engine.html")
        home_icon = await page.query_selector('.home-btn i[data-lucide="home"]')
        print(f"Home icon found in sidebar: {home_icon is not None}")
        await page.screenshot(path="verify_ce_sidebar.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
