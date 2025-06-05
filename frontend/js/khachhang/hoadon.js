// Hàm chuyển đổi mảng thoiGianTao thành chuỗi ngày giờ
function formatDateTime(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length < 6) {
    return "N/A";
  }
  const [year, month, day, hour, minute, second] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Hàm tiện ích
function showLoading() {
  console.log("Showing loading...");
  document.body.insertAdjacentHTML(
    "beforeend",
    '<div id="loading" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">Đang tải...</div>'
  );
}

function hideLoading() {
  console.log("Hiding loading...");
  const loading = document.getElementById("loading");
  if (loading) loading.remove();
}

function showError(message) {
  console.log("Error:", message);
  alert(message);
}

// Tải danh sách hóa đơn theo người dùng đang đăng nhập
async function loadInvoices() {
  try {
    showLoading();

    // Bước 1: Lấy idKhachHang từ API /api/khachhang/profile
    console.log("Fetching user profile...");
    const profileResponse = await fetch(
      "http://127.0.0.1:8080/api/khachhang/profile",
      {
        credentials: "include", // Gửi cookie/session để xác thực
      }
    );
    if (!profileResponse.ok) {
      throw new Error(
        `Lỗi HTTP khi lấy thông tin profile: ${profileResponse.status}`
      );
    }
    const profile = await profileResponse.json();
    const idKhachHang = profile.idKhachHang;
    console.log("idKhachHang:", idKhachHang);

    // Bước 2: Lấy danh sách hóa đơn dựa trên idKhachHang
    console.log("Fetching invoices...");
    const invoicesResponse = await fetch(
      `http://127.0.0.1:8080/api/hoadon/khachhang/${idKhachHang}`,
      {
        credentials: "include", // Gửi cookie/session để xác thực
      }
    );
    if (!invoicesResponse.ok) {
      throw new Error(
        `Lỗi HTTP khi lấy danh sách hóa đơn: ${invoicesResponse.status}`
      );
    }
    const userInvoices = await invoicesResponse.json();
    console.log("User Invoices:", userInvoices);

    // Hiển thị danh sách
    displayInvoices(userInvoices);
    hideLoading();
  } catch (error) {
    console.error("Lỗi khi tải danh sách hóa đơn:", error);
    showError(
      `Không thể tải danh sách hóa đơn. Vui lòng thử lại sau. Lỗi: ${error.message}`
    );
    hideLoading();
  }
}

// Hàm hiển thị danh sách hóa đơn
function displayInvoices(invoices) {
  console.log("Displaying invoices:", invoices);
  const invoiceTableBody = document.getElementById("invoiceTableBody");
  invoiceTableBody.innerHTML = "";

  if (!invoices || invoices.length === 0) {
    invoiceTableBody.innerHTML =
      '<tr><td colspan="6" class="text-center">Không có hóa đơn nào.</td></tr>';
    return;
  }

  invoices.forEach((invoice) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${invoice.idHoaDon ?? "N/A"}</td>
      <td>${formatDateTime(invoice.thoiGianTao)}</td>
      <td>${formatCurrency(invoice.tongTien ?? 0)}</td>
      <td>${invoice.trangThai ?? "N/A"}</td>
      <td>${invoice.trangThaiThanhToan ?? "N/A"}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="viewInvoiceDetails(${
          invoice.idHoaDon ?? 0
        })">
          Xem Chi Tiết
        </button>
      </td>
    `;
    invoiceTableBody.appendChild(row);
  });
}

// Hàm hiển thị chi tiết hóa đơn
async function viewInvoiceDetails(invoiceId) {
  try {
    showLoading();

    console.log("Fetching details for invoice ID:", invoiceId);
    const response = await fetch(
      `http://127.0.0.1:8080/api/hoadon/${invoiceId}`,
      {
        credentials: "include", // Gửi cookie/session để xác thực
      }
    );
    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }
    const invoice = await response.json();
    console.log("Invoice Details:", invoice);

    const modalContent = document.getElementById("invoiceDetailContent");
    modalContent.innerHTML = `
      <p><strong>ID Hóa Đơn:</strong> ${invoice.idHoaDon ?? "N/A"}</p>
      <p><strong>Thời Gian Tạo:</strong> ${formatDateTime(
        invoice.thoiGianTao
      )}</p>
      <p><strong>Tổng Tiền:</strong> ${formatCurrency(
        invoice.tongTien ?? 0
      )}</p>
      <p><strong>Giảm Giá:</strong> ${formatCurrency(invoice.giamGia ?? 0)}</p>
      <p><strong>Thanh Toán:</strong> ${formatCurrency(
        invoice.thanhToan ?? 0
      )}</p>
      <p><strong>Phương Thức:</strong> ${invoice.phuongThuc ?? "N/A"}</p>
      <p><strong>Trạng Thái:</strong> ${invoice.trangThai ?? "N/A"}</p>
      <p><strong>Trạng Thái Thanh Toán:</strong> ${
        invoice.trangThaiThanhToan ?? "N/A"
      }</p>
    `;

    // Hiển thị chi tiết dịch vụ nếu có
    if (invoice.chiTietList && invoice.chiTietList.length > 0) {
      let chiTietHTML =
        '<div class="mt-4"><h6>Chi Tiết Dịch Vụ:</h6><table class="table table-bordered table-sm">';
      chiTietHTML +=
        "<thead><tr><th>Sản Phẩm</th><th>Số Lượng</th><th>Giá</th><th>Thành Tiền</th></tr></thead><tbody>";

      invoice.chiTietList.forEach((chiTiet) => {
        chiTietHTML += `<tr>
          <td>${chiTiet.sanPham?.tenSanPham ?? "N/A"}</td>
          <td>${chiTiet.soLuong}</td>
          <td>${formatCurrency(chiTiet.gia ?? 0)}</td>
          <td>${formatCurrency(chiTiet.thanhTien ?? 0)}</td>
        </tr>`;
      });

      chiTietHTML += "</tbody></table></div>";
      modalContent.innerHTML += chiTietHTML;
    } else {
      modalContent.innerHTML +=
        "<p><strong>Chi Tiết Dịch Vụ:</strong> Không có</p>";
    }

    const modal = new bootstrap.Modal(
      document.getElementById("invoiceDetailModal")
    );
    modal.show();

    hideLoading();
  } catch (error) {
    console.error("Lỗi khi tải chi tiết hóa đơn:", error);
    showError(
      `Không thể tải chi tiết hóa đơn. Vui lòng thử lại sau. Lỗi: ${error.message}`
    );
    hideLoading();
  }
}

// Gọi hàm loadInvoices khi trang tải
document.addEventListener("DOMContentLoaded", loadInvoices);
