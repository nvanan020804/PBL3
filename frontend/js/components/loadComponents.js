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

    // Kiểm tra xem người dùng đã đăng nhập chưa
    const user = localStorage.getItem('user');
    
    if (user) {
        // Người dùng đã đăng nhập
        if (loginButton) loginButton.style.display = 'none';
        if (registerButton) registerButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';
        
        // Hiển thị tên người dùng nếu có
        if (userDisplay) {
            try {
                const userData = JSON.parse(user);
                userDisplay.textContent = userData.tenDangNhap || 'Người dùng';
                userDisplay.style.display = 'inline-block';
            } catch (e) {
                console.error('Lỗi khi xử lý thông tin người dùng:', e);
            }
        }
    } else {
        // Người dùng chưa đăng nhập
        if (loginButton) loginButton.style.display = 'block';
        if (registerButton) registerButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
        if (userDisplay) userDisplay.style.display = 'none';
    }

    // Xử lý sự kiện đăng xuất
    if (logoutButton) {
        logoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Xóa thông tin người dùng khỏi localStorage
            localStorage.clear(); // Xóa tất cả dữ liệu
            // Chuyển hướng về trang chủ
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
