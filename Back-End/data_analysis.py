import pandas as pd
import matplotlib.pyplot as plt
import sqlalchemy

pd.options.display.max_columns = 20

engine = sqlalchemy.create_engine("mysql+mysqldb://duca:Password-123@localhost:3306/OVA_DB")
with engine.connect() as connection:
    student = pd.read_sql("select * from STUDENT", connection)
    interaction = pd.read_sql("select * from INTERACTION", connection)
    ova = pd.read_sql("select * from OVA", connection)
    course = pd.read_sql("select * from COURSE", connection)
    
course_students = student.merge(course, how="inner").drop("COURSE_ID", axis=1)
course_numbers = course_students[["COURSE_NAME", "RA"]].groupby(["COURSE_NAME"]).count()

course_numbers.plot(kind="bar", title="Number of students by course")
plt.xticks(rotation=8)
plt.yticks(range(course_numbers.max().iloc[0] + 1))
fig = plt.gcf()
plt.show()
fig.savefig("./plots/number-of-students-by-course.jpg", format="jpg")