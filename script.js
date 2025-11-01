console.log("Welcome to Spotify");

// -------------------------------
// 🎧 Initialize Variables
// -------------------------------
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));

// store last playback time for resume feature
let lastPlayedTime = 0; 

// -------------------------------
// 🎵 Song Data
// -------------------------------
let songs = [
    { songName: "Warriyo - Mortals [NCS Release]", filePath: "songs/1.mp3", coverPath: "covers/1.jpg" },
    { songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg" },
    { songName: "DEAF KEV - Invincible [NCS Release]-320k", filePath: "songs/3.mp3", coverPath: "covers/3.jpg" },
    { songName: "Different Heaven & EH!DE - My Heart [NCS Release]", filePath: "songs/4.mp3", coverPath: "covers/4.jpg" },
    { songName: "Janji-Heroes-Tonight-feat-Johnning-NCS-Release", filePath: "songs/5.mp3", coverPath: "covers/5.jpg" },
    { songName: "Rabba - Salam-e-Ishq", filePath: "songs/6.mp3", coverPath: "covers/6.jpg" },
    { songName: "Sakhiyaan - Salam-e-Ishq", filePath: "songs/7.mp3", coverPath: "covers/7.jpg" },
    { songName: "Bhula Dena - Salam-e-Ishq", filePath: "songs/8.mp3", coverPath: "covers/8.jpg" },
    { songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "songs/9.mp3", coverPath: "covers/9.jpg" },
    { songName: "Na Jaana - Salam-e-Ishq", filePath: "songs/10.mp3", coverPath: "covers/10.jpg" },
];

// Fill song list
songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

// -------------------------------
// 🔁 Utility Functions
// -------------------------------

// Reset all small play icons
const makeAllPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((el) => {
        el.classList.remove('fa-pause-circle');
        el.classList.add('fa-play-circle');
    });
};

// Play song (with resume)
const playSong = (index) => {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;

    // If resuming same song, keep last time
    if (lastPlayedTime && !audioElement.paused && audioElement.currentTime > 0) {
        audioElement.currentTime = lastPlayedTime;
    } else {
        audioElement.currentTime = lastPlayedTime || 0;
    }

    audioElement.play();
    gif.style.opacity = 1;
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');

    makeAllPlays();
    document.getElementById(songIndex).classList.remove('fa-play-circle');
    document.getElementById(songIndex).classList.add('fa-pause-circle');
};

// Pause song and save time
const pauseSong = () => {
    lastPlayedTime = audioElement.currentTime; // save last position
    audioElement.pause();
    gif.style.opacity = 0;
    masterPlay.classList.remove('fa-pause-circle');
    masterPlay.classList.add('fa-play-circle');
    makeAllPlays();
};

// -------------------------------
// ▶️ Master Play/Pause Button
// -------------------------------
masterPlay.addEventListener('click', () => {
    if (audioElement.paused) {
        playSong(songIndex);
    } else {
        pauseSong();
    }
});

// -------------------------------
// 🎚️ Progress Bar Update
// -------------------------------
audioElement.addEventListener('timeupdate', () => {
    if (audioElement.duration) {
        let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
        myProgressBar.value = progress;
    }
});

// Seek feature
myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
});

// -------------------------------
// 🎵 Song List Buttons
// -------------------------------
Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
    element.addEventListener('click', (e) => {
        let index = parseInt(e.target.id);

        // If clicking same song that's already playing
        if (songIndex === index && !audioElement.paused) {
            pauseSong();
        } else {
            lastPlayedTime = (songIndex === index) ? lastPlayedTime : 0; // reset if new song
            playSong(index);
        }
    });
});

// -------------------------------
// ⏭️ Next / ⏮️ Previous
// -------------------------------
document.getElementById('next').addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    lastPlayedTime = 0;
    playSong(songIndex);
});

document.getElementById('previous').addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    lastPlayedTime = 0;
    playSong(songIndex);
});

// -------------------------------
// 🔚 Auto Play Next
// -------------------------------
audioElement.addEventListener('ended', () => {
    songIndex = (songIndex + 1) % songs.length;
    lastPlayedTime = 0;
    playSong(songIndex);
});
