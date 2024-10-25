# Import the main libraries
from flask import Flask
from flask_cors import CORS

# Import the API routes
from routes.loginRoute import app_login
from routes.ovaRoute import app_ova
from routes.courseRoute import app_course
from routes.interactionRoute import app_interaction
from routes.studentRoute import app_student
from routes.plotRoute import app_plot
from routes.questionRoute import app_question

# Create the Flask app and configure CORS
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://ova_apache:*/*"}})

# Register the API routes as blueprints
app.register_blueprint(app_login)
app.register_blueprint(app_ova)
app.register_blueprint(app_course)
app.register_blueprint(app_interaction)
app.register_blueprint(app_student)
app.register_blueprint(app_plot)
app.register_blueprint(app_question)

# Start the application
if __name__ == "__main__":
    app.run(debug=True, host="ova_flask", port=8090)
