let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
  // Clear any existing timers.
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000
  // Run as soon as function is invoked.
  displayTimeLeft(seconds);
  // Display the be back time.
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // Check if we should stop it!
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }

    // Display the time left.
    // Run this function again.
    displayTimeLeft(secondsLeft);
  }, 1000); // Run it every second.
}

// Display the timer.
function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  timerDisplay.textContent = display;
  // Update title tag / browser tab
  document.title = display;
}

// Display be back time.
function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  // Don't use 24h clock.
  //const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  endTime.textContent = `Be back at ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

// Start the timer when the default time buttons are clicked.
function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

// Listeners.
buttons.forEach(button => button.addEventListener('click', startTimer));
// Start the timer when minutes are entered into form.
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  timer(mins * 60);
  this.reset();
});