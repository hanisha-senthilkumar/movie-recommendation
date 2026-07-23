import urllib.request
import re

movies = [
    (743563, 'Vikram'),
    (943722, 'Leo'),
    (615658, 'Master'),
    (630566, 'Kaithi'),
    (673593, 'Soorarai Pottru'),
    (843241, 'Jai Bhim'),
    (541135, 'Ratsasan'),
    (358485, 'Thani Oruvan'),
    (614696, 'Asuran'),
    (430598, 'Vada Chennai'),
    (1151538, 'Jailer')
]

for mid, title in movies:
    try:
        url = f'https://www.themoviedb.org/movie/{mid}'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        # search for backdrop / poster image
        m = re.search(r'<meta property="og:image" content="(.*?)"', html)
        if m:
            img = m.group(1).replace('media.themoviedb.org', 'image.tmdb.org').replace('w1200_and_h630_bestv2', 'w500').replace('w600_and_h900_bestv2', 'w500')
            print(f'{title} ({mid}): {img}')
    except Exception as e:
        print(f'{title} ({mid}): ERROR {e}')
