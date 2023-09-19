from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/test', methods=['GET'])
def get_gane_list():
    movie_list = [
        {"title": "FIFA 20", "year": 2019},
        {"title": "Ghost of Tsushima", "year": 2020},
        {"title": "Octopath Traveller 2", "year": 2023}
    ]
    return jsonify(movie_list)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
