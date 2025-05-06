/**
 * API Service - Các hàm gọi API từ frontend đến backend
 * Hướng dẫn sử dụng:
 * 1. Import file này vào file JS của bạn
 * 2. Sử dụng các hàm cung cấp để gọi API
 */

// URL cơ sở của API - thay đổi nếu server backend chạy ở địa chỉ khác
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Gọi API với phương thức GET
 * @param {string} endpoint - Endpoint của API (phần sau /api/)
 * @param {object} params - Các tham số query (không bắt buộc)
 * @returns {Promise} - Promise chứa dữ liệu trả về từ API
 */
async function fetchGet(endpoint, params = null) {
    let url = `${API_BASE_URL}/${endpoint}`;
    
    // Thêm query params nếu có
    if (params) {
        const queryString = new URLSearchParams(params).toString();
        url = `${url}?${queryString}`;
    }
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Thêm token authorization nếu cần
                // 'Authorization': `Bearer ${getToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

/**
 * Gọi API với phương thức POST
 * @param {string} endpoint - Endpoint của API (phần sau /api/)
 * @param {object} data - Dữ liệu để gửi trong body của request
 * @returns {Promise} - Promise chứa dữ liệu trả về từ API
 */
async function fetchPost(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

/**
 * Gọi API với phương thức PUT
 * @param {string} endpoint - Endpoint của API (phần sau /api/)
 * @param {object} data - Dữ liệu để gửi trong body của request
 * @returns {Promise} - Promise chứa dữ liệu trả về từ API
 */
async function fetchPut(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

/**
 * Gọi API với phương thức DELETE
 * @param {string} endpoint - Endpoint của API (phần sau /api/)
 * @returns {Promise} - Promise chứa dữ liệu trả về từ API
 */
async function fetchDelete(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${getToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Trả về null nếu API DELETE không trả về dữ liệu
        if (response.status === 204) {
            return null;
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

/**
 * Các hàm gọi API cụ thể cho Account
 */
const AccountAPI = {
    // Lấy danh sách tất cả tài khoản
    getAllAccounts: () => fetchGet('accounts'),
    
    // Lấy thông tin tài khoản theo username
    getAccountByUsername: (username) => fetchGet(`accounts/${username}`),
    
    // Tạo tài khoản mới
    createAccount: (accountData) => fetchPost('accounts', accountData),
    
    // Cập nhật thông tin tài khoản
    updateAccount: (username, accountData) => fetchPut(`accounts/${username}`, accountData),
    
    // Xóa tài khoản
    deleteAccount: (username) => fetchDelete(`accounts/${username}`),
    
    // Đăng ký tài khoản khách hàng
    registerCustomer: (registrationData) => fetchPost('accounts/register/customer', registrationData),
    
    // Đăng ký tài khoản nhân viên
    registerStaff: (registrationData) => fetchPost('accounts/register/staff', registrationData),
    
    // Đăng nhập
    login: (username, password) => fetchPost('accounts/login', { username, password })
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
 * Các hàm gọi API cụ thể cho Đăng Ký
 */
const DangKyAPI = {
    // Lấy tất cả đăng ký
    getAllDangKy: () => fetchGet('dangky'),
    
    // Lấy đăng ký theo ID
    getDangKyById: (id) => fetchGet(`dangky/${id}`),
    
    // Tạo đăng ký mới
    createDangKy: (dangKyData) => fetchPost('dangky', dangKyData),
    
    // Cập nhật thông tin đăng ký
    updateDangKy: (id, dangKyData) => fetchPut(`dangky/${id}`, dangKyData),
    
    // Xóa đăng ký
    deleteDangKy: (id) => fetchDelete(`dangky/${id}`)
};

// Export các chức năng gọi API để sử dụng ở các file khác
export {
    fetchGet,
    fetchPost,
    fetchPut,
    fetchDelete,
    AccountAPI,
    GoiDichVuAPI,
    DangKyAPI
};