// Load header
fetch("../../components/header.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("header-container").innerHTML = data;
  });

// Load menu
fetch("../../components/menu.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("menu-container").innerHTML = data;

    // Thực thi menu.js sau khi menu được load
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
      const role = user.phanQuyen ? user.phanQuyen.toLowerCase().trim() : "";
      console.log("Phân quyền hiện tại:", role);

      if (role.includes("admin")) {
        // Nếu là admin
        adminOnlyItems.forEach((item) => {
          item.style.display = "block";
          item.classList.add("admin-visible");
        });
        userOnlyItems.forEach((item) => {
          item.style.display = "none"; // Ẩn nút Hồ sơ cho admin
        });

        // Điều chỉnh đường dẫn cho admin hoặc khách hàng
        allMenuLinks.forEach((link) => {
          // Lấy href hiện tại
          let href = link.getAttribute("href");
          console.log("Link original href:", href);

          // Hiện thị đường dẫn hiện tại để debug
          console.log("Current path:", window.location.pathname);

          // Đã ở trong trang admin
          if (window.location.pathname.includes("/admin/")) {
            // Xử lý đặc biệt cho trang chủ
            if (href === "index.html") {
              link.setAttribute("href", "home.html");
              console.log("Admin path: Changed index.html to home.html");
            }
          }
          // Đã ở trong trang khách hàng
          else if (window.location.pathname.includes("/khachhang/")) {
            // Xử lý đặc biệt cho trang chủ
            if (href === "index.html") {
              link.setAttribute("href", "home.html");
              console.log("Customer path: Changed index.html to home.html");
            }
          }
          // Chưa ở trang admin hoặc khách hàng, cần chuyển hướng
          else if (
            href &&
            !href.includes("../admin/") &&
            !href.includes("../khachhang/")
          ) {
            // Admin thì chuyển hướng về trang admin
            if (role.includes("admin")) {
              // Xử lý đặc biệt cho trang chủ (index.html -> home.html)
              if (href === "index.html") {
                link.setAttribute("href", "../admin/home.html");
                console.log("Redirecting to admin home from outside");
              } else {
                // Chuyển đường dẫn thành đường dẫn admin tương ứng cho các trang khác
                const pageName = href.split("/").pop() || href;
                link.setAttribute("href", "../admin/" + pageName);
                console.log("Redirecting to admin page:", pageName);
              }
            }
            // Khách hàng thì chuyển hướng về trang khách hàng
            else {
              // Xử lý đặc biệt cho trang chủ (index.html -> home.html)
              if (href === "index.html") {
                link.setAttribute("href", "../khachhang/home.html");
                console.log("Redirecting to customer home from outside");
              } else {
                // Chuyển đường dẫn thành đường dẫn khách hàng tương ứng cho các trang khác
                const pageName = href.split("/").pop() || href;
                link.setAttribute("href", "../khachhang/" + pageName);
                console.log("Redirecting to customer page:", pageName);
              }
            }
          }
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
        if (!link.getAttribute("href").includes(".html")) {
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
      // Xóa tất cả dữ liệu đăng nhập
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("idLienKet");
      localStorage.removeItem("userName");
      localStorage.removeItem("khachhang");
      localStorage.removeItem("token");

      // Chuyển về trang đăng nhập
      window.location.href = "../../pages/trangchu/login.html";
    });
  });

// Load footer
fetch("../../components/footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer-container").innerHTML = data;
  });
