"use strict";

window.addEventListener("DOMContentLoaded", start);

const root = document.documentElement;
let stories = [];
let authors = [];

let topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";
let singleStoryUrl = "https://hacker-news.firebaseio.com/v0/item/";
let singleAuthorUrl = "https://hacker-news.firebaseio.com/v0/user/";

function start() {
    document.querySelector("#refresh-btn").addEventListener("click", ()=>{location.reload();});
    loadJSON();
}

// Fetching top stories
function loadJSON() {
  fetch(topStoriesUrl)
    .then(response => response.json())
    .then(jsonData => {
      // When loaded, get 10 random ids
      let randomIds = getRandom(jsonData);

      // Fetch 10 stories by id
      loadSingleStoryJSON(randomIds);
    });
}

// Get 10 random ids from array of ids
function getRandom(jsonData) {
    // Shuffle array
    const shuffled = jsonData.sort(() => 0.5 - Math.random());

    // Get sub-array of 10 elements after shuffled
    let selected = shuffled.slice(0, 10);

    return selected;
}

// Fetching individual stories by id
function loadSingleStoryJSON(randomIds) {
    Promise.all(randomIds.map(id => 
        // Build API URL with id
        fetch(singleStoryUrl + id + ".json")
          .then(response => response.json())
          .then(async singleStory => {
            // Create new object with fetched data
            const story = Object.create(Story)

            story.author = singleStory.by;
            story.id = singleStory.id;
            story.score = singleStory.score;
            story.timestamp = singleStory.time;
            story.url = singleStory.url;
            story.title = singleStory.title;

            // Add the karma: build author URL
            let authorUrl = singleAuthorUrl + singleStory.by + ".json";

            // Fetch the karma
            await fetch(authorUrl)
            .then(response => response.json())
            .then(authorInfo => {
                story.karma = authorInfo.karma;
            });

            stories.push(story);
            
          })
    )).then(data => {
      
        // Sort stories by score ASC
        stories.sort((a, b) => {
            return  a.score - b.score;
        });

        // Displaying fetched data
        displayStories(stories);
    })

}

function displayStories(stories) {
    // remove loader
    document.querySelector("#loader").classList.add("hidden");
  stories.forEach(displayStory);
}

function displayStory(story, index) {
    console.log(story)

    // Create a clone of a template
    const clone = document
    .querySelector("template#story")
    .content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=title]").textContent = story.title;
    if(story.url) {
        clone.querySelector("[data-field=url]").textContent = story.url;
        clone.querySelector("[data-field=url]").setAttribute("href", story.url);
    }
    clone.querySelector("[data-field=timestamp]").textContent = story.timestamp;
    clone.querySelector("[data-field=score]").textContent = story.score;
    clone.querySelector("[data-field=author]").textContent = story.author;
    clone.querySelector("[data-field=karma]").textContent = story.karma;


    // append clone to list
    document.querySelector(".content-main").appendChild(clone);
}

//prototype Story object
const Story = {
  id: "-id-",
  author: "-author-",
  title: "-title-",
  url: "-url-",
  timestamp: "-timestamp-",
  score: "-score-",
  karma: "-karma-"
};
