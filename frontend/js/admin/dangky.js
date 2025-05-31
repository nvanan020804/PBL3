// Import API functions
import { HoaDonAPI, DangKyAPI } from '../../js/utils/api-service.js';

// Khởi tạo biến toàn cục
let registrations = []; // Mảng lưu danh sách đăng ký
let currentPage = 1; // Trang hiện tại
let itemsPerPage = 10; // Số lượng đăng ký mỗi trang
let totalPages = 1; // Tổng số trang
let currentFilter = 'all'; // Bộ lọc hiện tại
let editMode = false; // Biến kiểm tra đang ở chế độ sửa hay thêm mới
let currentRegistrationId = null; // ID của đăng ký đang được chỉnh sửa

// Đợi DOM được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra người dùng đã đăng nhập là admin chưa
    checkAdminLogin();
    
    // Tải danh sách đăng ký
    loadRegistrations();
    
    // Gắn sự kiện cho các nút
    setupEventListeners();
    
    // Thiết lập ngày mặc định
    document.getElementById('ngayBatDau').valueAsDate = new Date();
});

// Kiểm tra tài khoản đăng nhập có phải admin hay không
function checkAdminLogin() {
    const userRole = localStorage.getItem('userRole');
    console.log('DEBUG: userRole trong checkAdminLogin:', userRole);
    
    if (!userRole || !userRole.toLowerCase().includes('admin')) {
        showError('Bạn không có quyền truy cập trang quản lý đăng ký.');
        setTimeout(() => {
            window.location.href = '../trangchu/index.html';
        }, 2000);
    }
}

// Thiết lập các sự kiện cho các nút
function setupEventListeners() {
    // Sự kiện nút thêm đăng ký mới
    document.getElementById('addRegistrationBtn').addEventListener('click', function() {
        resetForm();
        editMode = false;
        document.getElementById('registrationModalLabel').textContent = 'Thêm đăng ký mới';
        
        // Mở modal thêm mới
        const modal = new bootstrap.Modal(document.getElementById('registrationModal'));
        modal.show();
    });
    
    // Sự kiện nút tìm kiếm khách hàng
    document.getElementById('searchCustomerBtn').addEventListener('click', searchCustomer);
    
    // Sự kiện nút tìm kiếm gói dịch vụ
    document.getElementById('searchPackageBtn').addEventListener('click', searchPackage);
    
    // Sự kiện nút lưu đăng ký
    document.getElementById('saveRegistrationBtn').addEventListener('click', saveRegistration);
    
    // Sự kiện nút xác nhận xóa (chức năng đã bị loại bỏ)
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteRegistration);
    
    // Sự kiện nút xác nhận tạo hóa đơn
    document.getElementById('confirmCreateInvoiceBtn').addEventListener('click', confirmAndCreateInvoice);
    
    // Sự kiện thay đổi trạng thái thanh toán
    const paymentStatusElement = document.getElementById('paymentStatus');
    if (paymentStatusElement) {
        paymentStatusElement.addEventListener('change', validatePaymentStatus);
    }
    
    // Sự kiện nút tìm kiếm đăng ký
    document.getElementById('searchBtn').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchInput').value.trim();
        searchRegistrations(searchTerm);
    });
    
    // Sự kiện nhấn Enter trong ô tìm kiếm
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            searchRegistrations(searchTerm);
        }
    });
    
    // Sự kiện nút làm mới
    document.getElementById('refreshBtn').addEventListener('click', function() {
        document.getElementById('searchInput').value = '';
        currentFilter = 'all';
        loadRegistrations();
    });
    
    // Sự kiện lọc
    document.querySelectorAll('.dropdown-item[data-filter]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            currentFilter = this.getAttribute('data-filter');
            loadRegistrations();
        });
    });
}

// Tải danh sách đăng ký từ API
function loadRegistrations() {
    showLoading(true);
    
    // URL của API
    const apiUrl = 'http://localhost:8080/api/dangky';
    
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Lỗi máy chủ: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // In cấu trúc đầy đủ của dữ liệu nhận được từ API
        console.log("Dữ liệu chi tiết từ API:", JSON.stringify(data, null, 2));
        
        // Lưu danh sách đăng ký gốc
        registrations = data;
        
        // Kiểm tra xem idKhachHang và idGOI được lưu trữ ở đâu
        if (data.length > 0) {
            const firstRegistration = data[0];
            console.log("Phân tích đăng ký đầu tiên:");
            console.log("idDangKy:", firstRegistration.idDangKy);
            
            // Kiểm tra đối tượng khachHang
            if (firstRegistration.khachHang) {
                console.log("Đối tượng khachHang:", firstRegistration.khachHang);
                console.log("idKhachHang từ đối tượng:", firstRegistration.khachHang.idKhachHang);
            } else {
                console.log("Không tìm thấy đối tượng khachHang trong đăng ký");
            }
            
            // Kiểm tra đối tượng goiDichVu
            if (firstRegistration.goiDichVu) {
                console.log("Đối tượng goiDichVu:", firstRegistration.goiDichVu);
                console.log("idGoi từ đối tượng:", firstRegistration.goiDichVu.id);
            } else {
                console.log("Không tìm thấy đối tượng goiDichVu trong đăng ký");
            }
            
            // Kiểm tra các trường JPA riêng lẻ
            console.log("Các trường khác có thể chứa ID:");
            for (const [key, value] of Object.entries(firstRegistration)) {
                if (key.includes("id") || key.includes("Id") || key.includes("ID")) {
                    console.log(`${key}: ${value}`);
                }
            }
        }
        
        // Xử lý từng đăng ký để lấy thông tin chi tiết
        processRegistrationsData();
    })
    .catch(error => {
        console.error('API Error:', error);
        showError('Lỗi khi tải danh sách đăng ký: ' + error.message);
        showLoading(false);
        // Hiển thị dữ liệu mẫu cho việc kiểm thử giao diện
        displaySampleData();
    });
}

// Hàm mới để xử lý dữ liệu đăng ký sau khi tải
async function processRegistrationsData() {
    try {
        for (let i = 0; i < registrations.length; i++) {
            const registration = registrations[i];
            
            console.log(`Phân tích đăng ký ${i+1} (ID ${registration.idDangKy}):`);
            
            // Kiểm tra tất cả các trường có trong đối tượng đăng ký
            console.log("Tất cả các trường trong đối tượng đăng ký:");
            Object.keys(registration).forEach(key => {
                console.log(`- ${key}: ${registration[key]}`);
            });
            
            // Tìm ID khách hàng từ các trường JPA của Hibernate
            let customerId = null;
            let packageId = null;
            
            // Thử lấy ID từ các trường được kế thừa từ JPA
            for (const key in registration) {
                // Tìm ID khách hàng
                if (key === 'idKhachHang' || key === 'khachHang_idKhachHang') {
                    customerId = registration[key];
                    console.log(`Tìm thấy ID khách hàng: ${customerId} từ trường ${key}`);
                }
                
                // Tìm ID gói dịch vụ
                if (key === 'idGOI' || key === 'goiDichVu_id') {
                    packageId = registration[key];
                    console.log(`Tìm thấy ID gói dịch vụ: ${packageId} từ trường ${key}`);
                }
            }
            
            // Nếu không tìm thấy ID từ các trường trực tiếp, hãy gọi API để lấy thông tin chi tiết đăng ký
            if (!customerId || !packageId) {
                console.log(`Không tìm thấy ID trực tiếp, lấy thông tin chi tiết từ API cho đăng ký ${registration.idDangKy}`);
                try {
                    const detailResponse = await fetch(`http://localhost:8080/api/dangky/${registration.idDangKy}`);
                    if (detailResponse.ok) {
                        const detailData = await detailResponse.json();
                        console.log(`Thông tin chi tiết đăng ký ${registration.idDangKy}:`, detailData);
                        
                        // Sao chép các trường bổ sung từ phản hồi chi tiết nếu có
                        for (const key in detailData) {
                            if (!(key in registration)) {
                                registration[key] = detailData[key];
                            }
                        }
                    }
                } catch (detailError) {
                    console.error(`Lỗi khi lấy thông tin chi tiết đăng ký ${registration.idDangKy}:`, detailError);
                }
            }
            
            // Thử lại tìm ID sau khi đã lấy thông tin chi tiết
            if (!customerId) {
                for (const key in registration) {
                    if (key === 'idKhachHang' || key === 'khachHang_idKhachHang') {
                        customerId = registration[key];
                    }
                }
            }
            
            if (!packageId) {
                for (const key in registration) {
                    if (key === 'idGOI' || key === 'goiDichVu_id') {
                        packageId = registration[key];
                    }
                }
            }
            
            // Nếu vẫn không tìm thấy ID, dùng endpoint đặc biệt
            if (!customerId || !packageId) {
                console.log(`Dùng phương pháp SQL để lấy ID cho đăng ký ${registration.idDangKy}`);
                try {
                    const sqlResponse = await fetch(`http://localhost:8080/api/dangky/ids/${registration.idDangKy}`);
                    if (sqlResponse.ok) {
                        const idData = await sqlResponse.json();
                        customerId = idData.idKhachHang;
                        packageId = idData.idGOI;
                        console.log(`Lấy được ID từ SQL: KH=${customerId}, GDV=${packageId}`);
                    }
                } catch (sqlError) {
                    console.error(`Lỗi khi lấy ID từ SQL cho đăng ký ${registration.idDangKy}:`, sqlError);
                }
            }
            
            // Sau khi có ID, lấy thông tin khách hàng và gói dịch vụ
            try {
                // Lấy thông tin khách hàng nếu có ID
                if (customerId) {
                    console.log(`Lấy thông tin khách hàng với ID ${customerId} cho đăng ký ${registration.idDangKy}`);
                    
                    const customerResponse = await fetch(`http://localhost:8080/api/khachhang/${customerId}`);
                    if (customerResponse.ok) {
                        const customerData = await customerResponse.json();
                        registration.khachHangInfo = customerData;
                        console.log(`Thông tin khách hàng cho đăng ký ${registration.idDangKy}:`, customerData);
                    } else {
                        console.error(`Không thể lấy thông tin khách hàng ID ${customerId}`);
                    }
                }
                
                // Lấy thông tin gói dịch vụ nếu có ID
                if (packageId) {
                    console.log(`Lấy thông tin gói dịch vụ với ID ${packageId} cho đăng ký ${registration.idDangKy}`);
                    
                    const packageResponse = await fetch(`http://localhost:8080/api/goidichvu/${packageId}`);
                    if (packageResponse.ok) {
                        const packageData = await packageResponse.json();
                        registration.goiDichVuInfo = packageData;
                        console.log(`Thông tin gói dịch vụ cho đăng ký ${registration.idDangKy}:`, packageData);
                    } else {
                        console.error(`Không thể lấy thông tin gói dịch vụ ID ${packageId}`);
                    }
                }
            } catch (error) {
                console.error(`Lỗi khi xử lý thông tin đăng ký ${registration.idDangKy}:`, error);
            }
        }
    } catch (error) {
        console.error("Lỗi khi xử lý dữ liệu đăng ký:", error);
    } finally {
        // Hiển thị dữ liệu đã xử lý
        filterRegistrations();
        showLoading(false);
    }
}



// Lọc đăng ký theo trạng thái (tất cả, đang hoạt động, hết hạn, chưa kích hoạt)
function filterRegistrations() {
    let filteredRegistrations = getFilteredRegistrations();
    
    // Cập nhật tổng số trang
    totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
    
    // Đảm bảo trang hiện tại không vượt quá tổng số trang
    if (currentPage > totalPages) {
        currentPage = totalPages === 0 ? 1 : totalPages;
    }
    
    // Phân trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRegistrations = filteredRegistrations.slice(startIndex, endIndex);
    
    // Hiển thị đăng ký
    displayRegistrations(paginatedRegistrations);
    
    // Cập nhật phân trang
    updatePagination();
}

// Hàm helper để lấy danh sách đăng ký đã lọc theo trạng thái hiện tại
function getFilteredRegistrations() {
    let filteredRegistrations = [...registrations];
    
    if (currentFilter === 'active') {
        filteredRegistrations = filteredRegistrations.filter(registration => 
            registration.trangThai === 'Đang hoạt động'
        );
    } else if (currentFilter === 'inactive') {
        filteredRegistrations = filteredRegistrations.filter(registration => 
            registration.trangThai === 'Hết hạn'
        );
    } else if (currentFilter === 'pending') {
        filteredRegistrations = filteredRegistrations.filter(registration => 
            registration.trangThai === 'Chờ kích hoạt'
        );
    }
    
    return filteredRegistrations;
}

// Hiển thị danh sách đăng ký
function displayRegistrations(registrationsToDisplay) {
    const tableBody = document.getElementById('registrationsTableBody');
    tableBody.innerHTML = '';
    
    if (registrationsToDisplay.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="8" class="text-center py-3">Không có dữ liệu đăng ký</td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    console.log("Đang hiển thị đăng ký:", registrationsToDisplay);
    
    // Format ngày tháng
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('vi-VN');
    };

    registrationsToDisplay.forEach((registration, index) => {
        const row = document.createElement('tr');
        const startIndex = (currentPage - 1) * itemsPerPage;
        
        // Lấy thông tin khách hàng từ đối tượng khachHangInfo nếu có
        let tenKhachHang = 'N/A';
        const khachHangInfo = registration.khachHangInfo;
        if (khachHangInfo && khachHangInfo.tenKhachHang) {
            tenKhachHang = khachHangInfo.tenKhachHang;
        }
        
        // Lấy thông tin gói dịch vụ từ đối tượng goiDichVuInfo nếu có
        let tenGoi = 'N/A';
        let giaTien = 'N/A';
        let thoiHan = 0;
        
        const goiDichVuInfo = registration.goiDichVuInfo;
        if (goiDichVuInfo) {
            tenGoi = goiDichVuInfo.tenGoi || 'N/A';
            giaTien = goiDichVuInfo.gia !== undefined ? formatCurrency(goiDichVuInfo.gia) : 'N/A';
            thoiHan = goiDichVuInfo.thoiHan || 0;
        }
        
        // Xử lý ngày bắt đầu và ngày kết thúc
        let startDateStr = 'N/A';
        let endDateStr = 'N/A';
        
        if (registration.ngayBatDau) {
            const startDate = new Date(registration.ngayBatDau);
            startDateStr = formatDate(startDate);
        }
        
        // Sử dụng trường ngayKetThuc từ API thay vì tự tính
        if (registration.ngayKetThuc) {
            const endDate = new Date(registration.ngayKetThuc);
            endDateStr = formatDate(endDate);
        } else if (thoiHan > 0 && registration.ngayBatDau) {
            // Fallback nếu API không trả về ngayKetThuc
            const startDate = new Date(registration.ngayBatDau);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + thoiHan);
            endDateStr = formatDate(endDate);
        }
        
        // Xử lý giờ tập
        let gioTapStr = registration.gioTap || 'N/A';
        if (typeof registration.gioTap === 'number') {
            gioTapStr = `${registration.gioTap}:00`;
        }
        
        // Xử lý trạng thái
        const trangThai = registration.trangThai || 'Đang hoạt động';
        
        // Xác định badge class dựa trên trạng thái
        let badgeClass = 'badge-pending';
        if (trangThai === 'Đang hoạt động') {
            badgeClass = 'badge-active';
        } else if (trangThai === 'Hết hạn') {
            badgeClass = 'badge-inactive';
        }
        
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${tenKhachHang}</td>
            <td>${tenGoi}</td>
            <td>${giaTien}</td>
            <td>${startDateStr}</td>
            <td>${endDateStr}</td>
            <td>${gioTapStr}</td>
            <td>
                <span class="badge ${badgeClass}">
                    ${trangThai}
                </span>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Gắn sự kiện cho các nút sửa và xóa
    attachActionButtonEvents();
}

// Gắn sự kiện cho hàng của bảng để truy cập chi tiết đăng ký
function attachActionButtonEvents() {
    // Đã loại bỏ các nút hành động và thay thế bằng tính năng nhấp vào hàng
    // Gắn sự kiện cho các hàng trong bảng đăng ký
    document.querySelectorAll('#registrationsTableBody tr').forEach(row => {
        row.style.cursor = 'pointer'; // Thêm con trỏ để hiển thị rằng có thể nhấp
        
        // Khi nhấp vào hàng sẽ mở modal hóa đơn để xem chi tiết
        row.addEventListener('click', function() {
            // Lấy chỉ mục của hàng trong trang hiện tại
            const rowIndex = Array.from(this.parentNode.children).indexOf(this);
            // Tính chỉ mục thực của đăng ký trong danh sách đã lọc
            const startIndex = (currentPage - 1) * itemsPerPage;
            const registrationIndex = startIndex + rowIndex;
            
            // Lấy đăng ký tương ứng
            const filteredRegistrations = getFilteredRegistrations();
            if (filteredRegistrations[registrationIndex]) {
                const registrationId = filteredRegistrations[registrationIndex].idDangKy;
                viewRegistrationInvoices(registrationId);
            }
        });
    });
}

// Hiển thị các hóa đơn của một đăng ký
async function viewRegistrationInvoices(registrationId) {
    try {
        showLoading(true);
        
        // Lấy thông tin chi tiết của đăng ký
        const registration = await getRegistrationById(registrationId);
        if (!registration) {
            showError('Không thể tải thông tin đăng ký');
            return;
        }
        
        // Hiển thị thông tin khách hàng
        displayInvoiceCustomerInfo(registration);
        
        // Hiển thị thông tin gói dịch vụ
        displayInvoicePackageInfo(registration);
        
        // Lấy danh sách hóa đơn của đăng ký
        const invoices = await HoaDonAPI.getHoaDonByDangKy(registrationId);
        
        // Hiển thị danh sách hóa đơn
        displayInvoiceList(invoices);
        
        // Lưu registrationId để sử dụng khi cần tạo hóa đơn mới
        document.getElementById('createInvoiceBtn').setAttribute('data-id', registrationId);
        
        // Gắn sự kiện cho nút tạo hóa đơn mới
        document.getElementById('createInvoiceBtn').addEventListener('click', function() {
            const regId = this.getAttribute('data-id');
            createNewInvoiceForRegistration(regId);
        });
        
        // Hiển thị modal
        const invoiceModal = new bootstrap.Modal(document.getElementById('invoiceModal'));
        invoiceModal.show();
    } catch (error) {
        console.error('Lỗi khi tải hóa đơn đăng ký:', error);
        showError('Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.');
    } finally {
        showLoading(false);
    }
}

// Lấy thông tin chi tiết của một đăng ký theo ID
async function getRegistrationById(registrationId) {
    try {
        const response = await fetch(`http://localhost:8080/api/dangky/${registrationId}`);
        if (!response.ok) {
            throw new Error('Không thể tải thông tin đăng ký');
        }
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy thông tin đăng ký:', error);
        return null;
    }
}

// Hiển thị thông tin khách hàng trong modal hóa đơn
function displayInvoiceCustomerInfo(registration) {
    const customerInfo = document.getElementById('invoiceCustomerInfo');
    if (!registration.khachHang) {
        customerInfo.innerHTML = '<p class="text-muted">Không có thông tin khách hàng</p>';
        return;
    }
    
    customerInfo.innerHTML = `
        <dl class="row mb-0">
            <dt class="col-sm-4">Tên khách hàng:</dt>
            <dd class="col-sm-8">${registration.khachHang.ho} ${registration.khachHang.ten}</dd>
            
            <dt class="col-sm-4">Số điện thoại:</dt>
            <dd class="col-sm-8">${registration.khachHang.soDienThoai || 'N/A'}</dd>
            
            <dt class="col-sm-4">Email:</dt>
            <dd class="col-sm-8">${registration.khachHang.email || 'N/A'}</dd>
        </dl>
    `;
}

// Hiển thị thông tin gói dịch vụ trong modal hóa đơn
function displayInvoicePackageInfo(registration) {
    const packageInfo = document.getElementById('invoicePackageInfo');
    if (!registration.goiDichVu) {
        packageInfo.innerHTML = '<p class="text-muted">Không có thông tin gói dịch vụ</p>';
        return;
    }
    
    // Lấy thời gian từ thoiHan hoặc thoiGian
    let thoiGian = registration.goiDichVu.thoiHan || registration.goiDichVu.thoiGian;
    
    // Log giá trị gốc để debug
    console.log('Modal hóa đơn - Giá trị thời hạn gói:', {
        thoiHan: registration.goiDichVu.thoiHan,
        thoiGian: registration.goiDichVu.thoiGian,
        rawValue: thoiGian,
        typeOf: typeof thoiGian
    });
    
    // Đảm bảo thoiGian là hợp lệ
    thoiGian = thoiGian !== undefined && thoiGian !== null ? Number(thoiGian) : 0;
    if (isNaN(thoiGian)) {
        thoiGian = 0;
        console.log('Không thể lấy thời hạn gói cho hiển thị, sử dụng giá trị mặc định.');
    }
    
    // Đảm bảo hiển thị định dạng thời gian phù hợp
    const displayDuration = thoiGian && !isNaN(thoiGian) && thoiGian > 0 
        ? `${thoiGian} tháng` 
        : 'Không xác định';
    
    packageInfo.innerHTML = `
        <dl class="row mb-0">
            <dt class="col-sm-4">Tên gói:</dt>
            <dd class="col-sm-8">${registration.goiDichVu.tenGoi}</dd>
            
            <dt class="col-sm-4">Giá:</dt>
            <dd class="col-sm-8">${formatCurrency(registration.goiDichVu.gia)}</dd>
            
            <dt class="col-sm-4">Thời hạn:</dt>
            <dd class="col-sm-8">${displayDuration}</dd>
        </dl>
    `;
}

// Hiển thị danh sách hóa đơn
function displayInvoiceList(invoices) {
    const tableBody = document.getElementById('invoiceTableBody');
    const noInvoicesElement = document.getElementById('noInvoices');
    
    tableBody.innerHTML = '';
    
    if (!invoices || invoices.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Không có hóa đơn</td></tr>';
        noInvoicesElement.classList.remove('d-none');
        return;
    }
    
    noInvoicesElement.classList.add('d-none');
    
    invoices.forEach(invoice => {
        const row = document.createElement('tr');
        
        // Xác định class cho trạng thái
        const statusClass = getStatusClass(invoice.trangThai);
        const paymentStatusClass = getPaymentStatusClass(invoice.trangThaiThanhToan);
        
        row.innerHTML = `
            <td>${invoice.idHoaDon}</td>
            <td>${formatDate(invoice.thoiGianTao)}</td>
            <td>${formatCurrency(invoice.tongTien)}</td>
            <td><span class="badge ${statusClass}">${invoice.trangThai}</span></td>
            <td><span class="badge ${paymentStatusClass}">${invoice.trangThaiThanhToan}</span></td>
            <td>
                <button class="btn btn-sm btn-info view-invoice-btn" data-id="${invoice.idHoaDon}">
                    <i class="fas fa-eye"></i> Xem
                </button>
                ${invoice.trangThaiThanhToan !== 'Đã thanh toán' ? 
                    `<button class="btn btn-sm btn-success mark-paid-btn" data-id="${invoice.idHoaDon}">
                        <i class="fas fa-check"></i> Đã thanh toán
                    </button>` : ''}
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Gắn sự kiện cho các nút
    attachInvoiceButtonEvents();
}

// Gắn sự kiện cho các nút trong danh sách hóa đơn
function attachInvoiceButtonEvents() {
    // Nút xem chi tiết hóa đơn
    document.querySelectorAll('.view-invoice-btn').forEach(button => {
        button.addEventListener('click', function() {
            const invoiceId = this.getAttribute('data-id');
            viewInvoiceDetails(invoiceId);
        });
    });
    
    // Nút đánh dấu đã thanh toán
    document.querySelectorAll('.mark-paid-btn').forEach(button => {
        button.addEventListener('click', function() {
            const invoiceId = this.getAttribute('data-id');
            markInvoiceAsPaid(invoiceId);
        });
    });
}

// Mở trang hóa đơn để xem chi tiết hóa đơn
function viewInvoiceDetails(invoiceId) {
    // Đóng modal hiện tại
    bootstrap.Modal.getInstance(document.getElementById('invoiceModal')).hide();
    
    // Chuyển hướng đến trang hóa đơn với ID cụ thể
    window.location.href = `hoadon.html?id=${invoiceId}`;
}

// Đánh dấu hóa đơn đã thanh toán
async function markInvoiceAsPaid(invoiceId) {
    try {
        showLoading(true);
        
        // Lấy thông tin hóa đơn trước để biết idDangKy
        const invoice = await HoaDonAPI.getHoaDonById(invoiceId);
        
        // Gọi API đánh dấu đã thanh toán
        await HoaDonAPI.daThanhToan(invoiceId);
        
        // Cập nhật trạng thái hoàn thành luôn
        await HoaDonAPI.hoanThanhHoaDon(invoiceId);
        
        // Hiển thị thông báo
        showInvoiceSuccess('Đánh dấu đã thanh toán và hoàn thành thành công.');
        
        // Tải lại danh sách hóa đơn của đăng ký hiện tại
        const registrationId = document.getElementById('createInvoiceBtn').getAttribute('data-id');
        const invoices = await HoaDonAPI.getHoaDonByDangKy(registrationId);
        
        // Hiển thị lại danh sách hóa đơn
        displayInvoiceList(invoices);
        
        // Kích hoạt đăng ký nếu có ID đăng ký
        if (invoice && invoice.idDangKy) {
            try {
                // Sử dụng API đã định nghĩa để cập nhật trạng thái đăng ký
                await DangKyAPI.updateDangKyStatus(invoice.idDangKy, {
                    trangThai: 'Đang hoạt động'
                });
                
                console.log('Đã cập nhật trạng thái đăng ký thành "Đang hoạt động"');
                showInvoiceSuccess('Hóa đơn đã thanh toán và đăng ký đã được kích hoạt thành công!');
                
                // Reload đăng ký để cập nhật trạng thái mới
                setTimeout(() => {
                    loadRegistrations();
                }, 1000);
            } catch (updateError) {
                console.error('Lỗi khi cập nhật trạng thái đăng ký:', updateError);
                showInvoiceError('Đã thanh toán hóa đơn nhưng không thể kích hoạt đăng ký. Hãy thử lại sau.');
            }
        }
    } catch (error) {
        console.error('Lỗi khi đánh dấu đã thanh toán:', error);
        showInvoiceError('Không thể đánh dấu đã thanh toán. Vui lòng thử lại sau.');
    } finally {
        showLoading(false);
    }
}

// Tạo hóa đơn mới cho đăng ký
async function createNewInvoiceForRegistration(registrationId) {
    try {
        showLoading(true);
        
        // Lấy thông tin đăng ký
        const registration = await getRegistrationById(registrationId);
        if (!registration) {
            showInvoiceError('Không thể tải thông tin đăng ký');
            return;
        }
        
        // Lấy giá của gói dịch vụ
        const price = registration.goiDichVu?.gia || 0;
        
        // Tạo đối tượng dữ liệu hóa đơn
        const invoiceData = {
            dangKy: {
                idDangKy: registrationId
            },
            tongTien: price,
            giamGia: 0,
            thanhToan: price,
            phuongThuc: 'tienmat',
            trangThai: 'Chờ xử lý',
            trangThaiThanhToan: 'Chưa thanh toán',
            thoiGianTao: new Date().toISOString()
        };
        
        // Gọi API tạo hóa đơn
        await HoaDonAPI.createHoaDon(invoiceData);
        
        // Hiển thị thông báo thành công
        showInvoiceSuccess('Tạo hóa đơn mới thành công.');
        
        // Tải lại danh sách hóa đơn
        const invoices = await HoaDonAPI.getHoaDonByDangKy(registrationId);
        
        // Hiển thị lại danh sách hóa đơn
        displayInvoiceList(invoices);
    } catch (error) {
        console.error('Lỗi khi tạo hóa đơn mới:', error);
        showInvoiceError('Không thể tạo hóa đơn mới. Vui lòng thử lại sau.');
    } finally {
        showLoading(false);
    }
}

// Hiển thị thông báo lỗi trong modal hóa đơn
function showInvoiceError(message) {
    const alertElement = document.getElementById('invoiceAlertMessage');
    alertElement.className = 'alert alert-danger alert-dismissible fade show';
    alertElement.innerHTML = `
        <i class="fas fa-exclamation-circle me-2"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertElement.classList.remove('d-none');
}

// Hiển thị thông báo thành công trong modal hóa đơn
function showInvoiceSuccess(message) {
    const alertElement = document.getElementById('invoiceAlertMessage');
    alertElement.className = 'alert alert-success alert-dismissible fade show';
    alertElement.innerHTML = `
        <i class="fas fa-check-circle me-2"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertElement.classList.remove('d-none');
}

// Lấy class cho trạng thái
function getStatusClass(status) {
    switch (status) {
        case 'Chờ xử lý':
            return 'bg-warning';
        case 'Hoàn thành':
            return 'bg-success';
        case 'Hủy':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Lấy class cho trạng thái thanh toán
function getPaymentStatusClass(status) {
    switch (status) {
        case 'Đã thanh toán':
            return 'bg-success';
        case 'Chưa thanh toán':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Tìm kiếm khách hàng theo tên đăng nhập
function searchCustomer() {
    const username = document.getElementById('tenDangNhap').value.trim();
    
    if (!username) {
        showFormError('Vui lòng nhập tên đăng nhập khách hàng!');
        return;
    }
    
    showLoading(true);
    
    console.log('DEBUG: Đang tìm kiếm khách hàng với username:', username);
    
    // URL của API search khách hàng theo tên đăng nhập
    const apiUrl = `http://localhost:8080/api/khachhang/search?q=${username}&includeUsername=true`;
    console.log('DEBUG: Sử dụng API URL:', apiUrl);
    
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('DEBUG: Status code từ API search:', response.status);
        
        if (!response.ok) {
            throw new Error('Không thể kết nối đến server');
        }
        return response.json();
    })
    .then(data => {
        console.log('DEBUG: Kết quả tìm kiếm:', JSON.stringify(data, null, 2));
        
        // Kiểm tra xem có tìm thấy khách hàng không
        if (!data || data.length === 0) {
            throw new Error('Không tìm thấy tài khoản khách hàng');
        }
        
        // Lấy thông tin khách hàng đầu tiên từ kết quả
        const customer = data[0];
        
        // Hiển thị thông tin khách hàng
        document.getElementById('customerInfo').innerHTML = `
            <dl class="row mb-0 customer-info-card">
                <dt class="col-sm-4">Tên khách hàng:</dt>
                <dd class="col-sm-8">${customer.tenKhachHang || ''}</dd>
                
                <dt class="col-sm-4">Số điện thoại:</dt>
                <dd class="col-sm-8">${customer.soDienThoai || ''}</dd>
                
                <dt class="col-sm-4">Email:</dt>
                <dd class="col-sm-8">${customer.email || ''}</dd>
                
                <dt class="col-sm-4">CCCD:</dt>
                <dd class="col-sm-8">${customer.cccd || ''}</dd>
                
                <dt class="col-sm-4">Trạng thái:</dt>
                <dd class="col-sm-8">${customer.trangThai || ''}</dd>
            </dl>
        `;
        
        // Lưu ID khách hàng
        document.getElementById('idKhachHang').value = customer.idKhachHang;
        
        showLoading(false);
    })
    .catch(error => {
        console.error('DEBUG: Error during API call:', error);
        showFormError(error.message);
        document.getElementById('customerInfo').innerHTML = '<p class="mb-0 text-danger">Không tìm thấy thông tin khách hàng</p>';
        document.getElementById('idKhachHang').value = '';
        showLoading(false);
    });
}

// Tìm kiếm gói dịch vụ theo tên
function searchPackage() {
    const packageName = document.getElementById('tenGoi').value.trim();
    
    if (!packageName) {
        showFormError('Vui lòng nhập tên gói dịch vụ!');
        return;
    }
    
    showLoading(true);
    
    // URL của API
    const apiUrl = `http://localhost:8080/api/goidichvu/name/${encodeURIComponent(packageName)}`;
    
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Không tìm thấy gói dịch vụ');
        }
        return response.json();
    })
    .then(packageData => {
        // Xử lý thời hạn gói dịch vụ
        let thoiGian = packageData.thoiHan || packageData.thoiGian;
        
        // Log để debug giá trị gốc
        console.log('Tìm kiếm gói - Giá trị thời hạn gói:', {
            thoiHan: packageData.thoiHan,
            thoiGian: packageData.thoiGian,
            rawValue: thoiGian,
            typeOf: typeof thoiGian
        });
        
        // Đảm bảo thoiGian là hợp lệ
        thoiGian = thoiGian !== undefined && thoiGian !== null ? Number(thoiGian) : 0;
        if (isNaN(thoiGian)) {
            thoiGian = 0;
        }
        
        // Định dạng hiển thị thời hạn
        const displayDuration = thoiGian && thoiGian > 0 
            ? `${thoiGian} tháng` 
            : 'Không xác định';
            
        // Hiển thị thông tin gói dịch vụ
        document.getElementById('packageInfo').innerHTML = `
            <dl class="row mb-0 package-info-card">
                <dt class="col-sm-4">Tên gói:</dt>
                <dd class="col-sm-8">${packageData.tenGoi || ''}</dd>
                
                <dt class="col-sm-4">Giá:</dt>
                <dd class="col-sm-8">${formatCurrency(packageData.gia) || ''}</dd>
                
                <dt class="col-sm-4">Thời hạn:</dt>
                <dd class="col-sm-8">${displayDuration}</dd>
                
                <dt class="col-sm-4">Mô tả:</dt>
                <dd class="col-sm-8">${packageData.moTa || ''}</dd>
            </dl>
        `;
        
        // Lưu ID gói dịch vụ
        document.getElementById('idGOI').value = packageData.id;
        
        showLoading(false);
    })
    .catch(error => {
        console.error('Error:', error);
        showFormError(error.message);
        document.getElementById('packageInfo').innerHTML = '<p class="mb-0 text-danger">Không tìm thấy thông tin gói dịch vụ</p>';
        document.getElementById('idGOI').value = '';
        showLoading(false);
    });
}

// Format số tiền thành định dạng tiền tệ VND
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Chỉnh sửa đăng ký
function editRegistration(registrationId) {
    // Tìm đăng ký
    const registration = registrations.find(r => r.idDangKy == registrationId);
    
    if (!registration) {
        console.error(`Không tìm thấy đăng ký với ID ${registrationId}`);
        showError('Không tìm thấy thông tin đăng ký');
        return;
    }
    
    // Đặt chế độ chỉnh sửa
    editMode = true;
    currentRegistrationId = registrationId;
    
    // Cập nhật tiêu đề modal
    document.getElementById('registrationModalLabel').textContent = 'Chỉnh sửa thông tin đăng ký';
    
    // Điền thông tin đăng ký vào form
    document.getElementById('registrationId').value = registration.idDangKy;
    document.getElementById('tenDangNhap').value = '';
    document.getElementById('tenGoi').value = '';
    document.getElementById('idKhachHang').value = registration.khachHang.idKhachHang;
    document.getElementById('idGOI').value = registration.goiDichVu.id;
    document.getElementById('ngayBatDau').value = registration.ngayBatDau;
    document.getElementById('gioTap').value = registration.gioTap;
    document.getElementById('trangThai').value = registration.trangThai;
    
    // Hiển thị thông tin khách hàng
    document.getElementById('customerInfo').innerHTML = `
        <dl class="row mb-0 customer-info-card">
            <dt class="col-sm-4">Tên khách hàng:</dt>
            <dd class="col-sm-8">${registration.khachHang.tenKhachHang || ''}</dd>
            
            <dt class="col-sm-4">Số điện thoại:</dt>
            <dd class="col-sm-8">${registration.khachHang.soDienThoai || ''}</dd>
            
            <dt class="col-sm-4">Email:</dt>
            <dd class="col-sm-8">${registration.khachHang.email || ''}</dd>
            
            <dt class="col-sm-4">CCCD:</dt>
            <dd class="col-sm-8">${registration.khachHang.cccd || ''}</dd>
            
            <dt class="col-sm-4">Trạng thái:</dt>
            <dd class="col-sm-8">${registration.khachHang.trangThai || ''}</dd>
        </dl>
    `;
    
    // Xử lý thời hạn gói dịch vụ
    let thoiGian = registration.goiDichVu.thoiHan || registration.goiDichVu.thoiGian;
    
    // Log để debug giá trị gốc
    console.log('Edit gói - Giá trị thời hạn gói:', {
        thoiHan: registration.goiDichVu.thoiHan,
        thoiGian: registration.goiDichVu.thoiGian,
        rawValue: thoiGian,
        typeOf: typeof thoiGian
    });
    
    // Đảm bảo thoiGian là hợp lệ
    thoiGian = thoiGian !== undefined && thoiGian !== null ? Number(thoiGian) : 0;
    if (isNaN(thoiGian)) {
        thoiGian = 0;
    }
    
    // Định dạng hiển thị thời hạn
    const displayDuration = thoiGian && thoiGian > 0 
        ? `${thoiGian} tháng` 
        : 'Không xác định';
    
    // Hiển thị thông tin gói dịch vụ
    document.getElementById('packageInfo').innerHTML = `
        <dl class="row mb-0 package-info-card">
            <dt class="col-sm-4">Tên gói:</dt>
            <dd class="col-sm-8">${registration.goiDichVu.tenGoi || ''}</dd>
            
            <dt class="col-sm-4">Giá:</dt>
            <dd class="col-sm-8">${formatCurrency(registration.goiDichVu.gia) || ''}</dd>
            
            <dt class="col-sm-4">Thời hạn:</dt>
            <dd class="col-sm-8">${displayDuration}</dd>
            
            <dt class="col-sm-4">Mô tả:</dt>
            <dd class="col-sm-8">${registration.goiDichVu.moTa || ''}</dd>
        </dl>
    `;
    
    // Mở modal chỉnh sửa
    const modal = new bootstrap.Modal(document.getElementById('registrationModal'));
    modal.show();
}

// Hiển thị hộp thoại xác nhận xóa
function showDeleteConfirmation(registrationId, customerName) {
    document.getElementById('deleteCustomerName').textContent = customerName;
    currentRegistrationId = registrationId;
    
    // Xóa thông báo lỗi cũ (nếu có)
    clearDeleteError();
    
    // Hiển thị modal xác nhận
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    deleteModal.show();
}

// Xóa đăng ký - chức năng đã bị loại bỏ
function deleteRegistration() {
    // Xoá thông báo lỗi cũ
    clearDeleteError();
    
    // Hiển thị thông báo trong modal
    showDeleteError("Chức năng xóa đăng ký đã bị vô hiệu hoá theo quy định mới của hệ thống.");
    
    // Không đóng modal để người dùng có thể đọc thông báo
}

// Lưu thông tin đăng ký (thêm mới hoặc cập nhật)
function saveRegistration() {
    // Lấy dữ liệu từ form
    const idKhachHang = document.getElementById('idKhachHang').value;
    const idGOI = document.getElementById('idGOI').value;
    const ngayBatDau = document.getElementById('ngayBatDau').value;
    const gioTap = document.getElementById('gioTap').value;
    const trangThai = document.getElementById('trangThai').value;
    
    // Xóa bất kỳ thông báo lỗi nào trước đó
    clearFormErrors();
    
    // Xác thực dữ liệu
    if (!idKhachHang) {
        showFormError('Vui lòng tìm kiếm và chọn khách hàng!');
        return;
    }
    
    if (!idGOI) {
        showFormError('Vui lòng tìm kiếm và chọn gói dịch vụ!');
        return;
    }
    
    if (!ngayBatDau) {
        showFormError('Vui lòng chọn ngày bắt đầu!');
        return;
    }
    
    // Chuẩn bị dữ liệu - không cần gửi ngày kết thúc vì nó sẽ được tính ở phía server
    const formData = {
        idKhachHang: parseInt(idKhachHang),
        idGOI: parseInt(idGOI),
        ngayBatDau: ngayBatDau,
        gioTap: gioTap,
        // Đảm bảo đăng ký mới luôn có trạng thái "Chờ kích hoạt"
        trangThai: !editMode ? 'Chờ kích hoạt' : trangThai
    };
    
    showLoading(true);
    
    // URL của API
    let apiUrl = 'http://localhost:8080/api/dangky';
    let method = 'POST';
    
    // Nếu đang ở chế độ chỉnh sửa
    if (editMode) {
        apiUrl = `http://localhost:8080/api/dangky/${currentRegistrationId}`;
        method = 'PUT';
    }
    
    console.log(`Gửi request ${method} đến ${apiUrl} với dữ liệu:`, formData);
    
    fetch(apiUrl, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        // Lấy response body để kiểm tra lỗi
        return response.json().then(data => {
            if (!response.ok) {
                // Nếu có thông báo lỗi từ server, sử dụng nó
                if (data && data.message) {
                    throw new Error(data.message);
                }
                // Nếu không có thông báo cụ thể, sử dụng thông báo mặc định
                throw new Error(editMode ? 'Không thể cập nhật đăng ký' : 'Không thể thêm đăng ký mới');
            }
            return data;
        });
    })
    .then(data => {
        // Đóng modal
        bootstrap.Modal.getInstance(document.getElementById('registrationModal')).hide();
        
        // Nếu là thêm mới đăng ký, bắt buộc tạo hóa đơn trước khi hoàn tất
        if (!editMode && data && data.idDangKy) {
            // Hiển thị thông báo trạng thái
            showSuccess('Đăng ký mới đã được tạo với trạng thái "Chờ kích hoạt". Vui lòng tạo và thanh toán hóa đơn để kích hoạt đăng ký.');
            
            // Tạo hóa đơn cho đăng ký mới ngay lập tức
            createInvoiceForRegistration(data);
        } else {
            showSuccess(editMode ? 'Cập nhật thông tin đăng ký thành công!' : 'Thêm đăng ký mới thành công!');
        }
        
        // Cập nhật danh sách đăng ký
        loadRegistrations();
    })
    .catch(error => {
        console.error('Lỗi từ API:', error);
        
        // Hiển thị lỗi TRONG modal
        showFormError(error.message);
    })
    .finally(() => {
        showLoading(false);
    });
}

// Hiển thị modal xác nhận thông tin hóa đơn cho đăng ký mới
async function createInvoiceForRegistration(registration) {
    try {
        console.log('Mở modal xác nhận thông tin hóa đơn cho đăng ký:', registration);
        
        // Luôn lấy thông tin chi tiết đầy đủ của đăng ký từ API để đảm bảo dữ liệu mới nhất
        let detailedRegistration;
        try {
            const response = await fetch(`http://localhost:8080/api/dangky/${registration.idDangKy}`);
            if (response.ok) {
                detailedRegistration = await response.json();
                console.log('Thông tin chi tiết đăng ký:', detailedRegistration);
            } else {
                throw new Error('Không thể lấy thông tin chi tiết đăng ký');
            }
        } catch (error) {
            console.error('Không thể lấy thông tin chi tiết đăng ký:', error);
            // Nếu không lấy được thông tin mới, sử dụng thông tin hiện có
            detailedRegistration = registration;
        }
        
        // Kiểm tra nếu không có thông tin khách hàng, thì lấy thông tin khách hàng từ API
        if (!detailedRegistration.khachHang && !detailedRegistration.khachHangInfo) {
            console.log('Không tìm thấy thông tin khách hàng, sẽ lấy từ API...');
            try {
                const idKhachHang = detailedRegistration.idKhachHang;
                if (idKhachHang) {
                    console.log(`Lấy thông tin khách hàng với ID ${idKhachHang}`);
                    const customerResponse = await fetch(`http://localhost:8080/api/khachhang/${idKhachHang}`);
                    if (customerResponse.ok) {
                        const customerData = await customerResponse.json();
                        detailedRegistration.khachHangInfo = customerData;
                        console.log('Đã lấy được thông tin khách hàng:', customerData);
                    } else {
                        console.error(`Không thể lấy thông tin khách hàng với ID ${idKhachHang}`);
                    }
                } else {
                    console.error('Không tìm thấy ID khách hàng trong đối tượng đăng ký');
                }
            } catch (customerError) {
                console.error('Lỗi khi lấy thông tin khách hàng:', customerError);
            }
        }
        
        // Log để debug
        console.log('Chi tiết thông tin đăng ký trước khi hiển thị:', {
            hasKhachHang: !!detailedRegistration.khachHang,
            hasKhachHangInfo: !!detailedRegistration.khachHangInfo,
            idKhachHang: detailedRegistration.idKhachHang,
            fullObject: detailedRegistration
        });
        
        // Hiển thị thông tin khách hàng
        const customerInfo = document.getElementById('invoiceConfirmCustomerInfo');
        if (detailedRegistration.khachHang) {
            // Xử lý trường hợp thông tin khách hàng có cấu trúc khác nhau
            const ho = detailedRegistration.khachHang.ho || '';
            const ten = detailedRegistration.khachHang.ten || detailedRegistration.khachHang.tenKhachHang || '';
            const tenKhachHang = detailedRegistration.khachHang.tenKhachHang || '';
            const soDienThoai = detailedRegistration.khachHang.soDienThoai || 'N/A';
            const email = detailedRegistration.khachHang.email || 'N/A';
            
            // Ưu tiên sử dụng tenKhachHang nếu có
            let displayName = tenKhachHang;
            if (!displayName && (ho || ten)) {
                displayName = ho ? ho + ' ' + ten : ten;
            }
            
            customerInfo.innerHTML = `
                <dl class="row mb-0">
                    <dt class="col-sm-4">Tên khách hàng:</dt>
                    <dd class="col-sm-8">${displayName || 'N/A'}</dd>
                    
                    <dt class="col-sm-4">Số điện thoại:</dt>
                    <dd class="col-sm-8">${soDienThoai}</dd>
                    
                    <dt class="col-sm-4">Email:</dt>
                    <dd class="col-sm-8">${email}</dd>
                </dl>
            `;
            
            console.log('Hiển thị thông tin khách hàng từ khachHang:', {
                displayName, soDienThoai, email
            });
        } else if (detailedRegistration.khachHangInfo) {
            // Trường hợp sử dụng khachHangInfo (từ processRegistrationsData)
            const ho = detailedRegistration.khachHangInfo.ho || '';
            const ten = detailedRegistration.khachHangInfo.ten || '';
            const tenKhachHang = detailedRegistration.khachHangInfo.tenKhachHang || '';
            const soDienThoai = detailedRegistration.khachHangInfo.soDienThoai || 'N/A';
            const email = detailedRegistration.khachHangInfo.email || 'N/A';
            
            // Ưu tiên sử dụng tenKhachHang nếu có
            let displayName = tenKhachHang;
            if (!displayName && (ho || ten)) {
                displayName = ho ? ho + ' ' + ten : ten;
            }
            
            customerInfo.innerHTML = `
                <dl class="row mb-0">
                    <dt class="col-sm-4">Tên khách hàng:</dt>
                    <dd class="col-sm-8">${displayName || 'N/A'}</dd>
                    
                    <dt class="col-sm-4">Số điện thoại:</dt>
                    <dd class="col-sm-8">${soDienThoai}</dd>
                    
                    <dt class="col-sm-4">Email:</dt>
                    <dd class="col-sm-8">${email}</dd>
                </dl>
            `;
            
            console.log('Hiển thị thông tin khách hàng từ khachHangInfo:', {
                displayName, soDienThoai, email
            });
        } else {
            customerInfo.innerHTML = '<p class="text-muted">Không có thông tin khách hàng</p>';
            console.error('Không tìm thấy thông tin khách hàng trong đối tượng đăng ký:', detailedRegistration);
        }
        
        // Hiển thị thông tin gói dịch vụ
        const packageInfo = document.getElementById('invoiceConfirmPackageInfo');
        
        // Lấy thông tin giá tiền từ registration
        let price = 0;
        let packageName = 'N/A';
        let packageDuration = 0;
        
        if (detailedRegistration.goiDichVu && detailedRegistration.goiDichVu.gia) {
            // Trường hợp có đủ thông tin gói dịch vụ
            price = detailedRegistration.goiDichVu.gia || 0;
            packageName = detailedRegistration.goiDichVu.tenGoi || 'N/A';
            // Đảm bảo packageDuration là số hợp lệ
            // Kiểm tra cả thoiHan và thoiGian (có thể được sử dụng trong API)
            packageDuration = detailedRegistration.goiDichVu.thoiHan || detailedRegistration.goiDichVu.thoiGian;
            
            // Log để debug giá trị gốc
            console.log('Giá trị gốc từ goiDichVu:', {
                thoiHan: detailedRegistration.goiDichVu.thoiHan,
                thoiGian: detailedRegistration.goiDichVu.thoiGian,
                rawValue: packageDuration,
                typeOf: typeof packageDuration
            });
            
            // Đảm bảo packageDuration là một số hợp lệ
            packageDuration = packageDuration !== undefined && packageDuration !== null ? Number(packageDuration) : 0;
            if (isNaN(packageDuration)) {
                packageDuration = 0;
                console.log('Không thể lấy thời hạn gói, sử dụng giá trị mặc định.');
            }
            
            console.log('Thông tin gói từ goiDichVu:', {
                tenGoi: packageName,
                gia: price,
                thoiHan: packageDuration
            });
            
        } else if (detailedRegistration.goiDichVuInfo) {
            // Trường hợp có thông tin trong goiDichVuInfo (từ processRegistrationsData)
            price = detailedRegistration.goiDichVuInfo.gia || 0;
            packageName = detailedRegistration.goiDichVuInfo.tenGoi || 'N/A';
            // Đảm bảo packageDuration là số hợp lệ
            // Kiểm tra cả thoiHan và thoiGian (có thể được sử dụng trong API)
            packageDuration = detailedRegistration.goiDichVuInfo.thoiHan || detailedRegistration.goiDichVuInfo.thoiGian;
            
            // Log để debug giá trị gốc
            console.log('Giá trị gốc từ goiDichVuInfo:', {
                thoiHan: detailedRegistration.goiDichVuInfo.thoiHan,
                thoiGian: detailedRegistration.goiDichVuInfo.thoiGian,
                rawValue: packageDuration,
                typeOf: typeof packageDuration
            });
            
            // Đảm bảo packageDuration là một số hợp lệ
            packageDuration = packageDuration !== undefined && packageDuration !== null ? Number(packageDuration) : 0;
            if (isNaN(packageDuration)) {
                packageDuration = 0;
                console.log('Không thể lấy thời hạn gói từ goiDichVuInfo, sử dụng giá trị mặc định.');
            }
            
            console.log('Thông tin gói từ goiDichVuInfo:', {
                tenGoi: packageName,
                gia: price,
                thoiHan: packageDuration
            });
            
        } else {
            // Nếu không có thông tin gói dịch vụ, gọi API để lấy
            try {
                const idGOI = detailedRegistration.idGOI || detailedRegistration.goiDichVu?.id;
                if (!idGOI) {
                    throw new Error('Không tìm thấy ID gói dịch vụ');
                }
                
                console.log('Lấy thông tin gói dịch vụ từ API với ID:', idGOI);
                
                const packageResponse = await fetch(`http://localhost:8080/api/goidichvu/${idGOI}`);
                if (packageResponse.ok) {
                    const packageData = await packageResponse.json();
                    price = packageData.gia || 0;
                    packageName = packageData.tenGoi || 'N/A';
                    // Đảm bảo packageDuration là số hợp lệ
                    // Kiểm tra cả thoiHan và thoiGian (có thể được sử dụng trong API)
                    packageDuration = packageData.thoiHan || packageData.thoiGian;
                    
                    // Log để debug giá trị gốc
                    console.log('Giá trị gốc từ API packageData:', {
                        thoiHan: packageData.thoiHan,
                        thoiGian: packageData.thoiGian,
                        rawValue: packageDuration,
                        typeOf: typeof packageDuration
                    });
                    
                    // Đảm bảo packageDuration là một số hợp lệ
                    packageDuration = packageDuration !== undefined && packageDuration !== null ? Number(packageDuration) : 0;
                    if (isNaN(packageDuration)) {
                        packageDuration = 0;
                        console.log('Không thể lấy thời hạn gói từ API, sử dụng giá trị mặc định.');
                    }
                    
                    // Ghi log chi tiết để debug
                    console.log('Thông tin chi tiết gói từ API:', {
                        raw: packageData,
                        gia: packageData.gia,
                        tenGoi: packageData.tenGoi,
                        thoiHan: packageData.thoiHan,
                        thoiGian: packageData.thoiGian,
                        finalDuration: packageDuration
                    });
                    
                    console.log('Thông tin gói từ API:', packageData);
                } else {
                    throw new Error('Không thể lấy thông tin gói dịch vụ');
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin gói dịch vụ:', error);
            }
        }
        
        // Hiển thị thông tin gói dịch vụ sau khi đã lấy được dữ liệu
        // Log raw value for debugging
        console.log('Raw packageDuration before processing:', packageDuration, typeof packageDuration);
        
        // Đảm bảo packageDuration không hiển thị undefined
        // Convert to number again to make absolutely sure
        packageDuration = Number(packageDuration);
        const thoiGian = packageDuration; // Giữ tên biến gốc để dễ hiểu
        const displayDuration = thoiGian && !isNaN(thoiGian) && thoiGian > 0 
            ? `${thoiGian} tháng` 
            : 'Không xác định';
            
        console.log('Duration value to display:', {
            packageDuration: thoiGian,
            isValid: thoiGian && !isNaN(thoiGian) && thoiGian > 0,
            displayDuration: displayDuration
        });
            
        packageInfo.innerHTML = `
            <dl class="row mb-0">
                <dt class="col-sm-4">Tên gói:</dt>
                <dd class="col-sm-8">${packageName}</dd>
                
                <dt class="col-sm-4">Giá:</dt>
                <dd class="col-sm-8">${formatCurrency(price)}</dd>
                
                <dt class="col-sm-4">Thời hạn:</dt>
                <dd class="col-sm-8">${displayDuration}</dd>
            </dl>
        `;
        
        // Lưu ID đăng ký để sử dụng khi tạo hóa đơn
        const confirmRegistrationIdElement = document.getElementById('confirmRegistrationId');
        if (confirmRegistrationIdElement) {
            confirmRegistrationIdElement.value = detailedRegistration.idDangKy || '';
            console.log('Đã đặt ID đăng ký vào trường ẩn:', detailedRegistration.idDangKy);
        } else {
            console.error('Không tìm thấy phần tử confirmRegistrationId trong form');
        }
        
        // Log toàn bộ trạng thái form để debug
        console.log('Trạng thái các phần tử trong form:', {
            confirmRegistrationIdElement: document.getElementById('confirmRegistrationId'),
            invoiceStatus: document.getElementById('invoiceStatus'),
            paymentStatus: document.getElementById('paymentStatus'),
            paymentMethod: document.getElementById('paymentMethod')
        });
        
        // Khởi tạo thông báo trạng thái tự động cho hóa đơn
        const paymentStatusElement = document.getElementById('paymentStatus');
        if (paymentStatusElement) {
            // Gắn sự kiện change
            paymentStatusElement.addEventListener('change', validatePaymentStatus);
            // Kích hoạt ngay để hiển thị thông báo phù hợp với lựa chọn ban đầu
            validatePaymentStatus();
        }
        
        // Gắn lại sự kiện cho nút xác nhận
        const confirmBtn = document.getElementById('confirmCreateInvoiceBtn');
        
        // Xóa tất cả event listeners cũ bằng cách sử dụng một bản sao
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        // Gắn sự kiện mới và ghi log để debug
        console.log('Gắn lại sự kiện cho nút xác nhận', newConfirmBtn);
        newConfirmBtn.addEventListener('click', function(event) {
            console.log('Nút xác nhận được nhấp!', event);
            confirmAndCreateInvoice();
        });
        
        // Hiển thị modal xác nhận tạo hóa đơn
        const createInvoiceConfirmModal = new bootstrap.Modal(document.getElementById('createInvoiceConfirmModal'));
        createInvoiceConfirmModal.show();
    } catch (error) {
        console.error('Lỗi khi hiển thị modal xác nhận hóa đơn:', error);
        showError('Không thể tạo hóa đơn cho đăng ký. Vui lòng thử lại sau.');
    }
}

// Xác nhận và tạo hóa đơn mới từ form xác nhận
async function confirmAndCreateInvoice() {
    try {
        console.log('Bắt đầu hàm confirmAndCreateInvoice');
        showLoading(true);
        
        // Lấy thông tin từ form xác nhận
        const registrationIdElement = document.getElementById('confirmRegistrationId');
        console.log('Debug - confirmRegistrationId element:', registrationIdElement);
        
        if (!registrationIdElement) {
            throw new Error('Không tìm thấy phần tử confirmRegistrationId');
        }
        
        const registrationId = registrationIdElement.value;
        console.log('Debug - confirmRegistrationId value:', registrationId);
        
        // Lấy trạng thái thanh toán và tự động xác định trạng thái hóa đơn
        const trangThaiThanhToan = document.getElementById('paymentStatus').value;
        // Quyết định trạng thái hóa đơn dựa vào trạng thái thanh toán
        const trangThai = trangThaiThanhToan === 'Đã thanh toán' ? 'Hoàn thành' : 'Chờ xử lý';
        const phuongThuc = document.getElementById('paymentMethod').value;
        
        console.log('Form values và trạng thái hóa đơn tự động:', { 
            trangThai, 
            trangThaiThanhToan, 
            phuongThuc 
        });
        
        if (!registrationId) {
            throw new Error('Không tìm thấy thông tin đăng ký (ID trống)');
        }
        
        // Lấy thông tin đầy đủ của đăng ký
        const registration = await getRegistrationById(registrationId);
        if (!registration) {
            throw new Error('Không thể tải thông tin đăng ký');
        }
        
        // Lấy giá của gói dịch vụ
        const price = registration.goiDichVu?.gia || 0;
        
        // Tạo đối tượng dữ liệu hóa đơn
        const invoiceData = {
            dangKy: {
                idDangKy: registrationId
            },
            tongTien: price,
            giamGia: 0,
            thanhToan: price,
            phuongThuc: phuongThuc,
            trangThai: trangThai,
            trangThaiThanhToan: trangThaiThanhToan,
            thoiGianTao: new Date().toISOString()
        };
        
        console.log('Dữ liệu hóa đơn sẽ được tạo:', invoiceData);
        
        // Gọi API tạo hóa đơn
        const savedInvoice = await HoaDonAPI.createHoaDon(invoiceData);
        console.log('Đã tạo hóa đơn thành công:', savedInvoice);
        
        // Nếu hóa đơn được hoàn thành và đã thanh toán, cập nhật trạng thái đăng ký thành "Đang hoạt động"
        if (trangThai === 'Hoàn thành' && trangThaiThanhToan === 'Đã thanh toán') {
            try {
                // Sử dụng API đã định nghĩa để cập nhật trạng thái đăng ký
                await DangKyAPI.updateDangKyStatus(registrationId, {
                    trangThai: 'Đang hoạt động'
                });
                
                console.log('Đã cập nhật trạng thái đăng ký thành "Đang hoạt động"');
                showSuccess('Tạo hóa đơn và kích hoạt đăng ký thành công!');
                
                // Reload đăng ký để cập nhật trạng thái mới
                loadRegistrations();
            } catch (updateError) {
                console.error('Lỗi khi cập nhật trạng thái đăng ký:', updateError);
                showSuccess('Tạo hóa đơn thành công nhưng không thể kích hoạt đăng ký!');
            }
        } else {
            // Hiển thị thông báo thành công tạo hóa đơn
            showSuccess('Tạo hóa đơn mới thành công! Đăng ký vẫn ở trạng thái "Chờ kích hoạt" cho đến khi hóa đơn được thanh toán và hoàn thành.');
        }
        
        // Đóng modal xác nhận
        bootstrap.Modal.getInstance(document.getElementById('createInvoiceConfirmModal')).hide();
        
        return savedInvoice;
    } catch (error) {
        console.error('Lỗi khi tạo hóa đơn mới:', error);
        
        // Hiển thị thông báo lỗi trong modal xác nhận
        const alertElement = document.getElementById('invoiceConfirmAlertMessage');
        if (alertElement) {
            alertElement.className = 'alert alert-danger alert-dismissible fade show';
            alertElement.innerHTML = `
                <i class="fas fa-exclamation-circle me-2"></i> ${error.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            alertElement.classList.remove('d-none');
        } else {
            // Fallback nếu không tìm thấy phần tử cảnh báo
            console.error('Không tìm thấy phần tử invoiceConfirmAlertMessage');
            showError('Lỗi khi tạo hóa đơn: ' + error.message);
        }
        
        return null;
    } finally {
        showLoading(false);
    }
}

// Tìm kiếm đăng ký
function searchRegistrations(searchTerm) {
    if (!searchTerm) {
        loadRegistrations();
        return;
    }
    
    showLoading(true);
    
    // Tìm kiếm local
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filteredRegistrations = registrations.filter(registration => 
        (registration.khachHang.tenKhachHang && registration.khachHang.tenKhachHang.toLowerCase().includes(lowerSearchTerm)) ||
        (registration.khachHang.soDienThoai && registration.khachHang.soDienThoai.includes(searchTerm)) ||
        (registration.goiDichVu.tenGoi && registration.goiDichVu.tenGoi.toLowerCase().includes(lowerSearchTerm))
    );
    
    registrations = filteredRegistrations;
    filterRegistrations();
    showLoading(false);
}

// Cập nhật phân trang
function updatePagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    if (totalPages <= 1) {
        return;
    }
    
    // Tạo nút Previous
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
    pagination.appendChild(prevLi);
    
    // Thêm sự kiện cho nút Previous
    if (currentPage > 1) {
        prevLi.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage--;
            filterRegistrations();
        });
    }
    
    // Tạo các nút trang
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Đảm bảo luôn hiển thị ít nhất 5 nút trang (nếu có đủ trang)
    if (totalPages > 5) {
        if (endPage - startPage + 1 < 5) {
            if (currentPage < totalPages / 2) {
                endPage = Math.min(startPage + 4, totalPages);
            } else {
                startPage = Math.max(endPage - 4, 1);
            }
        }
    }
    
    // Tạo các nút số trang
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        // Thêm sự kiện cho nút trang
        li.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage = i;
            filterRegistrations();
        });
        
        pagination.appendChild(li);
    }
    
    // Tạo nút Next
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
    pagination.appendChild(nextLi);
    
    // Thêm sự kiện cho nút Next
    if (currentPage < totalPages) {
        nextLi.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage++;
            filterRegistrations();
        });
    }
}

// Reset form thêm/sửa đăng ký
function resetForm() {
    document.getElementById('registrationForm').reset();
    document.getElementById('registrationId').value = '';
    document.getElementById('idKhachHang').value = '';
    document.getElementById('idGOI').value = '';
    document.getElementById('customerInfo').innerHTML = '<p class="mb-0 text-muted">Thông tin khách hàng sẽ hiển thị ở đây</p>';
    document.getElementById('packageInfo').innerHTML = '<p class="mb-0 text-muted">Thông tin gói dịch vụ sẽ hiển thị ở đây</p>';
    document.getElementById('ngayBatDau').valueAsDate = new Date();
    
    // Đặt trạng thái mặc định là "Chờ kích hoạt" khi tạo mới đăng ký
    if (!editMode) {
        document.getElementById('trangThai').value = 'Chờ kích hoạt';
    }
    
    clearFormErrors();
}

// Hiển thị lỗi trong form modal
function showFormError(message) {
    // Tạo hoặc sử dụng container thông báo lỗi trong modal
    let errorContainer = document.getElementById('form-error-container');
    
    if (!errorContainer) {
        // Nếu chưa có container lỗi, tạo một cái và thêm vào đầu form
        errorContainer = document.createElement('div');
        errorContainer.id = 'form-error-container';
        errorContainer.className = 'alert alert-danger mb-3';
        errorContainer.style.display = 'block';
        
        const form = document.getElementById('registrationForm');
        form.insertBefore(errorContainer, form.firstChild);
    } else {
        // Nếu đã có, hiển thị nó
        errorContainer.style.display = 'block';
    }
    
    errorContainer.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
}

// Xóa thông báo lỗi trong form
function clearFormErrors() {
    const errorContainer = document.getElementById('form-error-container');
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
}

// Hiển thị thông báo lỗi trong modal xóa
function showDeleteError(message) {
    const errorContainer = document.getElementById('delete-error-container');
    const errorMessage = document.getElementById('delete-error-message');
    
    if (errorContainer && errorMessage) {
        errorMessage.textContent = message;
        errorContainer.style.display = 'block';
    }
}

// Xóa thông báo lỗi trong modal xóa
function clearDeleteError() {
    const errorContainer = document.getElementById('delete-error-container');
    
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
}

// Hiển thị/ẩn hiệu ứng loading
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none');
    }
}

// Hiển thị thông báo thành công
function showSuccess(message) {
    const alert = document.getElementById('alertSuccess');
    const alertMessage = document.getElementById('alertSuccessMessage');
    
    alertMessage.textContent = message;
    alert.classList.add('show');
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        alert.classList.remove('show');
    }, 3000);
}

// Hiển thị thông báo lỗi
function showError(message) {
    const alert = document.getElementById('alertError');
    const alertMessage = document.getElementById('alertErrorMessage');
    
    alertMessage.textContent = message;
    alert.classList.add('show');
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}

// Xác thực và hiển thị thông tin về trạng thái hóa đơn khi trạng thái thanh toán thay đổi
function validatePaymentStatus() {
    const paymentStatus = document.getElementById('paymentStatus').value;
    const statusMessage = document.querySelector('.form-text.text-info');
    
    if (statusMessage) {
        if (paymentStatus === 'Đã thanh toán') {
            statusMessage.innerHTML = '<i class="fas fa-info-circle"></i> Trạng thái hóa đơn sẽ được tự động xác định là <strong>"Hoàn thành"</strong> khi thanh toán đã hoàn tất.';
            statusMessage.classList.remove('text-info');
            statusMessage.classList.add('text-success');
        } else {
            statusMessage.innerHTML = '<i class="fas fa-info-circle"></i> Trạng thái hóa đơn sẽ được tự động xác định là <strong>"Chờ xử lý"</strong> khi chưa thanh toán.';
            statusMessage.classList.remove('text-success');
            statusMessage.classList.add('text-info');
        }
    }
}