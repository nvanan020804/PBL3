// File menu.js được tạo để khắc phục lỗi 404
// Menu functionality
document.addEventListener("DOMContentLoaded", function () {
  // Xử lý menu navigation
  const menuItems = document.querySelectorAll(".menu-item");
  if (menuItems) {
    menuItems.forEach((item) => {
      item.addEventListener("click", function (event) {
        const user = localStorage.getItem("user");
        // Nếu người dùng chưa đăng nhập và không phải là link đăng nhập/đăng ký
        if (
          !user &&
          !this.getAttribute("href")?.includes("login.html") &&
          !this.getAttribute("href")?.includes("register-customer.html")
        ) {
          event.preventDefault(); // Ngăn chặn điều hướng mặc định
          window.location.href = "../trangchu/login.html";
          return;
        }
        menuItems.forEach((i) => i.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
    });
  }

  // Quản lý hiển thị nút đăng nhập/đăng ký/đăng xuất
  const loginButton = document.getElementById("login-button");
  const registerButton = document.getElementById("register-button");
  const logoutButton = document.getElementById("logout-button");

  // Kiểm tra nếu người dùng đã đăng nhập
  const user = localStorage.getItem("user");

  if (user) {
    // Người dùng đã đăng nhập, ẩn nút đăng nhập và đăng ký, hiển thị nút đăng xuất
    if (loginButton) loginButton.style.display = "none";
    if (registerButton) registerButton.style.display = "none";
    if (logoutButton) logoutButton.style.display = "block";

    // Lấy tên người dùng để hiển thị nếu cần
    try {
      const userData = JSON.parse(user);
      const username = userData.tenDangNhap || "Người dùng";

      // Nếu có phần tử hiển thị tên người dùng
      const userDisplayElement = document.getElementById("user-display");
      if (userDisplayElement) {
        userDisplayElement.textContent = username;
        userDisplayElement.style.display = "inline-block";
      }
    } catch (e) {
      console.error("Lỗi khi xử lý thông tin người dùng:", e);
    }
  } else {
    // Người dùng chưa đăng nhập, hiển thị nút đăng nhập và đăng ký, ẩn nút đăng xuất
    if (loginButton) loginButton.style.display = "block";
    if (registerButton) registerButton.style.display = "block";
    if (logoutButton) logoutButton.style.display = "none";

    // Ẩn phần tử hiển thị tên người dùng nếu có
    const userDisplayElement = document.getElementById("user-display");
    if (userDisplayElement) {
      userDisplayElement.style.display = "none";
    }
  }

  // Xử lý sự kiện đăng xuất
  if (logoutButton) {
    // Bắt sự kiện cho cả nút đăng xuất và thẻ a bên trong
    logoutButton.addEventListener("click", handleLogout);

    const logoutLink = logoutButton.querySelector("a");
    if (logoutLink) {
      logoutLink.addEventListener("click", handleLogout);
    }

    function handleLogout(event) {
      console.log("Đăng xuất người dùng");
      event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
      // Xóa tất cả dữ liệu trong localStorage
      localStorage.clear();

      // Chuyển hướng về trang chủ sau khi đăng xuất
      window.location.href = "../trangchu/index.html";
    }
  }
});
