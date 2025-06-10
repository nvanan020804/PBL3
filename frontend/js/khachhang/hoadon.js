document.addEventListener("DOMContentLoaded", function () {
  // Constants
  const baseUrl = "http://localhost:8080";
  const ITEMS_PER_PAGE = 10;
  let currentPage = 1;
  let totalPages = 1;
  let allInvoices = [];
  // Get DOM elements
  const invoiceTableBody = document.getElementById("invoiceTableBody");
  const totalItemsElement = document.getElementById("totalItems");
  const paginationElement = document.getElementById("pagination");
  const refreshBtn = document.getElementById("refreshBtn");
  /**
   * Định dạng ngày tháng từ chuỗi MySQL thành định dạng Việt Nam DD/MM/YYYY
   * @param {string|Date} date - chuỗi ngày giờ hoặc đối tượng Date
   * @returns {string} - Ngày định dạng DD/MM/YYYY
   */
  function formatDate(date) {
    if (!date) return "N/A";

    try {
      console.log("formatDate được gọi với:", date);
      console.log("Kiểu dữ liệu:", typeof date);

      // Xử lý trường hợp đặc biệt khi giá trị là [0, 0, 0]
      if (Array.isArray(date) && date.every((item) => item === 0)) {
        console.warn("Phát hiện mảng toàn số 0:", date);
        return "N/A";
      }

      let dateObj;

      // Nếu là mảng (từ API Java cũ)
      if (Array.isArray(date)) {
        const year = date[0];
        const month = date[1] - 1;
        const day = date[2];

        console.log(
          `Xây dựng date từ mảng: year=${year}, month=${month}, day=${day}`
        );

        // Kiểm tra tính hợp lệ của năm
        if (year < 2000 || year > 2100) {
          console.warn("Năm không hợp lệ:", year);
          return "N/A";
        }

        dateObj = new Date(year, month, day);
      }
      // Nếu là string ISO hoặc đối tượng Date
      else {
        dateObj = date instanceof Date ? date : new Date(date);
      }

      console.log("Date object:", dateObj);

      // Kiểm tra nếu dateObj hợp lệ
      if (isNaN(dateObj.getTime())) {
        console.warn("Không thể chuyển đổi ngày tháng:", date);
        return "N/A";
      }

      // Sử dụng toLocaleDateString với options để đảm bảo hiển thị đầy đủ
      return dateObj.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      console.error("Lỗi định dạng ngày:", error);
      return "N/A";
    }
  }

  // Khởi tạo
  init();

  // Function to initialize the page
  async function init() {
    await loadInvoices();
    setupEventListeners();
  }

  // Set up event listeners
  function setupEventListeners() {
    refreshBtn.addEventListener("click", async function () {
      showLoading("Đang làm mới dữ liệu...");
      await loadInvoices();
      showSuccess("Dữ liệu đã được cập nhật!");
    });
  }

  // Load invoices from API
  async function loadInvoices() {
    try {
      const idLienKet = localStorage.getItem("idLienKet");
      if (!idLienKet) {
        showError("Vui lòng đăng nhập để xem hóa đơn");
        return;
      }

      showLoading("Đang tải dữ liệu...");
      const response = await fetch(
        `${baseUrl}/api/hoadon/khachhang/${idLienKet}`
      );

      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu hóa đơn");
      }

      allInvoices = await response.json();
      totalItemsElement.textContent = allInvoices.length;

      // Calculate total pages
      totalPages = Math.ceil(allInvoices.length / ITEMS_PER_PAGE);

      // Reset to first page when reloading data
      currentPage = 1;

      renderInvoices();
      renderPagination();
      hideAlert();
    } catch (error) {
      console.error("Error loading invoices:", error);
      showError("Có lỗi khi tải dữ liệu: " + error.message);
    }
  }

  // Render invoices in the table
  function renderInvoices() {
    invoiceTableBody.innerHTML = "";

    if (allInvoices.length === 0) {
      invoiceTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">Không có hóa đơn nào</td>
        </tr>
      `;
      return;
    }

    // Calculate the slice of data to display
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, allInvoices.length);
    const currentInvoices = allInvoices.slice(startIndex, endIndex);
    currentInvoices.forEach((invoice) => {
      const row = document.createElement("tr"); // Format the date - Sử dụng hàm formatDateTime mới
      // Kiểm tra trường nào có dữ liệu thời gian (ngayTao hoặc thoiGianTao)
      let thoiGian = invoice.ngayTao || invoice.thoiGianTao;
      let formattedDate = formatDateTime(thoiGian);
      console.log(
        `Hóa đơn ${invoice.idHoaDon} - Thời gian: ${thoiGian} => ${formattedDate}`
      );

      // Format currency
      const formattedTotal = invoice.tongTien.toLocaleString("vi-VN") + "đ";

      // Create status badge
      const statusClass = getStatusClass(invoice.trangThai);
      const paymentStatusClass = getPaymentStatusClass(
        invoice.trangThaiThanhToan
      );

      row.innerHTML = `
        <td>${invoice.idHoaDon}</td>
        <td>${formattedDate}</td>
        <td>${formattedTotal}</td>
        <td>${formatPaymentMethod(invoice.phuongThuc)}</td>
        <td><span class="badge ${statusClass}">${invoice.trangThai}</span></td>
        <td><span class="badge ${paymentStatusClass}">${
        invoice.trangThaiThanhToan
      }</span></td>
        <td>
          <button class="btn btn-sm btn-info view-invoice" data-id="${
            invoice.idHoaDon
          }" title="Xem chi tiết">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      `;

      invoiceTableBody.appendChild(row);
    });

    // Add event listeners to view buttons
    document.querySelectorAll(".view-invoice").forEach((button) => {
      button.addEventListener("click", () =>
        viewInvoiceDetails(button.dataset.id)
      );
    });
  }

  // Render pagination controls
  function renderPagination() {
    paginationElement.innerHTML = "";

    if (totalPages <= 1) return;

    // Previous button
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevLi.innerHTML = `<a class="page-link" href="#" ${
      currentPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ""
    }>Trước</a>`;
    prevLi.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        renderInvoices();
        renderPagination();
      }
    });
    paginationElement.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        renderInvoices();
        renderPagination();
      });
      paginationElement.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${
      currentPage === totalPages ? "disabled" : ""
    }`;
    nextLi.innerHTML = `<a class="page-link" href="#" ${
      currentPage === totalPages ? 'tabindex="-1" aria-disabled="true"' : ""
    }>Tiếp</a>`;
    nextLi.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        renderInvoices();
        renderPagination();
      }
    });
    paginationElement.appendChild(nextLi);
  }
  // View invoice details
  async function viewInvoiceDetails(invoiceId) {
    try {
      const response = await fetch(`${baseUrl}/api/hoadon/${invoiceId}`);

      if (!response.ok) {
        throw new Error("Không thể tải chi tiết hóa đơn");
      }
      const invoice = await response.json();
      console.log("Loaded invoice data:", invoice);
      console.log(
        "Invoice creation time:",
        invoice.ngayTao || invoice.thoiGianTao
      ); // Populate modal with invoice data
      document.getElementById("viewIdHoaDon").textContent = invoice.idHoaDon;

      // Format the creation time - kiểm tra nếu có ngayTao hoặc thoiGianTao
      const creationTime = invoice.ngayTao || invoice.thoiGianTao;
      const formattedTime = formatDateTime(creationTime);
      console.log("Trường thời gian:", creationTime);
      console.log("Formatted creation time:", formattedTime);
      document.getElementById("viewCreationTime").textContent =
        formattedTime || "N/A";

      document.getElementById("viewStatus").textContent = invoice.trangThai;
      document.getElementById("viewPaymentStatus").textContent =
        invoice.trangThaiThanhToan;

      // Set status colors
      document.getElementById("viewStatus").className = getStatusTextClass(
        invoice.trangThai
      );
      document.getElementById("viewPaymentStatus").className =
        getPaymentStatusTextClass(invoice.trangThaiThanhToan);

      document.getElementById("viewTongTien").textContent =
        invoice.tongTien.toLocaleString("vi-VN") + "đ";
      document.getElementById("viewGiamGia").textContent =
        (invoice.giamGia || 0).toLocaleString("vi-VN") + "đ";
      document.getElementById("viewThanhToan").textContent =
        invoice.thanhToan.toLocaleString("vi-VN") + "đ";
      document.getElementById("viewPhuongThuc").textContent =
        formatPaymentMethod(invoice.phuongThuc);

      // Display registration info if available
      const registrationInfo = document.getElementById("viewRegistrationInfo");

      if (invoice.dangKy) {
        registrationInfo.classList.remove("d-none");
        document.getElementById("viewTenGoi").textContent =
          invoice.dangKy.goiDichVu?.tenGoi || "N/A"; // Format dates - sử dụng hàm formatDate mới
        let startDate = invoice.dangKy.ngayBatDau
          ? formatDate(invoice.dangKy.ngayBatDau)
          : "N/A";
        let endDate = invoice.dangKy.ngayKetThuc
          ? formatDate(invoice.dangKy.ngayKetThuc)
          : "N/A";

        document.getElementById("viewNgayBatDau").textContent = startDate;
        document.getElementById("viewNgayKetThuc").textContent = endDate;
        document.getElementById("viewTrangThaiDangKy").textContent =
          invoice.dangKy.trangThai || "N/A";
      } else {
        registrationInfo.classList.add("d-none");
      }

      // Render invoice details table
      const detailsTableBody = document.getElementById("viewDetailsTableBody");
      detailsTableBody.innerHTML = "";

      if (invoice.chiTietHoaDons && invoice.chiTietHoaDons.length > 0) {
        invoice.chiTietHoaDons.forEach((item) => {
          const row = document.createElement("tr");
          const tenSanPham = item.sanPham
            ? item.sanPham.tenSanPham
            : item.goiDichVu
            ? item.goiDichVu.tenGoi
            : "N/A";
          const gia = item.gia.toLocaleString("vi-VN") + "đ";
          const soLuong = item.soLuong;
          const thanhTien =
            (item.gia * item.soLuong).toLocaleString("vi-VN") + "đ";

          row.innerHTML = `
            <td>${tenSanPham}</td>
            <td>${gia}</td>
            <td>${soLuong}</td>
            <td>${thanhTien}</td>
          `;

          detailsTableBody.appendChild(row);
        });
      } else {
        detailsTableBody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center">Không có chi tiết hóa đơn</td>
          </tr>
        `;
      }

      // Show the modal
      new bootstrap.Modal(document.getElementById("viewInvoiceModal")).show();
    } catch (error) {
      console.error("Error loading invoice details:", error);
      showError("Có lỗi khi tải chi tiết hóa đơn: " + error.message);
    }
  }

  // Helper functions
  function formatPaymentMethod(method) {
    const methods = {
      tienmat: "Tiền mặt",
      chuyenkhoan: "Chuyển khoản",
      thenganhang: "Thẻ ngân hàng",
    };

    return methods[method] || method;
  }

  function getStatusClass(status) {
    switch (status) {
      case "Hoàn thành":
        return "bg-success";
      case "Chờ xử lý":
        return "bg-warning text-dark";
      case "Hủy":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  }

  function getPaymentStatusClass(status) {
    switch (status) {
      case "Đã thanh toán":
        return "bg-success";
      case "Chưa thanh toán":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  }

  function getStatusTextClass(status) {
    switch (status) {
      case "Hoàn thành":
        return "text-success";
      case "Chờ xử lý":
        return "text-warning";
      case "Hủy":
        return "text-danger";
      default:
        return "text-secondary";
    }
  }

  function getPaymentStatusTextClass(status) {
    switch (status) {
      case "Đã thanh toán":
        return "text-success";
      case "Chưa thanh toán":
        return "text-danger";
      default:
        return "text-secondary";
    }
  }
  // Alert handling functions
  function showAlert(message, type) {
    const alertMessage = document.getElementById("alertMessage");
    if (!alertMessage) {
      console.error("Element with ID 'alertMessage' not found");
      return;
    }

    alertMessage.innerText = message;
    alertMessage.className = `alert alert-${type}`;
    alertMessage.classList.remove("d-none");

    // Auto hide after 5 seconds
    setTimeout(() => {
      alertMessage.classList.add("d-none");
    }, 5000);
  }

  function showError(message) {
    showAlert(message, "danger");
  }

  function showSuccess(message) {
    showAlert(message, "success");
  }

  function showLoading(message) {
    showAlert(message, "info");
  }
  function hideAlert() {
    const alertMessage = document.getElementById("alertMessage");
    if (alertMessage) {
      alertMessage.classList.add("d-none");
    }
  }
});

// Hiển thị modal xác nhận thanh toán
window.showModalXacNhan = function (goi, onConfirm) {
  console.log("showModalXacNhan được gọi với gói:", goi);

  const modalXacNhan = document.getElementById("modal-xac-nhan");
  const thongTinGoi = document.getElementById("thong-tin-goi");
  const phuongThucThanhToan = document.getElementById("phuong-thuc-thanh-toan");
  const thongTinChuyenKhoan = document.getElementById("thong-tin-chuyen-khoan");
  const gioTapModal = document.getElementById("gio-tap-modal");
  const closeXacNhan = document.getElementById("close-xac-nhan");
  const btnXacNhanThanhToan = document.getElementById(
    "btn-xac-nhan-thanh-toan"
  );
  // Kiểm tra tồn tại của các phần tử
  if (!modalXacNhan) {
    console.error("Element with ID 'modal-xac-nhan' not found");
    // Kiểm tra nếu modal không tồn tại, có thể cần tạo modal động
    createDynamicModal(goi, onConfirm);
    return;
  }

  modalXacNhan.style.display = "flex";

  if (thongTinGoi) {
    thongTinGoi.innerHTML = `
      <p><strong>Tên gói:</strong> ${goi.tenGoi}</p>
      <p><strong>Giá:</strong> ${formatCurrency(goi.gia)}</p>
      <p><strong>Thời hạn:</strong> ${goi.thoiGian || 0} tháng</p>
    `;
  } else {
    console.error("Element with ID 'thong-tin-goi' not found");
  }

  if (phuongThucThanhToan) {
    phuongThucThanhToan.value = "Tiền mặt";

    phuongThucThanhToan.onchange = function () {
      if (thongTinChuyenKhoan) {
        thongTinChuyenKhoan.style.display =
          this.value === "Chuyển khoản" ? "block" : "none";
      }
    };
  } else {
    console.error("Element with ID 'phuong-thuc-thanh-toan' not found");
  }

  if (thongTinChuyenKhoan) {
    thongTinChuyenKhoan.style.display = "none";
  } else {
    console.error("Element with ID 'thong-tin-chuyen-khoan' not found");
  }

  if (gioTapModal) {
    gioTapModal.value = "";
  } else {
    console.error("Element with ID 'gio-tap-modal' not found");
  }

  if (closeXacNhan) {
    closeXacNhan.onclick = function () {
      modalXacNhan.style.display = "none";
    };
  } else {
    console.error("Element with ID 'close-xac-nhan' not found");
  }
  if (btnXacNhanThanhToan) {
    btnXacNhanThanhToan.onclick = function () {
      if (!gioTapModal || !phuongThucThanhToan) {
        alert("Lỗi: Không tìm thấy phần tử form");
        return;
      }

      const phuongThuc = phuongThucThanhToan.value;
      const gioTap = gioTapModal.value;

      if (!gioTap) {
        alert("Vui lòng chọn giờ tập!");
        return;
      }

      modalXacNhan.style.display = "none";
      onConfirm(phuongThuc, gioTap);
    };
  } else {
    console.error("Element with ID 'btn-xac-nhan-thanh-toan' not found");
  }
};

// Hàm tạo modal xác nhận động nếu không tồn tại trong DOM
function createDynamicModal(goi, onConfirm) {
  console.log("Tạo modal động với gói:", goi);

  // Tạo modal động
  const modalTemplate = document.createElement("div");
  modalTemplate.id = "modal-xac-nhan";
  modalTemplate.className = "modal";
  modalTemplate.style.display = "flex";
  modalTemplate.style.position = "fixed";
  modalTemplate.style.zIndex = "1000";
  modalTemplate.style.left = "0";
  modalTemplate.style.top = "0";
  modalTemplate.style.width = "100%";
  modalTemplate.style.height = "100%";
  modalTemplate.style.backgroundColor = "rgba(0,0,0,0.5)";
  modalTemplate.style.justifyContent = "center";
  modalTemplate.style.alignItems = "center";

  // Tạo nội dung modal
  modalTemplate.innerHTML = `
    <div class="modal-content" style="background-color: white; padding: 20px; border-radius: 5px; width: 90%; max-width: 500px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
        <h3>Xác nhận đăng ký gói dịch vụ</h3>
        <span id="close-xac-nhan" style="cursor: pointer; font-size: 24px;">&times;</span>
      </div>
      
      <div id="thong-tin-goi" style="margin-bottom: 15px;">
        <p><strong>Tên gói:</strong> ${goi.tenGoi}</p>
        <p><strong>Giá:</strong> ${formatCurrency(goi.gia)}</p>
        <p><strong>Thời hạn:</strong> ${goi.thoiGian || 0} tháng</p>
      </div>
      
      <div style="margin-bottom: 15px;">
        <label for="gio-tap-modal"><strong>Chọn giờ tập:</strong></label>
        <select id="gio-tap-modal" class="form-control" required style="width: 100%; padding: 8px; margin-top: 5px;">
          <option value="">-- Chọn giờ tập --</option>
          <option value="Sáng (6h-12h)">Sáng (6h-12h)</option>
          <option value="Chiều (13h-17h)">Chiều (13h-17h)</option>
          <option value="Tối (18h-22h)">Tối (18h-22h)</option>
          <option value="Cả ngày">Cả ngày</option>
        </select>
      </div>
      
      <div style="margin-bottom: 15px;">
        <label for="phuong-thuc-thanh-toan"><strong>Phương thức thanh toán:</strong></label>
        <select id="phuong-thuc-thanh-toan" class="form-control" style="width: 100%; padding: 8px; margin-top: 5px;">
          <option value="tienmat">Tiền mặt</option>
          <option value="chuyenkhoan">Chuyển khoản</option>
          <option value="thenganhang">Thẻ ngân hàng</option>
        </select>
      </div>
      
      <div id="thong-tin-chuyen-khoan" style="display: none; margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
        <p><strong>Số tài khoản:</strong> 0935186115</p>
        <p><strong>Ngân hàng:</strong> MBBank</p>
        <p><strong>Chủ tài khoản:</strong> NGUYEN VAN A</p>
        <p><strong>Nội dung:</strong> [Mã KH] thanh toan goi dich vu</p>
      </div>
      
      <div style="text-align: center;">
        <button id="btn-xac-nhan-thanh-toan" class="btn btn-primary" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Xác nhận đăng ký</button>
      </div>
    </div>
  `;

  // Thêm modal vào body
  document.body.appendChild(modalTemplate);

  // Thêm sự kiện cho các nút trong modal
  document
    .getElementById("close-xac-nhan")
    .addEventListener("click", function () {
      document.body.removeChild(modalTemplate);
    });

  // Xử lý hiện thị thông tin chuyển khoản
  document
    .getElementById("phuong-thuc-thanh-toan")
    .addEventListener("change", function () {
      const thongTinChuyenKhoan = document.getElementById(
        "thong-tin-chuyen-khoan"
      );
      thongTinChuyenKhoan.style.display =
        this.value === "chuyenkhoan" ? "block" : "none";
    });

  // Xử lý nút xác nhận
  document
    .getElementById("btn-xac-nhan-thanh-toan")
    .addEventListener("click", function () {
      const gioTapModal = document.getElementById("gio-tap-modal");
      const phuongThucThanhToan = document.getElementById(
        "phuong-thuc-thanh-toan"
      );

      if (!gioTapModal || !phuongThucThanhToan) {
        alert("Lỗi: Không tìm thấy phần tử form");
        return;
      }

      const phuongThuc = phuongThucThanhToan.value;
      const gioTap = gioTapModal.value;

      if (!gioTap) {
        alert("Vui lòng chọn giờ tập!");
        return;
      }

      document.body.removeChild(modalTemplate);
      onConfirm(phuongThuc, gioTap);
    });
}

// Hiển thị modal hóa đơn chi tiết
window.showModalHoaDon = function (
  goi,
  khachHang,
  gioTap,
  phuongThuc,
  trangThai = ""
) {
  console.log("showModalHoaDon được gọi với gói:", goi);

  const modalHoaDon = document.getElementById("modal-hoa-don");
  const hoaDonChiTiet = document.getElementById("hoa-don-chi-tiet");
  const closeHoaDon = document.getElementById("close-hoa-don");

  // Kiểm tra tồn tại của các phần tử
  if (!modalHoaDon) {
    console.error("Element with ID 'modal-hoa-don' not found");
    // Tạo modal động nếu không tìm thấy modal
    createDynamicReceiptModal(goi, khachHang, gioTap, phuongThuc, trangThai);
    return;
  }

  modalHoaDon.style.display = "flex"; // Lấy thời gian hiện tại để hiển thị trong hóa đơn
  const thoiGianTao = new Date();
  console.log("Thời gian tạo hóa đơn:", thoiGianTao);

  // Format thời gian tạo
  const formattedTime = formatDateTime(thoiGianTao);

  if (hoaDonChiTiet) {
    hoaDonChiTiet.innerHTML = `
      <table style="width:100%;border-collapse:collapse;">
        <tr><th colspan="2" style="text-align:center;font-size:18px;">Thông tin gói dịch vụ</th></tr>
        <tr><td>Tên gói</td><td>${goi.tenGoi}</td></tr>
        <tr><td>Giá</td><td>${formatCurrency(goi.gia)}</td></tr>
        <tr><td>Thời hạn</td><td>${goi.thoiGian || 0} tháng</td></tr>
        <tr><td>Giờ tập</td><td>${gioTap}</td></tr>
        <tr><td>Thời gian tạo</td><td>${formattedTime}</td></tr>
        ${
          trangThai
            ? `<tr><td>Trạng thái</td><td><strong style="color: ${
                trangThai === "Chờ xác nhận"
                  ? "orange"
                  : trangThai === "Đang hoạt động"
                  ? "green"
                  : "blue"
              };">${trangThai}</strong></td></tr>`
            : ""
        }
        <tr><th colspan="2" style="text-align:center;font-size:18px;">Thông tin khách hàng</th></tr>
        <tr><td>Họ tên</td><td>${getCustomerName(khachHang)}</td></tr>
        <tr><td>Mã KH</td><td>${khachHang.idLienKet || ""}</td></tr>
        <tr><th colspan="2" style="text-align:center;font-size:18px;">Thông tin thanh toán</th></tr>
        <tr><td>Phương thức</td><td>${formatPaymentMethod(phuongThuc)}</td></tr>
        ${
          phuongThuc === "chuyenkhoan"
            ? `<tr><td colspan="2"><strong>Số tài khoản:</strong> 0935186115<br>
            <strong>Ngân hàng:</strong> MBBank<br>
            <strong>Chủ tài khoản:</strong> NGUYEN VAN A</td></tr>`
            : ""
        }
        ${
          trangThai === "Chờ xác nhận"
            ? `<tr><td colspan="2" style="text-align:center;font-style:italic;padding-top:15px;color:#555;">
              Đăng ký của bạn đang chờ xác nhận từ Admin.<br>
              Vui lòng đợi admin xác nhận đơn đăng ký và hoàn thành thanh toán.
             </td></tr>`
            : ""
        }
      </table>
    `;
  } else {
    console.error("Element with ID 'hoa-don-chi-tiet' not found");
  }

  if (closeHoaDon) {
    closeHoaDon.onclick = function () {
      modalHoaDon.style.display = "none";
      location.reload();
    };
  } else {
    console.error("Element with ID 'close-hoa-don' not found");
  }
};

// Hàm tạo modal hóa đơn động nếu không tồn tại trong DOM
function createDynamicReceiptModal(
  goi,
  khachHang,
  gioTap,
  phuongThuc,
  trangThai = ""
) {
  console.log(
    "Tạo modal hóa đơn động với gói:",
    goi,
    "và khách hàng:",
    khachHang
  );

  // Tạo modal động
  const modalTemplate = document.createElement("div");
  modalTemplate.id = "modal-hoa-don";
  modalTemplate.className = "modal";
  modalTemplate.style.display = "flex";
  modalTemplate.style.position = "fixed";
  modalTemplate.style.zIndex = "1000";
  modalTemplate.style.left = "0";
  modalTemplate.style.top = "0";
  modalTemplate.style.width = "100%";
  modalTemplate.style.height = "100%";
  modalTemplate.style.backgroundColor = "rgba(0,0,0,0.7)";
  modalTemplate.style.justifyContent = "center";
  modalTemplate.style.alignItems = "center";

  const statusColor =
    trangThai === "Chờ xác nhận"
      ? "orange"
      : trangThai === "Đang hoạt động"
      ? "green"
      : "blue";

  const chuyenKhoanInfo =
    phuongThuc === "chuyenkhoan"
      ? `
    <tr><td colspan="2"><strong>Số tài khoản:</strong> 0935186115<br>
    <strong>Ngân hàng:</strong> MBBank<br>
    <strong>Chủ tài khoản:</strong> NGUYEN VAN A</td></tr>
  `
      : "";

  const noticeInfo =
    trangThai === "Chờ xác nhận"
      ? `
    <tr><td colspan="2" style="text-align:center;font-style:italic;padding-top:15px;color:#555;">
      Đăng ký của bạn đang chờ xác nhận từ Admin.<br>
      Vui lòng đợi admin xác nhận đơn đăng ký và hoàn thành thanh toán.
     </td></tr>
  `
      : ""; // Lấy thời gian hiện tại để hiển thị trong hóa đơn
  const thoiGianTao = new Date();
  console.log("Thời gian tạo hóa đơn (dynamic):", thoiGianTao);

  // Format thời gian tạo
  const formattedTime = formatDateTime(thoiGianTao);

  // Tạo nội dung modal
  modalTemplate.innerHTML = `
    <div class="modal-content" style="background-color: white; padding: 20px; border-radius: 5px; width: 90%; max-width: 600px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
        <h3>Chi tiết đăng ký gói dịch vụ</h3>
        <span id="close-hoa-don" style="cursor: pointer; font-size: 24px;">&times;</span>
      </div>
      
      <div id="hoa-don-chi-tiet" style="margin-bottom: 20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><th colspan="2" style="text-align:center;font-size:18px;">Thông tin gói dịch vụ</th></tr>
          <tr><td>Tên gói</td><td>${goi.tenGoi}</td></tr>
          <tr><td>Giá</td><td>${formatCurrency(goi.gia)}</td></tr>
          <tr><td>Thời hạn</td><td>${goi.thoiGian || 0} tháng</td></tr>
          <tr><td>Giờ tập</td><td>${gioTap}</td></tr>
          <tr><td>Thời gian tạo</td><td>${formattedTime}</td></tr>
          ${
            trangThai
              ? `<tr><td>Trạng thái</td><td><strong style="color: ${statusColor};">${trangThai}</strong></td></tr>`
              : ""
          }          <tr><th colspan="2" style="text-align:center;font-size:18px;">Thông tin khách hàng</th></tr>
          <tr><td>Họ tên</td><td>${getCustomerName(khachHang)}</td></tr>
          <tr><td>Mã KH</td><td>${khachHang.idLienKet || ""}</td></tr>
          <tr><th colspan="2" style="text-align:center;font-size:18px;">Thông tin thanh toán</th></tr>
          <tr><td>Phương thức</td><td>${formatPaymentMethod(
            phuongThuc
          )}</td></tr>
          ${chuyenKhoanInfo}
          ${noticeInfo}
        </table>
      </div>
      
      <div style="text-align: center;">
        <button id="btn-dong-hoa-don" class="btn btn-primary" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Đóng</button>
      </div>
    </div>
  `;

  // Thêm modal vào body
  document.body.appendChild(modalTemplate);

  // Thêm sự kiện cho nút đóng
  document
    .getElementById("close-hoa-don")
    .addEventListener("click", function () {
      document.body.removeChild(modalTemplate);
      location.reload(); // Tải lại trang sau khi đóng
    });

  document
    .getElementById("btn-dong-hoa-don")
    .addEventListener("click", function () {
      document.body.removeChild(modalTemplate);
      location.reload(); // Tải lại trang sau khi đóng
    });
}

// Hàm định dạng phương thức thanh toán để hiển thị
function formatPaymentMethod(method) {
  const methods = {
    tienmat: "Tiền mặt",
    chuyenkhoan: "Chuyển khoản",
    thenganhang: "Thẻ ngân hàng",
  };
  return methods[method] || method;
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Lấy tên khách hàng từ đối tượng khách hàng hoặc từ localStorage nếu không có
 * @param {Object} khachHang - Đối tượng khách hàng
 * @returns {string} - Tên khách hàng hoặc "N/A" nếu không tìm thấy
 */
function getCustomerName(khachHang) {
  // Thử lấy tên từ đối tượng khách hàng được truyền vào
  if (khachHang && khachHang.tenKhachHang) {
    return khachHang.tenKhachHang;
  }

  // Nếu chỉ có đối tượng user (có thể có hoTen)
  if (khachHang && khachHang.hoTen) {
    return khachHang.hoTen;
  }

  // Nếu đối tượng khách hàng có tên đăng nhập và không có tên thật
  if (khachHang && khachHang.tenDangNhap) {
    // Thử tìm trong localStorage để lấy đối tượng khách hàng đầy đủ
    const khachhangData = localStorage.getItem("khachhang");
    if (khachhangData) {
      const khachhangObj = JSON.parse(khachhangData);
      if (khachhangObj && khachhangObj.tenKhachHang) {
        return khachhangObj.tenKhachHang;
      }
    }

    // Nếu không tìm thấy, dùng tên đăng nhập
    return khachHang.tenDangNhap;
  }

  // Cuối cùng, thử lấy từ localStorage nếu tất cả cách trên đều không có
  try {
    const khachhangData = localStorage.getItem("khachhang");
    if (khachhangData) {
      const khachhangObj = JSON.parse(khachhangData);
      if (khachhangObj && khachhangObj.tenKhachHang) {
        return khachhangObj.tenKhachHang;
      }
    }
  } catch (error) {
    console.error("Lỗi khi lấy tên khách hàng từ localStorage:", error);
  }

  return "N/A";
}

/**
 * Định dạng ngày giờ từ chuỗi MySQL thành định dạng DD/MM/YYYY HH:MM:SS
 * @param {string|Date} mysqlDateTime - chuỗi ngày giờ hoặc đối tượng Date
 * @returns {string} - Ngày giờ định dạng "DD/MM/YYYY HH:MM:SS"
 */
function formatDateTime(date) {
  if (!date) return "Chưa có thông tin";

  try {
    console.log("formatDateTime được gọi với:", date);
    console.log("Kiểu dữ liệu:", typeof date);

    // Xử lý trường hợp đặc biệt khi giá trị là [0, 0, 0]
    if (Array.isArray(date) && date.every((item) => item === 0)) {
      console.warn("Phát hiện mảng toàn số 0:", date);
      return "Chưa có thông tin";
    }

    let dateObj;

    // Nếu là mảng (từ API Java cũ)
    if (Array.isArray(date)) {
      const year = date[0];
      const month = date[1] - 1;
      const day = date[2];
      const hour = date[3] || 0;
      const minute = date[4] || 0;
      const second = date[5] || 0;

      console.log(
        `Xây dựng date từ mảng: year=${year}, month=${month}, day=${day}, hour=${hour}, minute=${minute}, second=${second}`
      );

      // Kiểm tra tính hợp lệ của năm
      if (year < 2000 || year > 2100) {
        console.warn("Năm không hợp lệ:", year);
        return "Chưa có thông tin";
      }

      dateObj = new Date(year, month, day, hour, minute, second);
    }
    // Nếu là string ISO hoặc đối tượng Date
    else {
      dateObj = date instanceof Date ? date : new Date(date);
    }

    console.log("Date object:", dateObj);

    // Kiểm tra nếu dateObj hợp lệ
    if (isNaN(dateObj.getTime())) {
      console.warn("Không thể chuyển đổi ngày giờ:", date);
      return "Chưa có thông tin";
    }

    // Sử dụng toLocaleString với options để đảm bảo hiển thị đầy đủ
    return dateObj.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch (error) {
    console.error("Lỗi định dạng ngày giờ:", error, date);
    return "Chưa có thông tin";
  }
}
