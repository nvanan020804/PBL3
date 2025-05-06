// Hàm để lấy danh sách gói dịch vụ từ API
async function layDanhSachGoiDichVu() {
    try {
        const response = await fetch('http://localhost:8080/api/goi-dich-vu');
        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu từ server');
        }
        const apiResponse = await response.json();
        
        // Kiểm tra nếu response có cấu trúc ApiResponse
        if (apiResponse.success) {
            hienThiDanhSachGoiDichVu(apiResponse.data);
        } else {
            throw new Error(apiResponse.message || 'Không thể lấy danh sách gói dịch vụ');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lấy danh sách gói dịch vụ');
    }
}

// Hàm để hiển thị danh sách gói dịch vụ lên bảng
function hienThiDanhSachGoiDichVu(danhSachGoi) {
    const tbody = document.querySelector('#dichvu-table tbody');
    tbody.innerHTML = ''; // Xóa dữ liệu cũ

    danhSachGoi.forEach((goi, index) => {
        // Hỗ trợ cả hai định dạng tên trường (backend vs frontend)
        const tenGoi = goi.tenGoi || goi.namegoi;
        const gia = goi.gia || goi.pricegoi;
        const thoiGian = goi.thoiGian || goi.timegoi;
        const moTa = goi.moTa || goi.aboutgoi;
        const id = goi.id || goi.idgoi;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${tenGoi}</td>
            <td>${formatCurrency(gia)}</td>
            <td>${thoiGian} tháng</td>
            <td>${moTa}</td>
            <td>
                <button onclick="suaGoiDichVu(${id})" class="btn-edit">Sửa</button>
                <button onclick="xoaGoiDichVu(${id})" class="btn-delete">Xóa</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Hàm format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Xử lý sự kiện submit form
document.getElementById('dichvu-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const goiDichVu = {
        tenGoi: document.getElementById('ten-goi').value,
        gia: parseFloat(document.getElementById('gia').value),
        thoiGian: parseInt(document.getElementById('thoi-han').value),
        moTa: document.getElementById('mo-ta').value
    };

    try {
        const id = document.getElementById('dichvu-id').value;
        const url = id ? 
            `http://localhost:8080/api/goi-dich-vu/${id}` : 
            'http://localhost:8080/api/goi-dich-vu';
        
        const response = await fetch(url, {
            method: id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(goiDichVu)
        });

        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi lưu gói dịch vụ');
        }

        alert(id ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        document.getElementById('dichvu-form').reset();
        document.getElementById('dichvu-id').value = '';
        layDanhSachGoiDichVu(); // Cập nhật lại danh sách
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lưu gói dịch vụ ');
    }
});

// Hàm hiển thị lỗi lên giao diện
function hienThiLoi(errors) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = ''; // Xóa lỗi cũ

    for (const [field, message] of Object.entries(errors)) {
        const errorElement = document.createElement('p');
        errorElement.textContent = message; // Hiển thị thông báo lỗi
        errorElement.style.color = 'red';
        errorContainer.appendChild(errorElement);

        // Đánh dấu trường bị lỗi
        const inputField = document.getElementById(field);
        if (inputField) {
            inputField.style.borderColor = 'red';
        }
    }
}

// Hàm xóa gói dịch vụ
async function xoaGoiDichVu(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa gói dịch vụ này?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/goi-dich-vu/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Không thể xóa gói dịch vụ');
        }

        alert('Xóa thành công!');
        layDanhSachGoiDichVu(); // Cập nhật lại danh sách
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi xóa gói dịch vụ');
    }
}

// Hàm sửa gói dịch vụ
async function suaGoiDichVu(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/goi-dich-vu/${id}`);
        if (!response.ok) {
            throw new Error('Không thể lấy thông tin gói dịch vụ');
        }
        const goi = await response.json();
        
        // Điền thông tin vào form, hỗ trợ cả hai định dạng tên trường
        document.getElementById('dichvu-id').value = goi.id || goi.idgoi;
        document.getElementById('ten-goi').value = goi.tenGoi || goi.namegoi;
        document.getElementById('gia').value = goi.gia || goi.pricegoi;
        document.getElementById('thoi-han').value = goi.thoiGian || goi.timegoi;
        document.getElementById('mo-ta').value = goi.moTa || goi.aboutgoi;

    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lấy thông tin gói dịch vụ');
    }
}

// Xử lý nút hủy
document.querySelector('.btn-cancel').addEventListener('click', function() {
    document.getElementById('dichvu-form').reset();
    document.getElementById('dichvu-id').value = '';
});

// Load danh sách khi trang được tải
document.addEventListener('DOMContentLoaded', layDanhSachGoiDichVu);