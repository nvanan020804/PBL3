const totalImages = 4;
let index = 0;

function changeSlide(direction) {
  index += direction;
  if (index < 0) index = totalImages - 1;
  if (index >= totalImages) index = 0;

  const track = document.getElementById("slider-track");
  track.style.transform = `translateX(-${index * 100}%)`;
}
