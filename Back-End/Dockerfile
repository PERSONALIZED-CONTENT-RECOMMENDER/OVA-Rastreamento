FROM python:3.10-slim

WORKDIR /api

COPY . .

RUN pip install -r requirements.txt

CMD [ "python", "api/api.py" ]
