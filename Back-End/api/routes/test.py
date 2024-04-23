import sys, os
root = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
sys.path.append(root)
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data/models')))
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'data')))

from sqlalchemy import select, create_engine, URL
from sqlalchemy.orm import session

from competency import Competency
from course import Course
from interaction import Interaction
from offering import Offering
from ova import OVA
from student import Student
from subject import Subject

from base import db

connection_string = "Driver={ODBC Driver 18 for SQL Server};Server=tcp:ova-db-server.database.windows.net,1433;Database=OVA-DB;Uid=duca1;Pwd=Ducaduca-1;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"
connection_url = URL.create("mssql+pyodbc", query={"odbc_connect": connection_string})

engine = create_engine(connection_url)

query = select(Course.course_name, Subject.subject_name).join(Course.subjects)
with engine.connect() as conn:
    for row in conn.execute(query):
        print(row)