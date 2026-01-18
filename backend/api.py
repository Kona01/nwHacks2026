from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('../database/clubs_app_data.db')
    conn.row_factory = sqlite3.Row  # Returns rows as dictionaries
    return conn

# 1. GET Club Details
@app.route('/api/club/<int:club_id>', methods=['GET'])
def get_club(club_id):
    conn = get_db_connection()
    club = conn.execute('SELECT * FROM clubs WHERE id = ?', (club_id,)).fetchone()
    conn.close()
    if club is None:
        return jsonify({'error': 'Club not found'}), 404
    return jsonify(dict(club))

# 2. GET Reviews for a specific club
@app.route('/api/club/<int:club_id>/reviews', methods=['GET'])
def get_reviews(club_id):
    conn = get_db_connection()
    # Sort by date_created so newest reviews appear first
    reviews = conn.execute(
        'SELECT rating, comment, date_created FROM reviews WHERE club_id = ? ORDER BY date_created DESC',
        (club_id,)
    ).fetchall()
    conn.close()
    return jsonify([dict(row) for row in reviews])

# 3. POST a new review
@app.route('/api/club/<int:club_id>/reviews', methods=['POST'])
def add_review(club_id):
    new_review = request.json
    rating = new_review.get('rating')
    comment = new_review.get('comment')

    if not rating or not comment:
        return jsonify({'error': 'Missing rating or comment'}), 400

    conn = get_db_connection()
    try:
        conn.execute(
            'INSERT INTO reviews (club_id, rating, comment) VALUES (?, ?, ?)',
            (club_id, rating, comment)
        )
        conn.commit()
        return jsonify({'status': 'success'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Club ID does not exist'}), 400
    finally:
        conn.close()

# 4. GET 50 Random Clubs
@app.route('/api/clubs/random', methods=['GET'])
def get_random_clubs():
    conn = get_db_connection()
    # Using SQLite's RANDOM() function to shuffle and LIMIT to get 50
    random_clubs = conn.execute(
        'SELECT * FROM clubs ORDER BY RANDOM() LIMIT 50'
    ).fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in random_clubs])

if __name__ == '__main__':
    app.run(debug=True, port=5000)