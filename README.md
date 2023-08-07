# Andsoft Assessment

## Requirements
Tested this code on Mac M1. In order to work you need to have installed **Node v18.13.0** and **SQLite 3.39.5**.
## Setup
Clone this repository, `cd andsoft` and run `npm install`.

## How to use
Create a .txt file and paste inside it the story you want to save in your *RAW_STORY* table. "*example.txt*" is provided.

Navigate to cloned repo and give the *storySaver.sh* rights to be executed using `chmod +x storySaver.sh`. Then run the bash script *storySaver.sh* using `./storySaver.sh yourTxtFile.txt`; this initialize a SQLite db file and db tables, and add the story provided by .txt file to *RAW_STORY* table.

To parse the story and save it to *PROCESSED_STORY* table you can run `npm start`; story inside *RAW_STORY* table will be listed with corresponding ID, and you will be prompted to type the desired story id to parse and save the story you want. 
### Considerations
I imagined a little use case to make sense of the assessment request, the only limit is the program does not recognized a story when it was yet parsed and saved to *PROCESSED_STORY* table; so if you keep selecting the same id from the list when you execute *index.js* the table will be polluted by duplicate data. 

Code is commented in order to show as much as possible my idea of the work. 