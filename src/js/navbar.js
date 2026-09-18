// ========================================
// Navbar
// Handles active navigation states and navbar behavior while scrolling.
// ========================================

// Navbar Initialization

export function initNavbar() {
  const navbar = document.getElementById("mainNavbar");
  const navbarWrapper = document.getElementById("navbarWrapper");
  if (!navbar || !navbarWrapper) {
    return;
  }

  // Set the active navigation item.
  setActiveNav();

  // Track the previous scroll position.
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;

    // Update rounded corners while scrolling.
    if (scrollTop > 15) {
      navbar.classList.remove(
        "rounded-tl-[0.9375rem]",
        "rounded-tr-[0.9375rem]",
      );
    } else {
      navbar.classList.add("rounded-tl-[0.9375rem]", "rounded-tr-[0.9375rem]");
    }

    // Keep the navbar visible at the top of the page.
    if (scrollTop <= 0) {
      navbarWrapper.classList.remove("-translate-y-full");

      lastScrollY = scrollTop;

      return;
    }

    // Hide the navbar while scrolling down.
    if (scrollTop > lastScrollY && scrollTop > 70) {
      navbarWrapper.classList.add("-translate-y-full");
    }
    // Show the navbar while scrolling up.
    else if (scrollTop < lastScrollY) {
      navbarWrapper.classList.remove("-translate-y-full");
    }

    lastScrollY = scrollTop;
  });
}

// Active Navigation

function setActiveNav() {
  const navLinks = document.querySelectorAll("[data-page]");
  // Stop when the page has no navigation links.
  if (!navLinks.length) {
    return;
  }

  const currentPath = window.location.pathname;

  navLinks.forEach((link) => {
    const page = link.dataset.page;
    const underline = link.querySelector(".nav-underline");
    if (!underline) {
      return;
    }

    let isActive = false;

    if (page === "home") {
      isActive = currentPath === "/" || currentPath.endsWith("/index.html");
    }

    if (page === "products") {
      isActive = currentPath.endsWith("/products.html");
    }

    if (page === "about") {
      isActive = currentPath.endsWith("/about.html");
    }

    if (page === "care") {
      isActive =
        currentPath.includes("care") || window.location.hash === "#care";
    }

    if (isActive) {
      underline.classList.add("w-full");
    } else {
      underline.classList.remove("w-full");
    }
  });
}
