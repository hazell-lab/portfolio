/* =========================
   portfolio javascript
   file: js/script.js

   this file is plain javascript, there is no library and no build step.

   what it does:
   1.  theme switch (light / dark, saved in localstorage)
   2.  mobile menu
   3.  smooth scrolling for the menu links
   4.  highlight the menu link of the section you are in
   5.  navbar, back to top button and scroll progress
   6.  hero intro animation
   7.  scroll reveal animations
   8.  rotating role text in the hero
   9.  project filter buttons
   10. project image parallax and cursor label (desktop only)
   11. contact form (netlify forms)
   12. current year in the footer
   13. local time and pointer drift in the hero

   tip: press f12 in the browser to see errors while you edit.
========================= */

"use strict";


/* =========================
   0. grab the elements we need
========================= */

const root = document.documentElement;
const header = document.getElementById("site-header");
const primaryNav = document.getElementById("primary-nav");
const navToggle = document.getElementById("nav-toggle");
const navList = document.querySelector(".nav-list");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");
const backToTopButton = document.getElementById("back-to-top");
const themeToggle = document.getElementById("theme-toggle");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const typedRole = document.getElementById("typed-role");
const yearSpan = document.getElementById("year");

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersReducedMotion = motionQuery.matches;


/* =========================
   1. theme switch
========================= */

/* the theme is already set by the small script in the <head>,
   so here we only update the button and handle clicks */

function currentTheme() {
  return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function updateThemeButton() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", "Switch to " + next + " theme");
  themeToggle.querySelector(".theme-label").textContent = next === "dark" ? "Dark" : "Light";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  updateThemeButton();
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    /* private mode or blocked storage, the theme still works for this visit */
  }
}

let themeTransitionRunning = false;

if (themeToggle) {
  updateThemeButton();

  themeToggle.addEventListener("click", function (event) {
    /* ignore extra clicks while the wipe is still playing */
    if (themeTransitionRunning) {
      return;
    }

    const next = currentTheme() === "dark" ? "light" : "dark";
    saveTheme(next);

    /* a circle wipe from the button, only where the browser supports it */
    if (!document.startViewTransition || prefersReducedMotion || document.hidden) {
      applyTheme(next);
      return;
    }

    const rect = themeToggle.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    themeTransitionRunning = true;

    const transition = document.startViewTransition(function () {
      applyTheme(next);
    });

    transition.ready
      .then(function () {
        root.animate(
          { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + radius + "px at " + x + "px " + y + "px)"] },
          { duration: 650, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      })
      .catch(function () {
        /* the browser skipped the animation, the theme is still applied */
      });

    transition.finished
      .catch(function () {})
      .then(function () {
        themeTransitionRunning = false;
        /* make sure the theme really changed, even if the transition was skipped */
        if (currentTheme() !== next) {
          applyTheme(next);
        }
      });
  });

  /* follow the system setting if the visitor never picked a theme */
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (error) {}
    if (!saved) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });
}


/* =========================
   2. mobile menu
========================= */

function setMenu(isOpen) {
  navList.classList.toggle("open", isOpen);
  primaryNav.classList.toggle("open", isOpen);
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  document.body.classList.toggle("menu-open", isOpen);
  if (isOpen) {
    header.classList.remove("tucked");
  }
}

function toggleMenu() {
  setMenu(!navList.classList.contains("open"));
}

function closeMenu() {
  if (navList.classList.contains("open")) {
    setMenu(false);
  }
}

navToggle.addEventListener("click", toggleMenu);

/* close the menu when escape is pressed */
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && navList.classList.contains("open")) {
    closeMenu();
    navToggle.focus();
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

/* close the menu if the screen gets wide enough for the normal menu */
window.matchMedia("(min-width: 961px)").addEventListener("change", function (event) {
  if (event.matches) {
    closeMenu();
  }
});


/* =========================
   3. smooth scrolling
========================= */

/* every link that points to a section on this page */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (event) {
    const targetId = link.getAttribute("href"); // example: "#projects"

    if (!targetId || targetId === "#" || targetId === "#main") {
      return;
    }

    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      event.preventDefault(); // stop the instant jump

      const offset = targetId === "#home" ? 0 : header.offsetHeight - 1;
      const targetPosition =
        targetId === "#home" ? 0 : targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });

      closeMenu(); // close the menu after you pick a section
      history.replaceState(null, "", targetId);
    }
  });
});


/* =========================
   4. active menu link
========================= */

function updateActiveLink() {
  const scrollPosition = window.pageYOffset + window.innerHeight * 0.35;
  let currentSectionId = "home";

  /* find which section we are inside */
  sections.forEach(function (section) {
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;

    if (scrollPosition >= sectionTop) {
      currentSectionId = section.getAttribute("id");
    }
  });

  /* remove active from every link, then add it to the matching one */
  navLinks.forEach(function (link) {
    const isActive = link.getAttribute("href") === "#" + currentSectionId;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}


/* =========================
   5. navbar, back to top and scroll progress
========================= */

let lastScrollY = window.pageYOffset;
let scrollTicking = false;

function handleScroll() {
  const y = window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  /* solid navbar after scrolling a little */
  header.classList.toggle("scrolled", y > 24);

  /* hide the navbar when scrolling down, show it when scrolling up */
  const goingDown = y > lastScrollY;
  const menuOpen = navList.classList.contains("open");
  header.classList.toggle("tucked", goingDown && y > 400 && !menuOpen);
  lastScrollY = y;

  /* back to top button and its progress ring */
  backToTopButton.classList.toggle("visible", y > 600);
  backToTopButton.style.setProperty("--progress", maxScroll > 0 ? (y / maxScroll).toFixed(4) : 0);

  updateActiveLink();
  updateParallax();
}

/* run at most once per frame so scrolling stays smooth */
window.addEventListener("scroll", function () {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(function () {
      handleScroll();
      scrollTicking = false;
    });
  }
}, { passive: true });

/* show the navbar again when keyboard focus moves into it */
header.addEventListener("focusin", function () {
  header.classList.remove("tucked");
});

/* back to top button click */
backToTopButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});


/* =========================
   6. hero intro
========================= */

/* the name rises in once the fonts are ready, so the letters do not jump */
function startIntro() {
  root.classList.add("loaded");
}

if (prefersReducedMotion) {
  startIntro();
} else if (document.fonts && document.fonts.ready) {
  /* never wait longer than 1.2s for fonts */
  Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1200); })]).then(startIntro);
} else {
  startIntro();
}


/* =========================
   7. scroll reveal animations
========================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = element.getAttribute("data-delay");

          /* data-delay="200" waits 200ms, so items appear one after another */
          if (delay) {
            element.style.transitionDelay = delay + "ms";
          }

          element.classList.add("visible");
          observer.unobserve(element); // animate once, then stop watching
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });
} else {
  /* older browsers and reduced motion users see everything right away */
  root.classList.add("no-reveal");
  revealElements.forEach(function (element) {
    element.classList.add("visible");
  });
}


/* =========================
   8. rotating role in the hero
========================= */

const roles = [
  "Front-End Developer",
  "React + TypeScript",
  "Responsive, Accessible UI",
  "Software Engineering Student"
];

let roleIndex = 0;

function showNextRole() {
  roleIndex = (roleIndex + 1) % roles.length;

  /* slide the old word up and out */
  typedRole.classList.add("out");

  setTimeout(function () {
    /* swap the text, jump below, then slide up into place */
    typedRole.textContent = roles[roleIndex];
    typedRole.classList.remove("out");
    typedRole.classList.add("in-start");
    void typedRole.offsetWidth; // forces the browser to apply the start position
    typedRole.classList.remove("in-start");
  }, 420);
}

/* only rotate if movement is ok, and pause while the tab is hidden */
if (typedRole && !prefersReducedMotion) {
  setInterval(function () {
    if (!document.hidden) {
      showNextRole();
    }
  }, 3200);
}


/* =========================
   9. project filter buttons
========================= */

/* each button has data-filter, each project has data-category.
   clicking a button hides the projects that do not match */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectGroups = document.querySelectorAll(".project-group");
const filterStatus = document.getElementById("filter-status");

const contentsItems = document.querySelectorAll(".project-contents li");

function applyFilter(filter) {
  let shown = 0;

  /* show matching projects, hide the rest */
  projectCards.forEach(function (card) {
    const matches = filter === "all" || card.getAttribute("data-category") === filter;
    card.hidden = !matches;
    if (matches) {
      shown++;
      card.classList.add("visible"); // make sure reveal animation is not stuck hidden
    }
  });

  /* the contents list only shows the projects that are visible */
  contentsItems.forEach(function (item) {
    item.hidden = !(filter === "all" || item.getAttribute("data-category") === filter);
  });

  /* hide a whole group (like the index) when nothing in it matches */
  projectGroups.forEach(function (group) {
    group.hidden = group.querySelectorAll(".project-card:not([hidden])").length === 0;
  });

  if (filterStatus) {
    filterStatus.textContent = "Showing " + shown + (shown === 1 ? " project" : " projects");
  }

  updateParallax();
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const filter = button.getAttribute("data-filter");

    /* move the active style to the clicked button */
    filterButtons.forEach(function (other) {
      other.classList.toggle("active", other === button);
      other.setAttribute("aria-pressed", other === button);
    });

    /* cross-fade the swap where the browser supports view transitions */
    if (!document.startViewTransition || prefersReducedMotion || document.hidden || themeTransitionRunning) {
      applyFilter(filter);
      return;
    }

    root.classList.add("filtering");
    const transition = document.startViewTransition(function () {
      applyFilter(filter);
    });
    /* a transition can be skipped (for example on resize), so swallow those rejections */
    transition.ready.catch(function () {});
    transition.updateCallbackDone.catch(function () {});
    transition.finished.catch(function () {}).then(function () {
      root.classList.remove("filtering");
    });
  });
});

/* the contents list underlines the project you are looking at */
if ("IntersectionObserver" in window && contentsItems.length) {
  const contentsLinks = document.querySelectorAll(".project-contents a");

  const projectObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        contentsLinks.forEach(function (link) {
          link.classList.toggle("current", link.getAttribute("data-project") === entry.target.id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  projectCards.forEach(function (card) {
    projectObserver.observe(card);
  });
}


/* =========================
   10. parallax and cursor label
========================= */

/* project screenshots drift slightly inside their frames while scrolling.
   only on wide screens, and never for reduced motion */

const parallaxImages = document.querySelectorAll(".project-feature .project-media img");
const wideScreen = window.matchMedia("(min-width: 768px)");

function updateParallax() {
  if (prefersReducedMotion || !wideScreen.matches) {
    return;
  }

  const viewHeight = window.innerHeight;

  parallaxImages.forEach(function (image) {
    const frame = image.parentElement.getBoundingClientRect();

    /* skip images that are not on screen */
    if (frame.bottom < 0 || frame.top > viewHeight || frame.height === 0) {
      return;
    }

    /* -1 when the frame enters at the bottom, 1 when it leaves at the top */
    const progress = (frame.top + frame.height / 2 - viewHeight / 2) / (viewHeight / 2 + frame.height / 2);
    const shift = Math.max(-1, Math.min(1, progress)) * frame.height * 0.035;
    image.style.setProperty("--parallax", shift.toFixed(1) + "px");
  });
}

/* a small label follows the mouse over project images, so it is clear they are links.
   the same links are always visible as buttons too, so nothing depends on hover */

const cursorLabel = document.getElementById("cursor-label");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (cursorLabel && finePointer && !prefersReducedMotion) {
  let targetX = -100;
  let targetY = -100;
  let currentX = -100;
  let currentY = -100;
  let following = false;

  function moveLabel() {
    /* ease towards the mouse so the label trails it a little */
    currentX += (targetX - currentX) * 0.22;
    currentY += (targetY - currentY) * 0.22;
    cursorLabel.style.setProperty("--cx", currentX.toFixed(1) + "px");
    cursorLabel.style.setProperty("--cy", currentY.toFixed(1) + "px");

    if (following || Math.abs(targetX - currentX) > 0.5) {
      requestAnimationFrame(moveLabel);
    }
  }

  document.querySelectorAll("[data-cursor]").forEach(function (element) {
    element.addEventListener("pointerenter", function (event) {
      cursorLabel.textContent = element.getAttribute("data-cursor");
      targetX = currentX = event.clientX + 16;
      targetY = currentY = event.clientY + 16;
      cursorLabel.classList.add("show");
      following = true;
      requestAnimationFrame(moveLabel);
    });

    element.addEventListener("pointermove", function (event) {
      targetX = event.clientX + 16;
      targetY = event.clientY + 16;
    });

    element.addEventListener("pointerleave", function () {
      cursorLabel.classList.remove("show");
      following = false;
    });
  });
}


/* =========================
   11. contact form (netlify forms)
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
   12. current year
========================= */

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}


/* =========================
   13. local time in the hero and pointer drift
========================= */

const localTime = document.getElementById("local-time");

if (localTime && window.Intl) {
  const clockFormat = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kuala_Lumpur",
    hour: "2-digit",
    minute: "2-digit"
  });

  function updateClock() {
    localTime.textContent = "Malaysia, " + clockFormat.format(new Date()) + " GMT+8";
  }

  updateClock();
  setInterval(updateClock, 30000);
}

/* the two words of the name lean apart slightly as the pointer moves */
const heroSection = document.querySelector(".hero");
const heroName = document.querySelector(".hero-name");

if (heroSection && heroName && finePointer && !prefersReducedMotion) {
  heroSection.addEventListener("pointermove", function (event) {
    const box = heroSection.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 2 - 1;
    heroName.style.setProperty("--px", x.toFixed(3));
  });

  heroSection.addEventListener("pointerleave", function () {
    heroName.style.setProperty("--px", "0");
  });
}


/* =========================
   start up
========================= */

/* run the scroll logic once when the page loads, so the navbar and the active
   link are correct even if the browser opens the page halfway down */

handleScroll();

/* recalculate when the window is resized, for example when a phone rotates */
window.addEventListener("resize", function () {
  updateActiveLink();
  updateParallax();
});
