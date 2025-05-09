/**
 * File xử lý đăng ký tài khoản khách hàng
 */

// Import các hàm gọi API từ api-service.js
import { AccountAPI } from '../../js/utils/api-service.js';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset tất cả thông báo lỗi
        resetErrors();
        
        // Lấy dữ liệu từ form
        const formData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            khachHang: {
                tenKhachHang: document.getElementById('tenKhachHang').value,
                namSinh: document.getElementById('namSinh').value ? parseInt(document.getElementById('namSinh').value) : null,
                soDienThoai: document.getElementById('soDienThoai').value,
                cccd: document.getElementById('cccd').value,
                email: document.getElementById('email').value
            }
        };
        
        // Kiểm tra độ dài mật khẩu
        if (formData.password.length < 6) {
            showError('passwordError', 'Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        
        try {
            // Gọi API đăng ký tài khoản khách hàng
            const result = await AccountAPI.registerCustomer(formData);
            
            // Hiển thị thông báo thành công
            document.getElementById('successMessage').textContent = 'Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập trong 3 giây...';
            document.getElementById('successMessage').style.display = 'block';
            
            // Chuyển hướng đến trang đăng nhập sau 3 giây
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
            
        } catch (error) {
            // Xử lý các lỗi phản hồi từ API
            if (error.message && error.message.includes('HTTP error')) {
                try {
                    const response = await error.response.json();
                    
                    if (response && response.message) {
                        if (response.message.includes('Tên đăng nhập đã tồn tại')) {
                            showError('usernameError', 'Tên đăng nhập đã tồn tại');
                        } else if (response.message.includes('Số điện thoại đã được đăng ký')) {
                            showError('soDienThoaiError', 'Số điện thoại đã được đăng ký');
                        } else if (response.message.includes('Email đã được đăng ký')) {
                            showError('emailError', 'Email đã được đăng ký');
                        } else if (response.message.includes('CCCD đã được đăng ký')) {
                            showError('cccdError', 'CCCD đã được đăng ký');
                        } else if (response.message.includes('Mật khẩu phải có ít nhất 6 ký tự')) {
                            showError('passwordError', 'Mật khẩu phải có ít nhất 6 ký tự');
                        } else {
                            showError('generalError', response.message);
                        }
                    } else {
                        showError('generalError', 'Đăng ký thất bại. Vui lòng thử lại!');
                    }
                } catch (e) {
                    showError('generalError', 'Đăng ký thất bại. Vui lòng thử lại!');
                }
            } else {
                // Bắt lỗi từ fetchPost trong api-service.js
                if (error.response && error.response.status === 400) {
                    error.response.json().then(data => {
                        if (data.message.includes('Tên đăng nhập đã tồn tại')) {
                            showError('usernameError', 'Tên đăng nhập đã tồn tại');
                        } else if (data.message.includes('Số điện thoại đã được đăng ký')) {
                            showError('soDienThoaiError', 'Số điện thoại đã được đăng ký');
                        } else if (data.message.includes('Email đã được đăng ký')) {
                            showError('emailError', 'Email đã được đăng ký');
                        } else if (data.message.includes('CCCD đã được đăng ký')) {
                            showError('cccdError', 'CCCD đã được đăng ký');
                        } else if (data.message.includes('Mật khẩu phải có ít nhất 6 ký tự')) {
                            showError('passwordError', 'Mật khẩu phải có ít nhất 6 ký tự');
                        } else {
                            showError('generalError', data.message);
                        }
                    }).catch(() => {
                        showError('generalError', 'Đăng ký thất bại. Vui lòng thử lại!');
                    });
                } else {
                    showError('generalError', 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau!');
                }
            }
            console.error('Registration error:', error);
        }
    });
    
    // Hàm hiển thị thông báo lỗi
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    // Hàm reset tất cả thông báo lỗi
    function resetErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
        
        const successElement = document.getElementById('successMessage');
        successElement.textContent = '';
        successElement.style.display = 'none';
    }
});