from bs4 import BeautifulSoup
import requests
import pdb
import re
import mysql.connector


def scrape_subject(url, semester):

    r = requests.get(url)
    data = r.text
    soup = BeautifulSoup(data,"html.parser")

    regex = re.compile(r'(\w{3} [-:\d]+)')
    sectionlist = []

    for section in soup.find_all(class_="cucourse"):
        element = section.find("b")
        if element is not None:
            # pdb.set_trace()
            #print element.find_all(text=True)[0].rstrip()
            code = element.text.rstrip()
            name = section.findNext('td').text
            row = section.findNext('tr')

            while row != None and check_end(row) is False:

                columns = row.findAll("td")

                type_ = columns[0].text
                section_id = columns[1].text
                status = columns[4].text
                enrolled, capacity = [int(x) for x in columns[5].text.split(' ')[0].split('/')]

                timematch = regex.match(columns[7].text)
                if timematch is not None:
                    time = timematch.group(1)
                else:
                    time = columns[7].text

                section_dict = {}
                section_dict['course_code'] = code
                section_dict['course_name'] = name
                section_dict['id'] = section_id
                section_dict['type'] = type_
                section_dict['status'] = status
                section_dict['enr_count'] = enrolled
                section_dict['enr_max'] = capacity
                section_dict['time'] = time
                section_dict['semester'] = semester

                sectionlist.append(section_dict)

                row = row.findNext('tr')

    return sectionlist

def check_end(row):
    # check the row if its past the end of the subject
    clas = row.get('class')
    if clas != None:
        clas = clas[0]
    if clas!= 'rowHighlight' and clas != 'rowLowLight':
        return True
    elif row.find('a') is not None and  row.find('a').get('href') == '#top':
        # check for the '^ top ^' hyperlink
        return True
    else:
        return False

def scrape_everything(semester):
    url = "http://classutil.unsw.edu.au/"
    r = requests.get(url)
    data = r.text
    soup = BeautifulSoup(data)
    sectionlist = []

    for row in soup.findAll('tr'):
        clas = row.get('class')
        if clas != None:
            clas = clas[0]
        if clas != 'rowHighlight' and clas != 'rowLowLight':
            continue
        columns = row.findAll(class_='data')
        #print columns
        if semester == 's2':
            column = columns[2]
        elif semester == 's1':
            column = columns[1]
        elif semester == 'sum':
            column = columns[0]

        if column.find('a') is not None:
            link = column.find('a').get('href')
            subject_url = url + link
            sectionlist.append(scrape_subject(subject_url,semester))

    return sectionlist




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
            query=("INSERT INTO sections (course_code,course_name, sem, type, enr_max, enr_count, status) VALUES(%s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);")
            cursor.execute(query,(
                section['course_code'], section['course_name'],section['semester'],section['type'],section['enr_max'],section['enr_count'],section['status']
                ))



    except mysql.connector.Error as err:
        print err
        db.rollback()
        sys.exit()

    db.commit()


    cursor.close()
    db.close()


if __name__ == '__main__':

    url = 'http://classutil.unsw.edu.au/ELEC_S2.html'

    scrape_everything('s2')

