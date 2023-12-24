from auth import get_token
from album import search_album, get_album_data
import json
from os import path
import sys

JSON_FILE = '../albums.json'


def add_to_json(album_data):
    with open(JSON_FILE, "r") as read_file:
        data = json.load(read_file)

    for entry in data:
        if album_data['name'] == entry['name'] and album_data['artists'] == entry['artists']:
            print('Album already in JSON file, aborting.')
    data.append(album_data)
    
    with open(JSON_FILE, "w") as write_file:
        json.dump(data, write_file)
    print('Success!')

token = get_token()

if __name__ == "__main__":
    # --url used when searching doesn't work
    if str(sys.argv[1]) in ['--url', '--u']:
        album = str(sys.argv[1])
        url = str(sys.argv[2])
        album_token = url[31:-26]
    else:
        album = ""
        for i in (sys.argv[1:]):
            album += str(i) + " "
        album_token = search_album(album, token)

    if album_token is None:
        print('Error: No album id')

    album_data = get_album_data(album_token, token)
    print('Add', album_data['name'],  'by',album_data['artists'], '? (y/n)')
    i = input()
    if i.lower() in ['', 'y', 'yes']:
        add_to_json(album_data)
    else:
        print('Aborting')


