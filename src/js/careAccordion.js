export function initCareAccordion() {
  const accordion = document.getElementById("careAccordion");

  if (!accordion) {
    return;
  }
  // ========================================
  // Mobile Care Articles Accordion
  // ========================================

  const careMenuButton = document.getElementById("careMenuButton");
  const careSubmenu = document.getElementById("careSubmenu");
  const careMenuArrow = document.getElementById("careMenuArrow");

  let careMenuOpen = false;

  function openCareMenu() {
    if (careMenuOpen) return;

    careMenuOpen = true;

    careMenuButton.setAttribute("aria-expanded", "true");

    careSubmenu.style.maxHeight = `${careSubmenu.scrollHeight}px`;

    careSubmenu.classList.remove("opacity-0");
    careSubmenu.classList.add("opacity-100");

    careMenuArrow.classList.add("rotate-90");
  }

  function closeCareMenu() {
    if (!careMenuOpen) return;

    careMenuOpen = false;

    careMenuButton.setAttribute("aria-expanded", "false");

    careSubmenu.style.maxHeight = "0px";

    careSubmenu.classList.remove("opacity-100");
    careSubmenu.classList.add("opacity-0");

    careMenuArrow.classList.remove("rotate-90");
  }

  careMenuButton?.addEventListener("click", () => {
    if (careMenuOpen) {
      closeCareMenu();
    } else {
      openCareMenu();
    }
  });
}
