// Function to handle menu scrolling
function initializeMenuScroll() {
  const menu = document.getElementById('menu-container');
  if (!menu) return;

  const sticky = menu.offsetTop;

  function scrollToFixedHeader() {
    if (window.pageYOffset > sticky) {
      menu.classList.add('sticky');
    } else {
      menu.classList.remove('sticky');
    }
  }

  window.onscroll = scrollToFixedHeader;
}

// Initialize menu scroll when the page loads
document.addEventListener('DOMContentLoaded', initializeMenuScroll); 