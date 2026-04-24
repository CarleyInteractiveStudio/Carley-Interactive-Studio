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

        # Directly call showLesson for a debug lesson
        await page.evaluate("""
            localStorage.setItem('course-lang-picked', 'es');
            // Wait for main initialization to finish
            setTimeout(() => {
                showLesson(22);
            }, 1000);
        """)

        # Wait for lesson view
        await page.wait_for_selector('#lesson-view:not(.hidden)', timeout=5000)
        print("Lesson 22 shown")

        # Wait for debug container
        await page.wait_for_selector('.debug-container', timeout=5000)
        print("Debug container found")

        # Check for debug lines
        lines = await page.query_selector_all('.debug-line')
        print(f"Found {len(lines)} debug lines")

        # Check for character
        char = await page.query_selector('#lesson-character')
        print(f"Character found: {char is not None}")

        # Take a screenshot
        await page.screenshot(path='/home/jules/verification/direct_lesson_22.png')

        # Check account page badges
        await page.goto('http://localhost:8080/cuenta.html')
        # Inject fake achievements
        await page.evaluate("""
            localStorage.setItem('ces-course-progress', JSON.stringify({
                achievements: ['Maestro de Arquitectura', 'Maestro de Leyes']
            }));
            window.location.reload();
        """)
        await page.wait_for_selector('.badge-item', timeout=5000)
        badges = await page.query_selector_all('.badge-item')
        print(f"Found {len(badges)} badges in account page")
        await page.screenshot(path='/home/jules/verification/account_badges.png')

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
