/**
 * API Service cho ứng dụng GYM-Manager
 * Cung cấp các hàm gọi API để tương tác với backend
 */

// Đường dẫn cơ sở API
const BASE_URL = 'http://localhost:8080/api';

// Biến để kiểm tra và lưu trữ trạng thái kết nối
let lastConnectionStatus = true;
let lastConnectionCheck = 0;

/**
 * Kiểm tra kết nối với server
 * @returns {Promise<boolean>} - Promise với trạng thái kết nối
 */
const checkConnection = async () => {
    // Nếu đã kiểm tra trong vòng 30 giây, không kiểm tra lại
    const now = Date.now();
    if (now - lastConnectionCheck < 30000) {
        return lastConnectionStatus;
    }
    
    try {
        // Sử dụng endpoint sanpham thay vì health để kiểm tra kết nối
        // Vì có thể backend chưa có endpoint health
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${BASE_URL}/sanpham`, {
            method: 'GET',
            signal: controller.signal,
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            }
        });
        
        clearTimeout(timeoutId);
        
        lastConnectionStatus = response.ok;
        lastConnectionCheck = now;
        return response.ok;
    } catch (error) {
        console.error('Lỗi kết nối đến server:', error);
        lastConnectionStatus = false;
        lastConnectionCheck = now;
        return false;
    }
};

/**
 * Hàm fetch chung để xử lý các yêu cầu GET
 * @param {string} endpoint - Điểm cuối API (không bao gồm BASE_URL)
 * @returns {Promise} - Promise với dữ liệu phản hồi
 */
const fetchGet = async (endpoint) => {
    try {
        // Kiểm tra kết nối trước
        const connected = await checkConnection();
        if (!connected) {
            throw new Error('Không thể kết nối đến server. Kiểm tra kết nối mạng hoặc server.');
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây timeout
        
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error: ${response.status} - ${errorText}`);
            throw new Error(`Lỗi từ server: ${response.status}${errorText ? ' - ' + errorText : ''}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        // Kiểm tra nếu là lỗi timeout
        if (error.name === 'AbortError') {
            throw new Error('Yêu cầu đã hết thời gian chờ. Vui lòng thử lại sau.');
        }
        throw error;
    }
};

/**
 * Hàm fetch chung để xử lý các yêu cầu POST
 * @param {string} endpoint - Điểm cuối API (không bao gồm BASE_URL)
 * @param {Object} data - Dữ liệu để gửi trong thân yêu cầu
 * @returns {Promise} - Promise với dữ liệu phản hồi
 */
const fetchPost = async (endpoint, data) => {
    try {
        // Kiểm tra kết nối trước
        const connected = await checkConnection();
        if (!connected) {
            throw new Error('Không thể kết nối đến server. Kiểm tra kết nối mạng hoặc server.');
        }
        
        // Chuẩn bị JSON và kiểm tra kích thước
        const jsonData = JSON.stringify(data);
        const dataSizeMB = new Blob([jsonData]).size / (1024 * 1024);
        
        // Log kích thước để debug
        console.log(`POST request to ${endpoint} - Data size: ${dataSizeMB.toFixed(2)}MB`);
        
        // Cảnh báo hoặc từ chối nếu dữ liệu quá lớn
        if (dataSizeMB > 5) {
            console.error(`Data size too large (${dataSizeMB.toFixed(2)}MB). Consider reducing image size.`);
            throw new Error(`Dữ liệu quá lớn (${dataSizeMB.toFixed(2)}MB). Vui lòng giảm kích thước ảnh.`);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây timeout
        
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: jsonData,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error: ${response.status} - ${errorText}`);
            throw new Error(`Lỗi từ server: ${response.status}${errorText ? ' - ' + errorText : ''}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error);
        // Kiểm tra nếu là lỗi timeout
        if (error.name === 'AbortError') {
            throw new Error('Yêu cầu đã hết thời gian chờ. Vui lòng thử lại sau.');
        }
        throw error;
    }
};

/**
 * Hàm fetch chung để xử lý các yêu cầu PUT
 * @param {string} endpoint - Điểm cuối API (không bao gồm BASE_URL)
 * @param {Object} data - Dữ liệu để gửi trong thân yêu cầu
 * @returns {Promise} - Promise với dữ liệu phản hồi
 */
const fetchPut = async (endpoint, data) => {
    try {
        // Kiểm tra kết nối trước
        const connected = await checkConnection();
        if (!connected) {
            throw new Error('Không thể kết nối đến server. Kiểm tra kết nối mạng hoặc server.');
        }
        
        // Chuẩn bị JSON và kiểm tra kích thước
        const jsonData = JSON.stringify(data);
        const dataSizeMB = new Blob([jsonData]).size / (1024 * 1024);
        
        // Log kích thước để debug
        console.log(`PUT request to ${endpoint} - Data size: ${dataSizeMB.toFixed(2)}MB`);
        
        // Cảnh báo hoặc từ chối nếu dữ liệu quá lớn
        if (dataSizeMB > 5) {
            console.error(`Data size too large (${dataSizeMB.toFixed(2)}MB). Consider reducing image size.`);
            throw new Error(`Dữ liệu quá lớn (${dataSizeMB.toFixed(2)}MB). Vui lòng giảm kích thước ảnh.`);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây timeout
        
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: jsonData,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error: ${response.status} - ${errorText}`);
            throw new Error(`Lỗi từ server: ${response.status}${errorText ? ' - ' + errorText : ''}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error updating ${endpoint}:`, error);
        // Kiểm tra nếu là lỗi timeout
        if (error.name === 'AbortError') {
            throw new Error('Yêu cầu đã hết thời gian chờ. Vui lòng thử lại sau.');
        }
        throw error;
    }
};

/**
 * Hàm fetch chung để xử lý các yêu cầu DELETE
 * @param {string} endpoint - Điểm cuối API (không bao gồm BASE_URL)
 * @returns {Promise} - Promise với dữ liệu phản hồi
 */
const fetchDelete = async (endpoint) => {
    try {
        // Kiểm tra kết nối trước
        const connected = await checkConnection();
        if (!connected) {
            throw new Error('Không thể kết nối đến server. Kiểm tra kết nối mạng hoặc server.');
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây timeout
        
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Nếu DELETE không trả về dữ liệu, trả về thành công
        if (response.status === 204) {
            return { success: true };
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error deleting ${endpoint}:`, error);
        // Kiểm tra nếu là lỗi timeout
        if (error.name === 'AbortError') {
            throw new Error('Yêu cầu đã hết thời gian chờ. Vui lòng thử lại sau.');
        }
        throw error;
    }
};

/**
 * Lấy header xác thực từ localStorage
 * @returns {string} - Header xác thực
 */
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
};

/**
 * Các hàm gọi API cụ thể cho Hóa Đơn
 */
const HoaDonAPI = {
    // Lấy tất cả hóa đơn
    getAllHoaDon: () => fetchGet('hoadon'),
    
    // Lấy hóa đơn theo ID
    getHoaDonById: (id) => fetchGet(`hoadon/${id}`),
    
    // Lấy hóa đơn theo ID đăng ký
    getHoaDonByDangKy: (idDangKy) => fetchGet(`hoadon/dangky/${idDangKy}`),
    
    // Lấy hóa đơn theo ID nhân viên
    getHoaDonByNhanVien: (idNhanVien) => fetchGet(`hoadon/nhanvien/${idNhanVien}`),
    
    // Tạo hóa đơn mới
    createHoaDon: (hoaDonData) => fetchPost('hoadon', hoaDonData),
    
    // Cập nhật hóa đơn
    updateHoaDon: (id, hoaDonData) => fetchPut(`hoadon/${id}`, hoaDonData),
    
    // Xóa hóa đơn
    deleteHoaDon: (id) => fetchDelete(`hoadon/${id}`),
    
    // Đánh dấu hóa đơn đã thanh toán
    daThanhToan: (id) => fetchPut(`hoadon/${id}/dathanhtoan`, {}),
    
    // Đánh dấu hóa đơn chưa thanh toán
    chuaThanhToan: (id) => fetchPut(`hoadon/${id}/chuathanhtoan`, {}),
    
    // Hoàn thành hóa đơn
    hoanThanhHoaDon: (id) => fetchPut(`hoadon/${id}/hoanthanh`, {}),
    
    // Hủy hóa đơn
    huyHoaDon: (id) => fetchPut(`hoadon/${id}/huy`, {})
};

/**
 * Các hàm gọi API cụ thể cho Hóa Đơn Chi Tiết
 */
const HoaDonChiTietAPI = {
    // Lấy tất cả chi tiết hóa đơn
    getAllHoaDonChiTiet: () => fetchGet('hoadonchitiet'),
    
    // Lấy chi tiết hóa đơn theo ID
    getHoaDonChiTietById: (id) => fetchGet(`hoadonchitiet/${id}`),
    
    // Lấy chi tiết hóa đơn theo ID hóa đơn
    getHoaDonChiTietByHoaDon: (idHoaDon) => fetchGet(`hoadonchitiet/hoadon/${idHoaDon}`),
    
    // Tạo chi tiết hóa đơn mới
    createHoaDonChiTiet: (chiTietData) => fetchPost('hoadonchitiet', chiTietData),
    
    // Cập nhật chi tiết hóa đơn
    updateHoaDonChiTiet: (id, chiTietData) => fetchPut(`hoadonchitiet/${id}`, chiTietData),
    
    // Xóa chi tiết hóa đơn
    deleteHoaDonChiTiet: (id) => fetchDelete(`hoadonchitiet/${id}`)
};

/**
 * Các hàm gọi API cụ thể cho Đăng Ký
 */
const DangKyAPI = {
    // Lấy tất cả đăng ký
    getAllDangKy: () => fetchGet('dangky'),
    
    // Lấy đăng ký theo ID
    getDangKyById: (id) => fetchGet(`dangky/${id}`),
    
    // Lấy đăng ký theo ID khách hàng
    getDangKyByKhachHang: (idKhachHang) => fetchGet(`dangky/khachhang/${idKhachHang}`),
    
    // Tạo đăng ký mới
    createDangKy: (dangKyData) => fetchPost('dangky', dangKyData),
    
    // Cập nhật đăng ký
    updateDangKy: (id, dangKyData) => fetchPut(`dangky/${id}`, dangKyData),
    
    // Xóa đăng ký
    deleteDangKy: (id) => fetchDelete(`dangky/${id}`)
};

/**
 * Các hàm gọi API cụ thể cho Gói Dịch Vụ
 */
const GoiDichVuAPI = {
    // Lấy tất cả gói dịch vụ
    getAllGoiDichVu: () => fetchGet('goidichvu'),
    
    // Lấy gói dịch vụ theo ID
    getGoiDichVuById: (id) => fetchGet(`goidichvu/${id}`),
    
    // Tạo gói dịch vụ mới
    createGoiDichVu: (goiDichVuData) => fetchPost('goidichvu', goiDichVuData),
    
    // Cập nhật gói dịch vụ
    updateGoiDichVu: (id, goiDichVuData) => fetchPut(`goidichvu/${id}`, goiDichVuData),
    
    // Xóa gói dịch vụ
    deleteGoiDichVu: (id) => fetchDelete(`goidichvu/${id}`)
};

/**
 * Các hàm gọi API cụ thể cho Sản Phẩm
 */
const SanPhamAPI = {
    // Lấy tất cả sản phẩm
    getAllSanPham: () => fetchGet('sanpham'),
    
    // Lấy sản phẩm theo ID
    getSanPhamById: (id) => fetchGet(`sanpham/${id}`),
    
    // Tạo sản phẩm mới
    createSanPham: (sanPhamData) => fetchPost('sanpham', sanPhamData),
    
    // Cập nhật sản phẩm
    updateSanPham: (id, sanPhamData) => fetchPut(`sanpham/${id}`, sanPhamData),
    
    // Xóa sản phẩm
    deleteSanPham: (id) => fetchDelete(`sanpham/${id}`),
    
    // Lấy danh mục cho sản phẩm
    getDanhMuc: () => fetchGet('danhmuc'),
    
    // Tạo danh mục mới
    createDanhMuc: (danhMucData) => fetchPost('danhmuc', danhMucData)
};

/**
 * Các hàm gọi API cụ thể cho Nhân Viên
 */
const StaffAPI = {
    // Lấy tất cả nhân viên
    getAllStaff: () => fetchGet('nhanvien'),
    
    // Lấy nhân viên theo ID
    getStaffById: (id) => fetchGet(`nhanvien/${id}`),
    
    // Tạo nhân viên mới
    createStaff: (staffData) => fetchPost('nhanvien', staffData),
    
    // Cập nhật nhân viên
    updateStaff: (id, staffData) => fetchPut(`nhanvien/${id}`, staffData),
    
    // Xóa nhân viên
    deleteStaff: (id) => fetchDelete(`nhanvien/${id}`)
};

/**
 * Các hàm gọi API cụ thể cho Khách Hàng
 */
const KhachHangAPI = {
    // Lấy tất cả khách hàng
    getAllKhachHang: () => fetchGet('khachhang'),
    
    // Lấy khách hàng theo ID
    getKhachHangById: (id) => fetchGet(`khachhang/${id}`),
    
    // Tạo khách hàng mới
    createKhachHang: (khachHangData) => fetchPost('khachhang', khachHangData),
    
    // Cập nhật khách hàng
    updateKhachHang: (id, khachHangData) => fetchPut(`khachhang/${id}`, khachHangData),
    
    // Xóa khách hàng
    deleteKhachHang: (id) => fetchDelete(`khachhang/${id}`)
};

/**
 * Các hàm gọi API cụ thể cho Tài khoản
 */
const AccountAPI = {
    // Lấy tất cả tài khoản
    getAllAccounts: () => fetchGet('accounts'),
    
    // Lấy tài khoản theo tên đăng nhập
    getAccountByUsername: (username) => fetchGet(`accounts/${username}`),
    
    // Tạo tài khoản mới
    createAccount: (accountData) => fetchPost('accounts', accountData),
    
    // Đăng ký tài khoản khách hàng
    registerCustomer: (registrationData) => fetchPost('accounts/register/customer', registrationData),
    
    // Đăng ký tài khoản nhân viên
    registerStaff: (registrationData) => fetchPost('accounts/register/staff', registrationData),
    
    // Đăng nhập
    login: (loginData) => fetchPost('accounts/login', loginData),
    
    // Cập nhật tài khoản
    updateAccount: (username, accountData) => fetchPut(`accounts/${username}`, accountData),
    
    // Xóa tài khoản
    deleteAccount: (username) => fetchDelete(`accounts/${username}`)
};

// Export các modules API
export {
    HoaDonAPI,
    HoaDonChiTietAPI,
    DangKyAPI,
    GoiDichVuAPI,
    SanPhamAPI,
    StaffAPI,
    KhachHangAPI,
    AccountAPI,
    checkConnection
};