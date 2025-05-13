// Khởi tạo biến toàn cục
let invoices = []; // Mảng lưu danh sách hóa đơn
let currentPage = 1; // Trang hiện tại
let itemsPerPage = 10; // Số lượng hóa đơn mỗi trang
let totalPages = 1; // Tổng số trang
let currentFilter = 'all'; // Bộ lọc hiện tại
let editMode = false; // Biến kiểm tra đang ở chế độ sửa hay thêm mới
let currentInvoiceId = null; // ID của hóa đơn đang được chỉnh sửa
let products = []; // Danh sách sản phẩm
let staffs = []; // Danh sách nhân viên
let registrations = []; // Danh sách đăng ký
let invoiceDetails = []; // Danh sách chi tiết hóa đơn
let tempInvoiceDetails = []; // Danh sách chi tiết hóa đơn tạm thời (khi thêm mới/sửa)

// Import API functions
import { HoaDonAPI, HoaDonChiTietAPI, SanPhamAPI, DangKyAPI, StaffAPI } from '../../js/utils/api-service.js';

// Đợi DOM được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra người dùng đã đăng nhập là admin chưa
    checkAdminLogin();
    
    // Tải danh sách hóa đơn
    loadInvoices();
    
    // Tải danh sách sản phẩm, nhân viên, đăng ký
    loadProducts();
    loadStaffs();
    loadRegistrations();
    
    // Gắn sự kiện cho các nút
    setupEventListeners();
    
    // Kiểm tra nếu có tham số id trong URL để mở hóa đơn cụ thể
    checkUrlForInvoiceId();
});

// Kiểm tra tài khoản đăng nhập có phải admin hay không
function checkAdminLogin() {
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole || (userRole.toUpperCase() !== 'ADMIN' && userRole !== 'admin')) {
        showError('Bạn không có quyền truy cập trang quản lý hóa đơn.');
        setTimeout(() => {
            window.location.href = '../trangchu/index.html';
        }, 2000);
    }
}

// Thiết lập các sự kiện cho các nút
function setupEventListeners() {
    // Nút thêm hóa đơn mới
    document.getElementById('addInvoiceBtn').addEventListener('click', function() {
        resetForm();
        editMode = false;
        document.getElementById('invoiceModalLabel').textContent = 'Thêm hóa đơn mới';
        
        // Hiển thị modal
        const invoiceModal = new bootstrap.Modal(document.getElementById('invoiceModal'));
        invoiceModal.show();
    });
    
    // Nút làm mới
    document.getElementById('refreshBtn').addEventListener('click', function() {
        loadInvoices();
    });
    
    // Nút tìm kiếm
    document.getElementById('searchBtn').addEventListener('click', function() {
        searchInvoices();
    });
    
    // Filter theo trạng thái
    document.getElementById('statusFilter').addEventListener('change', function() {
        filterInvoices();
    });
    
    // Filter theo trạng thái thanh toán
    document.getElementById('paymentStatusFilter').addEventListener('change', function() {
        filterInvoices();
    });
    
    // Nút lưu hóa đơn
    document.getElementById('saveInvoiceBtn').addEventListener('click', function() {
        saveInvoice();
    });
    
    // Không cần xử lý sự kiện thay đổi loại hóa đơn nữa vì chỉ có 1 loại
    
    // Sự kiện khi thay đổi giảm giá
    document.getElementById('giamGia').addEventListener('input', function() {
        calculateTotalFromDiscount();
    });
    
    // Nút thêm sản phẩm
    document.getElementById('addItemBtn').addEventListener('click', function() {
        showItemModal();
    });
    
    // Sự kiện khi chọn sản phẩm trong modal thêm sản phẩm
    document.getElementById('itemSanPham').addEventListener('change', function() {
        updateItemPrice();
    });
    
    // Sự kiện khi thay đổi số lượng sản phẩm trong modal thêm sản phẩm
    document.getElementById('itemSoLuong').addEventListener('input', function() {
        calculateItemTotal();
    });
    
    // Nút lưu chi tiết sản phẩm
    document.getElementById('saveItemBtn').addEventListener('click', function() {
        saveInvoiceItem();
    });
}

// Tải danh sách hóa đơn
async function loadInvoices() {
    try {
        showLoading();
        
        // Gọi API lấy danh sách hóa đơn
        const data = await HoaDonAPI.getAllHoaDon();
        invoices = data;
        
        // Hiển thị danh sách
        displayInvoices();
        hideLoading();
    } catch (error) {
        console.error('Lỗi khi tải danh sách hóa đơn:', error);
        showError('Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.');
        hideLoading();
    }
}

// Tải danh sách sản phẩm
async function loadProducts() {
    try {
        // Gọi API lấy danh sách sản phẩm
        const data = await SanPhamAPI.getAllSanPham();
        products = data;
        
        // Cập nhật dropdown sản phẩm trong modal thêm sản phẩm
        updateProductDropdown();
    } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
    }
}

// Tải danh sách nhân viên
async function loadStaffs() {
    try {
        // Gọi API lấy danh sách nhân viên
        const data = await StaffAPI.getAllStaff();
        staffs = data;
        
        // Cập nhật dropdown nhân viên
        updateStaffDropdown();
    } catch (error) {
        console.error('Lỗi khi tải danh sách nhân viên:', error);
    }
}

// Tải danh sách đăng ký - không còn cần thiết cho tạo hóa đơn mới, 
// nhưng vẫn giữ lại để xem thông tin hóa đơn liên quan đến đăng ký
async function loadRegistrations() {
    try {
        // Gọi API lấy danh sách đăng ký
        const data = await DangKyAPI.getAllDangKy();
        registrations = data;
    } catch (error) {
        console.error('Lỗi khi tải danh sách đăng ký:', error);
    }
}

// Hiển thị danh sách hóa đơn
function displayInvoices() {
    const tableBody = document.getElementById('invoiceTableBody');
    tableBody.innerHTML = '';
    
    if (invoices.length === 0) {
        // Hiển thị thông báo nếu không có hóa đơn
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="11" class="text-center">Không có dữ liệu hóa đơn</td>`;
        tableBody.appendChild(row);
        
        document.getElementById('totalItems').textContent = '0';
        renderPagination(0);
        return;
    }
    
    // Lọc và phân trang dữ liệu
    const filteredInvoices = filterAndSearchInvoices();
    const paginatedInvoices = paginateInvoices(filteredInvoices);
    
    // Hiển thị thông tin tổng số
    document.getElementById('totalItems').textContent = filteredInvoices.length;
    
    // Hiển thị danh sách hóa đơn
    paginatedInvoices.forEach(invoice => {
        const row = document.createElement('tr');
        
        // Định dạng cho trạng thái
        const statusClass = getStatusClass(invoice.trangThai);
        const paymentStatusClass = getPaymentStatusClass(invoice.trangThaiThanhToan);
        
        // Format tiền tệ
        const tongTien = formatCurrency(invoice.tongTien);
        const giamGia = formatCurrency(invoice.giamGia);
        const thanhToan = formatCurrency(invoice.thanhToan);
        
        // Lấy tên khách hàng từ đăng ký (nếu có)
        let customerName = 'Khách lẻ';
        if (invoice.dangKy && invoice.dangKy.khachHang) {
            customerName = `${invoice.dangKy.khachHang.ho} ${invoice.dangKy.khachHang.ten}`;
        }
        
        // Format thời gian
        const creationTime = formatDate(invoice.thoiGianTao);
        
        // HTML cho hàng trong bảng
        row.innerHTML = `
            <td>${invoice.idHoaDon}</td>
            <td>${customerName}</td>
            <td>${invoice.nhanVien ? `${invoice.nhanVien.ho} ${invoice.nhanVien.ten}` : ''}</td>
            <td>${creationTime}</td>
            <td>${tongTien}</td>
            <td>${giamGia}</td>
            <td>${thanhToan}</td>
            <td>${formatPaymentMethod(invoice.phuongThuc)}</td>
            <td><span class="status-badge ${statusClass}">${formatStatus(invoice.trangThai)}</span></td>
            <td><span class="status-badge ${paymentStatusClass}">${formatPaymentStatus(invoice.trangThaiThanhToan)}</span></td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-info view-btn" data-id="${invoice.idHoaDon}"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${invoice.idHoaDon}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${invoice.idHoaDon}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Gắn sự kiện cho các nút hành động
    attachActionButtons();
    
    // Render phân trang
    renderPagination(filteredInvoices.length);
}

// Gắn sự kiện cho các nút hành động
function attachActionButtons() {
    // Nút xem chi tiết hóa đơn
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const invoiceId = this.getAttribute('data-id');
            viewInvoiceDetails(invoiceId);
        });
    });
    
    // Nút sửa hóa đơn
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const invoiceId = this.getAttribute('data-id');
            editInvoice(invoiceId);
        });
    });
    
    // Nút xóa hóa đơn
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const invoiceId = this.getAttribute('data-id');
            deleteInvoice(invoiceId);
        });
    });
}

// Xem chi tiết hóa đơn
async function viewInvoiceDetails(invoiceId) {
    try {
        showLoading();
        
        // Lấy thông tin hóa đơn
        const invoice = await HoaDonAPI.getHoaDonById(invoiceId);
        
        // Lấy danh sách chi tiết hóa đơn
        const details = await HoaDonChiTietAPI.getHoaDonChiTietByHoaDon(invoiceId);
        
        // Hiển thị thông tin hóa đơn
        document.getElementById('viewIdHoaDon').textContent = invoice.idHoaDon;
        
        // Hiển thị tên khách hàng
        let customerName = 'Khách lẻ';
        if (invoice.dangKy && invoice.dangKy.khachHang) {
            customerName = `${invoice.dangKy.khachHang.ho} ${invoice.dangKy.khachHang.ten}`;
        }
        document.getElementById('viewCustomerName').textContent = customerName;
        
        // Hiển thị tên nhân viên
        document.getElementById('viewStaffName').textContent = invoice.nhanVien ? `${invoice.nhanVien.ho} ${invoice.nhanVien.ten}` : '';
        
        // Format thời gian
        document.getElementById('viewCreationTime').textContent = formatDate(invoice.thoiGianTao);
        
        // Hiển thị trạng thái
        document.getElementById('viewStatus').textContent = formatStatus(invoice.trangThai);
        document.getElementById('viewPaymentStatus').textContent = formatPaymentStatus(invoice.trangThaiThanhToan);
        
        // Format tiền tệ
        document.getElementById('viewTongTien').textContent = formatCurrency(invoice.tongTien);
        document.getElementById('viewGiamGia').textContent = formatCurrency(invoice.giamGia);
        document.getElementById('viewThanhToan').textContent = formatCurrency(invoice.thanhToan);
        document.getElementById('viewPhuongThuc').textContent = formatPaymentMethod(invoice.phuongThuc);
        
        // Hiển thị chi tiết hóa đơn
        const detailsTableBody = document.getElementById('viewDetailsTableBody');
        detailsTableBody.innerHTML = '';
        
        if (details && details.length > 0) {
            details.forEach(detail => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${detail.sanPham ? detail.sanPham.tenSanPham : ''}</td>
                    <td>${formatCurrency(detail.gia)}</td>
                    <td>${detail.soLuong}</td>
                    <td>${formatCurrency(detail.thanhTien)}</td>
                `;
                detailsTableBody.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" class="text-center">Không có chi tiết hóa đơn</td>`;
            detailsTableBody.appendChild(row);
        }
        
        // Hiển thị các nút hành động tùy theo trạng thái
        const actionsContainer = document.getElementById('viewInvoiceActions');
        actionsContainer.innerHTML = '';
        
        // Tạo các nút hành động
        if (invoice.trangThai !== 'Hoàn thành' && invoice.trangThai !== 'Hủy') {
            // Nút hoàn thành
            const completeBtn = document.createElement('button');
            completeBtn.className = 'btn btn-success me-2';
            completeBtn.innerHTML = '<i class="fas fa-check"></i> Hoàn thành';
            completeBtn.addEventListener('click', function() {
                completeInvoice(invoice.idHoaDon);
            });
            actionsContainer.appendChild(completeBtn);
            
            // Nút hủy
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-danger me-2';
            cancelBtn.innerHTML = '<i class="fas fa-times"></i> Hủy';
            cancelBtn.addEventListener('click', function() {
                cancelInvoice(invoice.idHoaDon);
            });
            actionsContainer.appendChild(cancelBtn);
        }
        
        // Nút đánh dấu đã thanh toán
        if (invoice.trangThaiThanhToan !== 'Đã thanh toán') {
            const markPaidBtn = document.createElement('button');
            markPaidBtn.className = 'btn btn-primary me-2';
            markPaidBtn.innerHTML = '<i class="fas fa-money-bill"></i> Đánh dấu đã thanh toán';
            markPaidBtn.addEventListener('click', function() {
                markAsPaid(invoice.idHoaDon);
            });
            actionsContainer.appendChild(markPaidBtn);
        } else {
            // Nút đánh dấu chưa thanh toán
            const markUnpaidBtn = document.createElement('button');
            markUnpaidBtn.className = 'btn btn-warning';
            markUnpaidBtn.innerHTML = '<i class="fas fa-money-bill"></i> Đánh dấu chưa thanh toán';
            markUnpaidBtn.addEventListener('click', function() {
                markAsUnpaid(invoice.idHoaDon);
            });
            actionsContainer.appendChild(markUnpaidBtn);
        }
        
        // Hiển thị modal
        const viewModal = new bootstrap.Modal(document.getElementById('viewInvoiceModal'));
        viewModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Lỗi khi xem chi tiết hóa đơn:', error);
        showError('Không thể xem chi tiết hóa đơn. Vui lòng thử lại sau.');
        hideLoading();
    }
}

// Xóa hóa đơn
async function deleteInvoice(invoiceId) {
    if (confirm('Bạn có chắc chắn muốn xóa hóa đơn này không?')) {
        try {
            showLoading();
            
            // Gọi API xóa hóa đơn
            await HoaDonAPI.deleteHoaDon(invoiceId);
            
            // Hiển thị thông báo
            setTimeout(() => {
                showSuccess('Xóa hóa đơn thành công.');
                // Tải lại danh sách hóa đơn
                loadInvoices();
            }, 300);
            
        } catch (error) {
            console.error('Lỗi khi xóa hóa đơn:', error);
            showError('Không thể xóa hóa đơn. Vui lòng thử lại sau.');
            hideLoading();
        }
    }
}

// Đánh dấu hóa đơn đã thanh toán
async function markAsPaid(invoiceId) {
    try {
        showLoading();
        
        // Gọi API đánh dấu đã thanh toán
        await HoaDonAPI.daThanhToan(invoiceId);
        
        // Đóng modal trước khi hiển thị thông báo
        const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewInvoiceModal'));
        viewModal.hide();
        
        // Hiển thị thông báo sau khi đã đóng modal
        setTimeout(() => {
            showSuccess('Đánh dấu đã thanh toán thành công.');
            // Tải lại danh sách hóa đơn
            loadInvoices();
        }, 300);
    } catch (error) {
        console.error('Lỗi khi đánh dấu đã thanh toán:', error);
        showError('Không thể đánh dấu đã thanh toán. Vui lòng thử lại sau.');
        hideLoading();
    }
}

// Đánh dấu hóa đơn chưa thanh toán
async function markAsUnpaid(invoiceId) {
    try {
        showLoading();
        
        // Gọi API đánh dấu chưa thanh toán
        await HoaDonAPI.chuaThanhToan(invoiceId);
        
        // Đóng modal trước khi hiển thị thông báo
        const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewInvoiceModal'));
        viewModal.hide();
        
        // Hiển thị thông báo sau khi đã đóng modal
        setTimeout(() => {
            showSuccess('Đánh dấu chưa thanh toán thành công.');
            // Tải lại danh sách hóa đơn
            loadInvoices();
        }, 300);
    } catch (error) {
        console.error('Lỗi khi đánh dấu chưa thanh toán:', error);
        showError('Không thể đánh dấu chưa thanh toán. Vui lòng thử lại sau.');
        hideLoading();
    }
}

// Hoàn thành hóa đơn
async function completeInvoice(invoiceId) {
    try {
        showLoading();
        
        // Gọi API hoàn thành hóa đơn
        await HoaDonAPI.hoanThanhHoaDon(invoiceId);
        
        // Đóng modal trước khi hiển thị thông báo
        const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewInvoiceModal'));
        viewModal.hide();
        
        // Hiển thị thông báo sau khi đã đóng modal
        setTimeout(() => {
            showSuccess('Hoàn thành hóa đơn thành công.');
            // Tải lại danh sách hóa đơn
            loadInvoices();
        }, 300);
    } catch (error) {
        console.error('Lỗi khi hoàn thành hóa đơn:', error);
        showError('Không thể hoàn thành hóa đơn. Vui lòng thử lại sau.');
        hideLoading();
    }
}

// Hủy hóa đơn
async function cancelInvoice(invoiceId) {
    try {
        showLoading();
        
        // Gọi API hủy hóa đơn
        await HoaDonAPI.huyHoaDon(invoiceId);
        
        // Đóng modal trước khi hiển thị thông báo
        const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewInvoiceModal'));
        viewModal.hide();
        
        // Hiển thị thông báo sau khi đã đóng modal
        setTimeout(() => {
            showSuccess('Hủy hóa đơn thành công.');
            // Tải lại danh sách hóa đơn
            loadInvoices();
        }, 300);
    } catch (error) {
        console.error('Lỗi khi hủy hóa đơn:', error);
        showError('Không thể hủy hóa đơn. Vui lòng thử lại sau.');
        hideLoading();
    }
}

// Lưu hóa đơn
async function saveInvoice() {
    try {
        // Kiểm tra và lấy dữ liệu từ form
        const invoiceData = getInvoiceFormData();
        
        // Validate dữ liệu
        if (!validateInvoiceData(invoiceData)) {
            return;
        }
        
        showLoading();
        
        let savedInvoice;
        
        if (editMode) {
            // Cập nhật hóa đơn
            savedInvoice = await HoaDonAPI.updateHoaDon(currentInvoiceId, invoiceData);
            
            // Cập nhật chi tiết hóa đơn
            await updateInvoiceDetails(currentInvoiceId);
            
            showSuccess('Cập nhật hóa đơn thành công.');
        } else {
            // Tạo hóa đơn mới
            savedInvoice = await HoaDonAPI.createHoaDon(invoiceData);
            
            // Tạo chi tiết hóa đơn
            await createInvoiceDetails(savedInvoice.idHoaDon);
            
            showSuccess('Tạo hóa đơn mới thành công.');
        }
        
        // Đóng modal
        const invoiceModal = bootstrap.Modal.getInstance(document.getElementById('invoiceModal'));
        invoiceModal.hide();
        
        // Tải lại danh sách hóa đơn
        loadInvoices();
    } catch (error) {
        console.error('Lỗi khi lưu hóa đơn:', error);
        showError('Không thể lưu hóa đơn. Vui lòng thử lại sau.');
        hideLoading();
    }
}

// Tạo chi tiết hóa đơn mới
async function createInvoiceDetails(invoiceId) {
    for (const detail of tempInvoiceDetails) {
        // Thêm ID hóa đơn
        detail.hoaDon = { idHoaDon: invoiceId };
        
        // Gọi API tạo chi tiết hóa đơn
        await HoaDonChiTietAPI.createHoaDonChiTiet(detail);
    }
}

// Cập nhật chi tiết hóa đơn
async function updateInvoiceDetails(invoiceId) {
    // Lấy danh sách chi tiết hiện tại
    const currentDetails = await HoaDonChiTietAPI.getHoaDonChiTietByHoaDon(invoiceId);
    
    // Tạo map ID -> Detail để kiểm tra cập nhật hoặc xóa
    const currentDetailsMap = {};
    currentDetails.forEach(detail => {
        currentDetailsMap[detail.idHoaDonChiTiet] = detail;
    });
    
    // Tạo map ID -> Detail cho danh sách tạm thời
    const tempDetailsMap = {};
    tempInvoiceDetails.forEach(detail => {
        if (detail.idHoaDonChiTiet) {
            tempDetailsMap[detail.idHoaDonChiTiet] = detail;
        }
    });
    
    // Xóa chi tiết không còn trong danh sách tạm thời
    for (const id in currentDetailsMap) {
        if (!tempDetailsMap[id]) {
            await HoaDonChiTietAPI.deleteHoaDonChiTiet(id);
        }
    }
    
    // Cập nhật hoặc tạo mới chi tiết
    for (const detail of tempInvoiceDetails) {
        if (detail.idHoaDonChiTiet) {
            // Cập nhật chi tiết hiện có
            await HoaDonChiTietAPI.updateHoaDonChiTiet(detail.idHoaDonChiTiet, detail);
        } else {
            // Thêm ID hóa đơn
            detail.hoaDon = { idHoaDon: invoiceId };
            
            // Tạo mới chi tiết
            await HoaDonChiTietAPI.createHoaDonChiTiet(detail);
        }
    }
}

// Hiển thị modal thêm sản phẩm
function showItemModal() {
    // Reset form
    document.getElementById('itemForm').reset();
    document.getElementById('itemGia').value = '';
    document.getElementById('itemThanhTien').value = '';
    
    // Cập nhật dropdown sản phẩm
    updateProductDropdown();
    
    // Hiển thị modal
    const itemModal = new bootstrap.Modal(document.getElementById('itemModal'));
    itemModal.show();
    
    // Cập nhật giá khi chọn sản phẩm đầu tiên
    if (document.getElementById('itemSanPham').options.length > 0) {
        updateItemPrice();
    }
}

// Cập nhật giá sản phẩm khi chọn sản phẩm trong modal
function updateItemPrice() {
    const productId = document.getElementById('itemSanPham').value;
    const product = products.find(p => p.idSanPham == productId);
    
    if (product) {
        document.getElementById('itemGia').value = product.gia;
        calculateItemTotal();
    } else {
        document.getElementById('itemGia').value = '';
        document.getElementById('itemThanhTien').value = '';
    }
}

// Tính thành tiền cho sản phẩm trong modal
function calculateItemTotal() {
    const gia = parseFloat(document.getElementById('itemGia').value) || 0;
    const soLuong = parseInt(document.getElementById('itemSoLuong').value) || 0;
    const thanhTien = gia * soLuong;
    
    document.getElementById('itemThanhTien').value = thanhTien;
}

// Lưu chi tiết sản phẩm
function saveInvoiceItem() {
    const productId = document.getElementById('itemSanPham').value;
    const product = products.find(p => p.idSanPham == productId);
    
    if (!product) {
        showError('Vui lòng chọn sản phẩm.');
        return;
    }
    
    const soLuong = parseInt(document.getElementById('itemSoLuong').value) || 0;
    if (soLuong <= 0) {
        showError('Số lượng phải lớn hơn 0.');
        return;
    }
    
    if (soLuong > product.soLuong) {
        showError(`Số lượng không đủ. Hiện chỉ còn ${product.soLuong} sản phẩm.`);
        return;
    }
    
    const gia = parseFloat(document.getElementById('itemGia').value) || 0;
    const thanhTien = gia * soLuong;
    
    // Tạo đối tượng chi tiết hóa đơn
    const invoiceDetail = {
        sanPham: {
            idSanPham: product.idSanPham
        },
        gia: gia,
        soLuong: soLuong,
        thanhTien: thanhTien
    };
    
    // Thêm vào danh sách tạm thời
    tempInvoiceDetails.push(invoiceDetail);
    
    // Hiển thị lại danh sách
    displayInvoiceDetails();
    
    // Tính lại tổng tiền
    calculateTotal();
    
    // Đóng modal
    const itemModal = bootstrap.Modal.getInstance(document.getElementById('itemModal'));
    itemModal.hide();
}

// Hiển thị chi tiết hóa đơn
function displayInvoiceDetails() {
    const tableBody = document.getElementById('invoiceDetailsTableBody');
    tableBody.innerHTML = '';
    
    if (tempInvoiceDetails.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" class="text-center">Chưa có sản phẩm/dịch vụ nào</td>`;
        tableBody.appendChild(row);
        return;
    }
    
    tempInvoiceDetails.forEach((detail, index) => {
        const product = products.find(p => p.idSanPham == detail.sanPham.idSanPham);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${product ? product.tenSanPham : 'Không có thông tin'}</td>
            <td>${formatCurrency(detail.gia)}</td>
            <td>${detail.soLuong}</td>
            <td>${formatCurrency(detail.thanhTien)}</td>
            <td>
                <button class="btn btn-sm btn-danger remove-item-btn" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Gắn sự kiện cho nút xóa
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeInvoiceItem(index);
        });
    });
}

// Xóa sản phẩm khỏi danh sách tạm thời
function removeInvoiceItem(index) {
    tempInvoiceDetails.splice(index, 1);
    displayInvoiceDetails();
    calculateTotal();
}

// Tính tổng tiền
function calculateTotal() {
    let tongTien = 0;
    
    // Tính tổng tiền từ danh sách chi tiết
    tempInvoiceDetails.forEach(detail => {
        tongTien += detail.thanhTien;
    });
    
    // Lấy giảm giá
    const giamGia = parseFloat(document.getElementById('giamGia').value) || 0;
    
    // Tính thành tiền
    const thanhToan = tongTien - giamGia;
    
    // Cập nhật hiển thị
    document.getElementById('tongTien').value = tongTien;
    document.getElementById('thanhToan').value = thanhToan;
}

// Calculate total when discount changes
function calculateTotalFromDiscount() {
    const tongTienValue = document.getElementById('tongTien').value;
    const giamGiaValue = document.getElementById('giamGia').value;
    
    const tongTien = parseFloat(tongTienValue) || 0;
    const giamGia = parseFloat(giamGiaValue) || 0;
    
    // Calculate final amount (ensure it's not negative)
    const thanhToan = Math.max(0, tongTien - giamGia);
    document.getElementById('thanhToan').value = thanhToan;
}

// Function no longer needed as we've removed registration option
function toggleRegistrationField() {
    // This function is kept for backwards compatibility but no longer does anything
    // since we've removed the registration option from the invoice creation form
}

// Sửa hóa đơn
async function editInvoice(invoiceId) {
    try {
        showLoading();
        
        // Lấy thông tin hóa đơn
        const invoice = await HoaDonAPI.getHoaDonById(invoiceId);
        
        // Lấy danh sách chi tiết hóa đơn
        const details = await HoaDonChiTietAPI.getHoaDonChiTietByHoaDon(invoiceId);
        
        // Lưu ID hóa đơn đang sửa
        currentInvoiceId = invoice.idHoaDon;
        
        // Đặt chế độ sửa
        editMode = true;
        
        // Cập nhật tiêu đề modal
        document.getElementById('invoiceModalLabel').textContent = 'Sửa hóa đơn';
        
        // Điền thông tin vào form - chỉ còn loại hóa đơn sản phẩm
        document.getElementById('invoiceType').value = 'SANPHAM';
        
        document.getElementById('idNhanVien').value = invoice.nhanVien.idNhanVien;
        document.getElementById('tongTien').value = invoice.tongTien || 0;
        document.getElementById('giamGia').value = invoice.giamGia || 0;
        document.getElementById('thanhToan').value = invoice.thanhToan || 0;
        document.getElementById('phuongThuc').value = invoice.phuongThuc || 'tienmat';
        document.getElementById('trangThai').value = invoice.trangThai || 'Chờ xử lý';
        document.getElementById('trangThaiThanhToan').value = invoice.trangThaiThanhToan || 'Chưa thanh toán';
        
        // Lưu và hiển thị chi tiết hóa đơn
        tempInvoiceDetails = details || [];
        displayInvoiceDetails();
        
        // Hiển thị modal
        const invoiceModal = new bootstrap.Modal(document.getElementById('invoiceModal'));
        invoiceModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Lỗi khi sửa hóa đơn:', error);
        showError('Không thể sửa hóa đơn. Vui lòng thử lại sau.');
        hideLoading();
    }
}

// Lấy dữ liệu từ form hóa đơn
function getInvoiceFormData() {
    const invoiceType = document.getElementById('invoiceType').value;
    const idNhanVien = document.getElementById('idNhanVien').value;
    const tongTien = parseFloat(document.getElementById('tongTien').value) || 0;
    const giamGia = parseFloat(document.getElementById('giamGia').value) || 0;
    const thanhToan = parseFloat(document.getElementById('thanhToan').value) || 0;
    const phuongThuc = document.getElementById('phuongThuc').value;
    const trangThai = document.getElementById('trangThai').value;
    const trangThaiThanhToan = document.getElementById('trangThaiThanhToan').value;
    
    // Tạo đối tượng dữ liệu
    const invoiceData = {
        nhanVien: {
            idNhanVien: idNhanVien
        },
        tongTien: tongTien,
        giamGia: giamGia,
        thanhToan: thanhToan,
        phuongThuc: phuongThuc,
        trangThai: trangThai,
        trangThaiThanhToan: trangThaiThanhToan,
        thoiGianTao: editMode ? null : new Date().toISOString() // Chỉ đặt thời gian tạo khi thêm mới
    };
    
    // Thêm đăng ký nếu là loại hóa đơn đăng ký
    if (invoiceType === 'DANGKY') {
        const idDangKy = document.getElementById('idDangKy').value;
        if (idDangKy) {
            invoiceData.dangKy = {
                idDangKy: idDangKy
            };
        }
    } else {
        // Nếu là hóa đơn sản phẩm, đặt dangKy là null
        invoiceData.dangKy = null;
    }
    
    return invoiceData;
}

// Kiểm tra dữ liệu hóa đơn
function validateInvoiceData(invoiceData) {
    if (!invoiceData.nhanVien || !invoiceData.nhanVien.idNhanVien) {
        showError('Vui lòng chọn nhân viên.');
        return false;
    }
    
    const invoiceType = document.getElementById('invoiceType').value;
    if (invoiceType === 'DANGKY') {
        const idDangKy = document.getElementById('idDangKy').value;
        if (!idDangKy) {
            showError('Vui lòng chọn đăng ký.');
            return false;
        }
    }
    
    return true;
}

// Reset form khi thêm mới
function resetForm() {
    document.getElementById('invoiceForm').reset();
    
    // Reset các giá trị
    document.getElementById('tongTien').value = '0';
    document.getElementById('giamGia').value = '0';
    document.getElementById('thanhToan').value = '0';
    document.getElementById('trangThai').value = 'Chờ xử lý';
    document.getElementById('trangThaiThanhToan').value = 'Chưa thanh toán';
    document.getElementById('phuongThuc').value = 'tienmat';
    
    // Reset danh sách chi tiết hóa đơn tạm thời
    tempInvoiceDetails = [];
    displayInvoiceDetails();
    
    // Reset mode
    editMode = false;
    currentInvoiceId = null;
}

// Cập nhật dropdown sản phẩm
function updateProductDropdown() {
    const dropdown = document.getElementById('itemSanPham');
    dropdown.innerHTML = '';
    
    if (products && products.length > 0) {
        products.forEach(product => {
            if (product.soLuong > 0) { // Chỉ hiển thị sản phẩm còn hàng
                const option = document.createElement('option');
                option.value = product.idSanPham;
                option.textContent = `${product.tenSanPham} (Còn: ${product.soLuong})`;
                dropdown.appendChild(option);
            }
        });
    } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Không có sản phẩm';
        dropdown.appendChild(option);
    }
}

// Cập nhật dropdown nhân viên
function updateStaffDropdown() {
    const dropdown = document.getElementById('idNhanVien');
    dropdown.innerHTML = '';
    
    if (staffs && staffs.length > 0) {
        staffs.forEach(staff => {
            const option = document.createElement('option');
            option.value = staff.idNhanVien;
            option.textContent = `${staff.ho} ${staff.ten}`;
            dropdown.appendChild(option);
        });
    } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Không có nhân viên';
        dropdown.appendChild(option);
    }
}

// Cập nhật dropdown đăng ký
function updateRegistrationDropdown() {
    const dropdown = document.getElementById('idDangKy');
    dropdown.innerHTML = '';
    
    if (registrations && registrations.length > 0) {
        const activeRegistrations = registrations.filter(reg => reg.trangThai === 'Đang hoạt động');
        
        // Add an empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Chọn đăng ký --';
        dropdown.appendChild(emptyOption);
        
        activeRegistrations.forEach(registration => {
            const option = document.createElement('option');
            option.value = registration.idDangKy;
            
            // Lấy tên khách hàng và tên gói dịch vụ
            const customerName = registration.khachHang ? `${registration.khachHang.ho} ${registration.khachHang.ten}` : 'Không rõ';
            const packageName = registration.goiDichVu ? registration.goiDichVu.tenGoi : 'Không rõ';
            
            option.textContent = `${customerName} - ${packageName}`;
            
            // Store the registration price in a data attribute
            if (registration.goiDichVu && registration.goiDichVu.gia) {
                option.dataset.price = registration.goiDichVu.gia;
            }
            
            dropdown.appendChild(option);
        });
        
        // Add event listener to update invoice amount when registration changes
        dropdown.addEventListener('change', updateInvoiceAmountFromRegistration);
    } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Không có đăng ký';
        dropdown.appendChild(option);
    }
}

// Update invoice amount when registration is selected
function updateInvoiceAmountFromRegistration() {
    const registrationSelect = document.getElementById('idDangKy');
    const selectedOption = registrationSelect.options[registrationSelect.selectedIndex];
    
    if (selectedOption && selectedOption.dataset.price) {
        const price = parseFloat(selectedOption.dataset.price);
        
        if (!isNaN(price)) {
            // Update the invoice amount fields
            document.getElementById('tongTien').value = price;
            
            // Get discount amount
            const discountAmount = parseFloat(document.getElementById('giamGia').value) || 0;
            
            // Calculate final amount
            const finalAmount = Math.max(0, price - discountAmount);
            document.getElementById('thanhToan').value = finalAmount;
        }
    }
}

// Lọc và tìm kiếm hóa đơn
function filterAndSearchInvoices() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const paymentStatusFilter = document.getElementById('paymentStatusFilter').value;
    
    return invoices.filter(invoice => {
        // Lọc theo trạng thái
        const statusMatch = statusFilter === 'all' || 
            (statusFilter === 'choxuly' && invoice.trangThai === 'Chờ xử lý') ||
            (statusFilter === 'hoanthanh' && invoice.trangThai === 'Hoàn thành') ||
            (statusFilter === 'huy' && invoice.trangThai === 'Hủy');
            
        // Lọc theo trạng thái thanh toán
        const paymentStatusMatch = paymentStatusFilter === 'all' ||
            (paymentStatusFilter === 'dathanhtoan' && invoice.trangThaiThanhToan === 'Đã thanh toán') ||
            (paymentStatusFilter === 'chuathanhtoan' && invoice.trangThaiThanhToan === 'Chưa thanh toán');
            
        // Tìm kiếm
        let customerName = 'Khách lẻ';
        if (invoice.dangKy && invoice.dangKy.khachHang) {
            customerName = `${invoice.dangKy.khachHang.ho} ${invoice.dangKy.khachHang.ten}`.toLowerCase();
        }
        
        const staffName = invoice.nhanVien ? `${invoice.nhanVien.ho} ${invoice.nhanVien.ten}`.toLowerCase() : '';
        const invoiceId = invoice.idHoaDon.toString();
        
        const searchMatch = !searchValue || 
            customerName.includes(searchValue) ||
            staffName.includes(searchValue) ||
            invoiceId.includes(searchValue);
            
        return statusMatch && paymentStatusMatch && searchMatch;
    });
}

// Tìm kiếm hóa đơn
function searchInvoices() {
    currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
    displayInvoices();
}

// Lọc hóa đơn
function filterInvoices() {
    currentPage = 1; // Reset về trang đầu tiên khi lọc
    displayInvoices();
}

// Phân trang hóa đơn
function paginateInvoices(filteredInvoices) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInvoices.slice(startIndex, endIndex);
}

// Hiển thị phân trang
function renderPagination(totalItems) {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';
    
    totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) return;
    
    // Nút Previous
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
    prevLi.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            displayInvoices();
        }
    });
    paginationElement.appendChild(prevLi);
    
    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage = i;
            displayInvoices();
        });
        paginationElement.appendChild(li);
    }
    
    // Nút Next
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
    nextLi.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            displayInvoices();
        }
    });
    paginationElement.appendChild(nextLi);
}

// Format tiền tệ
function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Format ngày giờ
function formatDate(dateArray) {
    if (!dateArray) return '';
    
    try {
        const year = dateArray[0];
        const month = dateArray[1] - 1;
        const day = dateArray[2];
        const hour = dateArray[3];
        const minute = dateArray[4];
        const second = dateArray[5];
        
        const date = new Date(year, month, day, hour, minute, second);
        
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch (error) {
        console.error('Lỗi khi format ngày tháng:', error);
        return '';
    }
}

// Format trạng thái
function formatStatus(status) {
    return status || 'Chờ xử lý';
}

// Format trạng thái thanh toán
function formatPaymentStatus(status) {
    return status || 'Chưa thanh toán';
}

// Format phương thức thanh toán
function formatPaymentMethod(method) {
    switch(method) {
        case 'tienmat':
            return 'Tiền mặt';
        case 'chuyenkhoan':
            return 'Chuyển khoản';
        case 'thetindung':
            return 'Thẻ tín dụng';
        case 'thenganhang':
            return 'Thẻ ngân hàng';
        case 'Tiền mặt':
            return 'Tiền mặt'; // Hỗ trợ tương thích ngược
        default:
            return method || 'Tiền mặt';
    }
}

// Lấy class cho trạng thái
function getStatusClass(status) {
    switch (status) {
        case 'Chờ xử lý':
            return 'status-choxuly';
        case 'Hoàn thành':
            return 'status-hoanthanh';
        case 'Hủy':
            return 'status-huy';
        default:
            return '';
    }
}

// Lấy class cho trạng thái thanh toán
function getPaymentStatusClass(status) {
    switch (status) {
        case 'Đã thanh toán':
            return 'status-dathanhtoan';
        case 'Chưa thanh toán':
            return 'status-chuathanhtoan';
        default:
            return '';
    }
}

// Hiển thị thông báo lỗi
function showError(message) {
    const alertElement = document.getElementById('alertMessage');
    alertElement.className = 'alert alert-danger alert-dismissible fade show';
    alertElement.innerHTML = `
        <i class="fas fa-exclamation-circle me-2"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertElement.classList.remove('d-none');
    
    // Đảm bảo thông báo hiển thị trên modal
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
        if (alertElement.parentNode === document.body) {
            try {
                const bsAlert = new bootstrap.Alert(alertElement);
                bsAlert.close();
            } catch (e) {
                alertElement.classList.add('d-none');
            }
        }
    }, 5000);
}

// Hiển thị thông báo thành công
function showSuccess(message) {
    const alertElement = document.getElementById('alertMessage');
    alertElement.className = 'alert alert-success alert-dismissible fade show';
    alertElement.innerHTML = `
        <i class="fas fa-check-circle me-2"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertElement.classList.remove('d-none');
    
    // Đảm bảo thông báo hiển thị trên modal
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
        if (alertElement.parentNode === document.body) {
            try {
                const bsAlert = new bootstrap.Alert(alertElement);
                bsAlert.close();
            } catch (e) {
                alertElement.classList.add('d-none');
            }
        }
    }, 3000);
    
    hideLoading();
}

// Hiển thị loading
function showLoading() {
    let loadingOverlay = document.querySelector('.loading-overlay');
    
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        loadingOverlay.appendChild(spinner);
        document.body.appendChild(loadingOverlay);
    }
    
    loadingOverlay.style.display = 'flex';
}

// Ẩn loading
function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// Kiểm tra URL để xem có yêu cầu mở hóa đơn cụ thể hay không
function checkUrlForInvoiceId() {
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('id');
    
    if (invoiceId) {
        // Đợi một chút để đảm bảo dữ liệu đã được tải
        setTimeout(() => {
            viewInvoiceDetails(invoiceId);
        }, 500);
    }
}
