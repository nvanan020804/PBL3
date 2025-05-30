window.showModalXacNhan = function (goi, onConfirm) {
  document.getElementById("modal-xac-nhan").style.display = "flex";
  document.getElementById("thong-tin-goi").innerHTML = `
    <p><strong>Tên gói:</strong> ${goi.tenGoi}</p>
    <p><strong>Giá:</strong> ${formatCurrency(goi.gia)}</p>
    <p><strong>Thời hạn:</strong> ${goi.thoiGian || 0} tháng</p>
  `;
  document.getElementById("phuong-thuc-thanh-toan").value = "Tiền mặt";
  document.getElementById("thong-tin-chuyen-khoan").style.display = "none";
  document.getElementById("gio-tap-modal").value = "";

  document.getElementById("phuong-thuc-thanh-toan").onchange = function () {
    if (this.value === "Chuyển khoản") {
      document.getElementById("thong-tin-chuyen-khoan").style.display = "block";
    } else {
      document.getElementById("thong-tin-chuyen-khoan").style.display = "none";
    }
  };

  document.getElementById("close-xac-nhan").onclick = function () {
    document.getElementById("modal-xac-nhan").style.display = "none";
  };

  document.getElementById("btn-xac-nhan-thanh-toan").onclick = function () {
    const phuongThuc = document.getElementById("phuong-thuc-thanh-toan").value;
    const gioTap = document.getElementById("gio-tap-modal").value;
    if (!gioTap) {
      alert("Vui lòng chọn giờ tập!");
      return;
    }
    document.getElementById("modal-xac-nhan").style.display = "none";
    onConfirm(phuongThuc, gioTap);
  };
};

// Hiển thị modal hóa đơn chi tiết
window.showModalHoaDon = function (goi, khachHang, gioTap, phuongThuc) {
  document.getElementById("modal-hoa-don").style.display = "flex";
  document.getElementById("hoa-don-chi-tiet").innerHTML = `
    <table style="width:100%;border-collapse:collapse;">
      <tr><th colspan="2" style="text-align:center;font-size:18px;">Thông tin gói dịch vụ</th></tr>
      <tr><td>Tên gói</td><td>${goi.tenGoi}</td></tr>
      <tr><td>Giá</td><td>${formatCurrency(goi.gia)}</td></tr>
      <tr><td>Thời hạn</td><td>${goi.thoiGian || 0} tháng</td></tr>
      <tr><td>Giờ tập</td><td>${gioTap}</td></tr>
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
    </table>
  `;
  document.getElementById("close-hoa-don").onclick = function () {
    document.getElementById("modal-hoa-don").style.display = "none";
    location.reload();
  };
};
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
