document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".nav-bar .tab");
  const images = document.querySelectorAll(".album-slide .img");
  const slideContainer = document.querySelector(".album-slide");
  const imgWidth = 270;
  const visibleCount = 4;

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Xóa active
      tabs.forEach((t) => t.classList.remove("active"));
      images.forEach((img) => img.classList.remove("active"));

      const index = parseInt(this.getAttribute("data-index"));
      this.classList.add("active");
      if (images[index]) {
        images[index].classList.add("active");
      }

      // Tính dịch chuyển: nếu index >= visibleCount, dịch sang trái
      const startIndex = Math.max(0, index - visibleCount + 1);
      const offset = imgWidth * startIndex;

      slideContainer.style.transform = `translateX(-${offset}px)`;
    });
  });
});
