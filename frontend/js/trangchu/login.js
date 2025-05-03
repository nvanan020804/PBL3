document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tenDangNhap: username,
                matKhau: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            // Lưu thông tin người dùng và vai trò vào localStorage
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('userRole', data.phanQuyen); // Lưu riêng vai trò
            localStorage.setItem('idLienKet', data.idLienKet); // Lưu idLienKet
            localStorage.setItem('userName', data.tenDangNhap); // Lưu tên đăng nhập

            // Chuyển hướng dựa trên vai trò
            if (data.phanQuyen === 'admin') {
                window.location.href = '../admin/home.html';
            } else if (data.phanQuyen === 'nhanvien') {
                window.location.href = '../nhanvien/home.html';
            } else if (data.phanQuyen === 'khachhang') {
                if (data.phanQuyen === 'khachhang') {
                    // Gọi API lấy thông tin khách hàng
                    fetch(`http://localhost:8080/api/khachhang/${data.idLienKet}`)
                        .then(res => res.json())
                        .then(khachhang => {
                            // Lưu thông tin khách hàng vào localStorage
                            localStorage.setItem('khachhang', JSON.stringify(khachhang));
                            // Lưu idKhachHang vào user object để các chức năng khác dùng
                            let user = JSON.parse(localStorage.getItem('user'));
                            user.id = khachhang.idKhachHang;
                            localStorage.setItem('user', JSON.stringify(user));
                            window.location.href = '../khachhang/home.html';
                        })
                        .catch(() => {
                            alert('Không tìm thấy thông tin khách hàng!');
                        });
                }
            } else {
                alert('Bạn không có quyền truy cập!');
            }
        } else {
            const errorText = await response.text();
            alert(errorText || 'Tên đăng nhập hoặc mật khẩu không đúng');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi đăng nhập! Vui lòng thử lại sau.');
    }
});