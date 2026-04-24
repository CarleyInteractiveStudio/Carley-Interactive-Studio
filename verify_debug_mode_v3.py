import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 720})
        page = await context.new_page()

        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        # Load the page
        await page.goto('http://localhost:8080/curso-scripting.html')

        # Inject script to skip to a debug lesson
        await page.evaluate("""
            localStorage.setItem('course-lang-picked', 'es');
            localStorage.setItem('ces-course-progress', JSON.stringify({
                stage: 3,
                currentCourse: 22,
                completed: [21]
            }));
            window.location.reload();
        """)
        await page.wait_for_load_state('networkidle')

        await asyncio.sleep(3)

        # Check if course-map is empty
        map_html = await page.inner_html('#course-map')
        print(f"Map HTML length: {len(map_html)}")

        # Try to call renderStageMap manually if needed
        await page.evaluate("renderStageMap(3)")
        await asyncio.sleep(1)

        # Try to find node 22
        lesson22 = await page.wait_for_selector('.node[data-id="22"]', timeout=5000)
        if lesson22:
            await lesson22.click()
            print("Clicked lesson 22")

        # Wait for challenge to render
        await page.wait_for_selector('.debug-container', timeout=10000)

        # Take a screenshot
        await page.screenshot(path='/home/jules/verification/debug_mode_render.png')
        print("Screenshot saved to /home/jules/verification/debug_mode_render.png")

        # Verify that debug lines exist
        lines = await page.query_selector_all('.debug-line')
        print(f"Found {len(lines)} debug lines")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
