// Get our elements.
const player  = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreenButton = player.querySelector('.btn-full-screen');

// Build out functions.
// Toggle between playing and pausing.
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
  // if (video.paused) {
  //   video.play();
  // } else {
  //   video.pause();
  // }
}

// Toggle the play and pause icon.
function updateButton() {
  // 'this' is bound to video through the click event.
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

// Fast forward and rewind the video time by selecting data attribute value.
function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

// Set the volume and video speed via range values.
function handleRangeUpdate() {
  video[this.name] = this.value;
}

// Update the video progress bar fill colour.
function handleProgress() {
  const percent = (video.currentTime/ video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

// Move the video play time to where ever we clicked the progress bar.
function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

// Toggle Full screen.
// Need to have browser prefixes.
function toggleFullscreen() {
  // If it's already full screen, close it.
  if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else { // Else make full screen.
    if (document.documentElement.requestFullscreen) {
      player.requestFullscreen();
    } else if(document.documentElement.mozRequestFullScreen) {
      player.mozRequestFullScreen();
    } else if(document.documentElement.webkitRequestFullscreen) {
      player.webkitRequestFullscreen();
    } else if(document.documentElement.msRequestFullscreen) {
      player.msRequestFullscreen();
    }
  }
};

// Hook up event listeners.
// General video listeners.
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

// Play/Pause Button.
toggle.addEventListener('click', togglePlay);

// Skip Buttons.
skipButtons.forEach(button => button.addEventListener('click', skip));

// Ranges.
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

// Scrub.
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e)=> mousedown && scrub(e));
progress.addEventListener('mousedown', ()=> mousedown = true);
progress.addEventListener('mouseup', ()=> mousedown = false);

// Full screen.
fullscreenButton.addEventListener('click', toggleFullscreen);