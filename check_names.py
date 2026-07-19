import re

lines = open('src/Back_end/import-data.sql', 'r', encoding='utf-8').readlines()
count = 0
for line in lines:
    if 'INSERT INTO vehicles' in line:
        strings = re.findall(r"'([^']*)'", line)
        thumbnail = next((s for s in strings if s.startswith('/images/')), None)
        print("Name candidates:", [s for s in strings if ' ' in s and not s.startswith('/')][:5])
        print("Thumbnail:", thumbnail)
        print("---")
        count += 1
        if count >= 5:
            break
