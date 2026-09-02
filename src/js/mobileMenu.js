export function initMobileMenu() {
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuButton || !mobileMenu) {
    return;
  }
  // ========================================
  // Mobile Hamburger Menu
  // ========================================
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

  let mobileMenuOpen = false;

  const openMobileMenu = () => {
    if (mobileMenuOpen) return;

    mobileMenuOpen = true;

    // scrollbar
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.documentElement.classList.add("mobile-menu-open");
    document.body.classList.add("mobile-menu-open");
    mobileMenu.classList.remove("translate-x-full");

    // Overlay
    mobileMenuOverlay.classList.remove("pointer-events-none", "opacity-0");

    mobileMenuOverlay.classList.add("pointer-events-auto", "opacity-100");

    // Accessibility
    mobileMenu.setAttribute("aria-hidden", "false");
    menuButton?.setAttribute("aria-expanded", "true");
    mobileMenuClose?.focus();
  };

  const closeMobileMenu = () => {
    if (!mobileMenuOpen) return;

    mobileMenuOpen = false;
    mobileMenu.classList.add("translate-x-full");
    mobileMenuOverlay.classList.remove("pointer-events-auto", "opacity-100");
    mobileMenuOverlay.classList.add("pointer-events-none", "opacity-0");
    // Accessibility
    mobileMenu.setAttribute("aria-hidden", "true");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.focus();
    document.documentElement.classList.remove("mobile-menu-open");
    document.body.classList.remove("mobile-menu-open");
    document.body.style.paddingRight = "";
  };

  // Hamburger
  menuButton?.addEventListener("click", openMobileMenu);

  // Close
  mobileMenuClose?.addEventListener("click", closeMobileMenu);

  // Overlay
  mobileMenuOverlay?.addEventListener("click", closeMobileMenu);

  // Links
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenuOpen) {
      closeMobileMenu();
    }
  });
}
