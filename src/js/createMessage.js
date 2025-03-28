import { Message } from "./Message.js";
import { postMessage } from "./fetch.js";
import { Fireworks } from 'fireworks-js';
import { profanityCheckAndPost } from "./fetch.js";

const messageForm = document.getElementById('messageForm');
messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(messageForm);
    const username = formData.get('username');
    const message = formData.get('messageTxt');
    const color = createRandomColor();
    const shadowBanned = formData.get('shadowBanned'); //alriks test input för att man kan sätt shadowBanned

    if (!username || !message) {
        console.error("Username and message are required");
        return;
    }
    const messageObj = new Message(username, message, color, shadowBanned);
    
    const msgProf = await profanityCheckAndPost(message);
    if(msgProf.isProfanity == true) {
        console.error("Message contains profanity");
        alert("Message contains profanity");
        return;
    }
   
    try {
        const response = await postMessage(messageObj);
        if (response.success) {
            console.log("Message posted successfully:", response.id);
            const container = document.getElementById('messagesContainer');
            const fireworksContainer = document.createElement("div");
            fireworksContainer.id = "fireworksContainer";
            fireworksContainer.style.position = "absolute";
            fireworksContainer.style.top = "0";
            fireworksContainer.style.left = "0";
            fireworksContainer.style.width = "100%";
            fireworksContainer.style.height = "100%";
            fireworksContainer.style.pointerEvents = "none";
            fireworksContainer.style.zIndex = "9999";
            container.appendChild(fireworksContainer);

            // Kontrollera om Dark Mode är aktivt
            const isDarkMode = document.body.classList.contains("dark-mode");

            const fireworks = new Fireworks(fireworksContainer, {
                autoresize: true,
                opacity: isDarkMode ? 0.8 : 0.5,  // Mer synliga i dark mode
                acceleration: 1.05,
                friction: 0.98,
                gravity: 1.5,
                particles: isDarkMode ? 200 : 150,  // Fler partiklar i dark mode
                trace: isDarkMode ? 5 : 3,
                explosion: isDarkMode ? 15 : 10,
                intensity: isDarkMode ? 80 : 50,
                flickering: 50,
                lineWidth: {
                    trace: isDarkMode ? 3 : 2,
                    explosion: isDarkMode ? 5 : 4, 
                },
                brightness: {
                    min: isDarkMode ? 70 : 50,
                    max: isDarkMode ? 100 : 80,
                    decay: {
                        min: 0.015,
                        max: 0.03,
                    },
                },
                hue: {
                    min: 0,
                    max: 360,
                },
                delay: {
                    min: 30,
                    max: 60,
                },
            });

            fireworks.start();
            setTimeout(() => fireworks.stop(), 5000);

        } else {
            console.error("Failed to post message:", response.error);
        }
    } catch (error) {
        console.error("Error posting message:", error);
    }
});


function createRandomColor() {
    const getRandomValue = () => Math.floor(Math.random() * 156) + 100; // Ensures values between 100 and 255 for vibrant colors

    let red = getRandomValue();
    let green = getRandomValue();
    let blue = getRandomValue();

    const MIN_DIFF = 50;
    if (Math.abs(red - green) < MIN_DIFF) {
        green = (green + 100) % 256;
    }
    if (Math.abs(green - blue) < MIN_DIFF) {
        blue = (blue + 100) % 256;
    }
    if (Math.abs(blue - red) < MIN_DIFF) {
        red = (red + 100) % 256;
    }

    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    console.log(rgbColor);

    return rgbColor;
}
