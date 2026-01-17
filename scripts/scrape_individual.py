import os
import csv
import time
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

def sanitize_filename(filename):
    """Removes characters that are illegal in filenames."""
    return re.sub(r'[\\/*?:"<>|]', "", filename)

def scrape_individual_clubs(csv_file):
    # 1. Setup Selenium
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    # 2. Create output directory
    output_dir = "individual_club_pages"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # 3. Read the CSV
    try:
        with open(csv_file, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                name = row['Name']
                url = row['Link']
                
                if not url or url == "N/A":
                    print(f"Skipping {name}: No URL found.")
                    continue

                print(f"Scraping details for: {name}")
                
                try:
                    # Navigate to the individual club page
                    driver.get(url)
                    time.sleep(3) # Brief pause to let the page load

                    # Prepare filename
                    safe_name = sanitize_filename(name)
                    file_path = os.path.join(output_dir, f"{safe_name}.html")

                    # Save the HTML
                    with open(file_path, "w", encoding="utf-8") as html_file:
                        html_file.write(driver.page_source)
                    
                    print(f"Saved: {file_path}")

                except Exception as e:
                    print(f"Failed to scrape {url}: {e}")

    except FileNotFoundError:
        print(f"Error: The file '{csv_file}' was not found. Please run the extraction script first.")
    
    finally:
        driver.quit()
        print("\nFinished scraping all individual club pages.")

if __name__ == "__main__":
    # Ensure this matches the name of the CSV file created in the previous step
    scrape_individual_clubs("ams_clubs_list.csv")