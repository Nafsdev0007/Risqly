const toggleButton = document.querySelector(".navbar__toggle");
const overlay = document.getElementById("menuOverlay");
const closeButton = document.querySelector(".menu-overlay__close");
const navbar = document.querySelector(".navbar");

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

// Hamburger Menu
toggleButton.addEventListener("click", () => {
  const scrollbarWidth = getScrollbarWidth();

  overlay.style.display = "block";
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.body.style.overflow = "hidden";
});

const closeMenu = () => {
  overlay.style.display = "none";

  // Reset shift fix
  document.body.style.paddingRight = "";
  document.body.style.overflow = "";

};

closeButton.addEventListener("click", closeMenu);

// Close overlay if clicked outside content
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    closeMenu();
  }
});

// Sticky Navbar on Scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
});

// Cookie
document.addEventListener("DOMContentLoaded", () => {

  const consent = localStorage.getItem("cookieConsent");

  // ✅ force starting position
  gsap.set(".cookie-card", {
    opacity: 1,
  });

  gsap.set("#cookiePopup", {
    transform: "translateY(calc(200% + 1.5625vw))",
  });

  // 👉 যদি আগে decision নেয়া থাকে → আর কিছুই করবো না
  if (consent) return;

  const tl = gsap.timeline({ delay: 2 });

  // 1) fast jump
  tl.to("#cookiePopup", {
    transform: "translateY(-2%)",
    duration: 1.4,
    ease: "power3.out",
  }, "a");

  // 2) slow settle
  tl.to("#cookiePopup", {
    transform: "translateY(-6%)",
    duration: 1.5,
    ease: "power3.out",
  }, 0.5);
});


// EXIT ANIMATION
function animateAway() {
  gsap.to("#cookiePopup", {
    transform: "translateY(calc(200% + 1.5625vw))",
    duration: 1,
    ease: "cubic-bezier(0.06, 0, 0, 1)",
  });
}


// ✅ BUTTON HANDLERS
function acceptCookies() {
  localStorage.setItem("cookieConsent", "accepted");
  animateAway();
}

function declineCookies() {
  localStorage.setItem("cookieConsent", "declined");
  animateAway();
}
