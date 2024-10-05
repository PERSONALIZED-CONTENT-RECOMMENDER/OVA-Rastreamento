from peewee import * # ORM

# estabilishment of the database connection
# db = MySQLDatabase(
#     "ova_db",
#     user="remote",
#     password="OvaIa2024cimatec-mysql",
#     host="ec2-54-236-209-79.compute-1.amazonaws.com",
#     port=3306
# )

# option to local development
db = MySQLDatabase(
    "ova_db",
    user="root",
    host="172.18.0.2",
    port=3306,
    password="Password-123"
)

# base class for the others classes
class BaseModel(Model):
    class Meta:
        database=db
