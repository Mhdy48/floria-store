// ========================================
// Navbar
// ========================================

export function initNavbar() {
  const navbar = document.getElementById("mainNavbar");
  const navbarWrapper = document.getElementById("navbarWrapper");

  // اگر Navbar در صفحه وجود نداشت، اجرای این فایل متوقف شود
  if (!navbar || !navbarWrapper) {
    return;
  }

  // ========================================
  // Active Navigation
  // ========================================

  setActiveNav();

  // ========================================
  // Navbar Scroll
  // ========================================

  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;

    // ========================================
    // Navbar Rounded Corners
    // ========================================

    if (scrollTop > 15) {
      navbar.classList.remove(
        "rounded-tl-[0.9375rem]",
        "rounded-tr-[0.9375rem]",
      );
    } else {
      navbar.classList.add("rounded-tl-[0.9375rem]", "rounded-tr-[0.9375rem]");
    }

    // ========================================
    // Reached Top
    // ========================================

    if (scrollTop <= 0) {
      navbarWrapper.classList.remove("-translate-y-full");

      lastScrollY = scrollTop;

      return;
    }

    // ========================================
    // Scroll Down
    // ========================================

    if (scrollTop > lastScrollY && scrollTop > 70) {
      navbarWrapper.classList.add("-translate-y-full");
    }

    // ========================================
    // Scroll Up
    // ========================================
    else if (scrollTop < lastScrollY) {
      navbarWrapper.classList.remove("-translate-y-full");
    }

    lastScrollY = scrollTop;
  });
}

// ========================================
// Active Navigation
// ========================================

function setActiveNav() {
  const navLinks = document.querySelectorAll("[data-page]");

  // اگر لینک‌های Navbar وجود نداشتند
  if (!navLinks.length) {
    return;
  }

  const currentPath = window.location.pathname;

  navLinks.forEach((link) => {
    const page = link.dataset.page;
    const underline = link.querySelector(".nav-underline");

    // اگر underline وجود نداشت
    if (!underline) {
      return;
    }

    let isActive = false;

    // ========================================
    // Home
    // ========================================

    if (page === "home") {
      isActive = currentPath === "/" || currentPath.endsWith("/index.html");
    }

    // ========================================
    // Products
    // ========================================

    if (page === "products") {
      isActive = currentPath.endsWith("/products.html");
    }

    // ========================================
    // About
    // ========================================

    if (page === "about") {
      isActive = currentPath.endsWith("/about.html");
    }

    // ========================================
    // Care
    // ========================================

    if (page === "care") {
      isActive =
        currentPath.includes("care") || window.location.hash === "#care";
    }

    // ========================================
    // Active / Inactive
    // ========================================

    if (isActive) {
      underline.classList.add("w-full");
    } else {
      underline.classList.remove("w-full");
    }
  });
}
