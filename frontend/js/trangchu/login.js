document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');
    
    // Ẩn thông báo lỗi khi submit form
    loginError.style.display = 'none';
    
    // Định nghĩa baseUrl để sử dụng nhất quán cho tất cả API calls
    const baseUrl = 'http://127.0.0.1:8080';

    try {
        // Sửa tên tham số từ tenDangNhap/matKhau thành username/password theo yêu cầu của backend
        const response = await fetch(`${baseUrl}/api/accounts/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const responseData = await response.json();
            
            // Điều chỉnh cấu trúc phản hồi để phù hợp với backend
            const data = responseData.account;
            
            // Lưu token - THÊM DÒNG NÀY
            if (responseData.token) {
                localStorage.setItem('token', responseData.token);
                console.log('Token đã được lưu:', responseData.token.substring(0, 20) + '...');
            } else {
                console.error('Không tìm thấy token trong phản hồi đăng nhập:', responseData);
            }
            
            // In thông tin đầy đủ để debug
            console.log('Thông tin tài khoản đăng nhập:', data);
            console.log('Vai trò người dùng:', data.phanQuyen);
            
            // Lưu thông tin người dùng và vai trò vào localStorage
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('userRole', data.phanQuyen); // Lưu vai trò
            localStorage.setItem('idLienKet', data.idLienKet); // Lưu idLienKet
            localStorage.setItem('userName', data.tenDangNhap); // Lưu tên đăng nhập
            
            // Kiểm tra xem phân quyền đã được lưu đúng chưa
            console.log('Phân quyền đã lưu trong localStorage:', localStorage.getItem('userRole'));

            // Chuyển hướng dựa trên vai trò
            console.log('Vai trò người dùng (chưa lowercase):', data.phanQuyen);
            const role = data.phanQuyen ? data.phanQuyen.toLowerCase().trim() : '';
            console.log('Vai trò đã xử lý:', role);
            
            // Chỉ kiểm tra vai trò admin và khách hàng (đã loại bỏ nhân viên)
            if (role.includes('admin')) {
                window.location.href = '../admin/home.html';
            } else if (role.includes('khachhang')) {
                // Gọi API lấy thông tin khách hàng - Sử dụng cùng baseUrl và endpoint chính xác
                try {
                    console.log('Đang lấy thông tin khách hàng với idLienKet:', data.idLienKet);
                    const khResponse = await fetch(`${baseUrl}/api/khachhang/${data.idLienKet}`);
                    const khResponseData = await khResponse.json();
                    
                    console.log('Kết quả API khách hàng:', khResponseData);
                    
                    // Điều chỉnh cấu trúc phản hồi nếu cần
                    const khachhang = khResponseData.data || khResponseData;
                    // Lưu thông tin khách hàng vào localStorage
                    localStorage.setItem('khachhang', JSON.stringify(khachhang));
                    // Lưu idKhachHang vào user object để các chức năng khác dùng
                    let user = JSON.parse(localStorage.getItem('user'));
                    user.id = khachhang.id || khachhang.idKhachHang;
                    localStorage.setItem('user', JSON.stringify(user));
                    window.location.href = '../khachhang/home.html';
                } catch (error) {
                    console.error('Error fetching customer info:', error);
                    loginError.textContent = 'Không thể lấy thông tin khách hàng! Vui lòng thử lại sau.';
                    loginError.style.display = 'block';
                }
            } else {
                // Thông báo lỗi với thông tin chi tiết hơn
                loginError.textContent = 'Tài khoản không có quyền truy cập hợp lệ. Hệ thống chỉ hỗ trợ vai trò admin và khách hàng.';
                loginError.style.display = 'block';
                console.error('Vai trò không được hỗ trợ hoặc không hợp lệ:', data.phanQuyen);
            }
        } else {
            const errorResponse = await response.json();
            loginError.textContent = errorResponse.message || 'Tên đăng nhập hoặc mật khẩu không đúng';
            loginError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        loginError.textContent = 'Có lỗi xảy ra khi đăng nhập! Vui lòng thử lại sau.';
        loginError.style.display = 'block';
    }
});