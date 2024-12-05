from peewee import *  # ORM

# Establishing the database connection
# Uncomment for production or remote database connection
# db = MySQLDatabase(
#     "ova_db",
#     user="remote",
#     password="OvaIa2024cimatec-mysql",
#     host="ec2-54-236-209-79.compute-1.amazonaws.com",
#     port=3306
# )

# Configuration for local development
db = PostgresqlDatabase(
    user="postgres.yqccrsmufrvbamwpanmj",
    password="IC-2024.234",
    host="aws-0-sa-east-1.pooler.supabase.com",
    port=5432,
    database="postgres"
)

# Base class for other models
class BaseModel(Model):
    class Meta:
        database = db  # Define the database to be used for the model
