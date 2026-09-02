export function initSaleCountdown() {
  const countdown = document.getElementById("saleCountdown");

  if (!countdown) {
    return;
  }
  // ========================================
  // Sale Countdown
  // ========================================

  const saleStart = new Date("2026-08-23T00:00:00");
  const saleEnd = new Date("2026-09-02T16:50:00");
  const saleStatus = document.getElementById("sale-status");
  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  const toPersianNumbers = (number) => {
    return String(number).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
  };

  const updateSale = () => {
    const now = new Date();
    if (now < saleStart) {
      countdown.classList.add("hidden");

      saleStatus.classList.remove("hidden");
      saleStatus.classList.add("flex");

      saleStatus.textContent = "تخفیف به‌زودی شروع می‌شود";

      return;
    }
    if (now >= saleEnd) {
      countdown.classList.add("hidden");

      saleStatus.classList.remove("hidden");
      saleStatus.classList.add("flex");

      saleStatus.textContent = "تخفیف به پایان رسید";

      return;
    }
    countdown.classList.remove("hidden");
    saleStatus.classList.add("hidden");
    saleStatus.classList.remove("flex");
    const distance = saleEnd - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    daysElement.textContent = toPersianNumbers(String(days).padStart(2, "0"));
    hoursElement.textContent = toPersianNumbers(String(hours).padStart(2, "0"));
    minutesElement.textContent = toPersianNumbers(
      String(minutes).padStart(2, "0"),
    );
    secondsElement.textContent = toPersianNumbers(
      String(seconds).padStart(2, "0"),
    );
  };

  // ========================================
  // Sale Countdown Timer
  // ========================================

  let saleTimer = null;

  const runSaleTimer = () => {
    updateSale();

    if (new Date() >= saleEnd) {
      saleTimer = null;
      return;
    }

    saleTimer = setTimeout(runSaleTimer, 1000);
  };
  runSaleTimer();
}
