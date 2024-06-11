from peewee import * # ORM

# estabilishment of the database connection
db = MySQLDatabase(
    "ova_db",
    user="remote",
    password="Password-123",
    host="ec2-3-139-95-211.us-east-2.compute.amazonaws.com",
    port=3306
)

class BaseModel(Model):
    class Meta:
        database=db
