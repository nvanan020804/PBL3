document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Định nghĩa baseUrl để sử dụng nhất quán cho tất cả API calls
    const baseUrl = 'http://127.0.0.1:8080';

    try {
        const response = await fetch(`${baseUrl}/api/auth/login`, {
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
            const responseData = await response.json();
            
            if (responseData.success) {
                const data = responseData.data; // Lấy data từ ApiResponse
                
                // In thông tin vai trò để debug
                console.log('Vai trò người dùng:', data.phanQuyen);
                
                // Lưu thông tin người dùng và vai trò vào localStorage
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('userRole', data.phanQuyen); // Lưu vai trò
                localStorage.setItem('idLienKet', data.idLienKet); // Lưu idLienKet
                localStorage.setItem('userName', data.tenDangNhap); // Lưu tên đăng nhập

                // Chuyển hướng dựa trên vai trò - Hỗ trợ cả dạng "ROLE_XXX" và "xxx"
                const role = data.phanQuyen.toLowerCase();
                
                if (role === 'admin' || role === 'role_admin') {
                    window.location.href = '../admin/home.html';
                } else if (role === 'nhanvien' || role === 'role_nhanvien') {
                    window.location.href = '../nhanvien/home.html';
                } else if (role === 'khachhang' || role === 'role_khachhang') {
                    // Gọi API lấy thông tin khách hàng - Sử dụng cùng baseUrl và endpoint chính xác
                    try {
                        console.log('Đang lấy thông tin khách hàng với idLienKet:', data.idLienKet);
                        const khResponse = await fetch(`${baseUrl}/api/khachhang/${data.idLienKet}`);
                        const khResponseData = await khResponse.json();
                        
                        console.log('Kết quả API khách hàng:', khResponseData);
                        
                        if (khResponseData.success) {
                            const khachhang = khResponseData.data;
                            // Lưu thông tin khách hàng vào localStorage
                            localStorage.setItem('khachhang', JSON.stringify(khachhang));
                            // Lưu idKhachHang vào user object để các chức năng khác dùng
                            let user = JSON.parse(localStorage.getItem('user'));
                            user.id = khachhang.id;
                            localStorage.setItem('user', JSON.stringify(user));
                            window.location.href = '../khachhang/home.html';
                        } else {
                            alert(khResponseData.message || 'Không tìm thấy thông tin khách hàng!');
                        }
                    } catch (error) {
                        console.error('Error fetching customer info:', error);
                        alert('Không thể lấy thông tin khách hàng! Vui lòng thử lại sau.');
                    }
                } else {
                    // Hiển thị thông báo với vai trò không được hỗ trợ
                    alert(`Vai trò "${data.phanQuyen}" chưa được hỗ trợ trong hệ thống. Vui lòng liên hệ quản trị viên.`);
                    console.error('Vai trò không được hỗ trợ:', data.phanQuyen);
                }
            } else {
                alert(responseData.message || 'Đăng nhập thất bại!');
            }
        } else {
            const errorResponse = await response.json();
            alert(errorResponse.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi đăng nhập! Vui lòng thử lại sau.');
    }
});