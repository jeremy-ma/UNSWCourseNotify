from bs4 import BeautifulSoup
import requests

url = 'http://classutil.unsw.edu.au/ELEC_S2.html'

r = requests.get(url)
data = r.text

soup = BeautifulSoup(data)

for section in soup.find_all(class_="cucourse"):
    element = section.find("b")
    if element is not None:
        print element.find_all(text=True)[0].rstrip()
    else:
        print section.text


    nextrow = section.findNext('tr')
    element = nextrow.find("cucourse")
    if element is not None:
        continue

    columns = nextrow.findAll("td")

    for col in columns:
        print col
