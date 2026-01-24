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
  if (window.lenis) window.lenis.stop();
});

const closeMenu = () => {
  overlay.style.display = "none";

  // Reset shift fix
  document.body.style.paddingRight = "";
  document.body.style.overflow = "";

  if (window.lenis) window.lenis.start();
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
document.addEventListener("DOMContentLoaded", (event) => {
  // ENTRANCE ANIMATION
  // autoAlpha handles both opacity and visibility
  gsap.fromTo(
    "#cookiePopup",
    { y: 100, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 1.8,
      delay: 2,
      ease: "power3.out",
    }
  );
});

// EXIT ANIMATION
function animateAway() {
  gsap.to("#cookiePopup", {
    y: 100,
    autoAlpha: 0,
    duration: 1.5,
    ease: "power3.in",
    onComplete: () => {
      // Optional: Completely remove from DOM or just keep hidden
      document.getElementById("cookiePopup").style.display = "none";
    },
  });
}
