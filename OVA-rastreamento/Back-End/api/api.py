from flask import Flask, request
from flask_cors import CORS
import logging
import json

from routes.studentRoute import app_student

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(app_student)

if __name__ == "__main__":
    app.run(debug=True, port=8000)