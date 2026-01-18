import sqlite3
import random

def populate_mock_reviews(db_file):
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    # 1. Get all valid club IDs from the clubs table
    cursor.execute("SELECT id, name FROM clubs")
    clubs = cursor.fetchall()

    if not clubs:
        print("No clubs found in the database. Run the migration script first.")
        return

    # 2. Define some mock review data
    sample_comments = [
        "Really welcoming community! Highly recommend joining if you're interested in this field.",
        "The events are always well-organized. Great way to meet people.",
        "A bit intense in terms of workload, but the experience is worth it.",
        "Had a bit of trouble getting in touch with the execs, but the club itself is cool.",
        "Best club on campus! I've made so many friends here.",
        "Informative workshops, though I wish they had more social mixers.",
        "Decent club, but some of the meetings are quite long.",
        "Incredible networking opportunities with industry professionals.",
        "Super chill vibes and very low pressure for new members.",
        "I joined last semester and it's been the highlight of my year so far!"
    ]

    print(f"Generating mock reviews for {len(clubs)} clubs...")

    # 3. Insert random reviews for each club
    reviews_added = 0
    for club_id, club_name in clubs:
        # We'll skip a few clubs randomly to make the data look "natural"
        if random.random() < 0.1:
            continue
            
        # Add between 2 and 4 reviews per club
        num_reviews = random.randint(2, 4)
        
        for _ in range(num_reviews):
            rating = random.randint(3, 5) # Mostly positive reviews
            comment = random.choice(sample_comments)
            
            cursor.execute('''
                INSERT INTO reviews (club_id, rating, comment)
                VALUES (?, ?, ?)
            ''', (club_id, rating, comment))
            reviews_added += 1

    conn.commit()
    conn.close()
    print(f"Success! Added {reviews_added} mock reviews to the database.")

if __name__ == "__main__":
    populate_mock_reviews("../database/clubs_app_data.db")