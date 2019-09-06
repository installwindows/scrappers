import sys
import requests
import json
import logging


# Download file
# Save it to disk
# Open it with taglib
# Open json tags files
# Write tags to file
# Cleanup

def get_song(url, filename):
    try:
        r = requests.get(url)
        with open(filename, "wb") as f:
            f.write(r.content)
    except:
        logging.warning(sys.exc_info())

def tagme(json_path, save_path="~/Music"):
    artist = ""
    artwork = ""
    title = ""
    tracks = []
    with open(json_path) as json_file:
        json_string = reduce(lambda s, v: s + v, json_file.readlines(), "")
    js = json.loads(json_string)
    if 'artist' in js:
        artist = js['artist']
    if 'artwork' in js:
        artwork = js['artwork']
    if 'title' in js:
        title = js['title']

    filename = artist + " - " + title + " - "

    if 'tracks' in js:
        for i, t in enumerate(js['tracks'], 1):
            t_title = ""
            t_url = ""
            if 'title' in t:
                t_title = t['title']
            if 'url' in t:
                t_url = t['url']
            # TODO Sanitize filename
            filename = filename + str(i) + " - " + t_title + ".m4a" + " | " + t_url
            get_song(t_url, save_path + filename)



    


def main(argv):
    if len(argv) > 1:
        tagme(argv[1])

if __name__ == "__main__":
    main(sys.argv)
