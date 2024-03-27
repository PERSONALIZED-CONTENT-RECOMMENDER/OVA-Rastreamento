from flask import Flask, request
from flask_cors import CORS, cross_origin
import logging
import json

class OnlyUserActions(logging.Filter):
    def filter(self, record):
        return record.levelno == logging.INFO

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
logging.basicConfig(level=logging.INFO)

werkzeug_logger = logging.getLogger("werkzeug")
werkzeug_handler = logging.FileHandler("./Logs/api.log")
werkzeug_handler.setLevel(logging.WARNING)
werkzeug_logger.addHandler(werkzeug_handler)

logger = logging.getLogger(__name__)

handler = logging.FileHandler("./Logs/ova.log")
handler.setLevel(logging.INFO)
handler.addFilter(OnlyUserActions())

formatter = logging.Formatter("%(asctime)s - %(message)s")
handler.setFormatter(formatter)

logger.addHandler(handler)

@app.route("/log", methods=["POST"])
@cross_origin()
def log():
    if request.method == 'POST':
        request.get_json()
        try:
            log_request = request.get_json()
            log_data = log_request[0]
            logger.info(log_data)
            return json.dumps(log_data)
        except Exception:
            return json.dumps({"message", "error"})
    else:
        return "Wrong Request Methods. Just POST Allowed", 405

if __name__ == "__main__":
    app.run(debug=True, port=8000)