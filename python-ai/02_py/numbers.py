# a = 54
# b = 4
# #?  "//" is used to ignore the values after decimal
# print(a // b)



student = {"name": "Harman", "age": 18, "course": "CS"}
# print(student.keys())      # dict_keys(['name', 'age', 'course'])
# print(student.values())    # dict_values(['Harman', 18, 'CS'])
# print(student.items())     # dict_items([('name', 'Harman'), ('age', 18), ('course', 'CS')])


for key, value in student.items():
    print(key, ":", value)