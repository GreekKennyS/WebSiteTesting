var score = 0;
var timer = 60; // Timer starts at 60 seconds
var gameInterval; // To store the interval reference

document.getElementById("changeColor").addEventListener("click", function () {
    // Generate a random background color
    let bgColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    document.body.style.backgroundColor = bgColor;

    // Function to calculate opposite (high contrast) color
    function getContrastColor(hex) {
        let r = parseInt(hex.substr(1, 2), 16);
        let g = parseInt(hex.substr(3, 2), 16);
        let b = parseInt(hex.substr(5, 2), 16);
        let brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? "#000000" : "#FFFFFF";
    }

    let textColor = getContrastColor(bgColor);

    // List of random fonts to apply
    const fonts = ["Arial", "Verdana", "Courier New", "Georgia", "Trebuchet MS", "Times New Roman", "Comic Sans MS"];

    // Pick a random font
    let randomFont = fonts[Math.floor(Math.random() * fonts.length)];

    // Apply styles to .slideIn
    const slideInElement = document.querySelector(".slideIn");
    if (slideInElement) {
        slideInElement.style.color = textColor;
        slideInElement.style.fontFamily = randomFont;
    }

    // Apply styles to the first <p> inside #game
    const firstP = document.querySelector("#game p");
    if (firstP) {
        firstP.style.color = textColor;
        firstP.style.fontFamily = randomFont;
    }
});

// Function to display the current time in the top-right corner
document.getElementById("time").addEventListener("click", function() {
    const clockElement = document.getElementById("clock"); // Get the clock div
    const currentTime = new Date(); // Get the current date/time
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');

    // Format the time as HH:MM:SS
    clockElement.innerHTML = `Τρέχουσα ώρα: ${hours}:${minutes}:${seconds}`;
    
    // Ensure the clock is visible
    clockElement.classList.remove("hidden");
});



document.getElementById("animateText").addEventListener("click", function () {
    const p = document.querySelector(".slideIn");

    if (!p) return; // Ensure the element exists

    // Remove any current animation temporarily
    p.style.animation = "none";

    // Ensure the element is visible before applying the new animation
    p.style.opacity = 1; // Make sure it's visible
    p.style.transform = "none"; // Reset any transforms

    // Brief delay to allow the reset to take effect
    setTimeout(() => {
        // List of random animations
        const animations = ["fadeIn", "slideIn", "bounce", "zoomIn", "rotate", "flip"];

        // List of random fonts
        const fonts = ["Arial", "Verdana", "Courier New", "Georgia", "Trebuchet MS", "Times New Roman", "Comic Sans MS"];

        // Pick a random animation and font
        let randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        let randomFont = fonts[Math.floor(Math.random() * fonts.length)];

        // Apply the new animation and font
        p.style.animation = `${randomAnimation} 1s ease-in-out forwards`;
        p.style.fontFamily = randomFont;
    }, 50); // Short delay before applying the new animation
});


document.getElementById("playGame").addEventListener("click", function() {
    // Toggle visibility of the game and score sections
    document.getElementById("game").classList.toggle("hidden");
    document.getElementById("score").classList.toggle("hidden");
    document.getElementById("newSection").classList.toggle("hidden");

    // Reset score and timer when the game starts
    score = 0;
    timer = 60;

    // Update the display immediately
    document.getElementById("score").innerHTML = "Score: " + score + " Timer: " + timer;

    // Clear any previous intervals and start the timer countdown
    clearInterval(gameInterval); // Stop any existing interval
    gameInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            document.getElementById("score").innerHTML = "Score: " + score + " Timer: " + timer;
        } else {
            clearInterval(gameInterval); // Stop the timer
            alert("Game Over! Your final score is: " + score);
        }
    }, 1000); // Update every second
});

// Code for the mini-game (clicking the box to increase the score)
document.getElementById("box").addEventListener("click", function() {
    score += 1;
    document.getElementById("score").innerHTML = "Score: " + score + " Timer: " + timer;

    // Randomize position and size of the box
    this.style.top = Math.random() * 300 + "px";
    this.style.left = Math.random() * 500 + "px";
    this.style.width = Math.random() * 200 + 50 + "px";
    this.style.height = Math.random() * 200 + 50 + "px";

    // Randomize the color of the box
    this.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
});

const clickSound = document.getElementById("clickSound");

function playSound() {
    if (clickSound) {
        clickSound.play().catch(error => console.error("Sound play error:", error));
    }
}

// Play sound effects when buttons are clicked
document.getElementById("changeColor").addEventListener("click", playSound);
document.getElementById("animateText").addEventListener("click", playSound);
document.getElementById("playGame").addEventListener("click", playSound);
