import re
import os
import json
import argparse
import requests
from tqdm import tqdm


def get_download_url(track_id: int):
    url = f"https://www.ximalaya.com/revision/play/v1/audio?id={track_id}&ptype=1"
    res = requests.get(url, headers=headers)
    media_url = res.json()['data']['src']
    return media_url


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--album_url", help="e.g. https://www.ximalaya.com/album/43161440",
                        default="https://www.ximalaya.com/album/43161440")
    parser.add_argument("-o", "--output", help="Output Folder")
    args = parser.parse_args()

    payload = {}
    headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    }

    response = requests.request(
        "GET", args.album_url, headers=headers, data=payload)

    seoTrackList = re.findall(
        r'"seoTrackList":.+radiosInSearchPage', response.text)
    parsed_data = json.loads("{" + seoTrackList[0][:-21] + "}")

    pbar = tqdm(parsed_data['seoTrackList'])
    if not os.path.exists(args.output):
        os.makedirs(args.output)
    for track in pbar:
        media_url = get_download_url(track['trackId'])
        pbar.set_description(track['trackName'])
        file_ext = media_url.split('/')[-1].split('.')[-1]
        response = requests.get(media_url)
        open(f"{args.output}/{track['trackName']}.{file_ext}",
             "wb").write(response.content)
        # break
