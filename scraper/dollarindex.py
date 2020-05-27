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
        target_url = 'https://ca.investing.com/currencies/us-dollar-index-advanced-chart'
        headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                          'Chrome/81.0.4044.138 Safari/537.36'
        }
        page_content = requests.get(target_url, headers=headers).content
        tree = html.fromstring(page_content)
        price = tree.xpath('//span[@id="last_last"]/text()')
        diff = tree.xpath('//span[contains(@class, "arial_20")]/text()')
        offset = diff[0]
        percent = diff[1]
        latest_price = _clean_text(price[0])
        current_time = datetime.datetime.now()
        date_time = datetime.datetime.strftime(current_time, '%d:%m:%H:%M:%S')

        data = {
            'latest_price': latest_price,
            'offset': offset,
            'percent': percent,
            'date': date_time
        }

        json_data = []
        file_path = os.getcwd() + '/dollar_index.json'
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


schedule.every(0.01666).minutes.do(job)

while 1:
    schedule.run_pending()
    time.sleep(1)
