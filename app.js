const app = () => {
  let configuredMinutes = [2, 5, 10];

  const sound = document.querySelector('.sound');
  const play = document.querySelector('.play');
  const outline = document.querySelector('.movingOutline circle');
  const video = document.querySelector('.videoBg video');
  const addButton = document.querySelector('.addButton button');

  // sounds
  const soundButton = document.querySelectorAll('.soundPicker button');
  // time display
  const timeDisplay = document.querySelector('.timeDisplay');
  //time select wrapper
  const timeSelectWrapper = document.querySelector('.timeSelect');
  // time picker
  const timeSelectButton = document.querySelectorAll('.timeSelect button');
  // custom minutes
  const customMinutesText = document.querySelector('.customButton input');
  // get length of the outline
  const outlineLength = outline.getTotalLength();

  // duration
  let soundDuration = 600;

  outline.style.strokeDasharray = outlineLength;
  outline.style.strokeDashoffset = outlineLength;

  // add click listener to minutes button
  const addListenerToMinutesButton = (button) => {
    button.addEventListener('click', () => {
      soundDuration = button.dataset.time;

      let minutes = Math.floor(soundDuration / 60);
      let seconds = ('0' + Math.floor(soundDuration % 60)).slice(-2);
      timeDisplay.textContent = `${minutes}:${seconds}`;

      sound.play();
      video.play();
      play.src = './svg/pause.svg';
    });
  };

  // custom minutes button functionality
  addButton.addEventListener('click', () => {
    let minutes = customMinutesText.value;

    if (!minutes.match(/[0-9]/)) {
      customMinutesText.value = '';
      return;
    }

    if (configuredMinutes.indexOf(Number(minutes)) !== -1) {
      customMinutesText.value = '';
      return;
    }

    configuredMinutes.push(Number(minutes));

    var button = document.createElement('button');
    button.textContent = `${minutes} ${minutes == 1 ? 'minute' : 'minutes'}`;
    button.dataset.time = Number(minutes) * 60;

    addListenerToMinutesButton(button);

    timeSelectWrapper.appendChild(button);

    customMinutesText.value = '';
  });

  play.addEventListener('click', () => {
    playPauseSound(sound);
  });

  soundButton.forEach((button) => {
    button.addEventListener('click', () => {
      sound.src = button.dataset.sound;
      video.src = button.dataset.video;
      playPauseSound(sound);
    });
  });

  timeSelectButton.forEach((button) => {
    addListenerToMinutesButton(button);
  });

  const playPauseSound = (sound) => {
    if (sound.paused) {
      sound.play();
      video.play();
      play.src = './svg/pause.svg';
    } else {
      sound.pause();
      video.pause();
      play.src = './svg/play.svg';
    }
  };

  sound.ontimeupdate = () => {
    let currentTime = sound.currentTime;
    let elapsedTime = soundDuration - currentTime;

    let seconds = ('0' + Math.floor(elapsedTime % 60)).slice(-2);
    let minutes = Math.floor(elapsedTime / 60);

    // animate the circle
    let progress =
      outlineLength - (currentTime / soundDuration) * outlineLength;
    outline.style.strokeDashoffset = progress;

    // show duration
    timeDisplay.textContent = `${minutes}:${seconds}`;

    if (currentTime >= soundDuration) {
      sound.pause();
      video.pause();
      sound.currentTime = 0;
      play.src = './svg/play.svg';
    }
  };
};

app();
