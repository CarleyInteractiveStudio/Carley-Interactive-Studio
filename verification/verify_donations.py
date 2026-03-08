import re
from playwright.sync_api import Page, expect, sync_playwright

def verify_donations(page: Page):
    # Check Creative Engine on-page donation
    page.goto("http://localhost:8000/creative-engine.html")

    # Click Donations in sidebar
    page.get_by_role("link", name="Donaciones").click()

    # Wait for the section to be active and progress bar to exist
    page.wait_for_selector("#donations.active")

    # Click Apoyar button (exact match to avoid ad button)
    page.get_by_role("button", name="Apoyar", exact=True).click()
    expect(page.locator("#donation-flow-modal")).not_to_have_class(re.compile("hidden"))
    page.screenshot(path="verification/ce_donation_modal.png")

    # Close modal
    page.get_by_role("button", name="Cerrar").click()

    # Go to Donaciones Hub
    page.goto("http://localhost:8000/donaciones.html")
    page.wait_for_selector("#donors-hub-container")

    # Click one of the Apoyar buttons in the hub
    page.get_by_role("button", name="Apoyar Creative Engine").click()
    expect(page.locator("#donation-flow-modal")).not_to_have_class(re.compile("hidden"))
    page.screenshot(path="verification/hub_donation_modal.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_donations(page)
        finally:
            browser.close()
