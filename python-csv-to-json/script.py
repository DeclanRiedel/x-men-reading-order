import csv
import json

# File paths
csv_file = '../src/data/reading-order-1.csv'
json_file = '../src/data/reading-order-1.json'

# Read the CSV file
with open(csv_file, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    data = list(reader)

# Write to JSON
with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)
