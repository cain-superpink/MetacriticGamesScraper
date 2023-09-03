#!/usr/bin/env node
//import puppeteer
const puppeteer = require('puppeteer');
// import files stystem
const fs = require('fs');
const { finished } = require('stream');
const fullDetails = [];
const numberOfPages = 3;




//Initial value of the page to scrape, the first page of the metacritic ranking list
var site = 'https://www.metacritic.com/browse/games/score/metascore/all/all/filtered';
// Number of pages to scrape


async function run(){

        //launch browser and open new page
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();

    for (i=1; i <= numberOfPages; i++) {
        if (i==1) {
             //go to the address stored in the variable
            await page.goto(site, {waitUntil: 'load', timeout: 0});
            console.log(`starting index for ${site}`)


             // create array from each table row containing a game and store an object with metadata properties
            const gameDetails = await page.evaluate(() =>
            Array.from(document.querySelectorAll('table.clamp-list > tbody > tr:not(.spacer)'), (e) => ({
            //within the table row select one element's inner text per property
                title: e.querySelector('a.title').innerText,
                platform: e.querySelector('.platform > span:nth-child(2)').innerText,
                releaseDate: e.querySelector('.clamp-details > span:nth-child(2)').innerText,
                metacriticScore: e.querySelector('.clamp-score-wrap').innerText,
                }))
            );
            fullDetails.push(gameDetails);
            console.log(fullDetails);
        }
        else {
            site = `https://www.metacritic.com/browse/games/score/metascore/all/psvita/filtered?page=${i}`
            await page.goto(site, {waitUntil: 'load', timeout: 0});
            console.log(`starting index for ${site}`)
        
        
            // create array from each table row containing a game and store an object with metadata properties
            const gameDetails = await page.evaluate(() =>
            Array.from(document.querySelectorAll('table.clamp-list > tbody > tr:not(.spacer)'), (e) => ({
                //within the table row select one element's inner text per property
                title: e.querySelector('a.title').innerText,
                platform: e.querySelector('.platform > span:nth-child(2)').innerText,
                releaseDate: e.querySelector('.clamp-details > span:nth-child(2)').innerText,
                metacriticScore: e.querySelector('.clamp-score-wrap').innerText,
            }))
            );
            fullDetails.push(gameDetails);
            console.log(fullDetails);
             
        }
    }
    const arrayFlat = fullDetails.flat()
    const result = arrayFlat.reduce((finalArray, current) => {
        let obj = finalArray.find((item) => item.title.toUpperCase() === current.title.toUpperCase());
        if (obj) {
          return finalArray;
        }
        return finalArray.concat([current]);
      }, []);
    
    var arrayString = JSON.stringify(result, null, 2);
    //append the existing arrary.json file creating a new line for each entry
    fs.writeFile('array.json',arrayString, finished );
    
    function finished(err) {
        console.log('write complete');
    }

    await browser.close();


}

run();
console.log('index started');