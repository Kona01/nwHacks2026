import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

def scrape_ams_clubs(start_page, end_page):
    # Set up Chrome options (headless mode means the browser won't pop up)
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Initialize the driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    # Create a directory for the output if it doesn't exist
    output_dir = "scraped_pages"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        for page_num in range(start_page, end_page + 1):
            url = f"https://amsclubs.ca/all-clubs/pagenum/{page_num}/"
            print(f"Scraping: {url}")

            # Navigate to the page
            driver.get(url)

            # Wait a few seconds for JavaScript to load content (adjust if needed)
            time.sleep(3)

            # Get the page source
            page_content = driver.page_source

            # Define filename
            file_path = os.path.join(output_dir, f"ams_clubs_page_{page_num}.html")

            # Write content to .html file
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(page_content)
            
            print(f"Successfully saved page {page_num} to {file_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        # Close the browser
        driver.quit()
        print("Scraping complete.")

if __name__ == "__main__":
    scrape_ams_clubs(41, 50)