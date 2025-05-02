// Hàm để lấy danh sách gói dịch vụ
// Hàm để lấy danh sách gói dịch vụ từ API
async function layDanhSachGoiDichVu() {
    try {
        const response = await fetch('http://localhost:8080/api/goi-dich-vu');
        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu từ server');
        }
        const data = await response.json();
        hienThiDanhSachGoiDichVu(data);
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
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${goi.tenGoi}</td>
            <td>${formatCurrency(goi.gia)}</td>
            <td>${goi.thoiGian} tháng</td>
            <td>${goi.moTa}</td>
            <td>
                <button onclick="dangKyGoi(${goi.id})" class="btn-register">Đăng ký</button>
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

// Hàm xử lý đăng ký gói dịch vụ
async function dangKyGoi(idGoi) {
    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Vui lòng đăng nhập để đăng ký gói dịch vụ!');
        return;
    }

    // Ẩn bảng dịch vụ, hiện form đăng ký
    document.querySelector('.dichvu-container').style.display = 'none';
    document.getElementById('form-dang-ky').style.display = 'block';

    // Lưu lại idGoi để dùng khi xác nhận
    window._idGoiDangKy = idGoi;
}

// Load danh sách khi trang được tải
document.addEventListener('DOMContentLoaded', layDanhSachGoiDichVu);

document.getElementById('dangky-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const gioTap = document.getElementById('gio-tap').value;
    const idGoi = window._idGoiDangKy;
    const tenGoi = window._tenGoiDangKy;
    const user = JSON.parse(localStorage.getItem('user'));
    const ngayBatDau = new Date().toISOString().split('T')[0];
    const ngayKetThuc = new Date(ngayBatDau).setMonth(new Date(ngayBatDau).getMonth() + window._thoiGianGoiDangKy);

    const dangKy = {
        idGOI: idGoi,
        idKhachHang: user.id,
        ngayBatDau,
        gioTap: gioTap // Nếu không muốn lưu giờ tập thì bỏ dòng này luôn
    };

    try {
        const response = await fetch('http://localhost:8080/api/dang-ky', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dangKy)
        });

        if (!response.ok) {
            throw new Error('Không thể đăng ký gói dịch vụ');
        }

        alert('Đăng ký thành công!');
        document.getElementById('form-dang-ky').style.display = 'none';
        document.querySelector('.dichvu-container').style.display = 'none';

        // Hiện thông tin gói vừa đăng ký
        document.getElementById('goi-hien-tai').style.display = 'block';
        document.getElementById('goi-hien-tai').innerHTML = `
            <h2>Gói dịch vụ hiện tại</h2>
            <p><b>Tên gói:</b> ${tenGoi}</p>
            <p><b>Giờ tập:</b> ${gioTap}</p>
            <p><b>Ngày bắt đầu:</b> ${ngayBatDau}</p>
            <p><b>Ngày kết thúc:</b> ${ngayKetThuc}</p>
        `;
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi đăng ký gói dịch vụ');
    }
});

// Load danh sách khi trang được tải
document.addEventListener('DOMContentLoaded', layDanhSachGoiDichVu);

async function kiemTraTrangThaiKhachHang() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    // Gọi API lấy thông tin khách hàng
    const res = await fetch(`http://localhost:8080/api/khachhang/${user.id}`);
    if (!res.ok) return;
    const khachHang = await res.json();

    if (khachHang.trangThai === "Đang sử dụng") {
        // Gọi API lấy gói hiện tại của khách (ví dụ /api/dang-ky/hien-tai/{idKhachHang})
        const resGoi = await fetch(`http://localhost:8080/api/dang-ky/hien-tai/${user.id}`);
        if (!resGoi.ok) return;
        const goi = await resGoi.json();

        // Hiện thông tin gói hiện tại
        document.querySelector('.dichvu-container').style.display = 'none';
        document.getElementById('form-dang-ky').style.display = 'none';
        document.getElementById('goi-hien-tai').style.display = 'block';
        document.getElementById('goi-hien-tai').innerHTML = `
            <h2>Gói dịch vụ hiện tại</h2>
            <p><b>Tên gói:</b> ${goi.tenGoi}</p>
            <p><b>Ngày bắt đầu:</b> ${goi.ngayBatDau}</p>
            <p><b>Ngày kết thúc:</b> ${goi.ngayKetThuc}</p>
            <p><b>Giờ tập:</b> ${goi.gioTap || ''}</p>
        `;
    } else {
        // Chưa đăng ký, hiện bảng dịch vụ
        document.querySelector('.dichvu-container').style.display = 'block';
        document.getElementById('form-dang-ky').style.display = 'none';
        document.getElementById('goi-hien-tai').style.display = 'none';
    }
}

// Gọi hàm này khi load trang
document.addEventListener('DOMContentLoaded', kiemTraTrangThaiKhachHang);