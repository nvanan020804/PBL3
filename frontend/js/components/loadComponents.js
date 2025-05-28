// Load header
fetch("../../components/header.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("header-container").innerHTML = data;
  });

fetch("../../components/menu.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("menu-container").innerHTML = data;

    const loginButton = document.getElementById("login-button");
    const registerButton = document.getElementById("register-button");
    const logoutButton = document.getElementById("logout-button");
    const userDisplay = document.getElementById("user-display");
    const profileButton = document.getElementById("profile-button"); // Thêm nút Hồ sơ
    const adminOnlyItems = document.querySelectorAll(".admin-only");
    const userOnlyItems = document.querySelectorAll(".user-only"); // Thêm class user-only
    const allMenuLinks = document.querySelectorAll(".menu-items a");
    const authLinks = document.querySelectorAll(".auth-buttons a");

    // Kiểm tra trạng thái đăng nhập
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User data:", user); // Debug

    if (user) {
      // Đã đăng nhập
      loginButton.style.display = "none";
      registerButton.style.display = "none";
      logoutButton.style.display = "block";
      userDisplay.textContent = user.tenDangNhap || "Người dùng";
      userDisplay.style.display = "inline-block";

      // Xử lý phân quyền admin/user
      if (user.phanQuyen === "admin") {
        // Nếu là admin
        adminOnlyItems.forEach((item) => {
          item.style.display = "block";
          item.classList.add("admin-visible");
        });
        userOnlyItems.forEach((item) => {
          item.style.display = "none"; // Ẩn nút Hồ sơ cho admin
        });
      } else {
        // Nếu là user
        adminOnlyItems.forEach((item) => {
          item.style.display = "none";
          item.classList.remove("admin-visible");
        });
        userOnlyItems.forEach((item) => {
          item.style.display = "block"; // Hiển thị nút Hồ sơ cho user
        });
      }

      allMenuLinks.forEach((link) => {
        link.addEventListener("click", (e) => {});
      });
    } else {
      // Chưa đăng nhập
      loginButton.style.display = "block";
      registerButton.style.display = "block";
      logoutButton.style.display = "none";
      userDisplay.style.display = "none";
      profileButton.style.display = "none"; // Ẩn nút Hồ sơ khi chưa đăng nhập
      adminOnlyItems.forEach((item) => (item.style.display = "none"));
      userOnlyItems.forEach((item) => (item.style.display = "none")); // Ẩn nút Hồ sơ

      allMenuLinks.forEach((link) => {
        if (!link.getAttribute("href").includes("index.html")) {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "login.html";
          });
        }
      });
    }

    authLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    });

    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.href = "../../pages/trangchu/index.html";
    });
  });

// Load footer
fetch("../../components/footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer-container").innerHTML = data;
  });