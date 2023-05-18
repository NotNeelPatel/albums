from auth import get_token
from album import search_album, get_album_data
import json
from os import path
import random

ALBUM_TEXT_FILE = '../not_working.txt'
JSON_FILE = '../albums.json'

def add_to_json(album_data):
    with open(JSON_FILE, "r") as read_file:
        data = json.load(read_file)
    data.append(album_data)
    
    with open(JSON_FILE, "w") as write_file:
        json.dump(data, write_file)

token = get_token()

albums = []
with open(ALBUM_TEXT_FILE, 'r') as file:
    for a in file:
        albums.append(a.strip())

for a in albums:
    print('indexing ' + a)
    album_token = search_album(a, token)
    if album_token is not None:
        album_data = get_album_data(album_token, token)
        add_to_json(album_data)
