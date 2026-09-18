// ========================================
// Category Accordion
// Controls the mobile accordion for product categories and its visual state.
// ========================================

export function initCategoryAccordion() {
  const categoryMenuButton = document.getElementById("categoryMenuButton");

  if (!categoryMenuButton) {
    return;
  }

  const categorySubmenu = document.getElementById("categorySubmenu");
  const categoryMenuArrow = document.getElementById("categoryMenuArrow");

  let categoryMenuOpen = false;

  function openCategoryMenu() {
    if (categoryMenuOpen) return;

    categoryMenuOpen = true;

    categoryMenuButton.setAttribute("aria-expanded", "true");

    categorySubmenu.style.maxHeight = `${categorySubmenu.scrollHeight}px`;

    categorySubmenu.classList.remove("opacity-0");
    categorySubmenu.classList.add("opacity-100");

    categoryMenuArrow.classList.add("rotate-90");
  }

  function closeCategoryMenu() {
    if (!categoryMenuOpen) return;

    categoryMenuOpen = false;

    categoryMenuButton.setAttribute("aria-expanded", "false");

    categorySubmenu.style.maxHeight = "0px";

    categorySubmenu.classList.remove("opacity-100");
    categorySubmenu.classList.add("opacity-0");

    categoryMenuArrow.classList.remove("rotate-90");
  }

  categoryMenuButton.addEventListener("click", () => {
    if (categoryMenuOpen) {
      closeCategoryMenu();
    } else {
      openCategoryMenu();
    }
  });
}
