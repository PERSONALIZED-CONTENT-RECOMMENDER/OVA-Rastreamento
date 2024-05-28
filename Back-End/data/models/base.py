from peewee import * # ORM

# estabilishment of the database connection
db = MySQLDatabase("ova_db", user="duca", host="localhost", password="Password-123", port=3306)

class BaseModel(Model):
    class Meta:
        database=db