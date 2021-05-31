import urllib.request
import json
import sys
import requests
import random

MEDIA_DIR = "/home/var/Pictures/media"
MEDIA_DATABASE = "/home/var/Pictures/media/md5.txt"

BOARDS_SFW = ['a', 'c', 'g', 'k', 'm', 'o', 'p', 'v', 'vg', 'vm', 'vmg', 'vr', 'vrpg', 'vst', 'w', 'vip', 'qa cm', 'lgbt', '3', 'adv', 'an', 'biz', 'cgl', 'ck', 'co', 'diy', 'fa', 'fit', 'gd', 'his', 'int', 'jp', 'lit', 'mlp', 'mu', 'n', 'news', 'out', 'po', 'pw', 'qst', 'sci', 'sp', 'tg', 'toy', 'trv', 'tv', 'vp', 'vt', 'wsg', 'wsr', 'x', 'xs']
SFW_CATALOG_URL = "https://boards.4channel.org/%s/catalog"
SFW_THREAD_URL = "https://boards.4channel.org/%s/thread/%s"


class Post(object):
    pass


class Thread(object):
    def __init__(self, url):
        split_url = url.split('/')
        self.board = split_url[3]
        self.id = split_url[5]
        self.json_url = f"https://a.4cdn.org/{self.board}/thread/{self.id}.json"
        self.media_url = f"https://i.4cdn.org/{self.board}/"

        with urllib.request.urlopen(self.json_url) as response:
            self.posts = json.loads(response.read())['posts']
        self.media_post_list = []
        self.media_url_list = []
        for post in self.posts:
            if post.get('filename'):
                self.media_post_list.append(post)
                self.media_url_list.append(f"{self.media_url}{post['tim']}{post['ext']}")

    def download(self, post):
        urllib.request.urlretrieve(f"{self.media_url}{post['tim']}{post['ext']}", f"{MEDIA_DIR}/{post['tim']}{post['ext']}")

    def download_all(self):
        for post in self.media_post_list:
            print(f"downloading {post['filename']}")
            self.download(post)

    def download_random(self):
        r = random.randrange(0, len(self.media_post_list))
        self.download(self.media_post_list[r])

    def get_random_url(self):
        r = random.randrange(0, len(self.media_post_list))
        return self.media_url_list[r]


class Catalog(object):
    catalog_start_str = "var catalog = "
    catalog_end_str = ";var style_group"

    def __init__(self, url):
        self.url = url
        split_url = url.split('/')
        self.board = split_url[3]
        r = requests.get(url)
        content = r.text
        start = content.find(self.catalog_start_str)
        end = content.find(self.catalog_end_str, start)
        catalog = content[start + len(self.catalog_start_str):end]
        j = json.loads(catalog)
        self.threads = [thread for thread in j['threads']]

    def get_random_thread(self):
        r = random.randrange(0, len(self.threads))
        t = self.threads[r]
        thread = Thread(SFW_THREAD_URL % (self.board, t))
        return thread


if __name__ == "__main__":
    if len(sys.argv) > 1:
        thread = Thread(sys.argv[1])
        thread.download_all()
    else:
        b = random.choice(BOARDS_SFW)
        catalog = Catalog(SFW_CATALOG_URL % (b,))
        thread = catalog.get_random_thread()
        print(thread.get_random_url())
