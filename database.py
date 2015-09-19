from bs4 import BeautifulSoup
import requests
import pdb
import re
import mysql.connector
from scraper import *
import sys

config = {
    'user': 'unswcn',
    'password': 'password',
    'host': 'localhost',
    'database': 'unswcn',
    'raise_on_warnings': True
}


def get_watchlist():
    db = mysql.connector.connect(**config)

    cursor = db.cursor()
    #begin selection of data
    try:
        query=("SELECT * ,user_courses.id as uc_id FROM unswcn.user_courses \
LEFT JOIN users ON user_courses.u_id=users.id \
LEFT JOIN sections ON user_courses.section_id=sections.id")
        cursor.execute(query,())
        rows=cursor.fetchall()

    except mysql.connector.Error as err:
        print err
        db.rollback()
        sys.exit()

    db.commit()

    cursor.close()
    db.close()

    return rows

def removeUsers(users):
    db = mysql.connector.connect(**config)

    cursor = db.cursor()
    print '----removing users'
    try:
        query=("DELETE FROM user_courses WHERE user_courses.id=%s")
        for u in users:
            cursor.execute(query,([u[0]]))

    except mysql.connector.Error as err:
        print err
        db.rollback()
        sys.exit()

    db.commit()

    cursor.close()
    db.close()




    return
#insert data
def insertList(l):
    #connect to database
    db = mysql.connector.connect(**config)

    cursor = db.cursor()
    #begin insertion of data
    try:
        for section in l:
            #insert uts into the list of organisations
            query=("INSERT INTO sections (course_code,course_name, section_code, sem, type, enr_max, enr_count, status, section_time) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);")
            cursor.execute(query,(
                section['course_code'], section['course_name'],section['section_code'], section['sem'],section['type'],section['enr_max'],section['enr_count'],section['status'],section['time']
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