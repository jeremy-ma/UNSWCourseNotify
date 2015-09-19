from bs4 import BeautifulSoup
import requests
import pdb
import re
import mysql.connector
from scraper import *
#insert data
def insertList(l):
    #connect to database

    config = {
        'user': 'unswcn',
        'password': 'password',
        'host': 'localhost',
        'database': 'unswcn',
        'raise_on_warnings': True
    }
    db = mysql.connector.connect(**config)

    cursor = db.cursor()
    #begin insertion of data
    try:
        for section in l:
            #insert uts into the list of organisations
            query=("INSERT INTO sections (course_code,course_name, section_code, sem, type, enr_max, enr_count, status) VALUES(%s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);")
            cursor.execute(query,(
                section['course_code'], section['course_name'],section['id'], section['semester'],section['type'],section['enr_max'],section['enr_count'],section['status']
                ))



    except mysql.connector.Error as err:
        print err
        db.rollback()
        sys.exit()

    db.commit()

    cursor.close()
    db.close()


if __name__ == '__main__':
    #url = 'http://classutil.unsw.edu.au/ELEC_S2.html'
    l = scrape_everything('s2')
    insertList(l)