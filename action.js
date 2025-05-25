// Audio elements
const rotateSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
const toggleSound = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');
const weatherChangeSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
const powerSound = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');

// Weather-specific sounds - Soothing nature sounds
const thunderstormSound = new Audio('rain-and-thunder-sfx-12820.mp3');
const rainSound = new Audio('rain-and-thunder-sfx-12820.mp3');
const snowSound = new Audio('smooth-cold-wind-looped-135538.mp3');
const windSound = new Audio('wind-artificial-18750.mp3');
const nightSound = new Audio('night-ambience-with-cricket-sound-271304.mp3');
const sunnySound = new Audio('in-the-sunshine-170183.mp3');

// Set volume levels for all sounds (0.0 to 1.0)
[rotateSound, toggleSound, weatherChangeSound, powerSound].forEach(sound => {
    sound.volume = 0.3; // UI sounds at 30% volume
});

// Set volume levels for weather sounds
[thunderstormSound, rainSound, snowSound, windSound, nightSound, sunnySound].forEach(sound => {
    sound.volume = 0.9; // Ambient sounds at 50% volume
});

// Music Player Functionality
const musicPlayer = new Audio();
let isMusicPlaying = false;
let currentMusicIndex = 0;
let powerClickCount = 0;
let lastPowerClickTime = 0;

// Your favorite music playlist - Add your music files here
const musicPlaylist = [
    'Dekho Na _ Full Song _ Fanaa _ Aamir Khan, Kajol _ Sonu Nigam, Sunidhi Chauhan, Jatin-Lalit, Prasoon-yt.savetube.me.mp3',
    // You can also use full URLs for online music
    // 'https://example.com/path-to-your-music.mp3'
];

// Function to toggle music
function toggleMusic() {
    if (!isMusicPlaying) {
        // Stop all weather sounds before starting music
        stopAllWeatherSounds();
        
        musicPlayer.src = musicPlaylist[currentMusicIndex];
        musicPlayer.volume = 0.9; // Set music volume to 90%
        musicPlayer.loop = true; // Loop the current track
        musicPlayer.play().catch(error => {
            console.error('Error playing music:', error);
        });
        isMusicPlaying = true;
    } else {
        musicPlayer.pause();
        isMusicPlaying = false;
    }
}

// Remove the click anywhere event listener
// document.addEventListener('click', function(event) { ... });

// Add triple-click detection to power button
document.querySelector('.power').addEventListener('click', function() {
    const currentTime = new Date().getTime();
    
    // Reset count if more than 1 second has passed since last click
    if (currentTime - lastPowerClickTime > 1000) {
        powerClickCount = 0;
    }
    
    powerClickCount++;
    lastPowerClickTime = currentTime;
    
    // If power button is clicked 3 times within 1 second
    if (powerClickCount === 3) {
        toggleMusic();
        powerClickCount = 0; // Reset count after triggering music
    }
});

var rotateDiv = document.getElementById('rot');
var rotateIcons = document.getElementById('rot-icons');
var clickRotateDiv = document.getElementById('click-rot');
var angle = 0;

clickRotateDiv.onclick = function() {
    angle += 60;
    rotateDiv.style.transform = 'rotate(' + angle + 'deg)';
    rotateIcons.style.transform = 'rotate(' + angle + 'deg)';
    rotateSound.currentTime = 0;
    rotateSound.play();
};

var step = 2;
var color1 = 'rgba(0,0,0,0.5)';
var color2 = 'rgba(0,0,0,0.1)';

var gradient = ' conic-gradient(';
for (var i = 0; i < 360; i += step) {
    var color = i % (2 * step) === 0 ? color1 : color2;
    gradient += color + ' ' + i + 'deg, ';
}
gradient = gradient.slice(0, -2) + '), rgb(85 93 108)'; 

rotateDiv.style.background = gradient;


var toggles = document.querySelectorAll('.toggle');
var tempElement = document.querySelector('.temp');

let isAnimating = false; // Add flag to indicate if animation is active

toggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
        if (this.classList.contains('active') || isAnimating) {
            return;
        }
        toggles.forEach(function(toggle) {
            toggle.classList.remove('active');
        });
        this.classList.add('active');
        var tempValue = parseFloat(tempElement.textContent);
        if (this.id === 'toggle-cel') {
            var celsius = Math.round((tempValue - 32) * 5 / 9);
            tempElement.textContent = celsius + '°C';
        } else if (this.id === 'toggle-far') {
            var fahrenheit = Math.round(tempValue * 9 / 5 + 32);
            tempElement.textContent = fahrenheit + '°F';
        }
        toggleSound.currentTime = 0;
        toggleSound.play();
    });
});

let currentTempF = 34; // Initialize with the initial temperature in Fahrenheit

// cubic ease in/out function
function easeInOutCubic(t) {
    return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
}

function changeTemp(element, newTemp) {
    let unit = element.innerHTML.includes("F") ? "°F" : "°C";
    let currentTemp = unit === "°F" ? currentTempF : Math.round((currentTempF - 32) * 5 / 9);
    let finalTemp = unit === "°F" ? newTemp : Math.round((newTemp - 32) * 5 / 9);

    let duration = 2000; // Duration of the animation in milliseconds
    let startTime = null;

    function animate(currentTime) {
        if (startTime === null) {
            startTime = currentTime;
        }

        let elapsed = currentTime - startTime;
        let progress = Math.min(elapsed / duration, 1);
        progress = easeInOutCubic(progress);

        let tempNow = Math.round(currentTemp + (progress * (finalTemp - currentTemp)));
        element.innerHTML = `${tempNow}${unit}`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Update currentTempF once the animation is complete
            currentTempF = newTemp;
            isAnimating = false; // Reset the flag when animation is done
        }
    }

    isAnimating = true; // Set flag when animation starts
    requestAnimationFrame(animate);
}

// Function to stop all weather sounds
function stopAllWeatherSounds() {
    thunderstormSound.pause();
    thunderstormSound.currentTime = 0;
    rainSound.pause();
    rainSound.currentTime = 0;
    snowSound.pause();
    snowSound.currentTime = 0;
    windSound.pause();
    windSound.currentTime = 0;
    nightSound.pause();
    nightSound.currentTime = 0;
    sunnySound.pause();
    sunnySound.currentTime = 0;
}

// Set all weather sounds to loop
[thunderstormSound, rainSound, snowSound, windSound, nightSound, sunnySound].forEach(sound => {
    sound.loop = true;
});

window.onload = function() {
    const sixths = Array.from(document.querySelectorAll('.sixths'));
    let index = 0;
    let temp = document.querySelector('.temp');

    document.querySelector('#rot-icons').addEventListener('click', () => {
        sixths[index].classList.remove('active');
        index = (index + 1) % sixths.length;
        sixths[index].classList.add('active');
        weatherChangeSound.currentTime = 0;
        weatherChangeSound.play();
        
        // Stop all weather sounds before playing new one
        stopAllWeatherSounds();
        
        if (index == 0) {
            changeTemp(temp, 34);
            document.querySelector('#mountains').classList.remove("snow");
            document.querySelector('#mountains').classList.remove("clouds");
            sunnySound.play();
        } else if (index == 1) {
            changeTemp(temp, 27);
            document.querySelector('#mountains').classList.add("sunset");
            windSound.play();
        } else if (index == 2) {
            changeTemp(temp, 14);
            document.querySelector('#mountains').classList.remove("sunset");
            document.querySelector('#mountains').classList.add("moon");
            nightSound.play();
        } else if (index == 3) {
            changeTemp(temp, 16);
            document.querySelector('#mountains').classList.add("clouds");
            rainSound.play();
        } else if (index == 4) {
            changeTemp(temp, 8);
            document.querySelector('#mountains').classList.add("storm");
            thunderstormSound.play();
        } else if (index == 5) {
            changeTemp(temp, -4);
            document.querySelector('#mountains').classList.remove("moon");
            document.querySelector('#mountains').classList.remove("storm");
            document.querySelector('#mountains').classList.add("snow");
            snowSound.play();
        }

        let loadingBar = document.querySelector('.loading-bar');
        loadingBar.classList.add('active');
    
        setTimeout(() => {
            loadingBar.classList.remove('active');
        }, 1200);
    });

    // Add power button sound and stop all weather sounds when power is turned off
    document.querySelector('.power').addEventListener('click', function() {
        powerSound.currentTime = 0;
        powerSound.play();
        
        // If power is being turned off, stop all weather sounds
        if (!document.querySelector('.outer-rim').classList.contains('power-on')) {
            stopAllWeatherSounds();
        }
    });
};