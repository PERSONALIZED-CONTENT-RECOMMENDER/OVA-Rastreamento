from flask import Flask
from flask_cors import CORS
from sqlalchemy.engine import URL

from routes.loginRoute import app_login
from routes.ovaRoute import app_ova
from routes.courseRoute import app_course
from routes.interactionRoute import app_interaction
from routes.studentRoute import app_student
from routes.plotRoute import app_plot

from base import db

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:*/*"}})

connection_string = "Driver={ODBC Driver 18 for SQL Server};Server=tcp:ova-db-server.database.windows.net,1433;Database=OVA-DB;Uid=duca1;Pwd=Ducaduca-1;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"
connection_url = URL.create("mssql+pyodbc", query={"odbc_connect": connection_string})
app.config["SQLALCHEMY_DATABASE_URI"] = connection_url

db.init_app(app)

app.register_blueprint(app_login)
app.register_blueprint(app_ova)
app.register_blueprint(app_course)
app.register_blueprint(app_interaction)
app.register_blueprint(app_student)
app.register_blueprint(app_plot)

if __name__ == "__main__":
    app.run(debug=True, port=8000)
    
#dividir a tabela de interações em interações de questões e de progresso (tabelas filhas)
#questões -> questão, alternativa escolhida (texto), arternativa correta (texto), se acertou ou não
#progresso -> se é rolagem ou assistindo vídeo, progresso