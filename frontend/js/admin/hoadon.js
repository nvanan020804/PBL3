// Khởi tạo biến toàn cục
let invoices = []; // Mảng lưu danh sách hóa đơn
let currentPage = 1; // Trang hiện tại
const itemsPerPage = 10; // Số lượng hóa đơn mỗi trang
let totalPages = 1; // Tổng số trang
let currentFilter = 'all'; // Bộ lọc hiện tại
let editMode = false; // Biến kiểm tra đang ở chế độ sửa hay thêm mới
let currentInvoiceId = null; // ID của hóa đơn đang được chỉnh sửa
let products = []; // Danh sách sản phẩm
let registrations = []; // Danh sách đăng ký
let invoiceDetails = []; // Danh sách chi tiết hóa đơn
let tempInvoiceDetails = []; // Danh sách chi tiết hóa đơn tạm thời (khi thêm mới/sửa)

// Map để lưu trữ tên khách hàng cho mỗi hóa đơn
let customerNamesMap = {};

// Import API functions
import { HoaDonAPI, HoaDonChiTietAPI, SanPhamAPI, DangKyAPI } from '../../js/utils/api-service.js';

// Đợi DOM được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra người dùng đã đăng nhập là admin chưa
    checkAdminLogin();
    
    // Tải danh sách hóa đơn
    loadInvoices();
    
    // Tải danh sách sản phẩm và đăng ký
    loadProducts();
    loadRegistrations();
    
    // Gắn sự kiện cho các nút
    setupEventListeners();
    
    // Kiểm tra nếu có tham số id trong URL để mở hóa đơn cụ thể
    checkUrlForInvoiceId();
});

// Kiểm tra tài khoản đăng nhập có phải admin hay không
function checkAdminLogin() {
    const userRole = localStorage.getItem('userRole');
    console.log('DEBUG: userRole trong checkAdminLogin:', userRole);
    
    if (!userRole || !userRole.toLowerCase().includes('admin')) {
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
    
    // Khởi tạo tìm kiếm khách hàng
    if (document.getElementById('customerSearch')) {
        initCustomerSearch();
    }
    
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
    
    // Sự kiện khi thay đổi số lượng sản phẩm
    document.getElementById('itemSoLuong').addEventListener('input', function() {
        calculateItemTotal();
    });
    
    // Nút lưu sản phẩm trong modal thêm sản phẩm
    document.getElementById('saveItemBtn').addEventListener('click', function() {
        addItemToInvoice();
    });
}

// Tải danh sách hóa đơn
async function loadInvoices() {
    try {
        showLoading();
        
        // Gọi API lấy danh sách hóa đơn
        const data = await HoaDonAPI.getAllHoaDon();
        console.log('Loaded invoices:', data); // Log để debug
        invoices = data || [];
        
        // Lấy danh sách tên khách hàng cho các hóa đơn
        await loadCustomerNames();
        
        // Hiển thị danh sách
        displayInvoices();
        hideLoading();
    } catch (error) {
        console.error('Lỗi khi tải danh sách hóa đơn:', error);
        showError('Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.');
        hideLoading();
    }
}

// Tải danh sách tên khách hàng cho các hóa đơn
async function loadCustomerNames() {
    try {
        // Lấy tất cả các ID khách hàng từ danh sách hóa đơn
        const customerIds = invoices.map(invoice => {
            if (invoice.khachHang && invoice.khachHang.idKhachHang) {
                return invoice.khachHang.idKhachHang;
            } else if (invoice.dangKy && invoice.dangKy.khachHang && invoice.dangKy.khachHang.idKhachHang) {
                return invoice.dangKy.khachHang.idKhachHang;
            }
            return null;
        }).filter((id, index, self) => id && self.indexOf(id) === index); // Lọc trùng

        if (customerIds.length === 0) return;

        // Gọi API để lấy thông tin khách hàng theo danh sách ID
        const customerData = await Promise.all(customerIds.map(id => HoaDonAPI.getKhachHangById(id)));

        // Cập nhật map tên khách hàng
        customerData.forEach(customer => {
            if (customer && customer.idKhachHang) {
                // Find all invoices with this customer and map them
                invoices.forEach(invoice => {
                    // Check if this invoice is related to this customer
                    const invoiceCustomerId = invoice.khachHang?.idKhachHang || invoice.dangKy?.khachHang?.idKhachHang;
                    if (invoiceCustomerId === customer.idKhachHang) {
                        customerNamesMap[invoice.idHoaDon] = customer.tenKhachHang;
                    }
                });
            }
        });
    } catch (error) {
        console.error('Lỗi khi tải danh sách khách hàng:', error);
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

// Tải danh sách đăng ký
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
    
    if (!invoices || invoices.length === 0) {
        // Hiển thị thông báo nếu không có hóa đơn
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="10" class="text-center">Không có dữ liệu hóa đơn</td>`;
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
        const tongTien = formatCurrency(invoice.tongTien || 0);
        const giamGia = formatCurrency(invoice.giamGia || 0);
        const thanhToan = formatCurrency(invoice.thanhToan || 0);
        
        // Get customer name from our tracking map (or default to 'Khách lẻ')
        let customerName = customerNamesMap[invoice.idHoaDon] || 'Khách lẻ';
        
        // Format thời gian
        const creationTime = formatDate(invoice.thoiGianTao);
        
        // HTML cho hàng trong bảng
        let actionButtonsHtml = '';
        
        // Chỉ hiển thị nút xem nếu hóa đơn đã hoàn thành, ngược lại hiển thị đầy đủ các nút thao tác
        if (invoice.trangThai === 'Hoàn thành') {
            actionButtonsHtml = `
                <button class="btn btn-sm btn-info view-btn" data-id="${invoice.idHoaDon}"><i class="fas fa-eye"></i></button>
            `;
        } else {
            // Tạo các dropdown items dựa trên trạng thái thanh toán
            let completeButtonHtml = '';
            
            if (invoice.trangThaiThanhToan === 'Đã thanh toán') {
                // Nếu đã thanh toán, hiện nút Hoàn thành
                completeButtonHtml = `<li><a class="dropdown-item complete-btn" href="#" data-id="${invoice.idHoaDon}"><i class="fas fa-check"></i> Hoàn thành</a></li>`;
            } else {
                // Nếu chưa thanh toán, hiện nút Hoàn thành bị vô hiệu hóa
                completeButtonHtml = `<li><a class="dropdown-item disabled" href="#"><i class="fas fa-check"></i> Hoàn thành (cần thanh toán)</a></li>`;
            }
            
            actionButtonsHtml = `
                <button class="btn btn-sm btn-info view-btn" data-id="${invoice.idHoaDon}"><i class="fas fa-eye"></i></button>
                <div class="btn-group">
                    <button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-tasks"></i>
                    </button>
                    <ul class="dropdown-menu">
                        ${completeButtonHtml}
                        <li><a class="dropdown-item cancel-btn" href="#" data-id="${invoice.idHoaDon}"><i class="fas fa-times"></i> Hủy</a></li>
                    </ul>
                </div>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${invoice.idHoaDon}"><i class="fas fa-trash"></i></button>
            `;
        }
        
        row.innerHTML = `
            <td>${invoice.idHoaDon}</td>
            <td>${customerName}</td>
            <td>${creationTime}</td>
            <td>${tongTien}</td>
            <td>${giamGia}</td>
            <td>${thanhToan}</td>
            <td>${formatPaymentMethod(invoice.phuongThuc)}</td>
            <td><span class="status-badge ${statusClass}">${formatStatus(invoice.trangThai)}</span></td>
            <td><span class="status-badge ${paymentStatusClass}">${formatPaymentStatus(invoice.trangThaiThanhToan)}</span></td>
            <td class="action-buttons">
                ${actionButtonsHtml}
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
    
    // Nút hoàn thành hóa đơn
    document.querySelectorAll('.complete-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const invoiceId = this.getAttribute('data-id');
            completeInvoice(invoiceId);
        });
    });
    
    // Nút hủy hóa đơn
    document.querySelectorAll('.cancel-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const invoiceId = this.getAttribute('data-id');
            cancelInvoice(invoiceId);
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
        console.log("Đã lấy thông tin hóa đơn:", invoice);
        console.log("ID đăng ký từ hóa đơn:", invoice.idDangKy);
        
        // Lấy danh sách chi tiết hóa đơn
        const details = await HoaDonChiTietAPI.getHoaDonChiTietByHoaDon(invoiceId);
        console.log("Đã lấy thông tin chi tiết hóa đơn:", details);
        
        // Biến theo dõi việc đã lấy được thông tin đăng ký chưa
        let registrationDetails = null;
        
        // Nếu hóa đơn có ID đăng ký, lấy thông tin đăng ký từ API
        if (invoice.idDangKy) {
            try {
                console.log("Lấy thông tin đăng ký từ ID:", invoice.idDangKy);
                registrationDetails = await DangKyAPI.getDangKyById(invoice.idDangKy);
                
                if (registrationDetails && registrationDetails.goiDichVu) {
                    console.log("Đã lấy thành công thông tin đăng ký:", registrationDetails);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin đăng ký:", error);
            }
        }
        
        // Đảm bảo thông tin khách hàng được tải
        await loadCustomerDetailsForInvoice(invoice);
        
        // Hiển thị thông tin hóa đơn
        document.getElementById('viewIdHoaDon').textContent = invoice.idHoaDon;
        
        // Hiển thị tên khách hàng
        let customerName = customerNamesMap[invoice.idHoaDon] || 'Khách lẻ';
        document.getElementById('viewCustomerName').textContent = customerName;
        
        // Format thời gian
        document.getElementById('viewCreationTime').textContent = formatDate(invoice.thoiGianTao);
        
        // Hiển thị trạng thái
        document.getElementById('viewStatus').textContent = formatStatus(invoice.trangThai);
        
        // Hiển thị thông tin đăng ký nếu có
        const registrationInfoSection = document.getElementById('viewRegistrationInfo');
        
        if (registrationDetails && registrationDetails.goiDichVu) {
            console.log("Hiển thị thông tin đăng ký từ registrationDetails");
            registrationInfoSection.classList.remove('d-none');
            document.getElementById('viewTenGoi').textContent = registrationDetails.goiDichVu.tenGoi || 'N/A';
            document.getElementById('viewNgayBatDau').textContent = formatDate(registrationDetails.ngayBatDau) || 'N/A';
            
            // Tính ngày kết thúc từ ngày bắt đầu và thời hạn gói
            if (registrationDetails.ngayBatDau && registrationDetails.goiDichVu.thoiHan) {
                const ngayBatDau = new Date(registrationDetails.ngayBatDau);
                const thoiHan = registrationDetails.goiDichVu.thoiHan;
                const ngayKetThuc = new Date(ngayBatDau);
                ngayKetThuc.setMonth(ngayKetThuc.getMonth() + thoiHan);
                document.getElementById('viewNgayKetThuc').textContent = formatDate(ngayKetThuc) || 'N/A';
            } else {
                document.getElementById('viewNgayKetThuc').textContent = 'N/A';
            }
            
            document.getElementById('viewTrangThaiDangKy').textContent = registrationDetails.trangThai || 'N/A';
        } else {
            console.log("Không có thông tin đăng ký để hiển thị");
            registrationInfoSection.classList.add('d-none');
        }
        document.getElementById('viewPaymentStatus').textContent = formatPaymentStatus(invoice.trangThaiThanhToan);
        
        // Format tiền tệ
        document.getElementById('viewTongTien').textContent = formatCurrency(invoice.tongTien);
        document.getElementById('viewGiamGia').textContent = formatCurrency(invoice.giamGia);
        document.getElementById('viewThanhToan').textContent = formatCurrency(invoice.thanhToan);
        document.getElementById('viewPhuongThuc').textContent = formatPaymentMethod(invoice.phuongThuc);
        
        // Hiển thị chi tiết hóa đơn
        const detailsTableBody = document.getElementById('viewDetailsTableBody');
        detailsTableBody.innerHTML = '';
        
        if (registrationDetails && registrationDetails.goiDichVu) {
            // Ưu tiên hiển thị thông tin đăng ký vì đây là hoá đơn đăng ký
            const goiDichVu = registrationDetails.goiDichVu;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${goiDichVu.tenGoi || 'Gói dịch vụ'}</td>
                <td>${formatCurrency(invoice.tongTien)}</td>
                <td>1</td>
                <td>${formatCurrency(invoice.tongTien)}</td>
            `;
            detailsTableBody.appendChild(row);
            
            // Thêm thông báo giải thích đây là hoá đơn đăng ký
            const infoRow = document.createElement('tr');
            infoRow.innerHTML = `<td colspan="4" class="text-center text-info">
                <i class="fas fa-info-circle me-2"></i>
                Đây là hoá đơn đăng ký gói dịch vụ, không có sản phẩm.
            </td>`;
            detailsTableBody.appendChild(infoRow);
        } else if (details && details.length > 0) {
            // Hiển thị chi tiết sản phẩm/dịch vụ nếu có
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
            // Nếu không có thông tin chi tiết và cũng không phải gói dịch vụ
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" class="text-center">
                <i class="fas fa-info-circle text-warning me-2"></i>
                Không có thông tin chi tiết sản phẩm/dịch vụ cho hóa đơn này.
                <br><small>Thành tiền: ${formatCurrency(invoice.tongTien)}</small>
            </td>`;
            detailsTableBody.appendChild(row);
        }
        
        // Hiển thị các nút hành động tùy theo trạng thái
        const actionsContainer = document.getElementById('viewInvoiceActions');
        actionsContainer.innerHTML = '';
        
        // Nếu hóa đơn đã hoàn thành, không hiển thị bất kỳ nút hành động nào
        if (invoice.trangThai === 'Hoàn thành') {
            // Không hiển thị nút hành động nào, chỉ cho phép xem thông tin
            const infoText = document.createElement('span');
            infoText.className = 'text-info';
            infoText.innerHTML = '<i class="fas fa-info-circle"></i> Hóa đơn đã hoàn thành, không thể thay đổi.';
            actionsContainer.appendChild(infoText);
            // Không return ở đây để tiếp tục hiển thị modal
        }
        
        // Tạo các nút hành động nếu hóa đơn chưa hoàn thành và chưa hủy
        if (invoice.trangThai !== 'Hoàn thành' && invoice.trangThai !== 'Hủy') {
            // Nút hoàn thành - chỉ hiển thị nếu hóa đơn đã thanh toán
            if (invoice.trangThaiThanhToan === 'Đã thanh toán') {
                const completeBtn = document.createElement('button');
                completeBtn.className = 'btn btn-success me-2';
                completeBtn.innerHTML = '<i class="fas fa-check"></i> Hoàn thành';
                completeBtn.addEventListener('click', function() {
                    completeInvoice(invoice.idHoaDon);
                });
                actionsContainer.appendChild(completeBtn);
            } else {
                // Hiển thị thông báo nếu hóa đơn chưa thanh toán
                const paymentRequiredInfo = document.createElement('span');
                paymentRequiredInfo.className = 'text-warning me-3';
                paymentRequiredInfo.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Cần thanh toán trước khi hoàn thành';
                actionsContainer.appendChild(paymentRequiredInfo);
            }
            
            // Nút hủy
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-danger me-2';
            cancelBtn.innerHTML = '<i class="fas fa-times"></i> Hủy';
            cancelBtn.addEventListener('click', function() {
                cancelInvoice(invoice.idHoaDon);
            });
            actionsContainer.appendChild(cancelBtn);
            
            // Các nút thanh toán chỉ hiển thị khi hóa đơn không ở trạng thái Hủy hoặc Hoàn thành
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
        } else {
            // Nếu hóa đơn đã hủy, hiển thị thông báo
            const infoText = document.createElement('span');
            infoText.className = 'text-danger';
            infoText.innerHTML = '<i class="fas fa-ban"></i> Hóa đơn đã bị hủy.';
            actionsContainer.appendChild(infoText);
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

// Hiển thị modal thêm sản phẩm
function showItemModal() {
    // Reset form
    document.getElementById('itemForm').reset();
    
    // Cập nhật danh sách sản phẩm
    updateProductDropdown();
    
    // Thiết lập giá trị mặc định cho số lượng
    document.getElementById('itemSoLuong').value = 1;
    
    // Cập nhật giá sản phẩm
    updateItemPrice();
    
    // Hiển thị modal
    const itemModal = new bootstrap.Modal(document.getElementById('itemModal'));
    itemModal.show();
}

// Cập nhật giá sản phẩm khi chọn sản phẩm
function updateItemPrice() {
    const productSelect = document.getElementById('itemSanPham');
    const selectedProductId = productSelect.value;
    
    if (selectedProductId) {
        // Tìm sản phẩm đã chọn
        const selectedProduct = products.find(p => p.idSanPham == selectedProductId);
        
        if (selectedProduct && selectedProduct.gia) {
            // Cập nhật trường giá
            document.getElementById('itemGia').value = selectedProduct.gia;
            
            // Tính toán thành tiền
            calculateItemTotal();
        }
    } else {
        document.getElementById('itemGia').value = 0;
        document.getElementById('itemThanhTien').value = 0;
    }
}

// Tính toán thành tiền khi thay đổi giá hoặc số lượng
function calculateItemTotal() {
    const gia = parseFloat(document.getElementById('itemGia').value) || 0;
    const soLuong = parseInt(document.getElementById('itemSoLuong').value) || 0;
    
    const thanhTien = gia * soLuong;
    document.getElementById('itemThanhTien').value = thanhTien;
}

// Thêm sản phẩm vào hóa đơn
function addItemToInvoice() {
    try {
        // Lấy dữ liệu từ form
        const productId = document.getElementById('itemSanPham').value;
        const gia = parseFloat(document.getElementById('itemGia').value) || 0;
        const soLuong = parseInt(document.getElementById('itemSoLuong').value) || 0;
        const thanhTien = parseFloat(document.getElementById('itemThanhTien').value) || 0;
        
        // Kiểm tra dữ liệu
        if (!productId) {
            showError('Vui lòng chọn sản phẩm.');
            return false;
        }
        
        if (soLuong <= 0) {
            showError('Số lượng phải lớn hơn 0.');
            return false;
        }
        
        if (gia <= 0) {
            showError('Giá phải lớn hơn 0.');
            return false;
        }
        
        // Tìm thông tin sản phẩm
        const selectedProduct = products.find(p => p.idSanPham == productId);
        if (!selectedProduct) {
            showError('Không tìm thấy sản phẩm.');
            return false;
        }
        
        // Kiểm tra số lượng có đủ không
        if (soLuong > selectedProduct.soLuong) {
            showError(`Chỉ còn ${selectedProduct.soLuong} sản phẩm trong kho.`);
            return false;
        }
        
        // Tạo chi tiết hóa đơn mới
        const invoiceDetail = {
            sanPham: selectedProduct,
            gia: gia,
            soLuong: soLuong,
            thanhTien: thanhTien
        };
        
        // Thêm vào mảng tạm
        tempInvoiceDetails.push(invoiceDetail);

        // Cập nhật lại số lượng sản phẩm trong mảng products
        selectedProduct.soLuong -= soLuong;

        // Cập nhật lại dropdown sản phẩm để phản ánh số lượng mới
        updateProductDropdown();
        
        // Cập nhật hiển thị
        displayInvoiceDetails();
        
        // Đóng modal
        const itemModal = bootstrap.Modal.getInstance(document.getElementById('itemModal'));
        if (itemModal) {
            itemModal.hide();
        }
        
        return true;
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        showError('Có lỗi xảy ra khi thêm sản phẩm.');
        return false;
    }
}

// Tải thông tin khách hàng cho từng hóa đơn
async function loadCustomerDetailsForInvoices(invoices) {
    try {
        // Lấy danh sách riêng biệt của tất cả idKhachHang từ các hóa đơn
        const customerIds = [];
        invoices.forEach(invoice => {
            if (invoice.khachHang && typeof invoice.khachHang === 'object' && invoice.khachHang.idKhachHang) {
                if (!customerIds.includes(invoice.khachHang.idKhachHang)) {
                    customerIds.push(invoice.khachHang.idKhachHang);
                }
            }
        });
        
        if (customerIds.length === 0) {
            console.log('Không có khách hàng cần tải thông tin');
            return;
        }
        
        console.log('Tải thông tin cho các khách hàng:', customerIds);
        
        // Gọi API để lấy thông tin chi tiết của từng khách hàng
        for (const customerId of customerIds) {
            try {
                const response = await fetch(`http://localhost:8080/api/khachhang/${customerId}`);
                if (response.ok) {
                    const customer = await response.json();
                    
                    // Cập nhật tên khách hàng cho tất cả hóa đơn có khách hàng này
                    invoices.forEach(invoice => {
                        if (invoice.khachHang && invoice.khachHang.idKhachHang === customerId) {
                            customerNamesMap[invoice.idHoaDon] = customer.tenKhachHang;
                        }
                    });
                }
            } catch (error) {
                console.error(`Lỗi khi tải thông tin khách hàng ID ${customerId}:`, error);
            }
        }
    } catch (error) {
        console.error('Lỗi khi tải thông tin khách hàng:', error);
    }
}

// Lấy thông tin khách hàng cho một hóa đơn cụ thể
async function loadCustomerDetailsForInvoice(invoice) {
    try {
        // Kiểm tra xem thông tin khách hàng đã có trong map chưa
        if (customerNamesMap[invoice.idHoaDon]) {
            console.log(`Thông tin khách hàng cho hóa đơn ${invoice.idHoaDon} đã có sẵn`);
            return; // Đã có thông tin khách hàng
        }
        
        console.log(`Đang tải thông tin khách hàng cho hóa đơn ${invoice.idHoaDon}`);
        
        // Lấy ID khách hàng từ hóa đơn
        let customerId = null;
        if (invoice.khachHang && invoice.khachHang.idKhachHang) {
            customerId = invoice.khachHang.idKhachHang;
            console.log(`Tìm thấy ID khách hàng từ trường khachHang: ${customerId}`);
        } else if (invoice.dangKy && invoice.dangKy.khachHang && invoice.dangKy.khachHang.idKhachHang) {
            customerId = invoice.dangKy.khachHang.idKhachHang;
            console.log(`Tìm thấy ID khách hàng từ trường dangKy: ${customerId}`);
        }
        
        if (!customerId) {
            console.log(`Không tìm thấy ID khách hàng cho hóa đơn ${invoice.idHoaDon}`);
            // Vẫn gán một giá trị mặc định để tránh lặp lại việc tìm kiếm
            customerNamesMap[invoice.idHoaDon] = 'Khách lẻ';
            return; // Không có ID khách hàng
        }
        
        // Gọi API để lấy thông tin khách hàng
        try {
            console.log(`Đang gọi API lấy thông tin khách hàng có ID ${customerId}`);
            const response = await fetch(`http://localhost:8080/api/khachhang/${customerId}`);
            if (response.ok) {
                const customer = await response.json();
                if (customer && customer.tenKhachHang) {
                    console.log(`Đã tìm thấy thông tin khách hàng: ${customer.tenKhachHang}`);
                    customerNamesMap[invoice.idHoaDon] = customer.tenKhachHang;
                } else {
                    console.log(`Không có thông tin tên cho khách hàng ID ${customerId}`);
                    customerNamesMap[invoice.idHoaDon] = 'Khách hàng #' + customerId;
                }
            } else {
                console.log(`API trả về lỗi khi tìm khách hàng ID ${customerId}. Status: ${response.status}`);
                customerNamesMap[invoice.idHoaDon] = 'Khách hàng #' + customerId;
            }
        } catch (error) {
            console.error(`Lỗi khi tải thông tin khách hàng cho hóa đơn ${invoice.idHoaDon}:`, error);
            customerNamesMap[invoice.idHoaDon] = 'Khách hàng không xác định';
        }
    } catch (error) {
        console.error('Lỗi khi tải thông tin khách hàng cho hóa đơn:', error);
        if (invoice && invoice.idHoaDon) {
            customerNamesMap[invoice.idHoaDon] = 'Khách hàng không xác định';
        }
    }
}

// Đánh dấu hóa đơn là Hoàn thành
async function completeInvoice(invoiceId) {
    try {
        // Kiểm tra xem hóa đơn đã được thanh toán chưa
        const invoice = invoices.find(inv => inv.idHoaDon == invoiceId);
        if (!invoice) {
            showError('Không tìm thấy thông tin hóa đơn.');
            return;
        }
        
        // Nếu hóa đơn chưa thanh toán, hiển thị thông báo lỗi
        if (invoice.trangThaiThanhToan !== 'Đã thanh toán') {
            showError('Không thể hoàn thành hóa đơn chưa thanh toán. Vui lòng thanh toán hóa đơn trước.');
            return;
        }
        
        if (!confirm('Xác nhận đánh dấu hóa đơn này là hoàn thành?')) {
            return;
        }
        
        showLoading();
        
        // Gọi API để cập nhật trạng thái hóa đơn thành Hoàn thành
        const updatedInvoice = await HoaDonAPI.hoanThanhHoaDon(invoiceId);
        
        // Cập nhật hóa đơn trong mảng
        const index = invoices.findIndex(inv => inv.idHoaDon == invoiceId);
        if (index !== -1) {
            invoices[index] = {...invoices[index], trangThai: 'Hoàn thành'};
            displayInvoices();
        }
        
        showSuccess('Đã cập nhật trạng thái hóa đơn thành Hoàn thành.');
        
        // Nếu đang mở modal chi tiết, đóng modal và mở lại để cập nhật giao diện
        const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewInvoiceModal'));
        if (viewModal) {
            viewModal.hide();
            setTimeout(() => {
                viewInvoiceDetails(invoiceId);
            }, 500);
        }
        
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái hóa đơn:', error);
        showError('Không thể cập nhật trạng thái hóa đơn. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// Đánh dấu hóa đơn là Hủy
async function cancelInvoice(invoiceId) {
    try {
        if (!confirm('Xác nhận hủy hóa đơn này?')) {
            return;
        }
        
        showLoading();
        
        // Gọi API để cập nhật trạng thái hóa đơn thành Hủy
        const updatedInvoice = await HoaDonAPI.huyHoaDon(invoiceId);
        
        // Cập nhật hóa đơn trong mảng
        const index = invoices.findIndex(inv => inv.idHoaDon == invoiceId);
        if (index !== -1) {
            invoices[index] = {...invoices[index], trangThai: 'Hủy'};
            displayInvoices();
        }
        
        showSuccess('Đã cập nhật trạng thái hóa đơn thành Hủy.');
        
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái hóa đơn:', error);
        showError('Không thể cập nhật trạng thái hóa đơn. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// Hiển thị danh sách chi tiết hóa đơn tạm thời
function displayInvoiceDetails() {
    const detailsTableBody = document.getElementById('invoiceDetailsTableBody');
    if (!detailsTableBody) {
        console.error('Không tìm thấy bảng chi tiết hóa đơn');
        return;
    }
    
    // Xóa toàn bộ dữ liệu hiện có
    detailsTableBody.innerHTML = '';
    
    // Nếu không có chi tiết hóa đơn, hiển thị thông báo
    if (!tempInvoiceDetails || tempInvoiceDetails.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="5" class="text-center">Chưa có sản phẩm nào được thêm vào hóa đơn</td>`;
        detailsTableBody.appendChild(emptyRow);
        return;
    }
    
    // Hiển thị các chi tiết hóa đơn
    tempInvoiceDetails.forEach((detail, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${detail.sanPham ? detail.sanPham.tenSanPham : 'Không xác định'}</td>
            <td>${formatCurrency(detail.gia || 0)}</td>
            <td>${detail.soLuong || 0}</td>
            <td>${formatCurrency(detail.thanhTien || 0)}</td>
            <td>
                <button type="button" class="btn btn-sm btn-danger remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        detailsTableBody.appendChild(row);
    });
    
    // Gắn sự kiện xóa chi tiết
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeInvoiceDetail(index);
        });
    });
    
    // Cập nhật tổng tiền
    calculateTotal();
}

// Xóa chi tiết hóa đơn tạm thời theo index
function removeInvoiceDetail(index) {
    if (index >= 0 && index < tempInvoiceDetails.length) {
        // Lưu thông tin chi tiết hóa đơn trước khi xóa
        const detail = tempInvoiceDetails[index];
        
        // Hoàn trả số lượng sản phẩm vào kho
        if (detail.sanPham && products) {
            // Tìm sản phẩm trong danh sách products
            const productInList = products.find(p => p.idSanPham === detail.sanPham.idSanPham);
            if (productInList) {
                // Cộng lại số lượng sản phẩm vào kho
                productInList.soLuong += detail.soLuong;
                console.log(`Đã hoàn trả ${detail.soLuong} sản phẩm "${detail.sanPham.tenSanPham}" vào kho.`);
            }
        }
        
        // Xóa chi tiết khỏi mảng
        tempInvoiceDetails.splice(index, 1);
        
        // Cập nhật lại hiển thị
        displayInvoiceDetails();
    }
}

// Tính lại tổng tiền từ giảm giá
function calculateTotalFromDiscount() {
    const tongTien = parseFloat(document.getElementById('tongTien').value) || 0;
    const giamGia = parseFloat(document.getElementById('giamGia').value) || 0;
    
    // Kiểm tra giảm giá có hợp lệ không
    if (giamGia < 0) {
        showError('Giảm giá không thể âm.');
        document.getElementById('giamGia').value = 0;
        return calculateTotalFromDiscount();
    }
    
    // Kiểm tra giảm giá có vượt quá tổng tiền không
    if (giamGia > tongTien) {
        showError('Giảm giá không thể lớn hơn tổng tiền.');
        document.getElementById('giamGia').value = tongTien;
        return calculateTotalFromDiscount();
    }
    
    // Tính thành tiền
    const thanhToan = tongTien - giamGia;
    document.getElementById('thanhToan').value = thanhToan;
}

// Validate invoice data before saving
function validateInvoiceData(invoiceData) {
    const errors = [];
    // Validate amounts
    if (!invoiceData.tongTien || invoiceData.tongTien <= 0) {
        errors.push('Tổng tiền phải lớn hơn 0.');
    }
    
    if (invoiceData.giamGia < 0) {
        errors.push('Giảm giá không thể âm.');
    }
    
    if (invoiceData.giamGia > invoiceData.tongTien) {
        errors.push('Giảm giá không thể lớn hơn tổng tiền.');
    }
    
    // Validate payment method
    if (!invoiceData.phuongThuc) {
        errors.push('Vui lòng chọn phương thức thanh toán.');
    }
    
    return errors;
}

// Save invoice with improved error handling
async function saveInvoice() {
    try {
        // Get form data
        const invoiceData = getInvoiceFormData();
        if (!invoiceData) {
            showError('Có lỗi khi lấy dữ liệu từ form.');
            return;
        }
        
        // Validate data
        const errors = validateInvoiceData(invoiceData);
        if (errors.length > 0) {
            showError(errors.join('\n'));
            return;
        }
        
        showLoading();
        
        let savedInvoice;
        if (editMode && currentInvoiceId) {
            // Update existing invoice
            savedInvoice = await HoaDonAPI.updateHoaDon(currentInvoiceId, invoiceData);
            await updateInvoiceDetails(currentInvoiceId);
            showSuccess('Cập nhật hóa đơn thành công.');
        } else {
            // Create new invoice
            savedInvoice = await HoaDonAPI.createHoaDon(invoiceData);
            await createInvoiceDetails(savedInvoice.idHoaDon);
            showSuccess('Tạo hóa đơn mới thành công.');
        }
        
        // Close modal and refresh list
        const modal = bootstrap.Modal.getInstance(document.getElementById('invoiceModal'));
        if (modal) {
            modal.hide();
            // Wait for modal animation to complete
            setTimeout(() => {
                resetForm();
                loadInvoices();
            }, 300);
        }
        
    } catch (error) {
        console.error('Lỗi khi lưu hóa đơn:', error);
        let errorMessage = 'Không thể lưu hóa đơn.';
        if (error.response?.data?.message) {
            errorMessage += ' ' + error.response.data.message;
        }
        showError(errorMessage);
    } finally {
        hideLoading();
    }
}

// Get invoice form data with validation
function getInvoiceFormData() {
    try {
        const tongTien = parseFloat(document.getElementById('tongTien').value) || 0;
        const giamGia = parseFloat(document.getElementById('giamGia').value) || 0;
        const thanhToan = parseFloat(document.getElementById('thanhToan').value) || 0;
        const phuongThuc = document.getElementById('phuongThuc').value;
        const trangThai = document.getElementById('trangThai').value || 'Chờ xử lý';
        const trangThaiThanhToan = document.getElementById('trangThaiThanhToan').value;
        
        // Get customer/registration info
        let khachHang = null;
        let dangKy = null;
        
        const selectedCustomerId = document.querySelector('#selectedCustomerInfo input[type="hidden"]')?.value;
        if (selectedCustomerId) {
            khachHang = { idKhachHang: parseInt(selectedCustomerId) };
        }
        
        // Build invoice data
        const invoiceData = {
            khachHang,
            dangKy,
            tongTien,
            giamGia,
            thanhToan,
            phuongThuc,
            trangThai,
            trangThaiThanhToan,
            thoiGianTao: editMode ? undefined : new Date().toISOString()
        };
        
        return invoiceData;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu form:', error);
        return null;
    }
}

// Show error message with better styling
function showError(message) {
    const alertElement = document.getElementById('alertMessage');
    alertElement.className = 'alert alert-danger show';
    alertElement.textContent = message;
    alertElement.classList.remove('d-none');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        alertElement.classList.add('d-none');
    }, 5000);
}

// Show success message with better styling
function showSuccess(message) {
    const alertElement = document.getElementById('alertMessage');
    alertElement.className = 'alert alert-success show';
    alertElement.textContent = message;
    alertElement.classList.remove('d-none');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        alertElement.classList.add('d-none');
    }, 3000);
}

// Format tiền tệ
function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Tính tổng tiền và cập nhật
function calculateTotal() {
    let tongTien = 0;
    
    // Calculate total from invoice details
    tempInvoiceDetails.forEach(detail => {
        tongTien += detail.thanhTien || 0;
    });
    
    // Get discount amount
    const giamGia = parseFloat(document.getElementById('giamGia').value) || 0;
    
    // Validate discount
    if (giamGia > tongTien) {
        showError('Giảm giá không thể lớn hơn tổng tiền.');
        document.getElementById('giamGia').value = tongTien;
        return calculateTotal();
    }
    
    // Calculate final amount
    const thanhToan = Math.max(0, tongTien - giamGia);
    
    // Update form fields
    document.getElementById('tongTien').value = tongTien;
    document.getElementById('thanhToan').value = thanhToan;
    
    // Update display if in view mode
    const viewTongTien = document.getElementById('viewTongTien');
    const viewGiamGia = document.getElementById('viewGiamGia');
    const viewThanhToan = document.getElementById('viewThanhToan');
    
    if (viewTongTien) viewTongTien.textContent = formatCurrency(tongTien);
    if (viewGiamGia) viewGiamGia.textContent = formatCurrency(giamGia);
    if (viewThanhToan) viewThanhToan.textContent = formatCurrency(thanhToan);
}



// Reset form khi thêm mới
function resetForm() {
    const form = document.getElementById('invoiceForm');
    if (!form) {
        console.error('Invoice form not found');
        return;
    }

    form.reset();
    
    // Reset các giá trị
    const elements = {
        'invoiceType': 'SANPHAM',
        'tongTien': '0',
        'giamGia': '0',
        'thanhToan': '0',
        'trangThai': 'Chờ xử lý',
        'trangThaiThanhToan': 'Chưa thanh toán',
        'phuongThuc': 'tienmat',
        'selectedCustomerId': ''
    };

    // Set each value with null check
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
        }
    });
    
    // Reset customer search related elements
    const selectedCustomerInfo = document.getElementById('selectedCustomerInfo');
    const customerSearch = document.getElementById('customerSearch');
    if (selectedCustomerInfo) {
        selectedCustomerInfo.classList.add('d-none');
    }
    if (customerSearch) {
        customerSearch.value = '';
    }
    
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
    if (!invoices) return [];
    
    let filteredInvoices = [...invoices];
    
    // Lấy giá trị của các bộ lọc
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const statusValue = document.getElementById('statusFilter').value;
    const paymentStatusValue = document.getElementById('paymentStatusFilter').value;
    
    // Lọc theo từ khóa tìm kiếm
    if (searchValue) {
        filteredInvoices = filteredInvoices.filter(invoice => {
            // Format thông tin khách hàng
            let customerName = 'Khách lẻ';
            if (invoice.khachHang) {
                customerName = `${invoice.khachHang.ho} ${invoice.khachHang.ten}`.toLowerCase();
            } else if (invoice.dangKy && invoice.dangKy.khachHang) {
                customerName = `${invoice.dangKy.khachHang.ho} ${invoice.dangKy.khachHang.ten}`.toLowerCase();
            }
            
            return invoice.idHoaDon.toString().includes(searchValue) ||
                customerName.includes(searchValue) ||
                formatDate(invoice.thoiGianTao).toLowerCase().includes(searchValue) ||
                formatCurrency(invoice.tongTien).toLowerCase().includes(searchValue);
        });
    }
    
    // Lọc theo trạng thái
    if (statusValue !== 'all') {
        filteredInvoices = filteredInvoices.filter(invoice => {
            return statusValue === formatStatus(invoice.trangThai).toLowerCase().replace(/\s+/g, '');
        });
    }
    
    // Lọc theo trạng thái thanh toán
    if (paymentStatusValue !== 'all') {
        filteredInvoices = filteredInvoices.filter(invoice => {
            return paymentStatusValue === formatPaymentStatus(invoice.trangThaiThanhToan).toLowerCase().replace(/\s+/g, '');
        });
    }
    
    return filteredInvoices;
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

// Format ngày giờ
function formatDate(date) {
    if (!date) return '';
    
    try {
        // Nếu là mảng (từ API Java cũ)
        if (Array.isArray(date)) {
            const year = date[0];
            const month = date[1] - 1;
            const day = date[2];
            const hour = date[3];
            const minute = date[4];
            const second = date[5];
            
            const dateObj = new Date(year, month, day, hour || 0, minute || 0, second || 0);
            return dateObj.toLocaleString('vi-VN');
        } 
        // Nếu là string ISO (từ API Java mới)
        else if (typeof date === 'string') {
            const dateObj = new Date(date);
            return dateObj.toLocaleString('vi-VN');
        }
        
        return '';
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
    const defaultStatus = 'Chưa thanh toán';
    if (!status) return defaultStatus;
    return status;
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
    switch(status) {
        case 'Đã thanh toán':
            return 'payment-completed';
        case 'Chưa thanh toán':
            return 'payment-pending';
        default:
            return 'payment-pending';
    }
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

// Biến để lưu timeout của debounce
let searchTimeout;

// Hàm tìm kiếm khách hàng với debounce
async function searchCustomers(searchTerm) {
    try {
        if (!searchTerm.trim()) {
            document.getElementById('customerSearchResults').classList.remove('show');
            return;
        }

        const apiUrl = `http://localhost:8080/api/khachhang/search?q=${encodeURIComponent(searchTerm)}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Không thể tìm kiếm khách hàng');
        }

        const customers = await response.json();
        displayCustomerSearchResults(customers);
    } catch (error) {
        console.error('Lỗi khi tìm kiếm khách hàng:', error);
        showError('Không thể tìm kiếm khách hàng. Vui lòng thử lại sau.');
    }
}

// Hiển thị kết quả tìm kiếm khách hàng
function displayCustomerSearchResults(customers) {
    const resultsContainer = document.getElementById('customerSearchResults');
    resultsContainer.innerHTML = '';

    if (customers.length === 0) {
        resultsContainer.innerHTML = '<div class="dropdown-item text-muted">Không tìm thấy khách hàng</div>';
        resultsContainer.classList.add('show');
        return;
    }

    customers.forEach(customer => {
        const item = document.createElement('a');
        item.href = '#';
        item.className = 'dropdown-item';
        item.innerHTML = `
            <div><strong>${customer.tenKhachHang || 'Không có tên'}</strong></div>
            <div class="small text-muted">
                ${customer.soDienThoai ? `SĐT: ${customer.soDienThoai}` : ''}
                ${customer.email ? ` | Email: ${customer.email}` : ''}
            </div>
        `;
        item.addEventListener('click', (e) => {
            e.preventDefault();
            selectCustomer(customer);
        });
        resultsContainer.appendChild(item);
    });

    resultsContainer.classList.add('show');
}

// Khởi tạo tìm kiếm khách hàng
function initCustomerSearch() {
    const searchInput = document.getElementById('customerSearch');
    const searchResults = document.getElementById('customerSearchResults');
    const selectedCustomerInfo = document.getElementById('selectedCustomerInfo');
    const customerDetails = document.getElementById('customerDetails');
    
    if (!searchInput || !searchResults) return;
    
    searchInput.addEventListener('keyup', async function() {
        const searchValue = this.value.toLowerCase();
        
        if (searchValue.length < 2) {
            searchResults.classList.remove('show');
            return;
        }
        
        try {
            // Tìm trong danh sách đăng ký
            const filteredRegistrations = registrations.filter(reg => {
                const customer = reg.khachHang;
                if (!customer) return false;
                
                const fullName = `${customer.ho} ${customer.ten}`.toLowerCase();
                const phone = customer.sdt?.toLowerCase() || '';
                const email = customer.email?.toLowerCase() || '';
                
                return fullName.includes(searchValue) ||
                    phone.includes(searchValue) ||
                    email.includes(searchValue);
            });
            
            // Hiển thị kết quả
            searchResults.innerHTML = '';
            
            if (filteredRegistrations.length === 0) {
                searchResults.innerHTML = '<div class="dropdown-item text-muted">Không tìm thấy khách hàng</div>';
            } else {
                filteredRegistrations.forEach(reg => {
                    const customer = reg.khachHang;
                    const item = document.createElement('div');
                    item.className = 'dropdown-item';
                    item.style.cursor = 'pointer';
                    item.innerHTML = `
                        <div><strong>${customer.ho} ${customer.ten}</strong></div>
                        <div class="small text-muted">
                            ${customer.sdt || ''} | ${customer.email || ''}
                        </div>
                    `;
                    
                    item.addEventListener('click', () => {
                        selectCustomer(reg);
                        searchResults.classList.remove('show');
                        searchInput.value = ''; // Clear search input
                    });
                    
                    searchResults.appendChild(item);
                });
            }
            
            searchResults.classList.add('show');
            
        } catch (error) {
            console.error('Lỗi khi tìm kiếm khách hàng:', error);
            searchResults.innerHTML = '<div class="dropdown-item text-danger">Có lỗi xảy ra khi tìm kiếm</div>';
        }
    });
    
    // Ẩn kết quả khi click bên ngoài
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('show');
        }
    });
}

// Chọn khách hàng
function selectCustomer(registration) {
    const customer = registration.khachHang;
    const selectedCustomerInfo = document.getElementById('selectedCustomerInfo');
    const customerDetails = document.getElementById('customerDetails');
    const selectedCustomerId = document.getElementById('selectedCustomerId');
    
    // Hiển thị thông tin khách hàng
    customerDetails.innerHTML = `
        <dl class="row mb-0">
            <dt class="col-sm-4">Tên khách hàng:</dt>
            <dd class="col-sm-8">${customer.ho} ${customer.ten}</dd>
            
            <dt class="col-sm-4">Số điện thoại:</dt>
            <dd class="col-sm-8">${customer.sdt || 'Chưa cập nhật'}</dd>
            
            <dt class="col-sm-4">Email:</dt>
            <dd class="col-sm-8">${customer.email || 'Chưa cập nhật'}</dd>
            
            <dt class="col-sm-4">Gói dịch vụ:</dt>
            <dd class="col-sm-8">${registration.goiDichVu?.tenGoi || 'Không có'}</dd>
            
            <dt class="col-sm-4">Thời hạn:</dt>
            <dd class="col-sm-8">${formatDate(registration.thoiHan) || 'Không có'}</dd>
        </dl>
    `;
    
    // Lưu ID đăng ký
    selectedCustomerId.value = registration.idDangKy;
    
    // Hiển thị phần thông tin khách hàng
    selectedCustomerInfo.classList.remove('d-none');
}

// Đánh dấu hóa đơn đã thanh toán
async function markAsPaid(invoiceId) {
    try {
        if (!confirm('Xác nhận đánh dấu hóa đơn này đã thanh toán?')) {
            return;
        }
        
        showLoading();
        const updatedInvoice = await HoaDonAPI.daThanhToan(invoiceId);
        
        // Update DOM elements
        const paymentStatusElement = document.getElementById('viewPaymentStatus');
        if (paymentStatusElement) {
            paymentStatusElement.textContent = 'Đã thanh toán';
            paymentStatusElement.className = 'status-badge payment-completed';
        }
        
        // Update action buttons
        updatePaymentButtons(invoiceId, true);
        
        // Update invoice in list
        const index = invoices.findIndex(inv => inv.idHoaDon == invoiceId);
        if (index !== -1) {
            invoices[index] = {...invoices[index], trangThaiThanhToan: 'Đã thanh toán'};
            displayInvoices();
        }
        
        showSuccess('Đã cập nhật trạng thái thanh toán thành công.');
        
        // Cập nhật lại modal chi tiết để hiển thị nút hoàn thành nếu khách hàng đã thanh toán
        const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewInvoiceModal'));
        if (viewModal) {
            viewModal.hide();
            setTimeout(() => {
                viewInvoiceDetails(invoiceId);
            }, 500);
        }
    } catch (error) {
        console.error('Lỗi khi đánh dấu đã thanh toán:', error);
        showError('Không thể cập nhật trạng thái thanh toán. Vui lòng thử lại.');
    } finally {
        hideLoading();
    }
}

// Đánh dấu hóa đơn chưa thanh toán
async function markAsUnpaid(invoiceId) {
    try {
        if (!confirm('Xác nhận đánh dấu hóa đơn này chưa thanh toán?')) {
            return;
        }
        
        showLoading();
        const updatedInvoice = await HoaDonAPI.chuaThanhToan(invoiceId);
        
        // Update DOM elements
        const paymentStatusElement = document.getElementById('viewPaymentStatus');
        if (paymentStatusElement) {
            paymentStatusElement.textContent = 'Chưa thanh toán';
            paymentStatusElement.className = 'status-badge payment-pending';
        }
        
        // Update action buttons
        updatePaymentButtons(invoiceId, false);
        
        // Update invoice in list
        const index = invoices.findIndex(inv => inv.idHoaDon == invoiceId);
        if (index !== -1) {
            invoices[index] = {...invoices[index], trangThaiThanhToan: 'Chưa thanh toán'};
            displayInvoices();
        }
        
        showSuccess('Đã cập nhật trạng thái thanh toán thành công.');
        
        // Cập nhật lại modal chi tiết để ẩn nút hoàn thành vì khách hàng chưa thanh toán
        const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewInvoiceModal'));
        if (viewModal) {
            viewModal.hide();
            setTimeout(() => {
                viewInvoiceDetails(invoiceId);
            }, 500);
        }
    } catch (error) {
        console.error('Lỗi khi đánh dấu chưa thanh toán:', error);
        showError('Không thể cập nhật trạng thái thanh toán. Vui lòng thử lại.');
    } finally {
        hideLoading();
    }
}

// Update payment buttons
function updatePaymentButtons(invoiceId, isPaid) {
    const actionsContainer = document.getElementById('viewInvoiceActions');
    if (!actionsContainer) return;
    
    // Remove existing payment status buttons
    const existingButtons = actionsContainer.querySelectorAll('.payment-status-btn');
    existingButtons.forEach(btn => btn.remove());
    
    // Add appropriate button based on payment status
    if (isPaid) {
        const markUnpaidBtn = document.createElement('button');
        markUnpaidBtn.className = 'btn btn-warning payment-status-btn';
        markUnpaidBtn.innerHTML = '<i class="fas fa-money-bill"></i> Đánh dấu chưa thanh toán';
        markUnpaidBtn.addEventListener('click', () => markAsUnpaid(invoiceId));
        actionsContainer.appendChild(markUnpaidBtn);
    } else {
        const markPaidBtn = document.createElement('button');
        markPaidBtn.className = 'btn btn-primary payment-status-btn';
        markPaidBtn.innerHTML = '<i class="fas fa-money-bill"></i> Đánh dấu đã thanh toán';
        markPaidBtn.addEventListener('click', () => markAsPaid(invoiceId));
        actionsContainer.appendChild(markPaidBtn);
    }
}

// Hiển thị thông tin hóa đơn trong modal để chỉnh sửa
async function showEditInvoiceModal(invoiceId) {
    try {
        // Đặt chế độ sửa và lưu ID hóa đơn hiện tại
        editMode = true;
        currentInvoiceId = invoiceId;
        
        // Lấy thông tin hóa đơn từ server
        const invoice = await HoaDonAPI.getHoaDonById(invoiceId);
        console.log("Thông tin hóa đơn để sửa:", invoice);
        
        // Điền thông tin vào form
        document.getElementById('idHoaDon').value = invoice.idHoaDon;
        document.getElementById('tongTien').value = invoice.tongTien;
        document.getElementById('giamGia').value = invoice.giamGia;
        document.getElementById('thanhToan').value = invoice.thanhToan;
        document.getElementById('phuongThuc').value = invoice.phuongThuc;
        document.getElementById('trangThai').value = invoice.trangThai;
        document.getElementById('trangThaiThanhToan').value = invoice.trangThaiThanhToan;
        
        // Thiết lập thông tin khách hàng
        if (invoice.khachHang && invoice.khachHang.idKhachHang) {
            document.querySelector('#selectedCustomerInfo input[type="hidden"]').value = invoice.khachHang.idKhachHang;
            document.getElementById('customerNameDisplay').textContent = `${invoice.khachHang.ho} ${invoice.khachHang.ten}`;
            document.getElementById('customerPhoneDisplay').textContent = invoice.khachHang.sdt || 'Chưa có';
            document.getElementById('customerEmailDisplay').textContent = invoice.khachHang.email || 'Chưa có';
        } else {
            document.querySelector('#selectedCustomerInfo input[type="hidden"]').value = '';
            document.getElementById('customerNameDisplay').textContent = 'Khách lẻ';
            document.getElementById('customerPhoneDisplay').textContent = '';
            document.getElementById('customerEmailDisplay').textContent = '';
        }
        
        // Hiển thị danh sách chi tiết hóa đơn
        const details = await HoaDonChiTietAPI.getHoaDonChiTietByHoaDon(invoiceId);
        console.log("Chi tiết hóa đơn để sửa:", details);
        tempInvoiceDetails = details.map(detail => ({
            sanPham: detail.sanPham,
            gia: detail.gia,
            soLuong: detail.soLuong,
            thanhTien: detail.thanhTien
        }));
        displayInvoiceDetails();
        
        // Hiển thị modal
        const invoiceModal = new bootstrap.Modal(document.getElementById('invoiceModal'));
        invoiceModal.show();
    } catch (error) {
        console.error('Lỗi khi mở hóa đơn để sửa:', error);
        showError('Không thể mở hóa đơn để sửa. Vui lòng thử lại sau.');
    }
}

// Tạo chi tiết hóa đơn mới
async function createInvoiceDetails(invoiceId) {
    try {
        if (!tempInvoiceDetails || tempInvoiceDetails.length === 0) {
            return; // Không có chi tiết để tạo
        }
        
        // Tạo mảng chi tiết hóa đơn để gửi lên API
        const invoiceDetails = tempInvoiceDetails.map(detail => {
            return {
                hoaDon: { idHoaDon: invoiceId },
                sanPham: { idSanPham: detail.sanPham.idSanPham },
                gia: detail.gia,
                soLuong: detail.soLuong,
                thanhTien: detail.thanhTien
            };
        });
        
        // Gọi API để lưu các chi tiết hóa đơn
        for (const detail of invoiceDetails) {
            await HoaDonChiTietAPI.createHoaDonChiTiet(detail);
        }
        
        // Reset danh sách chi tiết tạm
        tempInvoiceDetails = [];
        
    } catch (error) {
        console.error('Lỗi khi tạo chi tiết hóa đơn:', error);
        throw error;
    }
}

// Cập nhật chi tiết hóa đơn
async function updateInvoiceDetails(invoiceId) {
    try {
        // Xóa chi tiết hóa đơn cũ
        await HoaDonChiTietAPI.deleteHoaDonChiTietByHoaDon(invoiceId);
        
        // Tạo chi tiết mới
        await createInvoiceDetails(invoiceId);
        
    } catch (error) {
        console.error('Lỗi khi cập nhật chi tiết hóa đơn:', error);
        throw error;
    }
}
