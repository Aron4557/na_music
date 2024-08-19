document.addEventListener('DOMContentLoaded', function() {
    let currentSound = null;
    let currentButton = null;
    let isAudioPlaying = false;

    function startLoading(box) {
        const spinner = box.querySelector('.spinner');
        spinner.style.display = 'block'; // Show spinner
    }

    function stopLoading(box) {
        const spinner = box.querySelector('.spinner');
        spinner.style.display = 'none'; // Hide spinner
    }

    function setPlayPauseIcon(button, isPlaying) {
        button.innerHTML = isPlaying ? "&#10074;&#10074;" : "&#9658;"; // Pause or Play icon
    }

    function updateProgressBar(progressBar, sound) {
        const progress = progressBar.querySelector('.progress');
        const percentage = (sound.seek() / sound.duration()) * 100;
        progress.style.width = percentage + '%';
    }

    function togglePlayPause() {
        if (currentSound) {
            if (currentSound.playing()) {
                currentSound.pause();
                setPlayPauseIcon(currentButton, false);
                currentButton.parentElement.setAttribute('data-state', 'paused');
                stopLoading(currentButton.parentElement);
                isAudioPlaying = false;
            } else {
                currentSound.play();
                setPlayPauseIcon(currentButton, true);
                currentButton.parentElement.setAttribute('data-state', 'playing');
                startLoading(currentButton.parentElement);
                isAudioPlaying = true;
            }
        }
    }

    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', function() {
            const audioSrc = box.getAttribute('data-src');
            const progressBar = box.querySelector('.progress-bar');

            // Stop and reset the currently playing audio if different
            if (currentSound && currentSound._src !== audioSrc) {
                currentSound.stop();
                if (currentButton) {
                    setPlayPauseIcon(currentButton, false);
                    currentButton.parentElement.setAttribute('data-state', 'paused');
                }
                stopLoading(currentButton.parentElement);
            }

            // Toggle play/pause for the same audio element
            if (currentSound && currentSound._src === audioSrc) {
                togglePlayPause();
                return;
            }

            // Play new audio
            if (!currentSound || currentSound._src !== audioSrc) {
                currentSound = new Howl({
                    src: [audioSrc],
                    html5: true, // Use HTML5 Audio for large files
                    onplay: function() {
                        startLoading(box);
                        setPlayPauseIcon(currentButton, true);
                        box.setAttribute('data-state', 'playing');
                        progressBar.style.display = 'block';
                    },
                    onpause: function() {
                        setPlayPauseIcon(currentButton, false);
                        box.setAttribute('data-state', 'paused');
                        stopLoading(box);
                    },
                    onend: function() {
                        setPlayPauseIcon(currentButton, false);
                        box.setAttribute('data-state', 'paused');
                        progressBar.style.display = 'none';
                        stopLoading(box);
                        currentSound = null;
                        currentButton = null;
                        isAudioPlaying = false;
                    },
                    onload: function() {
                        stopLoading(box);
                    }
                });

                currentButton = this.querySelector('.play-button');

                // Update progress bar as the audio plays
                currentSound.on('play', function() {
                    const interval = setInterval(() => {
                        if (currentSound.playing()) {
                            updateProgressBar(progressBar, currentSound);
                        } else {
                            clearInterval(interval);
                        }
                    }, 100);
                });

                currentSound.play();
            }
        });
    });

    // Handle space bar press
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault(); // Prevent the default space bar action (scrolling)
            togglePlayPause();
        }
    });
});
