document.addEventListener('DOMContentLoaded', function() {
    const slidesContainer = document.querySelector('.slides');
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    // Clone the first and last slides
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[totalSlides - 1].cloneNode(true);

    // Add clones to the end and beginning of the slides container
    slidesContainer.appendChild(firstClone);
    slidesContainer.insertBefore(lastClone, slidesContainer.firstChild);

    // Adjust the starting position
    let currentIndex = 1;
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

    function showNextSlide() {
        currentIndex++;
        slidesContainer.style.transition = 'transform 1s ease';
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

        if (currentIndex === totalSlides + 1) {
            setTimeout(() => {
                slidesContainer.style.transition = 'none';
                currentIndex = 1;
                slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            }, 1000); // Transition duration must match the CSS transition duration
        }
    }

    function showPreviousSlide() {
        currentIndex--;
        slidesContainer.style.transition = 'transform 1s ease';
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

        if (currentIndex === 0) {
            setTimeout(() => {
                slidesContainer.style.transition = 'none';
                currentIndex = totalSlides;
                slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            }, 1000); // Transition duration must match the CSS transition duration
        }
    }

    setInterval(showNextSlide, 5000); // Adjust the interval time as needed
});
