import os
import json
import csv
import re
from bs4 import BeautifulSoup

def sanitize_filename(filename):
    """Matches the filename format used in the previous scraping script."""
    return re.sub(r'[\\/*?:"<>|]', "", filename)

def sync_club_data(html_folder, csv_path):
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        return

    # 1. Read existing CSV data
    rows = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        # Add 'ID' to the header if it's not already there
        if 'ID' not in fieldnames:
            fieldnames = ['ID'] + fieldnames
        for row in reader:
            rows.append(row)

    all_clubs_map = {}
    updated_rows = []

    print(f"Starting sync for {len(rows)} clubs...")

    # 2. Process each club from the CSV
    for index, row in enumerate(rows, start=1):
        club_id = str(index)
        club_name = row['Name']
        
        # Match the filename created by the previous scraper
        safe_name = sanitize_filename(club_name)
        file_path = os.path.join(html_folder, f"{safe_name}.html")

        # Default values if file is missing or data is empty
        logo_url = None
        insta_handle = None
        insta_url = None
        description = None

        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")

                # --- Extract Logo ---
                logo_box = soup.find(class_="logo-box")
                if logo_box:
                    img = logo_box.find("img")
                    if img: logo_url = img.get("src")

                # --- Extract Instagram Handle & Link ---
                # Finding the display-name and then looking up for its parent anchor tag
                insta_tag = soup.find(class_="display-name")
                if insta_tag:
                    insta_handle = insta_tag.get_text(strip=True)
                    parent_link = insta_tag.find_parent("a")
                    if parent_link:
                        insta_url = parent_link.get("href")

                # --- Extract Description ---
                desc_section = soup.find(class_="open-section-wrap")
                if desc_section:
                    description = desc_section.get_text(separator=" ", strip=True)
        else:
            print(f"Warning: HTML file not found for {club_name}")

        # 3. Create JSON entry
        all_clubs_map[club_id] = {
            "club_name": club_name,
            "logo_url": logo_url,
            "instagram_handle": insta_handle,
            "instagram_url": insta_url,
            "description": description
        }

        # 4. Update CSV Row with the ID
        row['ID'] = club_id
        updated_rows.append(row)

        print(f"Processed [{club_id}]: {club_name}")

    # 5. Save the JSON Map
    with open("ams_clubs_data.json", "w", encoding="utf-8") as jf:
        json.dump(all_clubs_map, jf, indent=4, ensure_ascii=False)

    # 6. Overwrite the CSV with the new ID column included
    with open(csv_path, "w", newline="", encoding="utf-8") as cf:
        writer = csv.DictWriter(cf, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(updated_rows)

    print(f"\nSuccess!")

if __name__ == "__main__":
    # Ensure these paths match your actual folder and file names
    sync_club_data("individual_club_pages", "ams_clubs_list.csv")