export function initDealsSlider() {
  const slider = document.getElementById("dealsSlider");

  if (!slider) {
    return;
  }

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
    // Pointer Events
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

      if (nextTranslate < 0) {
        nextTranslate *= 0.2;
      }

      if (nextTranslate > maxTranslate) {
        const overflow = nextTranslate - maxTranslate;

        nextTranslate = maxTranslate + overflow * 0.2;
      }

      currentTranslate = nextTranslate;

      slider.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
    });

    // ========================================
    // Drag end
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
}
