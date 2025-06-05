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

// Hàm hiển thị loading
function showLoading() {
  document.body.insertAdjacentHTML(
    "beforeend",
    '<div id="loading" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 15px 30px; border-radius: 5px; z-index: 9999;"><i class="fas fa-spinner fa-spin"></i> Đang tải...</div>'
  );
}

// Hàm ẩn loading
function hideLoading() {
  const loading = document.getElementById("loading");
  if (loading) loading.remove();
}

// Hàm hiển thị thông báo lỗi
function showError(message) {
  alert(message);
}

// Tải danh sách hóa đơn theo người dùng đang đăng nhập
async function loadInvoices() {
  try {
    showLoading();

    const profileResponse = await fetch(
      "http://127.0.0.1:8080/api/khachhang/profile",
      {
        credentials: "include",
      }
    );

    if (profileResponse.status === 401) {
      showError("Vui lòng đăng nhập để xem hóa đơn!");
      window.location.href = "/login.html"; // Chuyển hướng đến trang đăng nhập
      return;
    }

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      throw new Error(`Lỗi HTTP: ${profileResponse.status} - ${errorText}`);
    }

    const profile = await profileResponse.json();
    const idKhachHang = profile.idKhachHang;

    const invoicesResponse = await fetch(
      `http://127.0.0.1:8080/api/hoadon/khachhang/${idKhachHang}`,
      {
        credentials: "include",
      }
    );

    if (!invoicesResponse.ok) {
      const errorText = await invoicesResponse.text();
      throw new Error(`Lỗi HTTP: ${invoicesResponse.status} - ${errorText}`);
    }

    const userInvoices = await invoicesResponse.json();
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
      <td>${formatCurrency(invoice.thanhToan ?? 0)}</td>
      <td>${invoice.trangThai ?? "N/A"}</td>
      <td>${invoice.trangThaiThanhToan ?? "N/A"}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="viewInvoiceDetails(${
          invoice.idHoaDon ?? 0
        })">
          <i class="fas fa-eye"></i> Xem
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

    const response = await fetch(
      `http://127.0.0.1:8080/api/hoadon/${invoiceId}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi HTTP: ${response.status} - ${errorText}`);
    }

    const invoice = await response.json();
    const modalContent = document.getElementById("invoiceDetailContent");
    modalContent.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <p><strong>ID Hóa Đơn:</strong> ${invoice.idHoaDon ?? "N/A"}</p>
          <p><strong>Thời Gian Tạo:</strong> ${formatDateTime(
            invoice.thoiGianTao
          )}</p>
          <p><strong>Khách Hàng:</strong> ${
            invoice.dangKy?.khachHang?.hoTen ?? "N/A"
          }</p>
        </div>
        <div class="col-md-6">
          <p><strong>Tổng Tiền:</strong> ${formatCurrency(
            invoice.tongTien ?? 0
          )}</p>
          <p><strong>Giảm Giá:</strong> ${formatCurrency(
            invoice.giamGia ?? 0
          )}</p>
          <p><strong>Thành Tiền:</strong> ${formatCurrency(
            invoice.thanhToan ?? 0
          )}</p>
        </div>
      </div>
      <p><strong>Phương Thức Thanh Toán:</strong> ${
        invoice.phuongThuc === "tienmat"
          ? "Tiền mặt"
          : invoice.phuongThuc === "chuyenkhoan"
          ? "Chuyển khoản"
          : invoice.phuongThuc === "thetindung"
          ? "Thẻ tín dụng"
          : "N/A"
      }</p>
      <p><strong>Trạng Thái:</strong> ${invoice.trangThai ?? "N/A"}</p>
      <p><strong>Trạng Thái Thanh Toán:</strong> ${
        invoice.trangThaiThanhToan ?? "N/A"
      }</p>
    `;

    if (invoice.chiTietList && invoice.chiTietList.length > 0) {
      let chiTietHTML =
        '<div class="mt-3"><h6>Chi Tiết Dịch Vụ:</h6><table class="table table-bordered table-sm">';
      chiTietHTML +=
        "<thead><tr><th>Sản Phẩm/Dịch Vụ</th><th>Số Lượng</th><th>Giá</th><th>Thành Tiền</th></tr></thead><tbody>";
      invoice.chiTietList.forEach((chiTiet) => {
        chiTietHTML += `<tr>
          <td>${chiTiet.sanPham?.tenSanPham ?? "N/A"}</td>
          <td>${chiTiet.soLuong ?? 0}</td>
          <td>${formatCurrency(chiTiet.gia ?? 0)}</td>
          <td>${formatCurrency(chiTiet.thanhTien ?? 0)}</td>
        </tr>`;
      });
      chiTietHTML += "</tbody></table></div>";
      modalContent.innerHTML += chiTietHTML;
    } else if (invoice.dangKy?.goiDichVu) {
      modalContent.innerHTML += `
        <div class="mt-3">
          <h6>Gói Dịch Vụ:</h6>
          <p><strong>Tên Gói:</strong> ${
            invoice.dangKy?.goiDichVu?.tenGoi ?? "N/A"
          }</p>
          <p><strong>Giá Gói:</strong> ${formatCurrency(
            invoice.dangKy?.goiDichVu?.gia ?? 0
          )}</p>
        </div>
      `;
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
