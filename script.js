var score = 0;
var timer = 60; 
var gameInterval; 

document.getElementById("changeColor").addEventListener("click", function () {

    let bgColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    document.body.style.backgroundColor = bgColor;


    function getContrastColor(hex) {
        let r = parseInt(hex.substr(1, 2), 16);
        let g = parseInt(hex.substr(3, 2), 16);
        let b = parseInt(hex.substr(5, 2), 16);
        let brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? "#000000" : "#FFFFFF";
    }

    let textColor = getContrastColor(bgColor);


    const fonts = ["Arial", "Verdana", "Courier New", "Georgia", "Trebuchet MS", "Times New Roman", "Comic Sans MS"];


    let randomFont = fonts[Math.floor(Math.random() * fonts.length)];

    const slideInElement = document.querySelector(".slideIn");
    if (slideInElement) {
        slideInElement.style.color = textColor;
        slideInElement.style.fontFamily = randomFont;
    }

    const firstP = document.querySelector("#game p");
    if (firstP) {
        firstP.style.color = textColor;
        firstP.style.fontFamily = randomFont;
    }
});


document.getElementById("time").addEventListener("click", function() {
    const clockElement = document.getElementById("clock");
    clockElement.classList.remove("hidden"); 


    function updateClock() {
        const currentTime = new Date(); 
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const seconds = currentTime.getSeconds().toString().padStart(2, '0');


        clockElement.innerHTML = `Τρέχουσα ώρα: ${hours}:${minutes}:${seconds}`;
    }


    updateClock();

  
    setInterval(updateClock, 1000); 
});


document.getElementById("animateText").addEventListener("click", function () {
    const p = document.querySelector(".slideIn");

    if (!p) return; 
	
    p.style.animation = "none";

 
    p.style.opacity = 1; 
    p.style.transform = "none"; 

    
    setTimeout(() => {
    
        const animations = ["fadeIn", "slideIn", "bounce", "zoomIn", "rotate", "flip"];


        const fonts = ["Arial", "Verdana", "Courier New", "Georgia", "Trebuchet MS", "Times New Roman", "Comic Sans MS"];

        let randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        let randomFont = fonts[Math.floor(Math.random() * fonts.length)];

        p.style.animation = `${randomAnimation} 1s ease-in-out forwards`;
        p.style.fontFamily = randomFont;
    }, 50); 
});


document.getElementById("playGame").addEventListener("click", function() {

    document.getElementById("game").classList.toggle("hidden");
    document.getElementById("score").classList.toggle("hidden");
    document.getElementById("newSection").classList.toggle("hidden");

 
    score = 0;
    timer = 60;


    document.getElementById("score").innerHTML = "Score: " + score + " Timer: " + timer;

  
    clearInterval(gameInterval); 
    gameInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            document.getElementById("score").innerHTML = "Score: " + score + " Timer: " + timer;
        } else {
            clearInterval(gameInterval); 
            alert("Game Over! Your final score is: " + score);
        }
    }, 1000); 
});


document.getElementById("box").addEventListener("click", function() {
    score += 1;
    document.getElementById("score").innerHTML = "Score: " + score + " Timer: " + timer;

  
    this.style.top = Math.random() * 300 + "px";
    this.style.left = Math.random() * 500 + "px";
    this.style.width = Math.random() * 200 + 50 + "px";
    this.style.height = Math.random() * 200 + 50 + "px";


    this.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
});

const clickSound = document.getElementById("clickSound");

function playSound() {
    if (clickSound) {
        clickSound.play().catch(error => console.error("Sound play error:", error));
    }
}


document.getElementById("changeColor").addEventListener("click", playSound);
document.getElementById("animateText").addEventListener("click", playSound);
document.getElementById("playGame").addEventListener("click", playSound);
