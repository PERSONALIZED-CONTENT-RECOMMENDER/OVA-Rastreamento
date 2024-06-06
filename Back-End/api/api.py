# import of the main libraries
from flask import Flask
from flask_cors import CORS

# import of the API routes
from routes.loginRoute import app_login
from routes.ovaRoute import app_ova
from routes.courseRoute import app_course
from routes.interactionRoute import app_interaction
from routes.studentRoute import app_student
from routes.plotRoute import app_plot

# creation of the app and cors object
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:*/*"}})

# registration of the API routes
app.register_blueprint(app_login)
app.register_blueprint(app_ova)
app.register_blueprint(app_course)
app.register_blueprint(app_interaction)
app.register_blueprint(app_student)
app.register_blueprint(app_plot)

# initiate the application
if __name__ == "__main__":
    app.run(debug=True, port=8090)