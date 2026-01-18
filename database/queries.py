import sqlite3

# 1. Connect to the database (it will be created if it doesn't exist)
connection = sqlite3.connect("clubs_app_data.db")

# 2. Create a cursor object to execute SQL commands
cursor = connection.cursor()

# 3. Create a table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS clubs (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        instagram_url TEXT,
        logo_url TEXT,
        description TEXT
    )
''')

# 4. Commit changes and close
connection.commit()
connection.close()

print("Database and table created successfully.")