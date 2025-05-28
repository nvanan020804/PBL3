// Biến chứa đối tượng biểu đồ hiện tại
let currentChart = null;

// Kiểu biểu đồ mặc định là cột
let currentChartType = 'bar';

// Loại thống kê mặc định là theo ngày
let currentStatType = 'day';

// Ngày hiện tại để làm điểm mặc định cho bộ lọc
const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

// Format date thành chuỗi YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format month thành chuỗi YYYY-MM
function formatMonth(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

// Format year thành chuỗi YYYY
function formatYear(date) {
    return `${date.getFullYear()}`;
}

// Khởi tạo các giá trị mặc định cho bộ lọc
function initializeFilters() {
    // Khởi tạo giá trị cho bộ lọc ngày
    document.getElementById('startDate').value = formatDate(firstDayOfMonth);
    document.getElementById('endDate').value = formatDate(lastDayOfMonth);

    // Khởi tạo giá trị cho bộ lọc tháng
    document.getElementById('startMonth').value = formatMonth(new Date(today.getFullYear(), 0, 1));
    document.getElementById('endMonth').value = formatMonth(new Date(today.getFullYear(), 11, 31));

    // Khởi tạo giá trị cho bộ lọc năm
    const startYear = today.getFullYear() - 5;
    const endYear = today.getFullYear();
    document.getElementById('startYear').value = startYear;
    document.getElementById('endYear').value = endYear;

    // Ẩn tất cả các bộ lọc ngoại trừ lọc theo ngày (mặc định)
    document.getElementById('dayFilterSection').style.display = 'block';
    document.getElementById('monthFilterSection').style.display = 'none';
    document.getElementById('yearFilterSection').style.display = 'none';
}

// Hàm vẽ biểu đồ doanh thu
function renderRevenueChart(data, chartType) {
    // Lấy thẻ canvas để vẽ biểu đồ
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Hủy biểu đồ cũ nếu có
    if (currentChart) {
        currentChart.destroy();
    }

    // Chuẩn bị dữ liệu cho biểu đồ
    const labels = data.map(item => item.period);
    const revenueData = data.map(item => item.revenue);
    const invoiceCountData = data.map(item => item.invoiceCount);

    // Định dạng số tiền (VND)
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    });
    
    // Tạo biểu đồ mới
    currentChart = new Chart(ctx, {
        type: chartType || 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: revenueData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }, {
                label: 'Số lượng hóa đơn',
                data: invoiceCountData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                // Sử dụng trục y thứ hai cho số lượng hóa đơn
                yAxisID: 'y1'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Doanh thu (VNĐ)'
                    },
                    ticks: {
                        // Định dạng nhãn trục y là tiền VNĐ
                        callback: function(value) {
                            return formatter.format(value);
                        }
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Số lượng hóa đơn'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.datasetIndex === 0) {
                                label += formatter.format(context.parsed.y);
                            } else {
                                label += context.parsed.y;
                            }
                            return label;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Thống kê doanh thu',
                    font: {
                        size: 20
                    }
                }
            }
        }
    });
    
    // Cập nhật thông tin tổng quan
    updateRevenueSummary(data);
}

// Hàm tạo bảng thống kê doanh thu
function renderRevenueTable(data) {
    // Lấy thẻ table body để hiển thị dữ liệu
    const tableBody = document.getElementById('revenueTableBody');
    tableBody.innerHTML = '';

    // Định dạng số tiền (VND)
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    });

    // Tính tổng doanh thu và số lượng hóa đơn
    let totalRevenue = 0;
    let totalInvoiceCount = 0;

    // Tạo dòng cho mỗi phần tử dữ liệu
    data.forEach((item, index) => {
        totalRevenue += item.revenue;
        totalInvoiceCount += item.invoiceCount;

        const row = document.createElement('tr');
        
        // Thêm thời gian
        const periodCell = document.createElement('td');
        periodCell.textContent = item.period;
        periodCell.style.width = '25%';
        row.appendChild(periodCell);
        
        // Thêm doanh thu - căn phải để số tiền thẳng hàng
        const revenueCell = document.createElement('td');
        revenueCell.textContent = formatter.format(item.revenue);
        revenueCell.classList.add('text-end');
        revenueCell.style.width = '25%';
        row.appendChild(revenueCell);
        
        // Thêm số lượng hóa đơn - căn giữa
        const invoiceCountCell = document.createElement('td');
        invoiceCountCell.textContent = item.invoiceCount;
        invoiceCountCell.classList.add('text-center');
        invoiceCountCell.style.width = '25%';
        row.appendChild(invoiceCountCell);
        
        // Thêm doanh thu trung bình - căn phải
        const avgRevenueCell = document.createElement('td');
        avgRevenueCell.textContent = formatter.format(item.averageRevenue);
        avgRevenueCell.classList.add('text-end');
        avgRevenueCell.style.width = '25%';
        row.appendChild(avgRevenueCell);
        
        tableBody.appendChild(row);
    });

    // Thêm dòng tổng
    const totalRow = document.createElement('tr');
    totalRow.classList.add('table-active', 'fw-bold');
    
    // Ô "Tổng cộng"
    const totalLabelCell = document.createElement('td');
    totalLabelCell.textContent = 'Tổng cộng';
    totalLabelCell.style.width = '25%';
    totalRow.appendChild(totalLabelCell);
    
    // Tổng doanh thu - căn phải
    const totalRevenueCell = document.createElement('td');
    totalRevenueCell.textContent = formatter.format(totalRevenue);
    totalRevenueCell.classList.add('text-end');
    totalRevenueCell.style.width = '25%';
    totalRow.appendChild(totalRevenueCell);
    
    // Tổng số lượng hóa đơn - căn giữa
    const totalInvoiceCountCell = document.createElement('td');
    totalInvoiceCountCell.textContent = totalInvoiceCount;
    totalInvoiceCountCell.classList.add('text-center');
    totalInvoiceCountCell.style.width = '25%';
    totalRow.appendChild(totalInvoiceCountCell);
    
    // Doanh thu trung bình tổng - căn phải
    const totalAvgRevenueCell = document.createElement('td');
    if (totalInvoiceCount > 0) {
        totalAvgRevenueCell.textContent = formatter.format(totalRevenue / totalInvoiceCount);
    } else {
        totalAvgRevenueCell.textContent = formatter.format(0);
    }
    totalAvgRevenueCell.classList.add('text-end');
    totalAvgRevenueCell.style.width = '25%';
    totalRow.appendChild(totalAvgRevenueCell);
    
    tableBody.appendChild(totalRow);
}

// Cập nhật thông tin tổng quan doanh thu
function updateRevenueSummary(data) {
    // Định dạng số tiền (VND)
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    });

    // Tính tổng doanh thu và số lượng hóa đơn
    let totalRevenue = 0;
    let totalInvoiceCount = 0;

    data.forEach((item) => {
        totalRevenue += item.revenue;
        totalInvoiceCount += item.invoiceCount;
    });

    // Tính doanh thu trung bình
    let averageRevenue = 0;
    if (totalInvoiceCount > 0) {
        averageRevenue = totalRevenue / totalInvoiceCount;
    }

    // Cập nhật giao diện
    document.getElementById('totalRevenue').textContent = formatter.format(totalRevenue);
    document.getElementById('totalInvoices').textContent = totalInvoiceCount;
    document.getElementById('averageRevenue').textContent = formatter.format(averageRevenue);
}

// Lấy doanh thu theo ngày
function getRevenueByDay() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Hiển thị loading
    showLoading();
    
    HoaDonAPI.getRevenueByDay(startDate, endDate)
        .then(data => {
            // Ẩn loading
            hideLoading();
            
            // Vẽ biểu đồ với dữ liệu nhận được
            renderRevenueChart(data, currentChartType);
            
            // Tạo bảng thống kê
            renderRevenueTable(data);
            
            // Hiển thị thông báo thành công
            showSuccess("Đã tải dữ liệu doanh thu thành công!");
        })
        .catch(error => {
            // Ẩn loading
            hideLoading();
            
            // Hiển thị thông báo lỗi
            showError("Lỗi khi lấy dữ liệu doanh thu theo ngày: " + error.message);
        });
}

// Lấy doanh thu theo tháng
function getRevenueByMonth() {
    const startMonth = document.getElementById('startMonth').value;
    const endMonth = document.getElementById('endMonth').value;
    
    // Hiển thị loading
    showLoading();
    
    HoaDonAPI.getRevenueByMonth(startMonth, endMonth)
        .then(data => {
            // Ẩn loading
            hideLoading();
            
            // Vẽ biểu đồ với dữ liệu nhận được
            renderRevenueChart(data, currentChartType);
            
            // Tạo bảng thống kê
            renderRevenueTable(data);
            
            // Hiển thị thông báo thành công
            showSuccess("Đã tải dữ liệu doanh thu thành công!");
        })
        .catch(error => {
            // Ẩn loading
            hideLoading();
            
            // Hiển thị thông báo lỗi
            showError("Lỗi khi lấy dữ liệu doanh thu theo tháng: " + error.message);
        });
}

// Lấy doanh thu theo năm
function getRevenueByYear() {
    const startYear = document.getElementById('startYear').value;
    const endYear = document.getElementById('endYear').value;
    
    // Hiển thị loading
    showLoading();
    
    HoaDonAPI.getRevenueByYear(startYear, endYear)
        .then(data => {
            // Ẩn loading
            hideLoading();
            
            // Vẽ biểu đồ với dữ liệu nhận được
            renderRevenueChart(data, currentChartType);
            
            // Tạo bảng thống kê
            renderRevenueTable(data);
            
            // Hiển thị thông báo thành công
            showSuccess("Đã tải dữ liệu doanh thu thành công!");
        })
        .catch(error => {
            // Ẩn loading
            hideLoading();
            
            // Hiển thị thông báo lỗi
            showError("Lỗi khi lấy dữ liệu doanh thu theo năm: " + error.message);
        });
}

// Hàm hiển thị loading
function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('d-none');
}

// Hàm ẩn loading
function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('d-none');
}

// Hàm hiển thị thông báo lỗi
function showError(message) {
    const alertElement = document.getElementById('alertError');
    document.getElementById('alertErrorMessage').textContent = message;
    alertElement.classList.add('show');
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        alertElement.classList.remove('show');
    }, 5000);
}

// Hàm hiển thị thông báo thành công
function showSuccess(message) {
    const alertElement = document.getElementById('alertSuccess');
    document.getElementById('alertSuccessMessage').textContent = message;
    alertElement.classList.add('show');
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        alertElement.classList.remove('show');
    }, 5000);
}

// Hàm xuất biểu đồ ra ảnh PNG
function exportChart() {
    if (currentChart) {
        const link = document.createElement('a');
        link.download = `thong-ke-doanh-thu-${new Date().toISOString().split('T')[0]}.png`;
        link.href = document.getElementById('revenueChart').toDataURL('image/png');
        link.click();
        showSuccess("Đã xuất biểu đồ thành công!");
    } else {
        showError("Không có biểu đồ để xuất");
    }
}

// Hàm chuyển đổi kiểu hiển thị thống kê
function changeStatType(type) {
    currentStatType = type;
    
    // Ẩn tất cả các bộ lọc
    document.getElementById('dayFilterSection').style.display = 'none';
    document.getElementById('monthFilterSection').style.display = 'none';
    document.getElementById('yearFilterSection').style.display = 'none';
    
    // Hiện bộ lọc tương ứng
    document.getElementById(`${type}FilterSection`).style.display = 'block';
    
    // Load dữ liệu thống kê tương ứng
    loadRevenueStats();
}

// Hàm chuyển đổi kiểu biểu đồ
function changeChartType(type) {
    currentChartType = type;
    
    // Load lại biểu đồ với kiểu mới
    if (currentChart) {
        currentChart.destroy();
        HoaDonAPI.getLatestRevenueData()
            .then(data => {
                renderRevenueChart(data, currentChartType);
            })
            .catch(error => {
                showError("Lỗi khi cập nhật kiểu biểu đồ: " + error.message);
            });
    }
}

// Hàm load dữ liệu thống kê theo loại hiện tại
function loadRevenueStats() {
    switch (currentStatType) {
        case 'day':
            getRevenueByDay();
            break;
        case 'month':
            getRevenueByMonth();
            break;
        case 'year':
            getRevenueByYear();
            break;
    }
}

// Hàm khởi tạo các sự kiện
function initializeEvents() {
    // Sự kiện khi nhấn nút áp dụng bộ lọc
    document.getElementById('applyFilterBtn').addEventListener('click', () => {
        loadRevenueStats();
    });
    
    // Sự kiện khi chuyển đổi kiểu thống kê
    document.getElementById('dateRangeType').addEventListener('change', (e) => {
        const type = e.target.value;
        changeStatType(type);
    });
    
    // Sự kiện khi chuyển đổi kiểu biểu đồ
    document.getElementById('chartType').addEventListener('change', (e) => {
        const type = e.target.value;
        changeChartType(type);
    });
    
    // Sự kiện khi nhấn nút xuất biểu đồ
    document.getElementById('downloadChartBtn').addEventListener('click', exportChart);
    
    // Sự kiện khi nhấn nút cập nhật biểu đồ
    document.getElementById('refreshChartBtn').addEventListener('click', () => {
        loadRevenueStats();
    });
}

// Mở rộng cho HoaDonAPI để lưu trữ dữ liệu doanh thu mới nhất
HoaDonAPI.latestRevenueData = null;
HoaDonAPI.getLatestRevenueData = function() {
    return Promise.resolve(this.latestRevenueData || []);
};

// Ghi đè các phương thức gốc để lưu dữ liệu mới nhất
const originalGetRevenueByDay = HoaDonAPI.getRevenueByDay;
HoaDonAPI.getRevenueByDay = function(startDate, endDate) {
    return originalGetRevenueByDay(startDate, endDate).then(data => {
        this.latestRevenueData = data;
        return data;
    });
};

const originalGetRevenueByMonth = HoaDonAPI.getRevenueByMonth;
HoaDonAPI.getRevenueByMonth = function(startMonth, endMonth) {
    return originalGetRevenueByMonth(startMonth, endMonth).then(data => {
        this.latestRevenueData = data;
        return data;
    });
};

const originalGetRevenueByYear = HoaDonAPI.getRevenueByYear;
HoaDonAPI.getRevenueByYear = function(startYear, endYear) {
    return originalGetRevenueByYear(startYear, endYear).then(data => {
        this.latestRevenueData = data;
        return data;
    });
};

// Import phương thức API từ api-service.js 
import { HoaDonAPI } from "../utils/api-service.js";

// Hàm chạy khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo các bộ lọc
    initializeFilters();
    
    // Khởi tạo các sự kiện
    initializeEvents();
    
    // Load dữ liệu thống kê mặc định (theo ngày)
    loadRevenueStats();
});
