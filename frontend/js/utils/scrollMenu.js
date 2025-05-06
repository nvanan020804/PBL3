function handleStickyMenu(menuId) {
  const menu = document.getElementById(menuId);
  if (!menu) return;

  const sticky = menu.offsetTop;

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > sticky) {
      menu.classList.add("sticky");
    } else {
      menu.classList.remove("sticky");
    }
  });
}
