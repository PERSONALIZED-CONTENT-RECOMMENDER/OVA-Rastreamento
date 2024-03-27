from peewee import *

db = MySQLDatabase("OVA_DB", user="duca", password="Password-123", host="localhost", port=3306)

class BaseModel(Model):
    class Meta:
        database=db