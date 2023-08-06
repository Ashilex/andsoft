import chalk from 'chalk'
import sqlite3 from 'sqlite3'

// const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/Users/ghiffo/Desktop/andsoft/andsoftDB.sqlite');
let raw_story;
db.serialize(()=>{
    let queryResult = db.all('SELECT * FROM RAW_STORY;',(err, row)=>{
        // console.log('ciao',row)
        row.forEach((e, i )=>{
            i%2 ? console.log(chalk.bgBlue.bold(`Story ID: ${e.ID}\n`),chalk.blue(`${e.STORY}`),'\n')
            : console.log(chalk.bgGreen.bold(`Story ID: ${e.ID}\n`),chalk.green(`${e.STORY}`,'\n'))
        })
        raw_story = row[row.length-1].STORY
        let raw_story_id = row[row.length-1].ID
        let paragraphs = raw_story.split(/\n[^a-zA-Z]*\n[^a-zA-Z]*/)
        // console.log(paragraphs);
        let paragraphPhrases
        let result = []
        paragraphs.forEach(e => {
            paragraphPhrases = e.split(/\.[^a-zA-Z]*/)
            paragraphPhrases.splice(-1,1)
            paragraphPhrases.forEach((e,i)=>{
                result.push({
                    SENTENCE:e.concat('.'),
                    IS_NEW_PARAGRAPH: Boolean(!i)
            })
            })
        });
        result.forEach((e,i)=>e.SENTENCE_NUMBER=i+1)
        console.log("\n\nRESULT\n");
        result.forEach(e=>{console.log(e)})
    })
})
