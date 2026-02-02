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
  // ✅ force starting position (hidden below)
  gsap.set("#cookiePopup", {
    transform: "translateY(calc(200% + 1.5625vw))",
  });

  const tl = gsap.timeline({ delay: 2 });

  // 2) slow settle (last 20%)
  tl.to("#cookiePopup", {
    transform: "translateY(-8%)",
    duration: 1.5,
    ease: "power3.out",
  },0.5);
});

// EXIT ANIMATION
function animateAway() {
  gsap.to("#cookiePopup", {
    transform: "translateY(calc(200% + 1.5625vw))",
    duration: 0.7,
    ease: "cubic-bezier(0.06, 0, 0, 1)",
  });
}
