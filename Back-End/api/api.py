from flask import Flask
from flask_cors import CORS

from routes.loginRoute import app_login
from routes.ovaRoute import app_ova
from routes.courseRoute import app_course
from routes.interactionRoute import app_interaction
from routes.plotRoute import app_plot

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:*/*"}})

app.register_blueprint(app_login)
app.register_blueprint(app_ova)
app.register_blueprint(app_course)
app.register_blueprint(app_interaction)
app.register_blueprint(app_plot)

if __name__ == "__main__":
    app.run(debug=True, port=8000)
    
#dividir a tabela de interações em interações de questões e de progresso (tabelas filhas)
#questões -> questão, alternativa escolhida (texto), arternativa correta (texto), se acertou ou não
#progresso -> se é rolagem ou assistindo vídeo, progresso