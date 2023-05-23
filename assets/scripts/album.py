from auth import *

def convert_ms(duration_ms) -> str:
    """
    Convert duration of album from ms to hr min or min sec
    """
    seconds=(duration_ms/1000)%60
    seconds = int(seconds)
    minutes=(duration_ms/60000)%60
    minutes = int(minutes)
    hours=(duration_ms/3600000)%24
    hours = int(hours)

    if hours > 0:
        return "%d hr %d min" % (hours, minutes)
    else:
        return "%d min %d sec" % (minutes, seconds)


def get_genre(artist_token, token) -> list:
    """
    Get genre based on artist. Not perfect since some artists dabble in multiple genres
    """
    result = send_request("https://api.spotify.com/v1/artists/",artist_token ,token)
    json_result = json.loads(result.content)

    if len(json_result) == 0:
        print("artist doesn't exist!")
        return None
    return json_result["genres"]

def get_track_features(track_ids, total_tracks, token) -> list:
    """
    Get the acousticness, danceability, energy, instrumentalness, and valence of each track in album
    """
    result = send_request("https://api.spotify.com/v1/audio-features?ids=",track_ids ,token)
    json_result = json.loads(result.content)
    if len(json_result["audio_features"]) == 0:
        print(" problem")
        return [0,0,0,0]
    
    # features are stored in a list and averaged out
    features = ["acousticness","danceability","energy","instrumentalness","valence"]
    feature_values = [0.0]*5

    # add up all the features
    for i in range(total_tracks):
        if( json_result["audio_features"][i] is None):
            print('NO AUDIO FEATURES FOUND FOR THIS ALBUM')
            return [100,100,100,100,100]
        data = json_result["audio_features"][i]
        for j in range (len(features)):
            feature_values[j] += data[features[j]]
    # average out the features
    for k in range(len(features)):
        feature_values[k] = round(feature_values[k] / total_tracks,3)
    return feature_values

def search_album(album_name, token) -> str:
    """
    Searches for an album and returns the album id if it exists
    """
    result = send_request("https://api.spotify.com/v1/search", "?q=" + album_name + "&type=album&limit=1" ,token)
    json_result = json.loads(result.content)["albums"]["items"]
    if len(json_result) == 0:
        print("album doesn't exist!")
        return None
    return json_result[0]["id"]

def get_album_data(album_token, token) -> dict:
    """
    Gets the data that I'm looking for in the album. See return statement to see what I look forf
    """
    result = send_request("https://api.spotify.com/v1/albums/",album_token + "?market=CA" ,token)
    json_result = json.loads(result.content)
    if len(json_result) == 0:
        print("album doesn't exist!")
        return None

    name = json_result["name"]

    artists = []
    artist_genre_data = []
    artist_data = json_result["artists"]
    # for loop in case there are multiple artists
    for a in artist_data:
        artists.append(a["name"])
        # Also collecting the genres that the artists do
        artist_genre_data += [get_genre(a["id"], token)]

    # genre is based on common genres amongst all the artists, or just the one artist, if there is only one artist
    # This is not a good way to do it because artists don"t just stick to one genre usually
    genres = set(artist_genre_data[0]).intersection(*artist_genre_data[1:])
    genres = list(genres)
    
    release_date = (json_result["release_date"])[:4]

    total_tracks = json_result["total_tracks"]
    
    # Using track data for duration and audio features
    track_data = (json_result["tracks"]["items"])
    duration_ms = 0
    track_ids = ""
    for t in track_data:
        duration_ms += t["duration_ms"]
        track_ids += t["id"] + "%2C"

    duration = convert_ms(duration_ms)
   
    #acousticness, danceability, energy, instrumentalness, valence
    feature_values = get_track_features(track_ids[:-3], total_tracks, token)

    album_url = json_result["external_urls"]["spotify"]

    image_url = json_result["images"][1]["url"]

    popularity = json_result["popularity"]/100
    
    #    "total_tracks": total_tracks,
    #    "duration": duration, 

    album_data = {
        "name": name,
        "artists": artists,
        "release_date": release_date, 
        "album_url": album_url,
        "image_url": image_url,
        "genres": genres,
        "popularity": popularity, 
        "acousticness": feature_values[0],
        "danceability": feature_values[1],
        "energy": feature_values[2],
        "instrumentalness": feature_values[3],
        "valence" : feature_values[4],
        "score" : 0
        }
    return album_data



