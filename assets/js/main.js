// --------- Navbar theme switch --------- //
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll("[data-theme]");
  const navbarCta = document.querySelector(".navbar__cta");
  const navbarCtaTextCont = document.querySelectorAll(".navbar__cta-text");

  const followMarkup = `
  <span class="cta-text">Follow us</span>
  <span class="cta-sep">&nbsp;</span>

  (&nbsp;<span class="cta-social cta-li">
     <a href="https://www.linkedin.com/company/risqlyai"
       target="_blank"
       rel="noopener"
       class="cta-link navbar__cta-text-li">LI</a>
       
       <a href="https://www.linkedin.com/company/risqlyai"
       target="_blank"
       rel="noopener"
       class="cta-link navbar__cta-text-li">LI</a>
    
  </span>&nbsp;)

  <span class="cta-sep">&nbsp;&amp;&nbsp;</span>

  (&nbsp;<span class="cta-social cta-x">
     <a href="https://x.com/RisqlyAI"
       target="_blank"
       rel="noopener"
       class="cta-link navbar__cta-text-x">X</a>

       <a href="https://x.com/RisqlyAI"
       target="_blank"
       rel="noopener"
       class="cta-link navbar__cta-text-x">X</a>
  </span>&nbsp;)
`;

  function updateNavbarTheme() {
    const scrollY = window.scrollY;
    const offset = 80; // adjust to navbar height

    const allSections = [...sections]; // your normal sections

    allSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = scrollY + rect.top;
      const sectionBottom = sectionTop + rect.height;

      if (scrollY + offset >= sectionTop && scrollY + offset < sectionBottom) {
        const currentTheme = section.dataset.theme || "light"; // fallback

        navbar.classList.remove("light-theme", "dark-theme");
        navbar.classList.add(`${currentTheme}-theme`);

        // Only apply CTA changes if it’s waitlist
        if (section.id === "waitlist") {
          navbarCta.dataset.disabled = "true";
          navbarCta.removeAttribute("href");

          navbarCtaTextCont.forEach((el) => {
            el.innerHTML = followMarkup;
          });
        } else {
          navbarCta.dataset.disabled = "false";
          navbarCta.href = "#waitlist";

          navbarCtaTextCont.forEach((el) => {
            el.textContent = "JOIN THE WAITLIST";
          });
        }
      }
    });
  }

  function handleFooterThemeEarly() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    function getFooterTriggerPoint() {
      if (window.innerWidth < 640) return window.innerHeight * 0.9; // mobile
      if (window.innerWidth < 1024) return window.innerHeight * 0.5; // tablet
      return window.innerHeight * 0.6; // desktop
    }

    const footerRect = footer.getBoundingClientRect();
    const triggerPoint = getFooterTriggerPoint(); // 80% screen

    // 👉 It will trigger before footer
    if (footerRect.top <= triggerPoint) {
      navbar.classList.remove("light-theme", "dark-theme");
      navbar.classList.add("dark-theme"); // footer theme

      navbarCta.dataset.disabled = "true";
      navbarCta.removeAttribute("href");
    }
  }

  window.addEventListener("scroll", () => {
    updateNavbarTheme();
    handleFooterThemeEarly();
  });

  window.addEventListener("load", () => {
    updateNavbarTheme();
    handleFooterThemeEarly();
  });
});

// Initialize Features Swiper
const featuresSwiper = new Swiper(".features__slider", {
  slidesPerView: 1,
  spaceBetween: 16,
  centeredSlides: false,
  pagination: {
    el: ".features__pagination",
    clickable: true,
  },

  breakpoints: {
    768: {
      slidesPerView: 3,
      spaceBetween: 12,
      centeredSlides: false,
      grid: {
        fill: "row",
        rows: 2,
      },
    },
  },
});

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

// Features Popup Functionality
const featuresPopup = document.querySelector(".features__popup");
const featuresCards = document.querySelectorAll(".features__card");
const popupClose = document.querySelector(".features__popup-close");

const popupIconContainer = document.querySelector(".features__popup-icon");
const popupTitle = document.querySelector(".features__popup-title");
const popupDescription = document.querySelector(".features__popup-description");
const popupTag = document.querySelector(".features__popup-tag");

function openPopup(icon, title, description, tag) {
  const scrollbarWidth = getScrollbarWidth();
  // Clone the SVG from the card and inject into popup
  popupIconContainer.innerHTML = "";
  if (icon) {
    popupIconContainer.appendChild(icon.cloneNode(true));
  }
  popupTitle.textContent = title;
  popupDescription.textContent = description;
  const words = title.split(" ");
  const mid = Math.ceil(words.length / 2);
  popupTitle.innerHTML = `
  ${words.slice(0, mid).join(" ")}<br>
  ${words.slice(mid).join(" ")}
`;
  if (tag) {
    popupTag.textContent = tag.textContent;
    popupTag.style.display = "block";
  } else {
    popupTag.textContent = "";
    popupTag.style.display = "none";
  }
  featuresPopup.hidden = false;
  // Force reflow
  featuresPopup.offsetHeight;
  featuresPopup.classList.add("is-visible");

  document.body.style.paddingRight = `${scrollbarWidth}px`;

  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.style.visibility = "hidden";
  }

  document.body.style.overflow = "hidden";
  if (window.lenis) window.lenis.stop();
}

function closePopup() {
  featuresPopup.classList.remove("is-visible");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  if (window.lenis) window.lenis.start();

  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.style.visibility = "";
  }

  setTimeout(() => {
    featuresPopup.hidden = true;
  }, 300);
}

featuresCards.forEach((card) => {
  card.addEventListener("click", () => {
    const iconSvg = card.querySelector(".features__icon svg");
    const title = card.querySelector(".h9, h3").textContent;
    const description = card.querySelector(
      ".features__card-description"
    ).textContent;
    const tag = card.querySelector(".tag");
    openPopup(iconSvg, title, description, tag);
  });
});

popupClose.addEventListener("click", closePopup);

featuresPopup.addEventListener("click", (e) => {
  if (e.target === featuresPopup) {
    closePopup();
  }
});

// Waitlist Form Handling
const waitlistForm = document.getElementById("waitlistForm");

// Validation functions
const validators = {
  firstName: (value) => ({
    isValid: value.trim().length >= 2 && value.trim().length <= 40,
    message: "Please enter your first name",
  }),
  lastName: (value) => ({
    isValid: value.trim().length >= 2 && value.trim().length <= 40,
    message: "Please enter your last name",
  }),
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(value),
      message: "Please enter a valid email address",
    };
  },
  bmsName: (value) => ({
    isValid:
      (value !== "" && value !== "Other") ||
      document
        .getElementById("otherBmsField")
        .querySelector("input")
        .value.trim() !== "",
    message: "Please select BMS you are using or specify your BMS",
  }),
};

// Show error for a field
function showError(input, message) {
  const field = input.parentElement;
  field.classList.add("form__field--error");

  // Remove any existing error message
  const existingError = field.querySelector(".form__field__error");
  if (existingError) {
    existingError.remove();
  }

  // Add error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "form__field__error";
  errorDiv.textContent = message;
  field.appendChild(errorDiv);
}

// Clear error for a field
function clearError(input) {
  const field = input.parentElement;
  field.classList.remove("form__field--error");
  const errorDiv = field.querySelector(".form__field__error");
  if (errorDiv) {
    errorDiv.remove();
  }
}

// Validate a single field
function validateField(input) {
  const value = input.value;
  const validatorName = input.name || input.getAttribute("data-validate");

  if (validators[validatorName]) {
    const { isValid, message } = validators[validatorName](value);
    if (!isValid) {
      showError(input, message);
      return false;
    } else {
      clearError(input);
      return true;
    }
  }
  return true;
}

// Setup real-time validation
waitlistForm.querySelectorAll(".form__field__input").forEach((input) => {
  // Clear error on input
  input.addEventListener("input", () => {
    clearError(input);
  });
});

// Handle BMS "Other" option
const bmsSelect = document.getElementById("bmsSelect");
const otherBmsField = document.getElementById("otherBmsField");

bmsSelect.addEventListener("change", () => {
  if (bmsSelect.value === "Other") {
    otherBmsField.style.display = "block";
    otherBmsField.querySelector("input").required = true;
    // Trigger validation on the BMS select when other input changes
    otherBmsField.querySelector("input").addEventListener("input", () => {
      validateField(bmsSelect);
    });
  } else {
    otherBmsField.style.display = "none";
    otherBmsField.querySelector("input").required = false;
    otherBmsField.querySelector("input").value = "";
    clearError(bmsSelect);
  }
});

// Form submission
waitlistForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let isValid = true;
  const formFields = waitlistForm.querySelector(".form__fields");
  const successMessage = waitlistForm.querySelector(".success__message");
  const submitButton = waitlistForm.querySelector(".waitlist__form__submit");

  // Validate all fields
  waitlistForm.querySelectorAll(".form__field__input").forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

  try {
    submitButton.textContent = "Submitting...";
    submitButton.disabled = true;

    // Simulate API call - Replace with actual API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success state
    waitlistForm.classList.add("waitlist__form--success");
    submitButton.textContent = "Successfully registered";
  } catch (error) {
    submitButton.disabled = false;
    submitButton.textContent = "Join the Waitlist";
    console.error("Form submission error:", error);
  }
});

/* Footer height calculate for linear gradient background */

const footer = document.querySelector("footer");
const root = document.documentElement;

function updateFooterHeight() {
  root.style.setProperty("--footer-height", `${footer.offsetHeight}px`);
}

updateFooterHeight();
window.addEventListener("resize", updateFooterHeight);

/* GSAP Animations */
gsap.registerPlugin(ScrollTrigger, SplitText);
// 1. Navbar
gsap.fromTo(
  ".navbar",
  { y: -100, opacity: 0 },
  { y: 0, opacity: 1, ease: "power3.out" }
);

gsap.fromTo(
  ".navbar__logo",
  { y: -70 },
  { y: 0, duration: 2, ease: "power3.out" }
);

gsap.fromTo(
  ".navbar__toggle",
  { y: -70 },
  { y: 0, delay: 0.9, duration: 2, ease: "power3.out" }
);

// 2. Nav links
gsap.fromTo(
  ".navbar__menu",
  { y: -70 },
  { y: 0, delay: 0.1, duration: 2, ease: "power3.out" }
);

// 3. CTA
gsap.fromTo(
  ".navbar__cta",
  { y: -70 },
  { y: 0, delay: 0.3, duration: 2, ease: "power3.out" }
);

const heroTitleSplit = new SplitText(".hero__title", { type: "words" });
const heroDescriptionSplit = new SplitText(".hero__description", {
  type: "lines",
  mask: "lines",
});
const featureTitleSplit = new SplitText(".features__header .title", {
  type: "words",
});

const featureDescriptionSplit = new SplitText(".features__header .subtitle", {
  type: "lines",
  mask: "lines",
});

gsap.set(".hero__text", { opacity: 1 });
gsap.set(".features__header", { opacity: 1 });
gsap.set(".training__content", { opacity: 1 });

gsap.set(featureTitleSplit.words, { opacity: 0 });
gsap.set(featureDescriptionSplit.lines, { opacity: 0 });

gsap.set(heroTitleSplit.words, { opacity: 0 });
gsap.set(heroDescriptionSplit.lines, { opacity: 0 });

const trainingTitleSplit = new SplitText(".training__content h2", {
  type: "words",
});

gsap.set(trainingTitleSplit.words, { opacity: 0 });
// Hero Section
ScrollTrigger.batch(".hero", {
  onEnter: () => {
    gsap.fromTo(
      ".hero__image",
      { opacity: 0 },
      { opacity: 1, delay: 0.05, duration: 3, ease: "power3.out" }
    );

    gsap.from(".hero__image", {
      scale: 0.97,
      duration: 1.3,
    });

    gsap.fromTo(
      ".hero__label",
      { opacity: 0, y: 70 },
      { opacity: 1, y: 0, delay: 0.15, duration: 2, ease: "power3.out" }
    );

    gsap.fromTo(
      heroTitleSplit.words,
      { opacity: 0, y: 70 },
      {
        opacity: 1,
        stagger: 0.07,
        y: 0,
        delay: 0.4,
        duration: 2,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      heroDescriptionSplit.lines,
      { opacity: 0, y: 70 },
      {
        opacity: 1,
        y: 0,
        delay: 0.5,
        stagger: 0.07,
        duration: 2,
        ease: "power3.out",
      }
    );
  },
  once: true,
});

// Hero Features Loop
gsap.fromTo(
  ".hero__feature",
  { opacity: 0, y: 70 },
  {
    opacity: 1,
    y: 0,
    delay: 0.8,
    stagger: 0.1,
    duration: 2,
    ease: "power3.out",
  }
);

// Comparison Section
ScrollTrigger.create({
  trigger: ".comparison",
  start: "top bottom",
  onEnter: () => {
    gsap.fromTo(
      ".compare__card--old",
      { opacity: 0, y: 70 },
      { opacity: 1, y: 0, duration: 2, delay: 0.2, ease: "power3.out" }
    );
    gsap.fromTo(
      ".compare__card--new",
      { opacity: 0, y: 70 },
      { opacity: 1, y: 0, duration: 2, delay: 0.6, ease: "power3.out" }
    );
  },
  once: true,
});

// Stats Section (Digit Rolling Logic)
ScrollTrigger.create({
  trigger: ".stats__data__wrapper",
  start: "top bottom",
  onEnter: () => {
    document.querySelectorAll(".stat__data").forEach((card, i) => {
      const valueEl = card.querySelector(".stat__value");
      const text = card.querySelector(".stat__text");

      const fullText = valueEl.innerText;
      const numberMatch = fullText.match(/\d+/);

      const symbolMatch = fullText.match(/[^\d]+/);

      if (!numberMatch) return;

      const numberStr = numberMatch[0];
      const digits = numberStr.split("");
      valueEl.innerHTML = "";

      const digitNodes = digits.map((digit) => {
        const container = document.createElement("span");
        Object.assign(container.style, {
          display: "inline-block",
          overflow: "hidden",
          height: "1.1em",
          lineHeight: "1.2em",
          verticalAlign: "top",
        });

        const strip = document.createElement("div");
        strip.innerHTML = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].join("<br>");
        container.appendChild(strip);
        valueEl.appendChild(container);
        return { strip, target: parseInt(digit) };
      });

      if (symbolMatch) {
        const sym = document.createElement("span");
        const symbolText = symbolMatch[0].trim();
        sym.textContent = symbolText;
        sym.classList.add("stat__symbol");
        if (symbolText === "%") sym.classList.add("stat__symbol--small");
        valueEl.appendChild(sym);
      }

      gsap.fromTo(
        valueEl,
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, delay: i * 0.2, duration: 2, ease: "power3.out" }
      );

      digitNodes.forEach((node, digitIndex) => {
        const targetY = -(node.target * 10);
        gsap.fromTo(
          node.strip,
          { y: "0%" },
          {
            y: `${targetY}%`,
            delay: i * 0.2 + 0.2,
            duration: 1.5 + digitIndex * 0.8,
            ease: "power3.out",
          }
        );
      });

      gsap.fromTo(
        text,
        { opacity: 0, y: 70 },
        {
          opacity: 1,
          y: 0,
          delay: 0.2 + i * 0.2,
          duration: 2,
          ease: "power3.out",
        }
      );
    });
  },
  once: true,
});

// Features Background
ScrollTrigger.create({
  trigger: ".features__background",
  onEnter: () => {
    gsap.fromTo(
      ".features__header .badge",
      { opacity: 0, y: 70 },
      { opacity: 1, y: 0, delay: 0.3, duration: 2, ease: "power3.out" }
    );

    gsap.fromTo(
      featureTitleSplit.words,
      { opacity: 0, y: 70 },
      {
        opacity: 1,
        y: 1,
        delay: 0.5,
        stagger: 0.07,
        duration: 2,
        ease: "power3.out",
      }
    );
    gsap.fromTo(
      featureDescriptionSplit.lines,
      { opacity: 0, y: 70 },
      {
        opacity: 1,
        y: 0,
        delay: 0.7,
        stagger: 0.07,
        duration: 2,
        ease: "power3.out",
      }
    );
  },
  once: true,
});

// Compliance Items (Stagger)
ScrollTrigger.create({
  trigger: ".compliance__item",
  onEnter: () => {
    gsap.fromTo(
      ".compliance__metric-title",
      { opacity: 0, y: 70 },
      { opacity: 1, y: 0, stagger: 0.25, duration: 2, ease: "power3.out" }
    );
    gsap.fromTo(
      ".compliance__metric-sub",
      { opacity: 0, y: 70 },
      { opacity: 1, y: 0, stagger: 0.3, duration: 2, ease: "power3.out" }
    );
  },
  once: true,
});

// Training Wrapper
ScrollTrigger.create({
  trigger: ".training__content",
  onEnter: () => {
    gsap.fromTo(
      ".training__visual img",
      { opacity: 0 },
      { opacity: 1, delay: 0, duration: 2, ease: "power3.out" }
    );
    gsap.fromTo(
      ".training__content .badge",
      { opacity: 0, y: 70 },
      { opacity: 1, y: 0, delay: 0.15, duration: 2, ease: "power3.out" }
    );

    gsap.fromTo(
      trainingTitleSplit.words,
      { opacity: 0, y: 70 },
      {
        opacity: 1,
        y: 0,
        delay: 0.3,
        stagger: 0.07,
        duration: 2,
        ease: "power3.out",
      }
    );
  },
  once: true,
});

// Training Grid (Stagger)
ScrollTrigger.create({
  trigger: ".training__grid",
  onEnter: () => {
    gsap.fromTo(
      ".training__list li",
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        delay: 0.8,
        duration: 2,
        ease: "power3.out",
      }
    );
  },
  once: true,
});

// Performance Cards
ScrollTrigger.create({
  trigger: ".perf__header .subtitle",
  onEnter: () => {
    gsap.fromTo(
      ".perf__card",
      { opacity: 0, y: 70 },
      { opacity: 1, y: 0, stagger: 0.25, duration: 2, ease: "power3.out" }
    );
  },
  once: true,
});

// Step Number Rolling Function
const rollStepNumberGSAP = (element, targetNumber) => {
  element.innerHTML = "";

  const strip = document.createElement("div");
  strip.classList.add("step-number-strip");

  const sequence = [
    (targetNumber + 2) % 10,
    (targetNumber + 1) % 10,
    targetNumber,
    (targetNumber + 9) % 10,
  ];

  sequence.forEach((num) => {
    const s = document.createElement("span");
    s.textContent = num;
    strip.appendChild(s);
  });

  element.appendChild(strip);

  return gsap.fromTo(
    strip,
    { y: "0%" },
    { y: "-50%", delay: 0.3, duration: 2, ease: "power3.out" }
  );
};

// Workflow Steps
[1, 2, 3].forEach((stepNum) => {
  ScrollTrigger.create({
    trigger: `.workflow__step--${stepNum} .workflow__step__content`,
    onEnter: () => {
      gsap.fromTo(
        `.workflow__step--${stepNum} .workflow__step-number`,
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, delay: 0.3, duration: 2, ease: "power3.out" }
      );
      rollStepNumberGSAP(
        document.querySelector(
          `.workflow__step--${stepNum} .workflow__step-number`
        ),
        stepNum
      );
      gsap.fromTo(
        `.workflow__step--${stepNum} .workflow__step-title`,
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, delay: 0.5, duration: 2, ease: "power3.out" }
      );
      gsap.fromTo(
        `.workflow__step--${stepNum} .workflow__step-description`,
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, delay: 0.7, duration: 2, ease: "power3.out" }
      );
    },
    once: true,
  });
});

// Privacy Cards
ScrollTrigger.create({
  trigger: ".priv__cards",
  onEnter: () => {
    gsap.fromTo(
      ".priv__card",
      { opacity: 0, y: 70 },
      { opacity: 1, y: 0, stagger: 0.25, duration: 2, ease: "power3.out" }
    );
  },
  once: true,
});

// Waitlist Submit
ScrollTrigger.create({
  trigger: ".waitlist__form__submit",
  onEnter: () => {
    gsap.fromTo(
      ".waitlist__form__submit",
      { y: 70 },
      { y: 0, delay: 0.2, duration: 2, ease: "power3.out" }
    );
  },
  once: true,
});

// Scroll Scaling Sections (Parallax replacement)
document.querySelectorAll(".scroll-scale").forEach((section) => {
  const mm = gsap.matchMedia();

  mm.add("(max-width: 767px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom center",
        scrub: 0.5,
        markers: false,
      },
    });

    // Step 1: Enter animation
    tl.fromTo(
      section,
      {
        opacity: 0.9,
        clipPath: "inset(0% 2.5% 0% 2.5% round 12px)",
      },
      { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" }
    );

    // Step 2: Wait / gap effect
    tl.to(section, {
      clipPath: "inset(0% 0% 0% 0% round 0%)",
      opacity: 1,
      duration: 0.4, // short pause
      ease: "none",
    });

    // Step 3: Exit animation
    tl.to(section, {
      opacity: 0.9,
      clipPath: "inset(0% 2.5% 0% 2.5% round 12px)",
      ease: "none",
    });
  });

  mm.add("(min-width: 640px) and (max-width: 767px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom center",
        scrub: 0.5,
        markers: false,
      },
    });

    // Step 1: Enter animation
    tl.fromTo(
      section,
      {
        opacity: 0.9,
        clipPath: "inset(0% 2% 0% 2% round 14px)",
      },
      { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" }
    );

    // Step 2: Wait / gap effect
    tl.to(section, {
      clipPath: "inset(0% 0% 0% 0% round 0%)",
      opacity: 1,
      duration: 0.4, // short pause
      ease: "none",
    });

    // Step 3: Exit animation
    tl.to(section, {
      opacity: 0.9,
      clipPath: "inset(0% 2% 0% 2% round 14px)",
      ease: "none",
    });
  });

  mm.add("(min-width:768px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom center",
        scrub: 0.5,
        markers: false,
      },
    });

    // Step 1: Enter animation
    tl.fromTo(
      section,
      {
        opacity: 0.9,
        clipPath: "inset(0% 1% 0% 1% round 1%)",
      },
      { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0%)", ease: "none" }
    );

    // Step 2: Wait / gap effect
    tl.to(section, {
      clipPath: "inset(0% 0% 0% 0% round 0%)",
      opacity: 1,
      duration: 0.2, // short pause
      ease: "none",
    });

    // Step 3: Exit animation
    tl.to(section, {
      opacity: 0.9,
      clipPath: "inset(0% 1% 0% 1% round 1%)",
      ease: "none",
    });
  });
});
