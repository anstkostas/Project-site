/**
 * Carousel functionality - buttons-only, seamless infinite loop.
 *
 * Get DOM Elements
 * Perform size calculations
 * Position on the real slide set (skip past the leading clone block)
 * Next/Previous Slide Listeners
 * Snap invisibly onto the real slide set whenever a clone is reached
 *
 * The DOM (built by carouselSlide.js) is laid out as:
 *   [clones of all projects] [real projects] [clones of all projects]
 * Buttons always move exactly one slide at a time, so a boundary is only ever crossed by one
 * slide - meaning we can always tell we've landed on a clone and snap back to its real twin.
 */

// Get carousel slides array. Includes the leading/trailing clone blocks used for the infinite-loop illusion.
const slides = Array.from(document.querySelectorAll(".slide"));

// Number of real (non-clone) slides - also the size of each clone block and the DOM index where the real block starts.
const realCount = document.querySelectorAll(".slide:not(.clone)").length;

// Get the elem containing ALL carousel items.
const carouselSlides = document.querySelector(".carousel-slides");

// Carousel buttons.
const btnNext = document.querySelector(".ctrl-next");
const btnPrev = document.querySelector(".ctrl-prev");

// Recalculates slide width + gap on load/resize.
function getSlideInterval() {
  const slideWidth = slides[0].offsetWidth;
  const slidesGap = parseInt(window.getComputedStyle(carouselSlides).gap, 10);
  return slideWidth + slidesGap;
}

let slideInterval = getSlideInterval();

// Tracks the DOM index (into `slides`, clones included) currently scrolled to.
let currentIndex = realCount;

// Scrolls carousel to a given DOM index. smooth = false jumps instantly (used for the initial
// position and for the invisible clone-to-real snap, where no animation should be seen).
function scrollToSlide(index, smooth = true) {
  carouselSlides.scrollTo({
    left: slideInterval * index,
    behavior: smooth ? "smooth" : "auto",
  });
}

// Position on the first real slide (skip past the leading clone block) with no visible scroll animation.
scrollToSlide(currentIndex, false);

// On resize only the pixel width changes - re-anchor to the same logical slide, don't reset to slide 0.
window.addEventListener("resize", () => {
  slideInterval = getSlideInterval();
  scrollToSlide(currentIndex, false);
});

// Recalculates currentIndex from the actual scroll position - keeps state in sync with manual
// swipe/trackpad scrolling on the container, not just button clicks.
function syncIndexFromScroll() {
  currentIndex = Math.round(carouselSlides.scrollLeft / slideInterval);
}

// Runs once any scroll (button click OR manual swipe/trackpad drag) settles. If it landed in a
// clone block, shifts the raw scroll position by exactly one clone-block-width - rather than
// rounding to the nearest slide and re-targeting its edge - so a mid-slide swipe position is
// preserved instead of being snapped to a slide boundary. Finally re-syncs currentIndex from the
// (possibly just-shifted) position, since a swipe never goes through the button handlers.
function settleScrollPosition() {
  const cloneBlockWidth = realCount * slideInterval;
  const rawScrollLeft = carouselSlides.scrollLeft;

  if (rawScrollLeft >= cloneBlockWidth * 2) {
    // Past the trailing clone block's start -> shift back onto the matching real position.
    carouselSlides.scrollTo({ left: rawScrollLeft - cloneBlockWidth, behavior: "auto" });
  } else if (rawScrollLeft < cloneBlockWidth) {
    // Before the real block's start -> shift forward onto the matching real position.
    carouselSlides.scrollTo({ left: rawScrollLeft + cloneBlockWidth, behavior: "auto" });
  }

  syncIndexFromScroll();
}

btnNext.addEventListener("click", () => {
  syncIndexFromScroll();
  currentIndex++;
  scrollToSlide(currentIndex);
});

btnPrev.addEventListener("click", () => {
  syncIndexFromScroll();
  currentIndex--;
  scrollToSlide(currentIndex);
});

// Settle - and snap off a clone if needed - once any scroll (button or swipe) comes to rest.
if ("onscrollend" in window) {
  carouselSlides.addEventListener("scrollend", settleScrollPosition);
} else {
  // Fallback for browsers without the `scrollend` event - approximates "the scroll has settled".
  let settleTimeout;
  carouselSlides.addEventListener("scroll", () => {
    clearTimeout(settleTimeout);
    settleTimeout = setTimeout(settleScrollPosition, 150);
  });
}
