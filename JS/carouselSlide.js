/**
 * Create each card based on data.mjs data entries.
 *
 * class Slide
 *  createElement(), createCard(), createTechnologies()
 */

import data from "./data.mjs";
import technologiesColorPalette from "./technologiesColorPalette.mjs";

// Create card instances based on the data.mjs's data obj, and place at the DOM.
class Slide {
  constructor(site) {
    this.site = site;
  }

  // Create DOM element, place in the DOM flow based on the parent arg and add classes.
  createElement(tag, parent, ...classes) {
    const element = document.createElement(tag);
    classes.length && element.classList.add(...classes);
    parent && parent.appendChild(element);
    return element;
  }

  // Main class method. isClone marks the duplicated cards used for the infinite-scroll illusion
  // (see carousel.js) - they're hidden from assistive tech and excluded from tab order.
  createCard(isClone = false) {
    // null parent arg bc this will be declared when the card instance is created & added manualy at the DOM.
    const cardClasses = isClone ? ["card", "slide", "clone"] : ["card", "slide"];
    const card = this.createElement("div", null, ...cardClasses);
    if (isClone) card.setAttribute("aria-hidden", "true");

    const image = this.createElement("img", card, "card-img");

    image.src = this.site.img.default.src;
    image.alt = this.site.img.default.alt;

    image.addEventListener("mouseenter", () => {
      // Hover image change.
      image.src = this.site.img.hover.src;
      image.alt = this.site.img.hover.alt;
    });

    image.addEventListener("mouseleave", () => {
      // Reset all cards' hover image.
      image.src = this.site.img.default.src;
      image.alt = this.site.img.default.alt;
    });

    const cardInfo = this.createElement("div", card, "card-info");

    const h3 = this.createElement("h3", cardInfo);
    h3.textContent = this.site.header;

    const cardInfoLinks = this.createElement(
      "div",
      cardInfo,
      "card-info-links"
    );

    const aViewCodeTag = this.createElement(
      "a",
      cardInfoLinks,
      "view-code-container",
      "info-link"
    );

    // Check if link string value exists implement logic & UI
    if (this.site.code.length > 0) {
      aViewCodeTag.href = this.site.code;
      aViewCodeTag.target = "_blank";
      aViewCodeTag.rel = "noopener noreferrer";
    } else {
      // Disable link and childs' mouse events
      aViewCodeTag.disabled = true;
      aViewCodeTag.style.pointerEvents = "none";
      aViewCodeTag.style.opacity = 0.4;
    }

    this.createElement("i", aViewCodeTag, "card-icon", "fa-brands", "fa-github");

    const spanGithub = this.createElement("span", aViewCodeTag);
    spanGithub.textContent = "View code";

    const aViewSiteTag = this.createElement(
      "a",
      cardInfoLinks,
      "view-site-container",
      "info-link"
    );
    aViewSiteTag.href = this.site.website;
    aViewSiteTag.target = "_blank";
    aViewSiteTag.rel = "noopener noreferrer";

    this.createElement("i", aViewSiteTag, "card-icon", "fa-solid", "fa-globe");

    const spanWebsite = this.createElement("span", aViewSiteTag);
    spanWebsite.textContent = "See it in action";

    this.cardTechnologies(cardInfoLinks);

    // Clone links shouldn't be reachable by keyboard - they exist only for the infinite-scroll illusion.
    if (isClone) card.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));

    return card;

    /**
     * What will be the slide DOM Element.
     * 
     * <div class="card slide">
        <img
          src="./assets/sites/Mindful-aliance.jpeg"
          class="card-img"
          alt="A screenshot containing the 1st section of the website."
         />
        <div class="card-info">
          <h3>Landing Page</h3>
          <div class="card-info-links">
            <a class="view-code-container info-link">
              <i class="card-icon fa-brands fa-github"></i>
              <span>View code on Github</span>
            </a>
            <a class="view-site-container info-link">
              <i class="card-icon fa-solid fa-globe"></i>
                <span>View on Web</span>
            </a>
      
            returned *DOM div element by cardTechnologies*

          </div>
        </div>
      </div>
     */
  }

  //   This method adds the more complex logic of the last line of card-info displaying the computer languages used.
  cardTechnologies(parent) {
    const technologiesUsedContainer = this.createElement(
      "div",
      parent,
      "technologies-used-container",
      "info-link"
    );

    const wrapper = this.createElement(
      "div",
      technologiesUsedContainer,
      "wrapper"
    );

    const inner = this.createElement("div", wrapper, "inner");

    const technologiesList = this.createElement(
      "ul",
      technologiesUsedContainer,
      "technologies-used-list"
    );

    // Object.entries(..) -> [ [ key, value ], [ HTML, 10% ], ... ].
    // Returns an array of arrays sorted without the percentage symbols.
    const sortedTechnologies = Object.entries(this.site.technologies).sort(
      ([, aValue], [, bValue]) =>
        parseFloat(bValue, 10) - parseFloat(aValue, 10)
    );

    // Initialize values for wrapper(self-made icon)'s background property. The colors and occuping length are based on each language's usage rate.
    // wrapperBgString holds the string value of the bg conic-gradient property.
    let wrapperBgString = "conic-gradient(";
    // Holds the starting percentage or degree of the current color, or else the thisPercentage of the previous color. If there isn't one(starting color), starts from 0.
    let lastPercentage = 0;
    // Holds this color's length(part of the circle).
    let thisPercentage;

    // Loop through each technology and create respective DOM elements.
    sortedTechnologies.forEach((technology) => {
      const item = this.createElement("li", technologiesList, "technology");

      // Get this technology's palette color once - used for both the dot icon and the wrapper
      // gradient below. From the Object.entries returned array, technology[0] is the key of the
      // [ key, value ] pair, which happens to be a key of the technologiesColorPalette obj as well.
      const languageColor =
        technologiesColorPalette[technology[0].toLowerCase()] || "#3e4b41"; // Add fallback value if some typo occurs.

      // The dot before each language.
      const icon = this.createElement("i", item, "fa-solid", "fa-circle");
      icon.style.color = languageColor;

      // Update value based on language percentage(keep only the number).
      thisPercentage = parseFloat(technology[1], 10);
      thisPercentage =
        thisPercentage + lastPercentage > 100
          ? 100
          : thisPercentage + lastPercentage;

      // Update bg string prop with this language's respective color(i.e. "#ffffff 10% 40%, "), its starting point and its end point on the circle.
      wrapperBgString += `${languageColor} ${lastPercentage}% ${thisPercentage}%, `;

      //   Update value for the next loop.
      lastPercentage = thisPercentage;

      const code = this.createElement("code", item, null);
      code.textContent = `${technology[0]} ${technology[1]}`;
    });

    // Set property after removing last 2 characters(a space and a comma), also add the closing parenthesis.
    wrapperBgString = wrapperBgString.slice(0, -2) + ")";

    wrapper.style.background = wrapperBgString;

    /**
     * The returned div element.
     * 
     * <div class="technologies-used-container info-link">
          <div class="wrapper">
            <div class="inner"></div>
          </div>
          <ul class="technologies-used-list">
            <li class="technology">
              <i class="fa-solid fa-circle"></i>
              <code>HTML 32%</code>
            </li>
            <li class="technology">
              <i class="fa-solid fa-circle"></i>
              <code>CSS 33%</code>
            </li>
            <li class="technology">
              <i class="fa-solid fa-circle"></i>
              <code>JavaScript 35%</code>
            </li>
            .
            .
            .
          </ul>
       </div>
     */
  }
}

// Build the DOM slide list as [clones of all projects] [real projects] [clones of all projects].
// A full clone block on each side means the "next"/"prev" buttons in carousel.js always find another
// slide immediately past a boundary, so navigation can snap invisibly onto the matching real slide.
const carouselSlidesContainer = document.querySelector(".carousel-slides");

// Builds a card for a project and appends it to the carousel. isClone marks duplicated cards
// used for the infinite-scroll illusion (see carousel.js).
function appendSlideCard(project, isClone = false) {
  const slide = new Slide(project);
  carouselSlidesContainer.appendChild(slide.createCard(isClone));
}

// Leading clones - mirror the real set so scrolling back past the first real slide shows the last one.
data.forEach((project) => appendSlideCard(project, true));

// Real slides for each obj item of data(data.mjs) array.
data.forEach((project) => appendSlideCard(project));

// Trailing clones - mirror the real set so scrolling past the last real slide shows the first one.
data.forEach((project) => appendSlideCard(project, true));
