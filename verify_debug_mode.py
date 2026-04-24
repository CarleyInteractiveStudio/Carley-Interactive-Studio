import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 720})
        page = await context.new_page()

        # Load the page
        await page.goto('http://localhost:8080/curso-scripting.html')

        # Inject script to skip to a debug lesson (e.g., Lesson 22)
        await page.evaluate("""
            localStorage.setItem('course-lang-picked', 'es');
            localStorage.setItem('ces-course-progress', JSON.stringify({
                stage: 3,
                currentCourse: 22,
                completed: []
            }));
            window.location.reload();
        """)
        await page.wait_for_load_state('networkidle')

        # Click the lesson node to open it
        # We need to find the node for lesson 22
        await page.click('.node[data-id="22"]')

        # Wait for challenge to render
        await page.wait_for_selector('.debug-container')

        # Take a screenshot
        await page.screenshot(path='/home/jules/verification/debug_mode_render.png')
        print("Screenshot saved to /home/jules/verification/debug_mode_render.png")

        # Verify that debug lines exist
        lines = await page.query_selector_all('.debug-line')
        print(f"Found {len(lines)} debug lines")

        await browser.close()

if __name__ == "__main__":
    import http.server
    import threading

    def serve():
        handler = http.server.SimpleHTTPRequestHandler
        with http.server.HTTPServer(("", 8080), handler) as httpd:
            httpd.serve_forever()

    daemon = threading.Thread(target=serve, daemon=True)
    daemon.start()

    asyncio.run(run())
