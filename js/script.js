console.log('lets write javaScript');
let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`https://ashutosh420kumar.github.io/MusicPlayer/${folder}`)
    //let a = await fetch(`http://127.0.0.1:5500/Project%20-%20Songora/${folder}/`)
    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a');
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            console.log("element = ",element.href.split(`/${folder}/`)[1])
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }



    // show all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="img/music.svg" alt="" srcset="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Ashutosh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div></li>`;
    }
    // Attach an evnt listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', element => {
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim())

        })

    })

    return songs
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("songs/" + track)
    currentSong.src = `${currFolder}/` + track
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function displayAlbums() {
    let a = await fetch(`https://ashutosh420kumar.github.io/MusicPlayer/songs/`)
    //console.log("a = ",a);

    let response = await a.text();
    let div = document.createElement('div')
    div.innerHTML = response
    let anchor = div.getElementsByTagName('a')
    //console.log(anchor);
    let cardContainer = document.querySelector('.cardContainer')
    let array = Array.from(anchor)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs")) {
            //console.log(e.href);

            //console.log(e.href.split("/").slice(-2));

            let folder = e.href.split("/").slice(-2)[1];
            //console.log(e.href.split("/").slice(-2)[1]);

            if (folder !== "songs") {
                //console.log("this ids "+folder);
                let a = await fetch(`https://ashutosh420kumar.github.io/MusicPlayer/songs/${folder}/info.json`)
                let response = await a.json();
                //console.log(response);
                cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <svg id='Play_Button_Circled_24' width='30' height='30' viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                            <rect width='24' height='24' stroke='none' fill='#000000' opacity='0' />
                            <g transform="matrix(0.43 0 0 0.43 12 12)">
                                <path
                                    style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(72, 232, 27); fill-rule: nonzero; opacity: 1;"
                                    transform=" translate(-25, -25)"
                                    d="M 25 2 C 12.318 2 2 12.317 2 25 C 2 37.683 12.318 48 25 48 C 37.682 48 48 37.683 48 25 C 48 12.317 37.682 2 25 2 z M 18.042 36.034 L 17.959000000000003 14.038 L 37 24.964 L 18.042 36.034 z"
                                    stroke-linecap="round" />
                            </g>
                        </svg>
                        <img aria-hidden="false" draggable="false" loading="lazy"
                            src="/songs/${folder}/cover.jpg"
                            data-testid="card-image" alt=""
                            class="mMx2LUixlnN_Fu45JpFB yMQTWVwLJ5bV8VGiaqU3 Yn2Ei5QZn19gria6LjZj">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
            }
            //console.log(a);
            // if (a) {
            //     let response = await a.json();
            //     console.log(response);   
            // }
        }
    }

    // Load the playlist whenever card is click
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener('click', async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}
async function main() {

    // get the list of all songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)

    // Display all the albums on the page
    displayAlbums()
    // Attach an event listner to play,next and previous
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })
    // Listen for timeupdate event
    // currentSong.addEventListener('timeupdate', () => {
    //     document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    //     document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    // })
    // Listen for timeupdate event
    currentSong.addEventListener('timeupdate', () => {
        // Update the time display
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;

        // Update the seekbar position
        document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

        // Check if the song has finished playing
        if (currentSong.currentTime === currentSong.duration) {
            // Pause the current song before switching
            currentSong.pause();

            // Automatically play the next song in the list
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

            if ((index + 1) < songs.length) {
                // Play the next song if available
                playMusic(songs[index + 1]);
            } else {
                // If it's the last song, play the first song again
                playMusic(songs[0]);
            }
        }
    });

    // Add an event listener to the seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Add an event listner to seekbar
    // document.querySelector(".seekbar").addEventListener("click", e => {
    //     let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    //     document.querySelector('.circle').style.left = percent + "%";
    //     currentSong.currentTime = (currentSong.duration * percent) / 100

    // })
    // Add an evnt listner for hamburger
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector(".left").style.left = "0"
    })
    // Add an evnt listner for close
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector(".left").style.left = "-120%"
    })
    // Add an event listner to previous 
    previous.addEventListener('click', () => {
        currentSong.pause()
        console.log('previous clicked')
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
        else {
            playMusic(songs[songs.length - 1])
        }
    })
    // Add an event listner to next
    next.addEventListener('click', () => {
        currentSong.pause()
        console.log('next clicked')

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
        else {
            playMusic(songs[0])
        }
    })
    // Add an event listner to volume
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })
    // Add Event Listener to mute the track
    document.querySelector('.volume>img').addEventListener('click', e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector('.range').getElementsByTagName('input')[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = 0.1;
            document.querySelector('.range').getElementsByTagName('input')[0].value = 10
        }

    })
}
main()

