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

@app.route('/api/club/<int:club_id>/average-rating', methods=['GET'])
def get_average_rating(club_id):
    conn = get_db_connection()
    # SQL query to get average and count of reviews
    row = conn.execute(
        'SELECT ROUND(AVG(rating), 1) as avg_rating, COUNT(*) as count FROM reviews WHERE club_id = ?',
        (club_id,)
    ).fetchone()
    conn.close()

    if row['count'] == 0:
        return jsonify({'average': 0, 'total_reviews': 0})

    return jsonify({
        'average': row['avg_rating'],
        'total_reviews': row['count']
    })

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

@app.route('/api/clubs/random-id', methods=['GET'])
def get_random_club_id():
    conn = get_db_connection()
    # Select only the 'id' column, shuffle, and take the first one
    result = conn.execute(
        'SELECT id FROM clubs ORDER BY RANDOM() LIMIT 1'
    ).fetchone()
    conn.close()
    
    if result:
        # result is a Row object, convert to dict or access by index
        return jsonify({"id": result['id']})
    else:
        return jsonify({"error": "No clubs found"}), 404

@app.route('/api/clubs', methods=['GET'])
def get_clubs():
    # 1. Get the page number from the URL (default to page 1)
    # Using type=int ensures the input is a valid number
    page = request.args.get('page', 1, type=int)
    per_page = 50 
    
    # 2. Calculate the offset
    # Page 1 starts at 0, Page 2 starts at 50, etc.
    offset = (page - 1) * per_page

    conn = get_db_connection()
    
    # 3. Query with alphabetical ordering and pagination
    # We order by 'name' (replace with your actual column name)
    query = 'SELECT * FROM clubs ORDER BY name ASC LIMIT ? OFFSET ?'
    clubs = conn.execute(query, (per_page, offset)).fetchall()
    
    conn.close()

    # Convert rows to list of dicts for JSON response
    return jsonify([dict(row) for row in clubs])

@app.route('/api/clubs/search', methods=['GET'])
def search_clubs():
    # Get the search query from the URL parameters
    # Example: /api/clubs/search?q=chess
    search_query = request.args.get('q', '')
    
    if not search_query:
        return jsonify([])

    conn = get_db_connection()
    
    # Use the SQL LIKE operator with wildcards (%) 
    # lower() ensures the search is case-insensitive
    query = "SELECT * FROM clubs WHERE lower(name) LIKE lower(?) ORDER BY name ASC"
    
    # We add % before and after the query so it matches anywhere in the string
    search_pattern = f"%{search_query}%"
    
    clubs = conn.execute(query, (search_pattern,)).fetchall()
    conn.close()

    return jsonify([dict(row) for row in clubs])

if __name__ == '__main__':
    app.run(debug=True, port=5000)