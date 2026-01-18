import sqlite3
import json
import os

def setup_database_with_relations(json_file, db_file):
    if not os.path.exists(json_file):
        print(f"Error: {json_file} not found.")
        return

    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    # 1. Enable Foreign Key support in SQLite (disabled by default)
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 2. Create the Clubs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clubs (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            logo_url TEXT,
            instagram_handle TEXT,
            instagram_url TEXT,
            description TEXT
        )
    ''')

    # 3. Create the Reviews table with a Foreign Key
    # REFERENCES clubs(id) ensures the review belongs to a real club
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            review_id INTEGER PRIMARY KEY AUTOINCREMENT,
            club_id INTEGER NOT NULL,
            rating INTEGER CHECK(rating >= 1 AND rating <= 5),
            comment TEXT,
            date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (club_id) REFERENCES clubs (id) ON DELETE CASCADE
        )
    ''')

    # 4. Load and Insert Club Data
    with open(json_file, 'r', encoding='utf-8') as f:
        clubs_map = json.load(f)

    for club_id, info in clubs_map.items():
        cursor.execute('''
            INSERT OR REPLACE INTO clubs (
                id, name, logo_url, instagram_handle, instagram_url, description
            ) VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            int(club_id),
            info.get('club_name'),
            info.get('logo_url'),
            info.get('instagram_handle'),
            info.get('instagram_url'),
            info.get('description')
        ))

    conn.commit()
    conn.close()
    print(f"Database sync complete. 'clubs' and 'reviews' tables are ready.")

if __name__ == "__main__":
    setup_database_with_relations("ams_clubs_data.json", "../database/clubs_app_data.db")