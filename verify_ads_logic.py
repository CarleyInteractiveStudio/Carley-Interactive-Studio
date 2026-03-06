import asyncio
from playwright.async_api import async_playwright
import http.server
import threading
import socketserver

PORT = 8004

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

        print("Testing Ad Reveal on index.html...")
        await page.goto(f"http://localhost:{PORT}/index.html")

        # Check if hidden
        is_hidden = await page.evaluate("() => document.getElementById('ce-ads-container').classList.contains('hidden')")
        print(f"Container hidden initially: {is_hidden}")

        # Click button
        await page.click('#ce-ad-btn')
        await asyncio.sleep(1)

        is_hidden_after = await page.evaluate("() => document.getElementById('ce-ads-container').classList.contains('hidden')")
        print(f"Container hidden after click: {is_hidden_after}")

        await page.screenshot(path="ad_reveal_test.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
