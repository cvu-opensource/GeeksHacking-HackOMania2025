import ast
from datetime import datetime

from DBController import DBController
db = DBController()

with open('im_cooked.txt') as f:
    for line in f.readlines():
        data = ast.literal_eval(line)
        for person in data:
            person['birth_date'] = datetime.strptime(person['birth_date'], '%d/%m/%y')
            print(person)
            # db.create_user(person)