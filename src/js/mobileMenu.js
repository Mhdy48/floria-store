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

  const resetMobileSubmenus = () => {
    const submenuButtons = mobileMenu.querySelectorAll(
      "#careMenuButton, #categoryMenuButton",
    );

    submenuButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });

    const careSubmenu = document.getElementById("careSubmenu");
    const careMenuArrow = document.getElementById("careMenuArrow");
    if (careSubmenu) {
      careSubmenu.style.maxHeight = "0px";
      careSubmenu.classList.remove("opacity-100");
      careSubmenu.classList.add("opacity-0");
    }
    careMenuArrow?.classList.remove("rotate-90");

    const categorySubmenu = document.getElementById("categorySubmenu");
    const categoryMenuArrow = document.getElementById("categoryMenuArrow");
    if (categorySubmenu) {
      categorySubmenu.style.maxHeight = "0px";
      categorySubmenu.classList.remove("opacity-100");
      categorySubmenu.classList.add("opacity-0");
    }
    categoryMenuArrow?.classList.remove("rotate-90");
  };

  const openMobileMenu = () => {
    if (mobileMenuOpen) return;

    mobileMenuOpen = true;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.documentElement.classList.add("mobile-menu-open");
    document.body.classList.add("mobile-menu-open");
    mobileMenu.classList.remove("translate-x-full");

    mobileMenuOverlay.classList.remove("pointer-events-none", "opacity-0");
    mobileMenuOverlay.classList.add("pointer-events-auto", "opacity-100");

    mobileMenu.setAttribute("aria-hidden", "false");
    menuButton?.setAttribute("aria-expanded", "true");
    mobileMenuClose?.focus();
  };

  const closeMobileMenu = () => {
    if (!mobileMenuOpen) return;

    mobileMenuOpen = false;

    // Always reset nested menus when the hamburger menu closes.
    resetMobileSubmenus();

    mobileMenu.classList.add("translate-x-full");
    mobileMenuOverlay.classList.remove("pointer-events-auto", "opacity-100");
    mobileMenuOverlay.classList.add("pointer-events-none", "opacity-0");

    mobileMenu.setAttribute("aria-hidden", "true");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.focus();
    document.documentElement.classList.remove("mobile-menu-open");
    document.body.classList.remove("mobile-menu-open");
    document.body.style.paddingRight = "";
  };

  menuButton?.addEventListener("click", openMobileMenu);
  mobileMenuClose?.addEventListener("click", closeMobileMenu);
  mobileMenuOverlay?.addEventListener("click", closeMobileMenu);

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (link.matches("#careMenuButton, #categoryMenuButton")) {
        return;
      }
      closeMobileMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenuOpen) {
      closeMobileMenu();
    }
  });
}
