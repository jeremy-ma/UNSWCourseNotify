from bs4 import BeautifulSoup
import requests
import pdb
import re
from collections import defaultdict
from credentials import mailgun_sandboxkey
import database

current_semester = 's2'

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
                #print row.text
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
                section_dict['section_code'] = section_id
                section_dict['type'] = type_
                section_dict['status'] = status
                section_dict['enr_count'] = enrolled
                section_dict['enr_max'] = capacity
                section_dict['time'] = time
                section_dict['sem'] = semester

                sectionlist.append(section_dict)
                #pdb.set_trace()


                row = row.findNext('tr')

    return sectionlist




def check_end(row):
    # check the row if its past the end of the subject
    clas = row.get('class')
    if clas != None:
        clas = clas[0]
    if clas != 'rowHighlight' and clas != 'rowLowlight':
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
            sectionlist.extend(scrape_subject(subject_url,semester))

    return sectionlist

def getmatches(watchl):
    sections = scrape_everything(current_semester)
    catalog = defaultdict(dict)
    matched_users = []
    for section in sections:
        #chuck everything into something sortable
        catalog[section['course_code']][section['section_code']] = section['status']

    for user in watchl:
        if 'Open' in catalog[user[9]][user[11]]:
                matched_users.append(user)

    return matched_users




def send_simple_message():
    return requests.post(
        "https://api.mailgun.net/v3/sandbox961793f019cd4f928eda465344bf3afb.mailgun.org/messages",
        auth=("api", mailgun_sandboxkey),
        data={"from": "Matt Duong <mailgun@timeweave.com.au>",
              "to": "Jeremy Ma <jeremyma.cx@gmail.com>",
              "subject": "Hello Jma",
              "text": "Congratulations Jma, you just sent an email with Mailgun!  You are truly awesome!  You can see a record of this email in your logs: https://mailgun.com/cp/log .  You can send up to 300 emails/day from this sandbox server.  Next, you should add your own domain so you can send 10,000 emails/month for free."})

def send_email(user):
    from_ = "UNSWCourseNotify <mailgun@timeweave.com.au>"
    to = "UNSW Student <" + user[6] + ">"
    subject =  user[9] + ' ' + user[11] + " is now OPEN for enrolment"
    text = subject + "\nGo and enrol!!!\nIf you found this app useful please visit www.timeweave.com.au for other useful tools\n\nUNSWCourseNotify"
    return requests.post(
        "https://api.mailgun.net/v3/sandbox961793f019cd4f928eda465344bf3afb.mailgun.org/messages",
        auth=("api", mailgun_sandboxkey),
        data={"from": from_,
              "to": to,
              "subject": subject,
              "text": text})

if __name__ == '__main__':

    watchl = database.get_watchlist()
    print watchl
    matched_users = getmatches(watchl)
    for user in matched_users:
        send_email(user)
        print 'sent email to'+ user[6]
        continue

    database.removeUsers(matched_users)

    #send_simple_message()
    #user = {"email": 'jeremyma.cx@gmail.com', 'course_code': 'ELEC3117', 'section_code': 'M14A'}
    #send_email(user)
