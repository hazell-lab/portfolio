/* =========================
   portfolio javascript
   file: js/script.js

   this file is plain javascript, there is no library and no build step.

   what it does:
   1. mobile hamburger menu
   2. smooth scrolling for the menu links
   3. highlight the menu link of the section you are in
   4. change the navbar after you scroll down
   5. show and hide the back to top button
   6. scroll reveal animations
   7. typing text in the hero
   8. contact form message
   9. current year in the footer
   10. project filter buttons

   tip: press f12 in the browser to see errors while you edit.
========================= */

/* "use strict" makes javascript warn about sloppy mistakes */
"use strict";


/* =========================
   0. grab the elements we need
========================= */

/* these lines find elements from the html so we can use them later */

const header = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle");
const navList = document.querySelector(".nav-list");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");
const backToTopButton = document.getElementById("back-to-top");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const typedRole = document.getElementById("typed-role");
const yearSpan = document.getElementById("year");


/* =========================
   1. mobile menu
========================= */

/* open or close the menu */
function toggleMenu() {
  const isOpen = navList.classList.toggle("open"); // true when the menu is open
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen); // tells screen readers if the menu is open
}

/* close the menu */
function closeMenu() {
  navList.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", toggleMenu);

/* close the menu when escape is pressed */
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeMenu();
  }
});

/* close the menu when you click outside it */
document.addEventListener("click", function (event) {
  const clickedInsideMenu = navList.contains(event.target);
  const clickedToggle = navToggle.contains(event.target);

  if (navList.classList.contains("open") && !clickedInsideMenu && !clickedToggle) {
    closeMenu();
  }
});


/* =========================
   2. smooth scrolling
========================= */

navLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    const targetId = link.getAttribute("href"); // example: "#projects"

    /* skip links that are not page anchors */
    if (!targetId || !targetId.startsWith("#")) {
      return;
    }

    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      event.preventDefault(); // stop the instant jump

      /* subtract the navbar height so the navbar does not cover the title */
      const navHeight = header.offsetHeight;
      const targetPosition =
        targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      closeMenu(); // close the menu after you pick a section
    }
  });
});


/* =========================
   3. active menu link
========================= */

function updateActiveLink() {
  const scrollPosition = window.pageYOffset + header.offsetHeight + 80;
  let currentSectionId = "";

  /* find which section we are inside.
     the top of a section is measured from the top of the page,
     then compared with how far down we have scrolled */
  sections.forEach(function (section) {
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;

    if (scrollPosition >= sectionTop) {
      currentSectionId = section.getAttribute("id");
    }
  });

  /* remove active from every link, then add it to the matching one */
  navLinks.forEach(function (link) {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + currentSectionId) {
      link.classList.add("active");
    }
  });
}


/* =========================
   4. navbar and back to top button
========================= */

/* one scroll listener does both, so the page stays fast */

function handleScroll() {
  const scrolledDown = window.pageYOffset > 40;

  /* add the scrolled class so the navbar gets a solid background */
  header.classList.toggle("scrolled", scrolledDown);

  /* show the back to top button only after scrolling down a bit */
  backToTopButton.classList.toggle("visible", window.pageYOffset > 400);

  /* keep the active menu link correct */
  updateActiveLink();
}

/* scroll fires very often, so we wait for a short pause before the last update.
   this keeps the page smooth on slower devices */
let scrollTimer = null;

window.addEventListener("scroll", function () {
  handleScroll(); // update right away so it feels fast

  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(updateActiveLink, 120);
});

/* back to top button click */
backToTopButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


/* =========================
   5. scroll reveal animations
========================= */

/* intersectionobserver tells us when an element enters the screen */

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = element.getAttribute("data-delay");

          /* data-delay="200" waits 200ms, so the cards appear one after another */
          if (delay) {
            element.style.transitionDelay = delay + "ms";
          }

          element.classList.add("visible");
          observer.unobserve(element); // animate once, then stop watching
        }
      });
    },
    {
      threshold: 0.15,               /* show when 15% of the element is visible */
      rootMargin: "0px 0px -60px 0px" /* start a little before the bottom edge */
    }
  );

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });
} else {
  /* older browsers and reduced motion users see everything right away */
  revealElements.forEach(function (element) {
    element.classList.add("visible");
  });
}


/* =========================
   6. typing text in the hero
========================= */

const roles = [
  "Software Developer",
  "React + TypeScript",
  "C# / .NET Desktop Apps",
  "Software Engineering Intern"
];

let roleIndex = 0;      // which word we are on
let charIndex = 0;      // which letter we are on
let isDeleting = false; // typing forward or deleting backwards

function typeRoles() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    charIndex--; // remove one letter
  } else {
    charIndex++; // add one letter
  }

  typedRole.textContent = currentRole.substring(0, charIndex);

  let speed = isDeleting ? 45 : 90; // deleting looks better when it is faster

  if (!isDeleting && charIndex === currentRole.length) {
    speed = 1600;      // pause when the word is finished
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length; // move to the next word
    speed = 400;
  }

  setTimeout(typeRoles, speed);
}

/* only start if the element exists and movement is ok */
if (typedRole && !prefersReducedMotion) {
  typedRole.textContent = ""; // start empty then type
  setTimeout(typeRoles, 600);
}


/* =========================
   7. contact form (netlify forms)
========================= */

/* we check the fields, then send them to netlify in the background.
   netlify saves each message under site > forms and can email it to you.
   note: sending only works on the live netlify site, not on live server */

if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // stop the page from reloading

    /* trim() removes spaces at the start and end of what was typed */
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    /* a very simple email check */
    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (name === "" || email === "" || subject === "" || message === "") {
      formStatus.textContent = "Please fill in every field before sending.";
      formStatus.className = "form-status error";
      return;
    }

    if (!emailLooksValid) {
      formStatus.textContent = "Please enter a valid email address.";
      formStatus.className = "form-status error";
      return;
    }

    const submitButton = document.getElementById("form-submit");
    submitButton.disabled = true; // stop double clicks
    formStatus.textContent = "Sending...";
    formStatus.className = "form-status";

    try {
      /* netlify expects the form fields url encoded, posted to "/" */
      const formData = new FormData(contactForm);
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      });

      if (!response.ok) {
        throw new Error("status " + response.status);
      }

      formStatus.textContent = "Thanks, " + name + "! Your message was sent. I will reply soon.";
      formStatus.className = "form-status success";
      contactForm.reset(); // clear the fields
    } catch (error) {
      formStatus.textContent =
        "Sorry, the message could not be sent. Please email me at mdhazim.aqil@gmail.com.";
      formStatus.className = "form-status error";
    } finally {
      submitButton.disabled = false;
    }
  });
}


/* =========================
   8. current year in the footer
========================= */

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}


/* =========================
   project filter buttons
========================= */

/* each button has data-filter, each card has data-category.
   clicking a button hides the cards that do not match */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const filter = button.getAttribute("data-filter");

    /* move the active style to the clicked button */
    filterButtons.forEach(function (other) {
      other.classList.toggle("active", other === button);
      other.setAttribute("aria-pressed", other === button);
    });

    /* show matching cards, hide the rest */
    projectCards.forEach(function (card) {
      const matches = filter === "all" || card.getAttribute("data-category") === filter;
      card.hidden = !matches;
      if (matches) {
        card.classList.add("visible"); // make sure reveal animation is not stuck hidden
      }
    });
  });
});


/* =========================
   9. start up
========================= */

/* run the scroll logic once when the page loads, so the navbar and the active
   link are correct even if the browser opens the page halfway down */

handleScroll();

/* recalculate when the window is resized, for example when a phone rotates */
window.addEventListener("resize", updateActiveLink);
