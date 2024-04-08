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

table_names = pd.read_sql("show tables", engine.connect()).iloc[:, 0]
tables = {table : pd.read_sql(f"select * from {table}", engine.connect()) for table in table_names}
    
def analysis():
    student = tables["STUDENT"]
    course = tables["COURSE"]
    students_by_course = student.merge(course, "inner", "COURSE_ID").drop("COURSE_ID", axis=1)
    result = students_by_course[["COURSE_NAME", "RA"]].groupby("COURSE_NAME").count()
    return result["RA"].to_json()

def analysis2():
    interaction = tables["INTERACTION"]
    ova = tables["OVA"]
    ova_by_student = ova.merge(interaction, "left", "OVA_ID").drop("OVA_ID", axis=1)
    result = ova_by_student[["OVA_NAME", "STUDENT_RA"]].groupby("OVA_NAME").count()
    return result["STUDENT_RA"].to_json()

def allPlots():
    return [analysis(), analysis2()]