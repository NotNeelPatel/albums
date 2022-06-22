import csv
import sys


def load(filename):

    albumProfile = []
    with open(filename) as csvfile:
        csv_reader = csv.reader(csvfile)
        next(csv_reader)
        for line in csv_reader:
            albumProfile.append({"album": line[0], "artist": line[1], "year": line[2], "length": line[3], "tracks": line[4], "avgSongLength": line[5],
                                "happiness": line[6], "energy": line[7], "experimental": line[8], "lyrics": line[9], "url": line[10]})

    # print(albumProfile[0])
    f = open("./assets/albums.json", 'w')
    f.write("[")
    for i in range(len(albumProfile)):
        f.write('\n\t{\n\t\t"album":"'+albumProfile[i].get("album")+'",\n\t\t"artist":"'+albumProfile[i].get("artist")+'",\n\t\t"year":"'+albumProfile[i].get("year")+'",\n\t\t"length":"'+albumProfile[i].get("length")+'",\n\t\t"tracks":"'+albumProfile[i].get("tracks")+'",\n\t\t"avgSongLength":"'+albumProfile[i].get(
            "avgSongLength")+'",\n\t\t"happiness":"'+albumProfile[i].get("happiness")+'",\n\t\t"energy":"'+albumProfile[i].get("energy")+'",\n\t\t"experimental":"'+albumProfile[i].get("experimental")+'",\n\t\t"lyrics":"'+albumProfile[i].get("lyrics")+'",\n\t\t"url":"'+albumProfile[i].get("url")+'"')

        if i == len(albumProfile)-1:
            f.write('\n\t}\n]')
        else:
            f.write('\n\t},')

    f.close()

    # print(albumProfile)
    return albumProfile


if __name__ == "__main__":
    file = str(sys.argv[1])
    load(file)
