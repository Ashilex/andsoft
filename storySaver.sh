#!/bin/bash

# Check if a filename argument is provided
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

# Read all lines from the file and join them into a single string
file_content=$(<"$filename")

echo "File Content:"
echo "$file_content"


sqlite3 "andsoftDB.sqlite" "CREATE TABLE IF NOT EXISTS RAW_STORY (ID INTEGER PRIMARY KEY, STORY NVARCHAR(1000));"
sqlite3 "andsoftDB.sqlite" "CREATE TABLE IF NOT EXISTS PROCESSED_STORY (ID integer primary key autoincrement, RAW_STORY_ID integer, SENTENCE nvarchar(200), SENTENCE_NUMBER integer, IS_NEW_PARAGRAPH bit)"

# Insert the combined content as a single row into the database
sqlite3 "andsoftDB.sqlite" "INSERT INTO RAW_STORY (STORY) VALUES (\"$file_content\");"

echo "Story was inserted into db."
