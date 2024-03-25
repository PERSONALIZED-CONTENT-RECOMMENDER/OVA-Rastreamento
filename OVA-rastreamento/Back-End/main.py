from flask import Flask, request
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO, filename="../ova.log")

@app.route("/log", methods=["POST"])
def log():
    if request.method == 'POST':
        # request.get_json() parse a JSON data, but for the future we need use request.form() to get key/value pairs from the body of HTML forms - For more information: https://stackoverflow.com/questions/10434599/get-the-data-received-in-a-flask-request
        log_request = request.get_json()
        log_data = log_request[0]
        logging.info(log_data)
    else:
        return "Wrong Request Methods. Just POST Allowed", 405

if __name__ == "__main__":
    app.run(debug=True, port=8000)