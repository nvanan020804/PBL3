// Load header
fetch("components/header.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("header-container").innerHTML = data;
  });
// Load menu
fetch("components/menu.html") // Nhúng menu từ file menu.html
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("menu-container").innerHTML = data;
  });

// Load footer
fetch("components/footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer-container").innerHTML = data;
  });
