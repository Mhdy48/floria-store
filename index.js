// ========================================
// Deals Slider
// ========================================

const slider = document.querySelector("#deals-slider");

const cards = [...slider.querySelectorAll(".deal-card")];

let currentIndex = 0;
let autoPlay;

// تعداد کارت‌های قابل نمایش
function getCardsPerView() {
  const width = window.innerWidth;

  if (width >= 1300) return 6;
  if (width >= 900) return 4;
  if (width >= 550) return 3;
  return 2;
}

// فاصله بین کارت‌ها
function getGap() {
  const width = window.innerWidth;

  if (width >= 1200) return 20;
  if (width >= 900) return 16;
  if (width >= 550) return 12;
  return 8;
}

// حرکت اسلایدر به کارت بعدی
function slideNext() {
  const cardsPerView = getCardsPerView();
  const lastIndex = Math.max(cards.length - cardsPerView, 0);

  currentIndex++;

  // بازگشت به ابتدای لیست پس از رسیدن به آخرین موقعیت
  if (currentIndex > lastIndex) {
    currentIndex = 0;
  }

  const cardWidth = cards[0].offsetWidth;
  const gap = getGap();

  // محاسبه فاصله حرکت بر اساس عرض کارت و فاصله بین کارت‌ها
  const distance = currentIndex * (cardWidth + gap);

  slider.style.transform = `translate3d(${distance}px, 0, 0)`;
}

// شروع حرکت خودکار اسلایدر
function startAutoPlay() {
  stopAutoPlay();

  autoPlay = setInterval(slideNext, 3000);
}

// توقف حرکت خودکار اسلایدر
function stopAutoPlay() {
  clearInterval(autoPlay);
}

// توقف اسلایدر هنگام قرار گرفتن نشانگر روی کارت
cards.forEach((card) => {
  card.addEventListener("mouseenter", stopAutoPlay);
  card.addEventListener("mouseleave", startAutoPlay);
});

// تنظیم مجدد اسلایدر هنگام تغییر اندازه صفحه
window.addEventListener("resize", () => {
  currentIndex = 0;
  slider.style.transform = "translate3d(0, 0, 0)";

  startAutoPlay();
});

// شروع اولیه اسلایدر
startAutoPlay();

// ========================================
// Sale Countdown
// ========================================

// زمان شروع و پایان تخفیف
const saleStart = new Date("2026-08-23T00:00:00");
const saleEnd = new Date("2026-08-31T16:30:00");

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
