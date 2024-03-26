import pandas as pd
import json

with open("Back-End/Logs/ova.log", "r") as log:
    log_records = []
    for record in log.readlines():
        log_records.append(record.replace())

print(json.loads(log_records[0][26:]))