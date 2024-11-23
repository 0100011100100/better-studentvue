from flask import Flask, request, jsonify
from flask_cors import CORS
from studentvue import StudentVue  # Assuming you've installed the studentvue library

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    domain = data.get('domain')  # Example: yourdistrict.school.com

    try:
        # Instantiate the StudentVue object with provided credentials
        sv = StudentVue(username, password, domain)
        # If login is successful, you could fetch some basic data like the student's name
        student_info = sv.get_student_info()  # Example method to get student info
        return jsonify({"message": "Logged in successfully!", "student_info": student_info}), 200
    except Exception as e:
        # Handle errors (e.g., incorrect credentials)
        return jsonify({"error": str(e)}), 400


@app.route('/grades', methods=['GET'])
def grades():
    username = request.args.get('username')
    password = request.args.get('password')
    domain = request.args.get('domain')

    try:
        # Create the StudentVue object with provided credentials
        sv = StudentVue(username, password, domain)
        grades_data = sv.get_grades()  # Fetch grades from StudentVue API
        return jsonify(grades_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
