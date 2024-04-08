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
    
def analysis():
    student = pd.read_sql(f"select * from STUDENT", engine.connect())
    course = pd.read_sql(f"select * from COURSE", engine.connect())
    students_by_course = student.merge(course, "left", "COURSE_ID").drop("COURSE_ID", axis=1)
    result = students_by_course[["COURSE_NAME", "RA"]].groupby("COURSE_NAME").count()
    return result["RA"].to_dict()

def analysis2():
    interaction = pd.read_sql(f"select * from INTERACTION", engine.connect())
    ova = pd.read_sql(f"select * from OVA", engine.connect())
    ova_by_student = ova.merge(interaction, "left", "OVA_ID").drop("OVA_ID", axis=1)
    result = ova_by_student[["OVA_NAME", "STUDENT_RA"]].groupby("OVA_NAME").count()
    return result["STUDENT_RA"].to_dict()

def studentPlot1(ra):
    interaction = pd.read_sql(f"select * from INTERACTION where STUDENT_RA = '{ra}'", engine.connect())
    result = interaction[["INTERACTION_DATE", "INTERACTION_ID"]].groupby("INTERACTION_DATE").count()
    return result["INTERACTION_ID"].to_dict()