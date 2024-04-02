# gt-test
Test project 

The project is a simple website which displays 10 random stories from HackerNews API. The stories are sorted by score.

In the js/script.js file, we fetch the contents of the "Top Stories" API, and then shuffle it and select the first 10 stories.
Then, we fetch "Story Info" of each of the selected stories. We use the author's username to fetch the author's karma from the "Author Info" API.

We save all the fetched data in an array of Story objects. Once data is fetched, we use the HTML template to populate the website and display the stories.
