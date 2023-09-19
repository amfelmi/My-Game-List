from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

db = mysql.connector.connect(
  host = "localhost",
  user = "root",
  password = "Password1",
  database = "users", 
)
cursor = db.cursor(dictionary=True)

@app.route('/steam', methods=['POST', 'OPTIONS'])
def search_games():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({'message': 'Preflight request accepted.'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, *')
        response.headers.add('Access-Control-Allow-Methods', '*')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    else:
        # Actual request handling
        data = request.get_json()
        title = data.get('title')

        query = "SELECT * FROM steam WHERE title LIKE %s"
        cursor.execute(query, ('%' + title + '%',))
        results = cursor.fetchall()

        response = jsonify(results)
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001)






