import pandas as pd
import matplotlib.pyplot as plt
import sqlalchemy

pd.options.display.max_columns = 20


    
# course_students = student.merge(course, how="inner").drop("COURSE_ID", axis=1)
# course_numbers = course_students[["COURSE_NAME", "RA"]].groupby(["COURSE_NAME"]).count()

# course_numbers.plot(kind="bar", title="Number of students by course")
# plt.xticks(rotation=8)
# plt.yticks(range(course_numbers.max().iloc[0] + 1))
# fig = plt.gcf()
# plt.show()
# fig.savefig("./plots/number-of-students-by-course.jpg", format="jpg")

engine = sqlalchemy.create_engine("mysql+mysqldb://duca:Password-123@localhost:3306/OVA_DB")

def get_tables():
    with engine.connect() as connection:
        tables = pd.read_sql("show tables", engine.connect()).iloc[:, 0]
        tables_dict = {table : pd.read_sql(f"select * from {table}", connection) for table in tables}
        
        return tables_dict
    
def analysis():
    tables = get_tables()
    student = tables["STUDENT"]
    course = tables["COURSE"]
    students_by_course = student.merge(course, "inner", "COURSE_ID").drop("COURSE_ID", axis=1)
    result = students_by_course[["COURSE_NAME", "RA"]].groupby("COURSE_NAME").count()
    return result["RA"].to_json()