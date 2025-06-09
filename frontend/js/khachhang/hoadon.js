window.showModalXacNhan = function (goi, onConfirm) {
  const modalXacNhan = document.getElementById("modal-xac-nhan");
  const thongTinGoi = document.getElementById("thong-tin-goi");
  const phuongThucThanhToan = document.getElementById("phuong-thuc-thanh-toan");
  const thongTinChuyenKhoan = document.getElementById("thong-tin-chuyen-khoan");
  const gioTapModal = document.getElementById("gio-tap-modal");
  const closeXacNhan = document.getElementById("close-xac-nhan");
  const btnXacNhanThanhToan = document.getElementById("btn-xac-nhan-thanh-toan");
  
  // Kiểm tra tồn tại của các phần tử
  if (!modalXacNhan) {
    console.error("Element with ID 'modal-xac-nhan' not found");
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
        thongTinChuyenKhoan.style.display = this.value === "Chuyển khoản" ? "block" : "none";
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

// Hiển thị modal hóa đơn chi tiết
window.showModalHoaDon = function (goi, khachHang, gioTap, phuongThuc, trangThai = "") {
  const modalHoaDon = document.getElementById("modal-hoa-don");
  const hoaDonChiTiet = document.getElementById("hoa-don-chi-tiet");
  const closeHoaDon = document.getElementById("close-hoa-don");
  
  // Kiểm tra tồn tại của các phần tử
  if (!modalHoaDon) {
    console.error("Element with ID 'modal-hoa-don' not found");
    return;
  }
  
  modalHoaDon.style.display = "flex";
  
  if (hoaDonChiTiet) {
    hoaDonChiTiet.innerHTML = `
      <table style="width:100%;border-collapse:collapse;">
        <tr><th colspan="2" style="text-align:center;font-size:18px;">Thông tin gói dịch vụ</th></tr>
        <tr><td>Tên gói</td><td>${goi.tenGoi}</td></tr>
        <tr><td>Giá</td><td>${formatCurrency(goi.gia)}</td></tr>
        <tr><td>Thời hạn</td><td>${goi.thoiGian || 0} tháng</td></tr>
        <tr><td>Giờ tập</td><td>${gioTap}</td></tr>
        ${trangThai ? `<tr><td>Trạng thái</td><td><strong style="color: ${
          trangThai === "Chờ xác nhận" ? "orange" : 
          trangThai === "Đang hoạt động" ? "green" : "blue"
        };">${trangThai}</strong></td></tr>` : ""}
        <tr><th colspan="2" style="text-align:center;font-size:18px;">Thông tin khách hàng</th></tr>
        <tr><td>Họ tên</td><td>${khachHang.tenKhachHang || ""}</td></tr>
        <tr><td>Mã KH</td><td>${khachHang.idLienKet || ""}</td></tr>
        <tr><th colspan="2" style="text-align:center;font-size:18px;">Thông tin thanh toán</th></tr>
        <tr><td>Phương thức</td><td>${phuongThuc}</td></tr>
        ${
          phuongThuc === "Chuyển khoản"
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
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
