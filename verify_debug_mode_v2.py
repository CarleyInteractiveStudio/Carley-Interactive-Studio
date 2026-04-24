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

        # Inject script to skip to a debug lesson (Lesson 22 is in Stage 3)
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

        # Give it a moment to render the sub-map
        await asyncio.sleep(2)

        # Let's see what's in the DOM
        content = await page.content()
        with open("/home/jules/verification/page_content.html", "w") as f:
            f.write(content)

        # Try to find any node
        nodes = await page.query_selector_all('.node')
        print(f"Found {len(nodes)} nodes")
        for node in nodes:
            nid = await node.get_attribute('data-id')
            print(f"Node ID: {nid}")

        # If node 22 is not there, maybe we are still in main map?
        # Let's try to click the stage 3 node in the main map first if it's there
        stage3_node = await page.query_selector('.node[data-stage="3"]')
        if stage3_node:
             print("Clicking Stage 3 node in main map")
             await stage3_node.click()
             await asyncio.sleep(1)

        # Now try to click lesson 22
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
