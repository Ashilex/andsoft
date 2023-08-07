import chalk from 'chalk'
import sqlite3 from 'sqlite3'
import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { log } from 'node:console';

const rl = readline.createInterface({ input, output });

//open db
const db = new sqlite3.Database('./andsoftDB.sqlite');
let raw_story;

db.serialize(()=>{
    //read all lines from RAW_STORY
    let queryResult = db.all('SELECT * FROM RAW_STORY;',(err, row)=>{

        //log stories to user with alternate colors, ui readability help.
        row.forEach((e, i )=>{
            i%2 ? console.log(chalk.bgBlue.bold(`Story ID: ${e.ID}\n`),chalk.blue(`${e.STORY}`),'\n')
            : console.log(chalk.bgGreen.bold(`Story ID: ${e.ID}\n`),chalk.green(`${e.STORY}`,'\n'))
        })
        
        //ask input calls itself until input in right range is provided
        function askInput(){
            let answer = rl.question(`What story do you want to save in PROCESSED_STORY table ? Insert between 1 and ${row.length}\n`)
            answer.then((storyId_input)=>{
                if(storyId_input<=row.length && storyId_input) {
                    console.log(`Processing ID ${storyId_input} Story`);
                    raw_story = row[storyId_input-1].STORY
                    let raw_story_id = row[storyId_input-1].ID
                    //split paragraphs using newlines
                    let paragraphs = raw_story.split(/\n[^a-zA-Z]*\n[^a-zA-Z]*/)
                    // console.log(paragraphs);
                    let paragraphPhrases
                    let result = []
                    paragraphs.forEach(e => {
                        //split phrases using ".""
                        paragraphPhrases = e.split(/\.[^a-zA-Z]*/)
                        paragraphPhrases.splice(-1,1)
                        
                        //add to result var an object with properties to be used in db
                        paragraphPhrases.forEach((e,i)=>{
                            result.push({
                                SENTENCE:e.concat('.'),
                                IS_NEW_PARAGRAPH: Boolean(!i),
                                RAW_STORY_ID: storyId_input
                        })
                        })
                    });
                    //index phrases disfructing their position in the result array. they remained sorted while parsed.
                    result.forEach((e,i)=>e.SENTENCE_NUMBER=i+1)
                    console.log("\n\nRESULT\n");
                    result.forEach(e=>{
                        db.run(`INSERT INTO PROCESSED_STORY (RAW_STORY_ID, SENTENCE, IS_NEW_PARAGRAPH, SENTENCE_NUMBER) VALUES (?, ?, ?, ?)`,
                            e.RAW_STORY_ID, e.SENTENCE, e.IS_NEW_PARAGRAPH, e.SENTENCE_NUMBER
                        )
                        console.log(e)})
                    rl.close()

                    
                }
                else askInput()
            })
        }
        
        //Ask user what story they want to save into "PROCESSED_STORY"
        askInput()

        
    })
})
