// File menu.js được tạo để khắc phục lỗi 404
// Menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý menu navigation
    const menuItems = document.querySelectorAll('.menu-item');
    if (menuItems) {
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                menuItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Xử lý mobile menu toggle nếu có
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
        });
    }
    
    // Quản lý hiển thị nút đăng nhập/đăng ký/đăng xuất
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const logoutButton = document.getElementById('logout-button');
    
    // Kiểm tra nếu người dùng đã đăng nhập
    const user = localStorage.getItem('user');
    
    if (user) {
        // Người dùng đã đăng nhập, ẩn nút đăng nhập và đăng ký, hiển thị nút đăng xuất
        if (loginButton) loginButton.style.display = 'none';
        if (registerButton) registerButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';
        
        // Lấy tên người dùng để hiển thị nếu cần
        try {
            const userData = JSON.parse(user);
            const username = userData.tenDangNhap || 'Người dùng';
            
            // Nếu có phần tử hiển thị tên người dùng
            const userDisplayElement = document.getElementById('user-display');
            if (userDisplayElement) {
                userDisplayElement.textContent = username;
                userDisplayElement.style.display = 'inline-block';
            }
        } catch (e) {
            console.error('Lỗi khi xử lý thông tin người dùng:', e);
        }
    } else {
        // Người dùng chưa đăng nhập, hiển thị nút đăng nhập và đăng ký, ẩn nút đăng xuất
        if (loginButton) loginButton.style.display = 'block';
        if (registerButton) registerButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
        
        // Ẩn phần tử hiển thị tên người dùng nếu có
        const userDisplayElement = document.getElementById('user-display');
        if (userDisplayElement) {
            userDisplayElement.style.display = 'none';
        }
    }
    
    // Xử lý sự kiện đăng xuất
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Xóa tất cả dữ liệu trong localStorage
            localStorage.clear();
            
            // Chuyển hướng về trang chủ sau khi đăng xuất
            window.location.href = '../trangchu/index.html';
        });
    }
});