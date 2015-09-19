from bs4 import BeautifulSoup
import requests
import pdb
import re


def scrape_subject(url, semester):

    r = requests.get(url)
    data = r.text
    soup = BeautifulSoup(data)

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
                section_dict['num_enrolled'] = enrolled
                section_dict['capacity'] = capacity
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



#insert data

config = {
    'user': 'unswcn',
    'password': 'password',
    'host': 'localhost',
    'database': 'unswcn',
    'raise_on_warnings': True
}
def insertList(list):
    print 'hello world'


if __name__ == '__main__':

    url = 'http://classutil.unsw.edu.au/ELEC_S2.html'

    scrape_subject(url,'s2')

