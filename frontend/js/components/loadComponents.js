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
    const logoutButton = document.getElementById("logout-button");

    // Kiểm tra xem người dùng đã đăng nhập chưa
    const userRole = localStorage.getItem('userRole');
    
    if (loginButton && logoutButton) {
        if (userRole) {
            // Nếu đã đăng nhập, hiển thị nút đăng xuất
            loginButton.classList.remove('active');
            logoutButton.classList.add('active');
        } else {
            // Nếu chưa đăng nhập, hiển thị nút đăng nhập
            loginButton.classList.add('active');
            logoutButton.classList.remove('active');
        }
    }

    // Xử lý sự kiện đăng xuất
    if (logoutButton) {
        logoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Xóa thông tin người dùng khỏi localStorage
            localStorage.removeItem('user');         // Xóa object user
            localStorage.removeItem('userRole');     // Xóa role
            localStorage.removeItem('idLienKet');    // Xóa id liên kết
            localStorage.removeItem('userName');     // Xóa tên đăng nhập
            // Chuyển hướng về trang đăng nhập
            window.location.href = "../../pages/trangchu/index.html";
        });
    }
  });

// Load footer
fetch("../../components/footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer-container").innerHTML = data;
  });
