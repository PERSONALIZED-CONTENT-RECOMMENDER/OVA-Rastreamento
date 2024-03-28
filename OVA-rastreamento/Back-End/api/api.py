from flask import Flask
from flask_cors import CORS

from routes.loginRoute import app_login
from routes.ovaRoute import app_ova
from routes.courseRoute import app_course

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:5500/*"}})

app.register_blueprint(app_login)
app.register_blueprint(app_ova)
app.register_blueprint(app_course)

if __name__ == "__main__":
    app.run(debug=True, port=8000)