import re
import os
import json
import time
import requests
import schedule
import datetime
from lxml import html


def job():
    try:
        print('Running')
        target_url = 'https://www.boerse-stuttgart.de/en/products/indices/a1maa5-euwax-sentiment-index'
        page_content = requests.get(target_url).content
        tree = html.fromstring(page_content)
        price = tree.xpath('//span[@class="js-bsg-live-data__field bsg-live-data__field" '
                           'and @data-field="PRICE"]/text()')
        latest_price = _clean_text(price[0])
        current_time = datetime.datetime.now()
        date_time = datetime.datetime.strftime(current_time, '%d:%m:%H:%M:%S')

        data = {
            'latest_price': latest_price,
            'date': date_time
        }

        json_data = []
        file_path = os.getcwd() + '/data.json'
        if not os.path.exists(file_path):
            with open(file_path, 'w'): pass

        with open(file_path, 'r+') as jsonFile:
            try:
                json_data = json.load(jsonFile)
            except Exception as e:
                pass
            json_data.append(data)

            jsonFile.seek(0)  # rewind
            json.dump(json_data, jsonFile)
            jsonFile.truncate()
    except Exception as e:
        print(e)
        pass


def _clean_text(text):
    text = text.replace("\n", " ").replace("\t", " ").replace("\r", " ")
    text = re.sub("&nbsp;", " ", text).strip()

    return re.sub(r'\s+', ' ', text)


schedule.every(1).minutes.do(job)

while 1:
    schedule.run_pending()
    time.sleep(1)
