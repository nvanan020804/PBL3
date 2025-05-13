// Import API functions
import { SanPhamAPI } from '../../js/utils/api-service.js';

// Khởi tạo biến toàn cục
let products = []; // Mảng lưu danh sách sản phẩm
let categories = []; // Mảng lưu danh sách danh mục
let currentPage = 1; // Trang hiện tại
let itemsPerPage = 9; // Số lượng sản phẩm mỗi trang
let totalPages = 1; // Tổng số trang
let currentFilter = 'all'; // Bộ lọc hiện tại theo danh mục
let currentStockFilter = 'all'; // Bộ lọc hiện tại theo tồn kho
let editMode = false; // Biến kiểm tra đang ở chế độ sửa hay thêm mới
let currentProductId = null; // ID của sản phẩm đang được chỉnh sửa
let viewMode = 'grid'; // Chế độ hiển thị ('grid' hoặc 'table')

// Đợi DOM được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra người dùng đã đăng nhập là admin chưa
    checkAdminLogin();
    
    // Tải danh mục trước, sau đó tải sản phẩm
    loadCategories().then(() => {
        loadProducts();
    }).catch(error => {
        console.error('Lỗi khi khởi tạo trang:', error);
        showError('Có lỗi khi tải dữ liệu, vui lòng tải lại trang.');
    });
    
    // Gắn sự kiện cho các nút
    setupEventListeners();
});

// Kiểm tra tài khoản đăng nhập có phải admin hay không
function checkAdminLogin() {
    const userRole = localStorage.getItem('userRole');
    console.log('User role from localStorage:', userRole);
    
    if (!userRole || (userRole.toUpperCase() !== 'ADMIN' && userRole !== 'admin')) {
        showError('Bạn không có quyền truy cập trang quản lý sản phẩm.');
        setTimeout(() => {
            window.location.href = '../trangchu/index.html';
        }, 2000);
    }
}

// Thiết lập các sự kiện cho các nút
function setupEventListeners() {
    // Sự kiện nút thêm sản phẩm mới
    document.getElementById('addProductBtn').addEventListener('click', function() {
        resetForm();
        editMode = false;
        document.getElementById('productModalLabel').textContent = 'Thêm Sản Phẩm Mới';
        
        // Hiển thị modal
        const productModal = new bootstrap.Modal(document.getElementById('productModal'));
        productModal.show();
    });
    
    // Sự kiện nút thêm danh mục mới
    document.getElementById('addMainCategoryBtn').addEventListener('click', function() {
        // Reset form danh mục
        resetCategoryForm();
        
        // Hiển thị modal danh mục
        const categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));
        categoryModal.show();
    });
    
    // Sự kiện nút lưu danh mục
    document.getElementById('saveCategoryBtn').addEventListener('click', saveCategory);
    
    // Sự kiện nút làm mới
    document.getElementById('refreshBtn').addEventListener('click', function() {
        loadProducts();
    });
    
    // Sự kiện nút tìm kiếm
    document.getElementById('searchBtn').addEventListener('click', function() {
        searchProducts();
    });
    
    // Sự kiện khi nhập trong ô tìm kiếm và nhấn Enter
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    
    // Filter theo danh mục
    document.getElementById('categoryFilter').addEventListener('change', function() {
        currentFilter = this.value;
        currentPage = 1; // Reset về trang đầu tiên khi lọc
        filterAndDisplayProducts();
    });
    
    // Filter theo tồn kho
    document.getElementById('stockFilter').addEventListener('change', function() {
        currentStockFilter = this.value;
        currentPage = 1; // Reset về trang đầu tiên khi lọc
        filterAndDisplayProducts();
    });
    
    // Sự kiện nút lưu sản phẩm
    document.getElementById('saveProductBtn').addEventListener('click', saveProduct);
    
    // Sự kiện nút chỉnh sửa từ modal xem chi tiết
    document.getElementById('editProductFromViewBtn').addEventListener('click', function() {
        // Đóng modal xem chi tiết
        bootstrap.Modal.getInstance(document.getElementById('viewProductModal')).hide();
        
        // Mở modal chỉnh sửa với dữ liệu hiện tại
        editProduct(currentProductId);
    });
}

// Tải danh sách sản phẩm từ API
function loadProducts() {
    showLoading(true);
    
    // URL của API
    SanPhamAPI.getAllSanPham()
        .then(data => {
            console.log('Dữ liệu sản phẩm từ API:', data);
            products = data;
            
            // Bổ sung thông tin danh mục vào mỗi sản phẩm từ danh sách categories đã tải trước
            if (categories && categories.length > 0) {
                products.forEach(product => {
                    if (product.danhMuc && product.danhMuc.idDanhMuc) {
                        const category = categories.find(cat => cat.idDanhMuc === product.danhMuc.idDanhMuc);
                        if (category) {
                            // Đảm bảo thông tin danh mục đầy đủ
                            product.danhMuc.tenDanhMuc = category.tenDanhMuc;
                        }
                    }
                });
            }
            
            filterAndDisplayProducts();
            showLoading(false);
        })
        .catch(error => {
            console.error('Lỗi khi tải danh sách sản phẩm:', error);
            showError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
            showLoading(false);
        });
}

// Tải danh sách danh mục từ API
function loadCategories() {
    showLoading(true);
    
    return new Promise((resolve, reject) => {
        // Sử dụng API service để tải danh mục
        SanPhamAPI.getDanhMuc()
        .then(data => {
            console.log('Dữ liệu danh mục từ API:', data);
            categories = data;
            
            // Cập nhật dropdown danh mục trong filter
            updateCategoryFilter();
            
            // Cập nhật dropdown danh mục trong form
            updateCategoryDropdown();
            
            showLoading(false);
            resolve(data);
        })
        .catch(error => {
            console.error('Lỗi khi tải danh mục sản phẩm:', error);
            showError('Không thể tải danh mục sản phẩm. Vui lòng thử lại sau.');
            showLoading(false);
            reject(error);
        });
    });
}

// Cập nhật dropdown danh mục trong filter
function updateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    // Giữ lại option "Tất cả danh mục"
    categoryFilter.innerHTML = '<option value="all">Tất cả danh mục</option>';
    
    if (categories && categories.length > 0) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.idDanhMuc;
            option.textContent = category.tenDanhMuc;
            categoryFilter.appendChild(option);
        });
    }
}

// Cập nhật dropdown danh mục trong form thêm/sửa sản phẩm
function updateCategoryDropdown() {
    const categoryDropdown = document.getElementById('loaiSanPham');
    // Giữ lại option mặc định
    categoryDropdown.innerHTML = '<option value="">-- Chọn danh mục sản phẩm --</option>';
    
    if (categories && categories.length > 0) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.idDanhMuc;
            option.textContent = category.tenDanhMuc;
            categoryDropdown.appendChild(option);
        });
    }
}

// Lọc và hiển thị sản phẩm
function filterAndDisplayProducts() {
    const filteredProducts = filterProducts();
    displayProducts(filteredProducts);
    renderPagination(filteredProducts.length);
}

// Lọc sản phẩm theo các tiêu chí
function filterProducts() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    
    return products.filter(product => {
        // Lọc theo danh mục - kiểm tra xem danhMuc có tồn tại không
        const danhMucId = product.danhMuc ? product.danhMuc.idDanhMuc : undefined;
        const categoryMatch = currentFilter === 'all' || (danhMucId && danhMucId == currentFilter);
        
        // Lọc theo tồn kho
        let stockMatch = true;
        if (currentStockFilter === 'instock') {
            stockMatch = product.soLuong > 10; // Còn hàng (> 10)
        } else if (currentStockFilter === 'lowstock') {
            stockMatch = product.soLuong > 0 && product.soLuong <= 10; // Sắp hết (1-10)
        } else if (currentStockFilter === 'outofstock') {
            stockMatch = product.soLuong <= 0; // Hết hàng (0)
        }
        
        // Lọc theo từ khóa tìm kiếm
        const searchMatch = searchValue === '' || 
            product.tenSanPham.toLowerCase().includes(searchValue) || 
            (product.congDung && product.congDung.toLowerCase().includes(searchValue));
        
        return categoryMatch && stockMatch && searchMatch;
    });
}

// Hiển thị danh sách sản phẩm (dạng lưới hoặc bảng)
function displayProducts(productsToDisplay) {
    const gridContainer = document.getElementById('productGrid');
    const tableBody = document.getElementById('productTableBody');
    
    // Hiển thị số lượng sản phẩm
    document.getElementById('totalItems').textContent = productsToDisplay.length;
    
    // Phân trang
    const paginatedProducts = paginateProducts(productsToDisplay);
    
    // Hiển thị dạng lưới
    gridContainer.innerHTML = '';
    
    // Hiển thị dạng bảng
    tableBody.innerHTML = '';
    
    if (paginatedProducts.length === 0) {
        gridContainer.innerHTML = '<div class="col-12 text-center py-5"><h4>Không tìm thấy sản phẩm nào</h4></div>';
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Không tìm thấy sản phẩm nào</td></tr>';
        return;
    }
    
    // Tạo các card sản phẩm cho chế độ lưới
    paginatedProducts.forEach(product => {
        // Tạo card sản phẩm
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 mb-4';
        
        let stockStatus, statusClass;
        if (product.soLuong <= 0) {
            stockStatus = 'Hết hàng';
            statusClass = 'status-outofstock';
        } else if (product.soLuong <= 10) {
            stockStatus = 'Sắp hết';
            statusClass = 'status-lowstock';
        } else {
            stockStatus = 'Còn hàng';
            statusClass = 'status-instock';
        }
        
        // Tìm danh mục tương ứng - kiểm tra xem danhMuc có tồn tại không
        const danhMucId = product.danhMuc ? product.danhMuc.idDanhMuc : undefined;
        const category = categories.find(cat => cat.idDanhMuc === danhMucId);
        const categoryName = category ? category.tenDanhMuc : 'Không xác định';
        
        // HTML cho card sản phẩm
        productCard.innerHTML = `
            <div class="card product-card h-100">
                <div class="position-absolute top-0 end-0 m-2">
                    <span class="status-badge ${statusClass}">${stockStatus}</span>
                </div>
                <img src="../../assets/goidichvu/goi1.jpg" 
                    class="card-img-top product-image" alt="${product.tenSanPham}">
                <div class="card-body">
                    <h5 class="card-title product-title">${product.tenSanPham}</h5>
                    <p class="card-text product-category"><strong>Danh mục:</strong> ${categoryName}</p>
                    <p class="card-text product-price"><strong>Giá:</strong> ${formatCurrency(product.gia)}</p>
                    <p class="card-text"><strong>Số lượng:</strong> ${product.soLuong}</p>
                    <p class="card-text product-description">${product.congDung || 'Không có mô tả'}</p>
                </div>
                <div class="card-footer bg-white">
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-sm btn-info view-btn" data-id="${product.idSanPham}">
                            <i class="fas fa-eye"></i> Xem
                        </button>
                        <button class="btn btn-sm btn-primary edit-btn" data-id="${product.idSanPham}">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${product.idSanPham}" data-name="${product.tenSanPham}">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        gridContainer.appendChild(productCard);
        
        // Thêm dòng vào bảng
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.idSanPham}</td>
            <td>
                <img src="../../assets/goidichvu/goi1.jpg" 
                    alt="${product.tenSanPham}" class="img-thumbnail">
            </td>
            <td>${product.tenSanPham}</td>
            <td>${categoryName}</td>
            <td>${formatCurrency(product.gia)}</td>
            <td>
                <span class="badge ${statusClass === 'status-instock' ? 'bg-success' : 
                                    statusClass === 'status-lowstock' ? 'bg-warning' : 'bg-danger'}">
                    ${product.soLuong}
                </span>
            </td>
            <td>${product.congDung ? (product.congDung.length > 50 ? product.congDung.substring(0, 50) + '...' : product.congDung) : 'Không có mô tả'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-info view-btn" data-id="${product.idSanPham}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${product.idSanPham}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${product.idSanPham}" data-name="${product.tenSanPham}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Gắn sự kiện cho các nút trong danh sách sản phẩm
    attachActionButtonEvents();
}

// Gắn sự kiện cho các nút hành động (xem, sửa, xóa)
function attachActionButtonEvents() {
    // Gắn sự kiện cho nút xem chi tiết
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            viewProductDetails(productId);
        });
    });
    
    // Gắn sự kiện cho nút sửa
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            editProduct(productId);
        });
    });
    
    // Gắn sự kiện cho nút xóa
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            showDeleteConfirmation(productId, productName);
        });
    });
}

// Xem chi tiết sản phẩm
function viewProductDetails(productId) {
    showLoading(true);
    
    // Lưu ID sản phẩm hiện tại
    currentProductId = parseInt(productId);
    
    // Tìm thông tin sản phẩm
    SanPhamAPI.getSanPhamById(productId)
        .then(product => {
            console.log('Chi tiết sản phẩm:', product);
            
            // Tìm danh mục tương ứng - kiểm tra xem danhMuc có tồn tại không
            const danhMucId = product.danhMuc ? product.danhMuc.idDanhMuc : undefined;
            const category = categories.find(cat => cat.idDanhMuc === danhMucId);
            const categoryName = category ? category.tenDanhMuc : 'Không xác định';
            
            // Điền thông tin vào modal
            document.getElementById('viewProductId').textContent = product.idSanPham;
            document.getElementById('viewProductName').textContent = product.tenSanPham;
            document.getElementById('viewProductCategory').textContent = categoryName;
            document.getElementById('viewProductPrice').textContent = formatCurrency(product.gia);
            document.getElementById('viewProductQuantity').textContent = product.soLuong;
            document.getElementById('viewProductDescription').textContent = product.congDung || 'Không có mô tả';
            document.getElementById('viewProductImage').src = `../../assets/goidichvu/goi1.jpg`;
            
            // Hiển thị modal
            const viewModal = new bootstrap.Modal(document.getElementById('viewProductModal'));
            viewModal.show();
            
            showLoading(false);
        })
        .catch(error => {
            console.error('Lỗi khi tải chi tiết sản phẩm:', error);
            showError('Không thể tải thông tin chi tiết sản phẩm.');
            showLoading(false);
        });
}

// Chỉnh sửa sản phẩm
function editProduct(productId) {
    showLoading(true);
    
    // Đặt chế độ sửa
    editMode = true;
    currentProductId = parseInt(productId);
    
    // Cập nhật tiêu đề modal
    document.getElementById('productModalLabel').textContent = 'Sửa Thông Tin Sản Phẩm';
    
    // Tìm thông tin sản phẩm
    SanPhamAPI.getSanPhamById(productId)
        .then(product => {
            console.log('Chi tiết sản phẩm cần sửa:', product);
            
            // Điền thông tin vào form
            document.getElementById('tenSanPham').value = product.tenSanPham;
            // Kiểm tra sự tồn tại của product.danhMuc trước khi truy cập idDanhMuc
            document.getElementById('loaiSanPham').value = product.danhMuc ? product.danhMuc.idDanhMuc : '';
            document.getElementById('gia').value = product.gia;
            document.getElementById('soLuong').value = product.soLuong;
            document.getElementById('moTa').value = product.congDung || '';
            
            // Hiển thị modal
            const productModal = new bootstrap.Modal(document.getElementById('productModal'));
            productModal.show();
            
            showLoading(false);
        })
        .catch(error => {
            console.error('Lỗi khi tải chi tiết sản phẩm cần sửa:', error);
            showError('Không thể tải thông tin chi tiết sản phẩm cần sửa.');
            showLoading(false);
        });
}

// Hiển thị hộp thoại xác nhận xóa
function showDeleteConfirmation(productId, productName) {
    // Tạo và hiển thị modal xác nhận xóa
    const modalHtml = `
        <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">Xác nhận xóa</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Bạn có chắc chắn muốn xóa sản phẩm: <strong>${productName}</strong>?</p>
                        <div class="alert alert-danger d-none" id="deleteErrorMessage"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Xóa</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Thêm modal vào body nếu chưa có
    if (!document.getElementById('deleteConfirmModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    } else {
        document.getElementById('deleteConfirmModal').outerHTML = modalHtml;
    }
    
    // Hiển thị modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    deleteModal.show();
    
    // Gắn sự kiện cho nút xóa trong modal
    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        deleteProduct(productId);
    });
}

// Xóa sản phẩm
function deleteProduct(productId) {
    showLoading(true);
    
    clearDeleteError();
    
    SanPhamAPI.deleteSanPham(productId)
        .then(() => {
            // Đóng modal
            bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
            showSuccess('Xóa sản phẩm thành công!');
            
            // Cập nhật danh sách sản phẩm
            loadProducts();
        })
        .catch(error => {
            console.error('Lỗi khi xóa sản phẩm:', error);
            
            // Hiển thị thông báo lỗi trong modal
            showDeleteError(error.message || 'Không thể xóa sản phẩm. Vui lòng thử lại sau.');
            showLoading(false);
        });
}

// Hiển thị thông báo lỗi trong modal xóa
function showDeleteError(message) {
    const errorElement = document.getElementById('deleteErrorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
    }
}

// Xóa thông báo lỗi trong modal xóa
function clearDeleteError() {
    const errorElement = document.getElementById('deleteErrorMessage');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('d-none');
    }
}

// Lưu thông tin sản phẩm (thêm mới hoặc cập nhật)
function saveProduct() {
    // Lấy dữ liệu từ form
    const formData = getProductFormData();
    
    // Validate dữ liệu
    if (!validateProductData(formData)) {
        return;
    }
    
    showLoading(true);
    
    // Nếu đang ở chế độ chỉnh sửa
    if (editMode) {
        SanPhamAPI.updateSanPham(currentProductId, formData)
            .then(response => {
                console.log('Sản phẩm đã được cập nhật:', response);
                
                // Đóng modal
                bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
                
                showSuccess('Cập nhật sản phẩm thành công!');
                
                // Tải lại danh sách sản phẩm
                loadProducts();
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật sản phẩm:', error);
                
                // Kiểm tra nếu lỗi là sản phẩm đã tồn tại
                if (isProductNameExists(error)) {
                    showFormError('Tên sản phẩm đã tồn tại');
                } else {
                    showFormError('Không thể cập nhật sản phẩm. ' + (error.message || ''));
                }
                showLoading(false);
            });
    } else {
        // Thêm mới sản phẩm
        SanPhamAPI.createSanPham(formData)
            .then(response => {
                console.log('Sản phẩm mới đã được tạo:', response);
                
                // Đóng modal
                bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
                
                showSuccess('Thêm sản phẩm mới thành công!');
                
                // Tải lại danh sách sản phẩm
                loadProducts();
            })
            .catch(error => {
                console.error('Lỗi khi thêm sản phẩm:', error);
                if (isProductNameExists(error)) {
                    showFormError('Tên sản phẩm đã tồn tại');
                } else {
                    showFormError('Không thể thêm sản phẩm mới. ' + (error.message || ''));
                }
                showLoading(false);
            });
    }
}

// Lấy dữ liệu từ form sản phẩm
function getProductFormData() {
    const tenSanPham = document.getElementById('tenSanPham').value;
    const idDanhMuc = document.getElementById('loaiSanPham').value;
    const gia = document.getElementById('gia').value;
    const soLuong = document.getElementById('soLuong').value;
    const congDung = document.getElementById('moTa').value;
    
    return {
        tenSanPham: tenSanPham,
        danhMuc: {
            idDanhMuc: parseInt(idDanhMuc)
        },
        gia: parseFloat(gia),
        soLuong: parseInt(soLuong),
        congDung: congDung,
        donViDem: 'cái' // Giá trị mặc định
    };
}

// Validate dữ liệu sản phẩm
function validateProductData(productData) {
    clearFormErrors();
    
    if (!productData.tenSanPham || productData.tenSanPham.trim() === '') {
        showFormError('Vui lòng nhập tên sản phẩm.');
        return false;
    }
    
    if (!productData.danhMuc || !productData.danhMuc.idDanhMuc) {
        showFormError('Vui lòng chọn danh mục sản phẩm.');
        return false;
    }
    
    if (!productData.gia || isNaN(productData.gia) || productData.gia <= 0) {
        showFormError('Giá sản phẩm phải là số dương.');
        return false;
    }
    
    if (!productData.soLuong || isNaN(productData.soLuong) || productData.soLuong < 0) {
        showFormError('Số lượng sản phẩm phải là số không âm.');
        return false;
    }
    
    return true;
}

// Reset form khi thêm mới
function resetForm() {
    // Reset các trường form
    document.getElementById('productForm').reset();
    
    // Xóa thông báo lỗi
    clearFormErrors();
    
    // Reset biến trạng thái
    editMode = false;
    currentProductId = null;
    
    // Reset tiêu đề modal
    document.getElementById('productModalLabel').textContent = 'Thêm Sản Phẩm Mới';
}

// Hiển thị lỗi trong form modal
function showFormError(message) {
    // Tạo thẻ div hiển thị lỗi nếu chưa có
    let errorDiv = document.querySelector('#productModal .modal-body .alert-danger');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        document.querySelector('#productModal .modal-body').prepend(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Xóa thông báo lỗi trong form
function clearFormErrors() {
    const errorDiv = document.querySelector('#productModal .modal-body .alert-danger');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Kiểm tra lỗi sản phẩm trùng tên
function isProductNameExists(error) {
    if (!error || !error.message) return false;
    
    // Kiểm tra nếu lỗi có chứa thông báo về sản phẩm đã tồn tại
    return error.message.includes('Sản phẩm với tên này đã tồn tại');
}

// Tìm kiếm sản phẩm
function searchProducts() {
    currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
    filterAndDisplayProducts();
}

// Phân trang sản phẩm
function paginateProducts(filteredProducts) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
}

// Hiển thị phân trang
function renderPagination(totalItems) {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';
    
    totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        return;
    }
    
    // Nút trang trước
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>`;
    paginationElement.appendChild(prevLi);
    
    if (currentPage > 1) {
        prevLi.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage--;
            filterAndDisplayProducts();
        });
    }
    
    // Các nút số trang
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4 && startPage > 1) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        li.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage = i;
            filterAndDisplayProducts();
        });
        
        paginationElement.appendChild(li);
    }
    
    // Nút trang sau
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>`;
    paginationElement.appendChild(nextLi);
    
    if (currentPage < totalPages) {
        nextLi.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage++;
            filterAndDisplayProducts();
        });
    }
}

// Kiểm tra kết nối với backend
function checkBackendConnection() {
    showLoading(true);
    
    fetch('http://localhost:8080/api/sanpham', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showSuccess('Kết nối đến máy chủ thành công!');
        } else {
            showError(`Không thể kết nối đến máy chủ. Mã lỗi: ${response.status}`);
        }
    })
    .catch(error => {
        showError('Không thể kết nối đến máy chủ: ' + error.message);
    })
    .finally(() => {
        showLoading(false);
    });
}

// Xuất báo cáo sản phẩm
function exportReport() {
    showLoading(true);
    
    // Chuẩn bị dữ liệu cho báo cáo
    try {
        // Tạo bảng tạm thời
        const table = document.createElement('table');
        table.className = 'table table-bordered';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Danh Mục</th>
                    <th>Giá (VNĐ)</th>
                    <th>Số Lượng Tồn</th>
                    <th>Trạng Thái</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        
        const tbody = table.querySelector('tbody');
        
        // Thêm dữ liệu vào bảng
        products.forEach(product => {
            const danhMucId = product.danhMuc ? product.danhMuc.idDanhMuc : undefined;
            const category = categories.find(cat => cat.idDanhMuc === danhMucId);
            const categoryName = category ? category.tenDanhMuc : 'Không xác định';
            
            let stockStatus;
            if (product.soLuong <= 0) {
                stockStatus = 'Hết hàng';
            } else if (product.soLuong <= 10) {
                stockStatus = 'Sắp hết';
            } else {
                stockStatus = 'Còn hàng';
            }
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.idSanPham}</td>
                <td>${product.tenSanPham}</td>
                <td>${categoryName}</td>
                <td>${formatCurrency(product.gia)}</td>
                <td>${product.soLuong}</td>
                <td>${stockStatus}</td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Tạo tải xuống Excel
        const htmlTable = table.outerHTML;
        const uri = 'data:application/vnd.ms-excel;base64,';
        
        // Tạo biểu mẫu Excel cơ bản
        const template = `<html>
            <head>
                <meta charset="UTF-8">
                <style>
                    table, th, td {
                        border: 1px solid black;
                        border-collapse: collapse;
                        padding: 5px;
                    }
                    th {
                        background-color: #f2f2f2;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <h2>Báo Cáo Sản Phẩm - GYM-Manager</h2>
                <p>Ngày xuất báo cáo: ${new Date().toLocaleDateString()}</p>
                ${htmlTable}
            </body>
        </html>`;
        
        // Chuyển đổi sang định dạng tải xuống
        const base64 = (s) => window.btoa(unescape(encodeURIComponent(s)));
        const format = (s, c) => s.replace(/{(\w+)}/g, (m, p) => c[p]);
        
        // Tạo liên kết tải xuống
        const a = document.createElement('a');
        a.href = uri + base64(template);
        a.download = 'bao-cao-san-pham.xls';
        a.click();
        
        showSuccess('Xuất báo cáo thành công!');
    } catch (error) {
        console.error('Lỗi khi xuất báo cáo:', error);
        showError('Không thể xuất báo cáo. Vui lòng thử lại sau.');
    } finally {
        showLoading(false);
    }
}

// Format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Hiển thị thông báo lỗi
function showError(message) {
    const alertBox = document.getElementById('alertMessage');
    alertBox.className = 'alert alert-danger';
    alertBox.textContent = message;
    alertBox.classList.remove('d-none');
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        alertBox.classList.add('d-none');
    }, 5000);
}

// Hiển thị thông báo thành công
function showSuccess(message) {
    const alertBox = document.getElementById('alertMessage');
    alertBox.className = 'alert alert-success';
    alertBox.textContent = message;
    alertBox.classList.remove('d-none');
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        alertBox.classList.add('d-none');
    }, 3000);
}

// Hiển thị loading
function showLoading(show = true) {
    const loadingElements = document.querySelectorAll('.spinner-border');
    if (loadingElements.length === 0) {
        // Tạo loading element nếu chưa có
        const loadingEl = document.createElement('div');
        loadingEl.className = 'spinner-border text-primary position-fixed';
        loadingEl.setAttribute('role', 'status');
        loadingEl.style.cssText = 'top: 50%; left: 50%; z-index: 9999;';
        loadingEl.innerHTML = '<span class="visually-hidden">Đang tải...</span>';
        document.body.appendChild(loadingEl);
    } else {
        loadingElements.forEach(el => {
            el.style.display = show ? 'inline-block' : 'none';
        });
    }
}

// Reset form danh mục
function resetCategoryForm() {
    // Reset form
    document.getElementById('categoryForm').reset();
    
    // Xóa thông báo
    const alertElement = document.getElementById('categoryAlert');
    alertElement.textContent = '';
    alertElement.classList.add('d-none');
    alertElement.classList.remove('alert-success', 'alert-danger');
}

// Hiển thị thông báo trong form danh mục
function showCategoryAlert(message, isSuccess) {
    const alertElement = document.getElementById('categoryAlert');
    alertElement.textContent = message;
    alertElement.classList.remove('d-none');
    
    if (isSuccess) {
        alertElement.classList.remove('alert-danger');
        alertElement.classList.add('alert-success');
    } else {
        alertElement.classList.remove('alert-success');
        alertElement.classList.add('alert-danger');
    }
}

// Lưu danh mục mới
function saveCategory() {
    // Lấy tên danh mục từ form
    const tenDanhMuc = document.getElementById('tenDanhMuc').value.trim();
    
    // Kiểm tra dữ liệu
    if (!tenDanhMuc) {
        showCategoryAlert('Vui lòng nhập tên danh mục', false);
        return;
    }
    
    // Kiểm tra danh mục đã tồn tại chưa
    const existingCategory = categories.find(cat => 
        cat.tenDanhMuc.toLowerCase() === tenDanhMuc.toLowerCase()
    );
    
    if (existingCategory) {
        showCategoryAlert('Danh mục này đã tồn tại', false);
        return;
    }
    
    // Hiển thị loading
    showLoading(true);
    
    // Gọi API để tạo danh mục mới
    SanPhamAPI.createDanhMuc({ tenDanhMuc: tenDanhMuc })
        .then(response => {
            console.log('Danh mục mới đã được tạo:', response);
            showCategoryAlert('Thêm danh mục thành công!', true);
            
            // Tải lại danh mục
            loadCategories().then(() => {
                showLoading(false);
                
                // Timeout ngắn để người dùng thấy thông báo thành công
                setTimeout(() => {
                    // Đóng modal
                    bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
                }, 1000);
            });
        })
        .catch(error => {
            console.error('Lỗi khi thêm danh mục:', error);
            showCategoryAlert('Không thể thêm danh mục. ' + (error.message || ''), false);
            showLoading(false);
        });
}
