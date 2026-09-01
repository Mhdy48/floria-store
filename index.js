// ========================================
// Deals Slider - Professional RTL Carousel
// ========================================

const slider = document.querySelector("#deals-slider");

if (slider) {
  const originalCards = [...slider.querySelectorAll(".deal-card")];

  let currentIndex = 0;
  let autoPlay = null;
  let resizeTimer = null;

  let isDragging = false;
  let hasDragged = false;

  let startX = 0;
  let startTranslate = 0;
  let currentTranslate = 0;

  // ========================================
  // Responsive
  // ========================================

  function getCardsPerView() {
    const width = window.innerWidth;

    if (width >= 1300) return 6;
    if (width >= 900) return 4;
    if (width >= 550) return 3;

    return 2;
  }

  function getGap() {
    const width = window.innerWidth;

    if (width >= 1200) return 20;
    if (width >= 900) return 16;
    if (width >= 550) return 12;

    return 8;
  }

  // ========================================
  // اندازه هر کارت
  // ========================================

  function getStep() {
    const card = slider.querySelector(".deal-card");

    if (!card) return 0;

    return card.getBoundingClientRect().width + getGap();
  }

  // ========================================
  // محدودیت حرکت
  // ========================================

  function getMaxIndex() {
    const cardsPerView = getCardsPerView();

    return Math.max(originalCards.length - cardsPerView, 0);
  }

  // ========================================
  // اعمال Transform
  // ========================================

  function setPosition(index, animate = true) {
    const step = getStep();

    if (!step) return;

    currentIndex = Math.max(0, Math.min(index, getMaxIndex()));

    const distance = currentIndex * step;

    slider.style.transition = animate
      ? "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";

    slider.style.transform = `translate3d(${distance}px, 0, 0)`;

    currentTranslate = distance;
  }

  // ========================================
  // حرکت بعدی
  // ========================================

  function slideNext() {
    if (isDragging) return;

    const maxIndex = getMaxIndex();

    if (currentIndex >= maxIndex) {
      setPosition(0, true);
      return;
    }

    setPosition(currentIndex + 1, true);
  }

  // ========================================
  // حرکت قبلی
  // ========================================

  function slidePrevious() {
    if (isDragging) return;

    if (currentIndex <= 0) {
      setPosition(0, true);
      return;
    }

    setPosition(currentIndex - 1, true);
  }

  // ========================================
  // Auto Play
  // ========================================

  function startAutoPlay() {
    stopAutoPlay();

    autoPlay = setInterval(() => {
      slideNext();
    }, 3500);
  }

  function stopAutoPlay() {
    if (autoPlay !== null) {
      clearInterval(autoPlay);
      autoPlay = null;
    }
  }

  // ========================================
  // Hover
  // ========================================

  slider.addEventListener("mouseenter", () => {
    stopAutoPlay();
  });

  slider.addEventListener("mouseleave", () => {
    if (!isDragging) {
      startAutoPlay();
    }
  });

  // ========================================
  // Mouse Drag
  // ========================================

  slider.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;

    isDragging = true;
    hasDragged = false;

    startX = event.clientX;

    startTranslate = currentTranslate;

    stopAutoPlay();

    slider.style.transition = "none";
    slider.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - startX;

    if (Math.abs(deltaX) > 5) {
      hasDragged = true;
    }

    currentTranslate = startTranslate + deltaX;

    // جلوگیری از کشیدن بیش از حد در ابتدا و انتها
    const maxTranslate = getMaxIndex() * getStep();

    if (currentTranslate < 0) {
      currentTranslate = currentTranslate * 0.35;
    }

    if (currentTranslate > maxTranslate) {
      const overflow = currentTranslate - maxTranslate;

      currentTranslate = maxTranslate + overflow * 0.35;
    }

    slider.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;

    slider.style.cursor = "grab";

    const step = getStep();

    if (!step) return;

    // ========================================
    // پیدا کردن نزدیک‌ترین کارت
    // ========================================

    let targetIndex = Math.round(currentTranslate / step);

    targetIndex = Math.max(0, Math.min(targetIndex, getMaxIndex()));

    const movedDistance = currentTranslate - startTranslate;

    const threshold = Math.max(step * 0.15, 40);

    // اگر حرکت خیلی کم بود،
    // همان کارت قبلی را نگه دار
    if (Math.abs(movedDistance) < threshold) {
      targetIndex = currentIndex;
    }

    setPosition(targetIndex, true);

    startAutoPlay();
  });

  // ========================================
  // Touch Swipe
  // ========================================

  slider.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];

      isDragging = true;
      hasDragged = false;

      startX = touch.clientX;
      startTranslate = currentTranslate;

      stopAutoPlay();

      slider.style.transition = "none";
    },
    { passive: true },
  );

  slider.addEventListener(
    "touchmove",
    (event) => {
      if (!isDragging) return;

      const touch = event.touches[0];

      const deltaX = touch.clientX - startX;

      if (Math.abs(deltaX) > 5) {
        hasDragged = true;
      }

      currentTranslate = startTranslate + deltaX;

      const maxTranslate = getMaxIndex() * getStep();

      // محدود کردن حرکت در ابتدا
      if (currentTranslate < 0) {
        currentTranslate *= 0.35;
      }

      // محدود کردن حرکت در انتها
      if (currentTranslate > maxTranslate) {
        const overflow = currentTranslate - maxTranslate;

        currentTranslate = maxTranslate + overflow * 0.35;
      }

      slider.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
    },
    { passive: true },
  );

  slider.addEventListener("touchend", () => {
    if (!isDragging) return;

    isDragging = false;

    const step = getStep();

    if (!step) return;

    const movedDistance = currentTranslate - startTranslate;

    let targetIndex = Math.round(currentTranslate / step);

    targetIndex = Math.max(0, Math.min(targetIndex, getMaxIndex()));

    const threshold = Math.max(step * 0.15, 40);

    if (Math.abs(movedDistance) < threshold) {
      targetIndex = currentIndex;
    }

    setPosition(targetIndex, true);

    startAutoPlay();
  });

  // ========================================
  // جلوگیری از Drag شدن عکس‌ها
  // ========================================

  slider.querySelectorAll("img").forEach((img) => {
    img.setAttribute("draggable", "false");
  });

  // ========================================
  // جلوگیری از کلیک بعد از Drag
  // ========================================

  slider.addEventListener(
    "click",
    (event) => {
      if (hasDragged) {
        event.preventDefault();
        event.stopPropagation();

        hasDragged = false;
      }
    },
    true,
  );

  // ========================================
  // Cursor
  // ========================================

  slider.style.cursor = "grab";

  // ========================================
  // Resize
  // ========================================

  window.addEventListener("resize", () => {
    stopAutoPlay();

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      currentIndex = 0;

      setPosition(0, false);

      startAutoPlay();
    }, 200);
  });

  // ========================================
  // شروع اولیه
  // ========================================

  setPosition(0, false);

  startAutoPlay();
}

// ========================================
// Sale Countdown
// ========================================

// زمان شروع و پایان تخفیف
const saleStart = new Date("2026-08-23T00:00:00");
const saleEnd = new Date("2026-09-02T16:50:00");

// عناصر مربوط به شمارش معکوس و وضعیت تخفیف
const countdown = document.getElementById("countdown");
const saleStatus = document.getElementById("sale-status");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

// تبدیل اعداد انگلیسی به اعداد فارسی
const toPersianNumbers = (number) => {
  return String(number).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
};

// به‌روزرسانی وضعیت تخفیف و شمارش معکوس
const updateSale = () => {
  const now = new Date();

  // تخفیف هنوز شروع نشده است
  if (now < saleStart) {
    countdown.classList.add("hidden");

    saleStatus.classList.remove("hidden");
    saleStatus.classList.add("flex");

    saleStatus.textContent = "تخفیف به‌زودی شروع می‌شود";

    return;
  }

  // زمان تخفیف به پایان رسیده است
  if (now >= saleEnd) {
    countdown.classList.add("hidden");

    saleStatus.classList.remove("hidden");
    saleStatus.classList.add("flex");

    saleStatus.textContent = "تخفیف به پایان رسید";

    return;
  }

  // تخفیف فعال است
  countdown.classList.remove("hidden");

  saleStatus.classList.add("hidden");
  saleStatus.classList.remove("flex");

  // محاسبه زمان باقی‌مانده تا پایان تخفیف
  const distance = saleEnd - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // نمایش روزهای باقی‌مانده
  daysElement.textContent = toPersianNumbers(String(days).padStart(2, "0"));

  // نمایش ساعت‌های باقی‌مانده
  hoursElement.textContent = toPersianNumbers(String(hours).padStart(2, "0"));

  // نمایش دقیقه‌های باقی‌مانده
  minutesElement.textContent = toPersianNumbers(
    String(minutes).padStart(2, "0"),
  );

  // نمایش ثانیه‌های باقی‌مانده
  secondsElement.textContent = toPersianNumbers(
    String(seconds).padStart(2, "0"),
  );
};

// اجرای اولیه شمارش معکوس
updateSale();

// به‌روزرسانی شمارش معکوس هر یک ثانیه
setInterval(updateSale, 1000);

// baktop
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  const isAtTop = scrollTop <= 10;
  const isAtBottom = scrollTop + windowHeight >= documentHeight - 250;

  if (isAtTop || isAtBottom) {
    backToTop.classList.remove("opacity-100", "visible", "translate-y-0");

    backToTop.classList.add("opacity-0", "invisible", "translate-y-3");
  } else {
    backToTop.classList.remove("opacity-0", "invisible", "translate-y-3");

    backToTop.classList.add("opacity-100", "visible", "translate-y-0");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

//navbar
const navbar = document.getElementById("mainNavbar");
const navbarWrapper = document.getElementById("navbarWrapper");
let lastScrollY = window.scrollY;
window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > 15) {
    navbar.classList.remove("rounded-tl-[0.9375rem]", "rounded-tr-[0.9375rem]");
  } else {
    navbar.classList.add("rounded-tl-[0.9375rem]", "rounded-tr-[0.9375rem]");
  }
  // رسیدن به ابتدای صفحه
  if (currentScrollY <= 0) {
    navbarWrapper.classList.remove("-translate-y-full");

    lastScrollY = currentScrollY;
    return;
  }
  // اسکرول به پایین بیشتر از 70px
  if (currentScrollY > lastScrollY && currentScrollY > 70) {
    navbarWrapper.classList.add("-translate-y-full");
  }
  // اسکرول به بالا
  else if (currentScrollY < lastScrollY) {
    navbarWrapper.classList.remove("-translate-y-full");
  }
  lastScrollY = currentScrollY;
});

// ========================================
// Mobile Hamburger Menu
// ========================================

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
const mobileMenuClose = document.getElementById("mobileMenuClose");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

let mobileMenuOpen = false;

const openMobileMenu = () => {
  if (mobileMenuOpen) return;

  mobileMenuOpen = true;

  // عرض واقعی scrollbar
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  // رزرو فضای scrollbar بدون جابه‌جایی محتوا
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  // حذف scrollbar اصلی
  document.documentElement.classList.add("mobile-menu-open");
  document.body.classList.add("mobile-menu-open");

  // باز کردن Drawer
  mobileMenu.classList.remove("translate-x-full");

  // Overlay
  mobileMenuOverlay.classList.remove("pointer-events-none", "opacity-0");

  mobileMenuOverlay.classList.add("pointer-events-auto", "opacity-100");

  // Accessibility
  mobileMenu.setAttribute("aria-hidden", "false");
  menuButton?.setAttribute("aria-expanded", "true");
};

const closeMobileMenu = () => {
  if (!mobileMenuOpen) return;

  mobileMenuOpen = false;

  // بستن Drawer
  mobileMenu.classList.add("translate-x-full");

  // بستن Overlay
  mobileMenuOverlay.classList.remove("pointer-events-auto", "opacity-100");

  mobileMenuOverlay.classList.add("pointer-events-none", "opacity-0");

  // Accessibility
  mobileMenu.setAttribute("aria-hidden", "true");
  menuButton?.setAttribute("aria-expanded", "false");

  // برگرداندن scrollbar
  document.documentElement.classList.remove("mobile-menu-open");
  document.body.classList.remove("mobile-menu-open");

  // حذف فضای رزرو شده
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
