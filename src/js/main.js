// ========================================
// Application Entry Point
// Initializes all shared JavaScript modules after the DOM is ready.
// ========================================

import { initNavbar } from "./navbar.js";
import { initBackToTop } from "./backToTop.js";
import { initMobileMenu } from "./mobileMenu.js";
import { initCareAccordion } from "./careAccordion.js";
import { initCategoryAccordion } from "./categoryAccordion.js";
import { initDealsSlider } from "./dealsSlider.js";
import { initSaleCountdown } from "./saleCountdown.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initBackToTop();
  initMobileMenu();
  initCareAccordion();
  initCategoryAccordion();
  initDealsSlider();
  initSaleCountdown();
});
