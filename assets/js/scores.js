// Select the <ul> element where high scores will be displayed
const scoresList = document.querySelector('#scoresList');

// Function to display high scores
function displayScores() {
    // Check if there are high scores stored in local storage
    if (JSON.parse(localStorage.getItem('players'))){
        // Retrieve high scores from local storage
        const scores = JSON.parse(localStorage.getItem('players'));

        // Iterate over each score
        scores.forEach(score => {
             // Create a list item element for each score
            const scoreItem = document.createElement('li');

            // Set class attribute for styling
            scoreItem.setAttribute('class', 'score');

            // Display player's initials and their score as text content of the list item
            scoreItem.textContent = score.name + ": " + score.score;

            // Append the list item to the <ul> element
            scoresList.append(scoreItem);
        });
    }
}

// Call the function to display high scores when the page is loaded
displayScores();