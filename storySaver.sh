#!/bin/bash

# Check if a filename is provided as an argument
if [ $# -eq 0 ]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

# Store the filename from the command-line argument
filename=$1

# Check if the file exists
if [ ! -f "$filename" ]; then
    echo "Error: File not found: $filename"
    exit 1
fi

# SQLite Database Configuration
db_file="andsoftDB.sqlite"  # Replace "your_database.sqlite" with your actual database file name
table_name="RAW_STORY"         # Replace "your_table" with your actual table name

# Read all lines from the file and join them into a single string
file_content=$(<"$filename")

echo "File Content:"
echo "$file_content"

# Read the file and print its contents to the console

while IFS= read -r line; do
    echo "$line"
done < "$filename"

sqlite3 "andsoftDB.sqlite" "CREATE TABLE IF NOT EXISTS $table_name (ID INTEGER PRIMARY KEY, STORY NVARCHAR(1000));"
sqlite3 "andsoftDB.sqlite" "CREATE TABLE IF NOT EXISTS PROCESSED_STORY (ID integer primary key autoincrement, RAW_STORY_ID integer, SENTENCE nvarchar(200), SENTENCE_NUMBER integer, IS_NEW_PARAGRAPH bit)"

# Insert the combined content as a single row into the database
sqlite3 "$db_file" "INSERT INTO $table_name (STORY) VALUES ('$file_content');"

echo "Story was inserted into db."
