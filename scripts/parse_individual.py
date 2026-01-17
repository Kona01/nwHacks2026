import os
import json
from bs4 import BeautifulSoup

def parse_club_details_to_json_map(folder_path):
    all_clubs_map = {}
    club_id = 1  # Starting the numerical key

    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' not found.")
        return

    # Loop through the individual HTML files
    for filename in sorted(os.listdir(folder_path)):
        if filename.endswith(".html"):
            file_path = os.path.join(folder_path, filename)
            
            with open(file_path, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")

                # --- 1. Extract Logo URL ---
                logo_box = soup.find(class_="logo-box")
                logo_url = None
                if logo_box:
                    img_tag = logo_box.find("img")
                    if img_tag and img_tag.get("src"):
                        logo_url = img_tag.get("src")

                # --- 2. Extract Instagram Handle AND Link ---
                insta_tag = soup.find(class_="display-name")
                instagram_handle = None
                instagram_url = None
                
                if insta_tag:
                    instagram_handle = insta_tag.get_text(strip=True)
                    # Find the <a> tag that wraps the display-name
                    parent_link = insta_tag.find_parent("a")
                    if parent_link:
                        instagram_url = parent_link.get("href")

                # --- 3. Extract Description ---
                desc_section = soup.find(class_="open-section-wrap")
                description = None
                if desc_section:
                    description = desc_section.get_text(separator=" ", strip=True)

                # Build the club object
                club_data = {
                    "club_name": filename.replace(".html", ""),
                    "logo_url": logo_url,
                    "instagram_handle": instagram_handle,
                    "instagram_url": instagram_url,
                    "description": description
                }

                # Add to the map using the unique numerical key
                all_clubs_map[str(club_id)] = club_data
                print(f"Processed [{club_id}]: {club_data['club_name']}")
                
                club_id += 1

    # Save to JSON file as a map
    output_file = "ams_clubs_data.json"
    with open(output_file, "w", encoding="utf-8") as json_file:
        json.dump(all_clubs_map, json_file, indent=4, ensure_ascii=False)
    
    print(f"\nSuccess! Generated {len(all_clubs_map)} club entries in '{output_file}'")

if __name__ == "__main__":
    parse_club_details_to_json_map("individual_club_pages")