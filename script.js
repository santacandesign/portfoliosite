"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const p5holder = document.getElementById("p5jsholder");
  const paragraph = document.querySelector("p");
  const vectorLine = document.querySelector(".vector-line");
  let lastScrollPosition = 0; // Track scroll direction

  window.addEventListener("scroll", () => {
    // Get scroll position and viewport height
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollingDown = scrollPosition > lastScrollPosition;

    // Only trigger animations when scrolling down past threshold
    if (scrollPosition > viewportHeight * 0.2 && scrollingDown) {
      p5holder.classList.add("p5js-exit");
      setTimeout(() => {
        paragraph.classList.add("paragraph-enter");
        vectorLine.classList.add("vector-line-enter");
      }, 300);
    }
    // Remove classes when scrolling up past threshold
    else if (scrollPosition <= viewportHeight * 0.2) {
      p5holder.classList.remove("p5js-exit");
      paragraph.classList.remove("paragraph-enter");
      vectorLine.classList.remove("vector-line-enter");
    }

    lastScrollPosition = scrollPosition;
  });
});

// document.addEventListener("DOMContentLoaded", () => {
//   const svgElement = document.querySelector("svg");

//   const observer = new IntersectionObserver(
//     (entries, observer) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           document.querySelectorAll(".draw-arrow").forEach((el) => {
//             el.classList.add("animate");
//           });
//           observer.unobserve(entry.target); // stop observing after first trigger
//         }
//       });
//     },
//     {
//       threshold: 0.5, // Trigger when 50% of the SVG is visible
//     }
//   );

//   observer.observe(svgElement);
// });
