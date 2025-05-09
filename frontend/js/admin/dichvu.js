// Các biến và hằng số toàn cục
const API_URL = 'http://localhost:8080/api/goidichvu';
let editMode = false;

// Các phần tử DOM
const formTitle = document.getElementById('form-title');
const dichvuForm = document.getElementById('dichvu-form');
const dichvuId = document.getElementById('dichvu-id');
const tenGoi = document.getElementById('ten-goi');
const gia = document.getElementById('gia');
const thoiHan = document.getElementById('thoi-han');
const moTa = document.getElementById('mo-ta');
const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const dichvuList = document.getElementById('dichvu-list');
const errorContainer = document.getElementById('error-container');
const loading = document.getElementById('loading');
const alertSuccess = document.getElementById('alert-success');
const successMessage = document.getElementById('success-message');
const alertDanger = document.getElementById('alert-danger');
const errorMessage = document.getElementById('error-message');

// Kiểm tra xem người dùng đã đăng nhập là admin chưa
document.addEventListener('DOMContentLoaded', function() {
    checkAdminLogin();
    loadGoiDichVu();
    setupEventListeners();
});

// Kiểm tra quyền admin
function checkAdminLogin() {
    const userRole = localStorage.getItem('userRole');
    if (!userRole || userRole.toLowerCase() !== 'admin') {
        showError('Bạn không có quyền truy cập trang quản lý gói dịch vụ!');
        setTimeout(() => {
            window.location.href = '../trangchu/index.html';
        }, 2000);
    }
}

// Thiết lập các sự kiện
function setupEventListeners() {
    // Sự kiện submit form
    dichvuForm.addEventListener('submit', handleFormSubmit);
    
    // Sự kiện nút hủy
    btnCancel.addEventListener('click', resetForm);
}

// Hiển thị loading
function showLoading(show = true) {
    loading.style.display = show ? 'block' : 'none';
}

// Hiển thị thông báo thành công
function showSuccess(message) {
    successMessage.textContent = message;
    alertSuccess.style.display = 'block';
    setTimeout(() => {
        alertSuccess.style.display = 'none';
    }, 3000);
}

// Hiển thị thông báo lỗi
function showError(message) {
    errorMessage.textContent = message;
    alertDanger.style.display = 'block';
    setTimeout(() => {
        alertDanger.style.display = 'none';
    }, 3000);
}

// Hiển thị lỗi form
function showFormErrors(errors) {
    errorContainer.innerHTML = '';
    
    if (typeof errors === 'string') {
        const errorElement = document.createElement('p');
        errorElement.textContent = errors;
        errorContainer.appendChild(errorElement);
        return;
    }
    
    for (const [field, message] of Object.entries(errors)) {
        const errorElement = document.createElement('p');
        errorElement.textContent = message;
        errorContainer.appendChild(errorElement);
    }
}

// Reset form
function resetForm() {
    dichvuForm.reset();
    dichvuId.value = '';
    editMode = false;
    formTitle.textContent = 'Thêm Gói Dịch Vụ Mới';
    btnSave.innerHTML = '<i class="fas fa-save"></i> Lưu';
    errorContainer.innerHTML = '';
}

// Format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Xử lý submit form
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Xóa thông báo lỗi cũ
    errorContainer.innerHTML = '';
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Lấy dữ liệu từ form
    const goiDichVu = {
        tenGoi: tenGoi.value.trim(),
        gia: parseFloat(gia.value),
        thoiGian: parseInt(thoiHan.value), // Đổi từ thoiHan thành thoiGian để khớp với backend
        moTa: moTa.value.trim()
    };
    
    console.log('Dữ liệu gói dịch vụ gửi lên server:', goiDichVu);
    
    // Hiển thị loading
    showLoading();
    
    try {
        let url = API_URL;
        let method = 'POST';
        
        // Nếu đang ở chế độ chỉnh sửa
        if (editMode) {
            // Đảm bảo ID là số nguyên
            const numericId = parseInt(dichvuId.value);
            if (isNaN(numericId)) {
                throw new Error('ID không hợp lệ');
            }
            url = `${API_URL}/${numericId}`;
            method = 'PUT';
            
            console.log(`Đang cập nhật gói dịch vụ với ID: ${numericId}`);
            console.log('Dữ liệu gửi đi:', goiDichVu);
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(goiDichVu)
        });
        
        // Ẩn loading
        showLoading(false);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Có lỗi xảy ra khi lưu gói dịch vụ');
        }
        
        // Hiển thị thông báo thành công
        showSuccess(editMode ? 'Cập nhật gói dịch vụ thành công!' : 'Thêm gói dịch vụ mới thành công!');
        
        // Reset form
        resetForm();
        
        // Tải lại danh sách gói dịch vụ
        loadGoiDichVu();
    } catch (error) {
        // Ẩn loading
        showLoading(false);
        
        // Hiển thị lỗi
        showFormErrors(error.message);
        console.error('Chi tiết lỗi:', error);
    }
}

// Validate form
function validateForm() {
    let isValid = true;
    const errors = [];
    
    if (!tenGoi.value.trim()) {
        errors.push('Vui lòng nhập tên gói dịch vụ');
        isValid = false;
    }
    
    if (!gia.value || isNaN(parseFloat(gia.value)) || parseFloat(gia.value) <= 0) {
        errors.push('Vui lòng nhập giá hợp lệ (số dương)');
        isValid = false;
    }
    
    if (!thoiHan.value || isNaN(parseInt(thoiHan.value)) || parseInt(thoiHan.value) <= 0) {
        errors.push('Vui lòng nhập thời hạn hợp lệ (số tháng dương)');
        isValid = false;
    }
    
    if (!moTa.value.trim()) {
        errors.push('Vui lòng nhập mô tả gói dịch vụ');
        isValid = false;
    }
    
    if (!isValid) {
        showFormErrors(errors.join('<br>'));
    }
    
    return isValid;
}

// Tải danh sách gói dịch vụ
async function loadGoiDichVu() {
    try {
        showLoading();
        
        const response = await fetch(API_URL);
        
        showLoading(false);
        
        if (!response.ok) {
            throw new Error('Không thể tải danh sách gói dịch vụ');
        }
        
        const data = await response.json();
        
        // Nếu API trả về dạng ApiResponse với thuộc tính data
        const goidichvu = Array.isArray(data) ? data : (data.data || []);
        
        // Hiển thị danh sách gói dịch vụ
        renderGoiDichVu(goidichvu);
    } catch (error) {
        showLoading(false);
        showError('Lỗi khi tải danh sách gói dịch vụ: ' + error.message);
        
        // Hiển thị dữ liệu mẫu để kiểm thử giao diện
        renderGoiDichVu(getSampleData());
    }
}

// Hiển thị danh sách gói dịch vụ
function renderGoiDichVu(danhSachGoi) {
    dichvuList.innerHTML = '';
    
    if (danhSachGoi.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="6" class="text-center">Không có dữ liệu gói dịch vụ</td>';
        dichvuList.appendChild(emptyRow);
        return;
    }
    
    danhSachGoi.forEach((goi, index) => {
        // Hỗ trợ cả hai định dạng tên trường
        const id = goi.id || goi.idGoiDichVu || '';
        const tenGoi = goi.tenGoi || goi.ten || '';
        const gia = goi.gia || goi.giaTien || 0;
        const thoiGian = goi.thoiHan || goi.thoiGian || 0; // Đổi từ thoiHan thành thoiGian để khớp với backend
        const moTa = goi.moTa || goi.moTa || '';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${tenGoi}</td>
            <td>${formatCurrency(gia)}</td>
            <td>${thoiGian} tháng</td>
            <td>${moTa}</td>
            <td>
                <button onclick="editGoiDichVu('${id}')" class="btn-edit">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button onclick="deleteGoiDichVu('${id}')" class="btn-delete">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </td>
        `;
        
        dichvuList.appendChild(row);
    });
}

// Chỉnh sửa gói dịch vụ
async function editGoiDichVu(id) {
    try {
        showLoading();
        
        // Đảm bảo id là số nguyên
        const numericId = parseInt(id);
        
        if (isNaN(numericId)) {
            throw new Error('ID không hợp lệ');
        }
        
        console.log(`Đang tải thông tin gói dịch vụ với ID: ${numericId}`);
        
        const response = await fetch(`${API_URL}/${numericId}`);
        
        showLoading(false);
        
        if (!response.ok) {
            throw new Error('Không thể tải thông tin gói dịch vụ');
        }
        
        const goi = await response.json();
        console.log("Dữ liệu gói dịch vụ:", goi);
        
        // Điền thông tin vào form, hỗ trợ cả hai định dạng tên trường
        dichvuId.value = numericId;
        tenGoi.value = goi.tenGoi || goi.ten || '';
        gia.value = goi.gia || goi.giaTien || 0;
        thoiHan.value = goi.thoiHan || goi.thoiGian || 0; // Đổi từ thoiHan thành thoiGian để khớp với backend
        moTa.value = goi.moTa || goi.moTa || '';
        
        // Chuyển sang chế độ chỉnh sửa
        editMode = true;
        formTitle.textContent = 'Chỉnh sửa gói dịch vụ';
        btnSave.innerHTML = '<i class="fas fa-save"></i> Cập nhật';
        
        // Cuộn lên đầu trang để hiển thị form
        window.scrollTo(0, 0);
    } catch (error) {
        showLoading(false);
        showError('Lỗi khi tải thông tin gói dịch vụ: ' + error.message);
        console.error('Chi tiết lỗi:', error);
    }
}

// Xóa gói dịch vụ
async function deleteGoiDichVu(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa gói dịch vụ này?')) {
        return;
    }
    
    try {
        showLoading();
        
        // Đảm bảo id là số nguyên
        const numericId = parseInt(id);
        
        if (isNaN(numericId)) {
            throw new Error('ID không hợp lệ');
        }
        
        console.log(`Đang xóa gói dịch vụ với ID: ${numericId}`);
        
        const response = await fetch(`${API_URL}/${numericId}`, {
            method: 'DELETE'
        });
        
        showLoading(false);
        
        if (!response.ok) {
            throw new Error('Không thể xóa gói dịch vụ');
        }
        
        showSuccess('Xóa gói dịch vụ thành công!');
        
        // Tải lại danh sách gói dịch vụ
        loadGoiDichVu();
    } catch (error) {
        showLoading(false);
        showError('Lỗi khi xóa gói dịch vụ: ' + error.message);
        console.error('Chi tiết lỗi:', error);
    }
}

// Dữ liệu mẫu để kiểm thử giao diện
function getSampleData() {
    return [
        {
            id: '1',
            tenGoi: 'Gói Basic',
            gia: 500000,
            thoiGian: 1, // Đổi từ thoiHan thành thoiGian để khớp với backend
            moTa: 'Gói tập cơ bản 1 tháng, bao gồm sử dụng tất cả các thiết bị tập luyện'
        },
        {
            id: '2',
            tenGoi: 'Gói Standard',
            gia: 1200000,
            thoiGian: 3, // Đổi từ thoiHan thành thoiGian để khớp với backend
            moTa: 'Gói tập tiêu chuẩn 3 tháng, bao gồm sử dụng tất cả các thiết bị và 2 buổi PT miễn phí'
        },
        {
            id: '3',
            tenGoi: 'Gói Premium',
            gia: 2800000,
            thoiGian: 6, // Đổi từ thoiHan thành thoiGian để khớp với backend
            moTa: 'Gói tập cao cấp 6 tháng, bao gồm sử dụng tất cả các thiết bị, 5 buổi PT miễn phí và nước uống miễn phí'
        },
        {
            id: '4',
            tenGoi: 'Gói Diamond',
            gia: 5000000,
            thoiGian: 12, // Đổi từ thoiHan thành thoiGian để khớp với backend
            moTa: 'Gói tập kim cương 12 tháng, bao gồm sử dụng tất cả các thiết bị, 10 buổi PT miễn phí, nước uống miễn phí và tư vấn dinh dưỡng'
        }
    ];
}