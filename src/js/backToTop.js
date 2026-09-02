export function initBackToTop() {
  const backToTop = document.getElementById("backToTop");

  if (!backToTop) {
    return;
  }

  const updateBackToTop = () => {
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
  };

  window.addEventListener("scroll", updateBackToTop);

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  updateBackToTop();
}
