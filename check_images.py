import re
import os

lines = open('src/Back_end/import-data.sql', 'r', encoding='utf-8').readlines()
car_images = os.listdir('src/Front_end/public/images/cars')
moto_images = os.listdir('src/Front_end/public/images/motorbikes')

missing_count = 0
total_count = 0

for i, line in enumerate(lines):
    if 'INSERT INTO vehicles' in line:
        total_count += 1
        # Extract thumbnail_url which is the 51st column (index 50)
        # But easier: it's typically /images/cars/... or /images/motorbikes/...
        match = re.search(r"'/images/(cars|motorbikes)/([^']+)'", line)
        if match:
            folder = match.group(1)
            filename = match.group(2)
            
            # Check if file exists
            if folder == 'cars' and filename not in car_images:
                print(f"MISSING CAR IMAGE: {filename} at line {i+1}")
                missing_count += 1
            elif folder == 'motorbikes' and filename not in moto_images:
                print(f"MISSING MOTO IMAGE: {filename} at line {i+1}")
                missing_count += 1
        else:
            print(f"NO IMAGE FOUND IN LINE {i+1}")
            missing_count += 1

print(f"Total checked: {total_count}")
print(f"Total missing: {missing_count}")
