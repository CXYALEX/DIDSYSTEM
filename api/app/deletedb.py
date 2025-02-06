import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('./api/app/didsystem.db')
cursor = conn.cursor()

# Prepare the username to delete
username_to_delete = 'admin'

# SQL DELETE statement
delete_query = '''
DELETE FROM users 
WHERE username = ?
'''

try:
    # Execute the delete
    cursor.execute(delete_query, (username_to_delete,))
    
    # Commit the transaction
    conn.commit()
    
    # Check if any row was deleted
    if cursor.rowcount > 0:
        print(f"User '{username_to_delete}' deleted successfully!")
    else:
        print(f"No user found with username '{username_to_delete}'.")

except sqlite3.Error as e:
    print(f"Error deleting user: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
finally:
    # Close the connection
    conn.close()