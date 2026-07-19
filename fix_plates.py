import re

lines = open('src/Back_end/import-data.sql', 'r', encoding='utf-8').readlines()
out_lines = []
counter = 1

for line in lines:
    if 'INSERT INTO vehicles' in line:
        # Just replace the license plate entirely with a completely unique one to be safe!
        # License plate is the 38th column, but we can just regex find it.
        # It looks like: '51G-C11111'
        match = re.search(r"'(?P<prefix>[0-9]{2}[A-Z0-9]{1,2})-(?P<suffix>[A-Z0-9]{4,6})'", line)
        if match:
            original = match.group(0)
            new_plate = f"'{counter:02d}A-{counter:05d}'"
            line = line.replace(original, new_plate, 1)
            counter += 1
    out_lines.append(line)

with open('src/Back_end/import-data.sql', 'w', encoding='utf-8') as f:
    f.writelines(out_lines)
print(f'Replaced {counter-1} plates!')
