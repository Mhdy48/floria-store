// ========================================
// Deals Slider
// Swipe Left  = Next
// Swipe Right = Previous
// ========================================

const slider = document.querySelector("#deals-slider");

if (slider) {
  const cards = [...slider.querySelectorAll(".deal-card")];

  let currentIndex = 0;
  let currentTranslate = 0;

  let isDragging = false;
  let hasDragged = false;

  let startX = 0;
  let startTranslate = 0;

  let autoPlay = null;
  let resizeTimer = null;

  // ========================================
  // Responsive
  // ========================================

  function getCardsPerView() {
    const width = window.innerWidth;

    if (width >= 1300) return 6;
    if (width >= 1100) return 5;
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

  function getStep() {
    const card = cards[0];

    if (!card) return 0;

    return card.getBoundingClientRect().width + getGap();
  }

  function getMaxIndex() {
    return Math.max(cards.length - getCardsPerView(), 0);
  }

  // ========================================
  // Position
  // ========================================

  function setPosition(index, animate = true) {
    const step = getStep();

    if (!step) return;

    const maxIndex = getMaxIndex();

    currentIndex = Math.max(0, Math.min(index, maxIndex));

    currentTranslate = currentIndex * step;

    slider.style.transition = animate
      ? "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";

    slider.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
  }

  // ========================================
  // Next
  // ========================================

  function slideNext() {
    if (isDragging) return;

    const maxIndex = getMaxIndex();

    if (currentIndex < maxIndex) {
      setPosition(currentIndex + 1, true);
    } else {
      setPosition(0, true);
    }
  }

  // ========================================
  // Previous
  // ========================================

  function slidePrevious() {
    if (isDragging) return;

    if (currentIndex > 0) {
      setPosition(currentIndex - 1, true);
    }
  }

  // ========================================
  // Auto Play
  // ========================================

  function stopAutoPlay() {
    if (autoPlay !== null) {
      clearInterval(autoPlay);
      autoPlay = null;
    }
  }

  function startAutoPlay() {
    stopAutoPlay();

    autoPlay = setInterval(() => {
      slideNext();
    }, 3500);
  }

  // ========================================
  // Pointer Drag
  // فقط Pointer Events
  // ========================================

  slider.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    isDragging = true;
    hasDragged = false;

    startX = event.clientX;
    startTranslate = currentTranslate;

    stopAutoPlay();

    slider.style.transition = "none";
    slider.style.cursor = "grabbing";

    slider.setPointerCapture?.(event.pointerId);
  });

  slider.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - startX;

    if (Math.abs(deltaX) > 8) {
      hasDragged = true;
    }

    let nextTranslate = startTranslate + deltaX;

    const maxTranslate = getMaxIndex() * getStep();

    // ابتدا
    if (nextTranslate < 0) {
      nextTranslate *= 0.2;
    }

    // انتها
    if (nextTranslate > maxTranslate) {
      const overflow = nextTranslate - maxTranslate;

      nextTranslate = maxTranslate + overflow * 0.2;
    }

    currentTranslate = nextTranslate;

    slider.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
  });

  // ========================================
  // پایان Drag
  // ========================================

  function finishDrag(event) {
    if (!isDragging) return;

    isDragging = false;

    slider.style.cursor = "grab";

    try {
      slider.releasePointerCapture?.(event.pointerId);
    } catch {}

    const step = getStep();

    if (!step) {
      startAutoPlay();
      return;
    }

    const maxIndex = getMaxIndex();

    const movedDistance = currentTranslate - startTranslate;

    const threshold = Math.max(step * 0.15, 40);

    let targetIndex = currentIndex;

    // ========================================
    // Swipe Left = Next
    // deltaX < 0
    // ========================================

    if (movedDistance < -threshold) {
      targetIndex = currentIndex - 1;
    }

    // ========================================
    // Swipe Right = Previous
    // deltaX > 0
    // ========================================
    else if (movedDistance > threshold) {
      targetIndex = currentIndex + 1;
    }

    // ========================================
    // محدودیت
    // ========================================

    targetIndex = Math.max(0, Math.min(targetIndex, maxIndex));

    setPosition(targetIndex, true);

    startAutoPlay();

    setTimeout(() => {
      hasDragged = false;
    }, 120);
  }

  slider.addEventListener("pointerup", finishDrag);

  slider.addEventListener("pointercancel", finishDrag);

  slider.addEventListener("lostpointercapture", () => {
    if (!isDragging) return;

    isDragging = false;
    slider.style.cursor = "grab";

    setPosition(currentIndex, true);

    startAutoPlay();
  });

  // ========================================
  // جلوگیری از کلیک بعد از Swipe
  // ========================================

  slider.addEventListener(
    "click",
    (event) => {
      if (!hasDragged) return;

      event.preventDefault();
      event.stopPropagation();

      hasDragged = false;
    },
    true,
  );

  // ========================================
  // جلوگیری از Drag عکس
  // ========================================

  cards.forEach((card) => {
    const image = card.querySelector("img");

    if (!image) return;

    image.draggable = false;
    image.style.userSelect = "none";
    image.style.webkitUserDrag = "none";
    image.style.pointerEvents = "none";
  });

  // ========================================
  // Slider Settings
  // ========================================

  slider.style.touchAction = "pan-y";
  slider.style.userSelect = "none";
  slider.style.webkitUserSelect = "none";
  slider.style.willChange = "transform";
  slider.style.cursor = "grab";

  // ========================================
  // Hover
  // ========================================

  slider.addEventListener("mouseenter", () => {
    if (window.matchMedia("(hover: hover)").matches) {
      stopAutoPlay();
    }
  });

  slider.addEventListener("mouseleave", () => {
    if (!isDragging && window.matchMedia("(hover: hover)").matches) {
      startAutoPlay();
    }
  });

  // ========================================
  // Resize
  // ========================================

  window.addEventListener("resize", () => {
    stopAutoPlay();

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      const maxIndex = getMaxIndex();

      currentIndex = Math.min(currentIndex, maxIndex);

      setPosition(currentIndex, false);

      startAutoPlay();
    }, 200);
  });

  // ========================================
  // Start
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
