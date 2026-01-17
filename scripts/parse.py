import os
from bs4 import BeautifulSoup
import csv

def extract_club_data(folder_path):
    all_clubs = []

    # Check if folder exists
    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' not found.")
        return

    # Loop through every file in the folder
    for filename in sorted(os.listdir(folder_path)):
        if filename.endswith(".html"):
            file_path = os.path.join(folder_path, filename)
            
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                soup = BeautifulSoup(content, "html.parser")

                # Find all club-item objects
                # Based on the site structure, each club is usually in a div or section
                clubs = soup.find_all(class_="club-item")

                for club in clubs:
                    # Find the link tag inside the club item
                    link_tag = club.find("a")
                    
                    if link_tag:
                        name = link_tag.get_text(strip=True)
                        link = link_tag.get("href")
                        
                        all_clubs.append({"Name": name, "Link": link})

            print(f"Processed: {filename}")

    # Output the results
    save_to_csv(all_clubs)

def save_to_csv(data):
    if not data:
        print("No data found to save.")
        return

    keys = data[0].keys()
    with open("ams_clubs_list.csv", "w", newline="", encoding="utf-8") as f:
        dict_writer = csv.DictWriter(f, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)
    
    print(f"\nSuccess! Extracted {len(data)} clubs to 'ams_clubs_list.csv'")

if __name__ == "__main__":
    # Point this to the folder where your .html files are stored
    extract_club_data("scraped_pages")