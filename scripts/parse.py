import os
import csv
from bs4 import BeautifulSoup

def extract_clean_club_data(folder_path):
    all_clubs = []
    club_id = 1

    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' not found.")
        return

    # Loop through the HTML files you saved earlier
    for filename in sorted(os.listdir(folder_path)):
        if filename.endswith(".html"):
            file_path = os.path.join(folder_path, filename)
            
            with open(file_path, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")

                # Locate each club container
                clubs = soup.find_all(class_="club-item")

                for club in clubs:
                    # 1. Get the link (usually found on the main anchor tag)
                    link_tag = club.find("a")
                    link = link_tag.get("href") if link_tag else "N/A"

                    # 2. Get the name ONLY from the h2 tag
                    # This ignores .blog-description or other text in the container
                    h2_tag = club.find("h2")
                    
                    if h2_tag:
                        name = h2_tag.get_text(strip=True)
                        all_clubs.append({"Name": name, "Link": link, "ID": club_id})
                        club_id += 1

            print(f"Parsed: {filename}")

    save_to_csv(all_clubs)

def save_to_csv(data):
    if not data:
        print("No data extracted.")
        return

    output_file = "ams_clubs_list.csv"
    keys = data[0].keys()
    
    with open(output_file, "w", newline="", encoding="utf-8") as f:
        dict_writer = csv.DictWriter(f, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)
    
    print(f"\nSuccess! Found {len(data)} clubs.")
    print(f"Data saved to: {os.path.abspath(output_file)}")

if __name__ == "__main__":
    # Ensure this matches the folder where your HTML files are stored
    extract_clean_club_data("scraped_pages")