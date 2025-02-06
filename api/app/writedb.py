import sqlite3
import hashlib
from datetime import datetime
from passlib.hash import pbkdf2_sha256 as sha256



# Function to hash the password (similar to your generate_hash method)
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Connect to the SQLite database
conn = sqlite3.connect('./api/app/didsystem.db')
cursor = conn.cursor()

# Prepare user data
username = 'issuer1'
password = sha256.hash('123456')  # Hash the password
email = 'issuer1@example.com'
is_super = 1  # Assuming 1 means admin
is_active = 1  # Assuming 1 means active
role_id = 1  # Assuming role_id 1 exists in roles table
remarks = 'Initial admin user'
reg_time = datetime.now()

# SQL INSERT statement
insert_query = '''
INSERT INTO users 
(username, password, email, is_super, is_active, role_id, remarks, reg_time) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
'''

try:
    # Execute the insert
    cursor.execute(insert_query, (
        username, 
        password, 
        email, 
        is_super, 
        is_active, 
        role_id, 
        remarks, 
        reg_time
    ))
    
    # Commit the transaction
    conn.commit()
    print("User inserted successfully!")

except sqlite3.IntegrityError as e:
    print(f"Error inserting user: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
finally:
    # Close the connection
    conn.close()