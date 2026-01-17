import os
import csv
from bs4 import BeautifulSoup

def parse_club_details(folder_path):
    all_club_details = []

    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' not found.")
        return

    # Iterate through all saved .html files
    for filename in sorted(os.listdir(folder_path)):
        if filename.endswith(".html"):
            file_path = os.path.join(folder_path, filename)
            
            with open(file_path, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")

                # --- 1. Extract Logo URL ---
                logo_box = soup.find(class_="logo-box")
                logo_url = "N/A"
                if logo_box:
                    img_tag = logo_box.find("img")
                    if img_tag and img_tag.get("src"):
                        logo_url = img_tag.get("src")

                # --- 2. Extract Instagram Display Name ---
                # Targeting the 'display-name' class specifically
                insta_tag = soup.find(class_="display-name")
                instagram_handle = insta_tag.get_text(strip=True) if insta_tag else "N/A"

                # --- 3. Extract Description ---
                desc_section = soup.find(class_="open-section-wrap")
                description = "N/A"
                if desc_section:
                    # get_text(separator=" ") preserves spacing between paragraphs
                    description = desc_section.get_text(separator=" ", strip=True)

                # Store the data
                all_club_details.append({
                    "Club Name": filename.replace(".html", ""),
                    "Logo URL": logo_url,
                    "Instagram": instagram_handle,
                    "Description": description
                })

            print(f"Parsed details for: {filename}")

    save_to_csv(all_club_details)

def save_to_csv(data):
    if not data:
        print("No data found.")
        return

    output_file = "ams_clubs_detailed_info.csv"
    keys = data[0].keys()

    with open(output_file, "w", newline="", encoding="utf-8") as f:
        dict_writer = csv.DictWriter(f, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)
    
    print(f"\nSuccess! Detailed data for {len(data)} clubs saved to '{output_file}'")

if __name__ == "__main__":
    # Ensure this matches the folder where your individual club HTMLs are stored
    parse_club_details("individual_club_pages")