const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// Get webcam video
function getVideo () {
  navigator.mediaDevices.getUserMedia( {
    video: true,
    audio: false
  })
  // Returns a 'promise'
  .then(localMediaStream => {
    console.log(localMediaStream);
    // In order for video to work it needs to be converted into a URL.
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
  })
  .catch(err => {
    console.log(`Oh NOOO!`, err);
  });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // Take the pixels out.
    let pixels = ctx.getImageData(0, 0, width, height);

    // Mess with them.
    // RedEffect
    pixels = redEffect(pixels);
    // RGB Split
    //pixels = rgbSplit(pixels);
    //ctx.globalAlpha = 0.8;
    // Green scren
    //pixels = greenScreen(pixels);
    // Put them back in again.
    pixels = ctx.putImageData(pixels, 0 ,0);
  }, 25);
}

function takePhoto() {
  // Play the camera sound.
  snap.currentTime = 0;
  snap.play();

  // Take the data out of the canvas.
  // Gives you base 64
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome">`;
  // jquery prepend in vanilla js
  strip.insertBefore(link, strip.firstChild);
}

// Red effect filter
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100 // Red
    pixels.data[i + 1] = pixels.data[i + 1] - 50 // Green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // Blue
  }

  return pixels;
}

// RGB Split filter
function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0] + 100 // Red
    pixels.data[i + 500] = pixels.data[i + 1] - 50 // Green
    pixels.data[i - 500] = pixels.data[i + 2] * 0.5 // Blue
  }

  return pixels;
}

// Green screen filter
function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
});

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

// Listeners
// Once video starts to play, it says 'I can play - webcam sorted etc'
video.addEventListener('canplay', paintToCanvas);