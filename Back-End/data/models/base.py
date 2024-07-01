from peewee import * # ORM

# estabilishment of the database connection
db = MySQLDatabase(
    "ova_db",
    user="remote",
    password="Password-123",
    host="ec2-54-162-164-125.compute-1.amazonaws.com",
    port=3306
)

class BaseModel(Model):
    class Meta:
        database=db
