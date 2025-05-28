// Hàm lấy danh sách gói dịch vụ từ API
async function layDanhSachGoiDichVu() {
  try {
    const response = await fetch("http://localhost:8080/api/goidichvu");
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu từ server");
    }
    const data = await response.json();
    hienThiDanhSachGoiDichVu(data);
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Có lỗi xảy ra khi lấy danh sách gói dịch vụ");
  }
}

function hienThiDanhSachGoiDichVu(danhSachGoi) {
  const goiList = document.getElementById("goi-list");
  goiList.innerHTML = "";

  let daCoGoi = window._daCoGoiDangDung || false;

  danhSachGoi.forEach((goi) => {
    const card = document.createElement("div");
    card.className = "goi-card";
    card.innerHTML = `
      <img src="../../assets/login.jpg" alt="Gói dịch vụ">
      <div class="goi-info">
        <div class="goi-ten">${goi.tenGoi}</div>
        <div class="goi-gia">${formatCurrency(goi.gia)}</div>
        <div class="goi-thoihan">Thời hạn: ${goi.thoiGian || 0} tháng</div>
        <div class="goi-mota">${goi.moTa || "Không có mô tả"}</div>
        <button onclick="dangKyGoi(${goi.id})" class="btn-register" ${
      daCoGoi ? "disabled" : ""
    }>Đăng ký</button>
      </div>
    `;
    goiList.appendChild(card);
  });
}

// Hàm format tiền tệ
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

window.dangKyGoi = async function (idGoi) {
  const userJson = localStorage.getItem("user");
  if (!userJson) {
    alert("Vui lòng đăng nhập để đăng ký gói dịch vụ!");
    window.location.href = "../trangchu/login.html";
    return;
  }
  // Lấy thông tin gói
  const response = await fetch("http://localhost:8080/api/goidichvu");
  const dsGoi = await response.json();
  const goi = dsGoi.find((g) => g.id === idGoi);

  window.showModalXacNhan(goi, async function (phuongThuc, gioTap) {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await fetch("http://localhost:8080/api/dangky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idKhachHang: user.idLienKet,
          idGOI: idGoi,
          ngayBatDau: new Date().toISOString().split("T")[0],
          trangThai: "Đang hoạt động",
          gioTap: gioTap,
          phuongThucThanhToan: phuongThuc,
        }),
      });
      if (!res.ok) throw new Error("Lỗi khi đăng ký gói dịch vụ");
      window.showModalHoaDon(goi, user, gioTap, phuongThuc);
    } catch (error) {
      alert("Có lỗi xảy ra khi đăng ký gói dịch vụ");
    }
  });
};

// Hàm xử lý hủy gói dịch vụ
window.huyGoiDangDung = async function (idDangKy) {
  if (!confirm("Bạn có chắc chắn muốn hủy gói dịch vụ hiện tại?")) return;
  try {
    // Gửi yêu cầu hủy, backend cần lưu lại thời gian hủy là thời gian hiện tại
    const response = await fetch(
      `http://localhost:8080/api/dangky/${idDangKy}/cancel`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Gửi thêm thời gian hủy nếu backend cần, hoặc backend tự lấy thời gian hiện tại
        body: JSON.stringify({
          thoiGianHuy: new Date().toISOString(),
        }),
      }
    );
    if (!response.ok) throw new Error("Lỗi khi hủy gói dịch vụ");
    alert("Đã hủy gói dịch vụ thành công!");
    window.location.reload();
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Có lỗi xảy ra khi hủy gói dịch vụ");
  }
};

// Load danh sách khi trang được tải
document.addEventListener("DOMContentLoaded", async () => {
  await layDanhSachGoiDichVu();

  // Kiểm tra gói hiện tại của khách hàng
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/dangky/khachhang/${user.idLienKet}`
      );
      if (response.ok) {
        const dangKyList = await response.json();

        // Lọc gói đang sử dụng
        const goiDangDung = dangKyList.find(
          (dk) => dk.trangThai === "Đang hoạt động"
        );
        // Lọc các gói đã hết hạn (chỉ trạng thái "Hết hạn" hoặc "Đã hủy")
        const goiHetHan = dangKyList.filter(
          (dk) => dk.trangThai === "Hết hạn" || dk.trangThai === "Đã hủy"
        );

        // Hiển thị gói đang sử dụng
        const goiHienTai = document.getElementById("goi-hien-tai");
        if (goiDangDung) {
          window._daCoGoiDangDung = true;
          goiHienTai.style.display = "block";
          goiHienTai.innerHTML = `
            <h3>Gói dịch vụ hiện tại</h3>
            <p><strong>Tên gói:</strong> ${goiDangDung.tenGoi}</p>
            <p><strong>Giá:</strong> ${formatCurrency(goiDangDung.gia)}</p>
            <p><strong>Thời hạn:</strong> ${goiDangDung.thoiHan || 0} tháng</p>
            <p><strong>Ngày bắt đầu:</strong> ${
              goiDangDung.ngayBatDau
                ? new Date(goiDangDung.ngayBatDau).toLocaleDateString("vi-VN")
                : ""
            }</p>
            <p><strong>Ngày kết thúc:</strong> ${
              goiDangDung.ngayKetThuc
                ? new Date(goiDangDung.ngayKetThuc).toLocaleDateString("vi-VN")
                : ""
            }</p>
            <p><strong>Trạng thái:</strong> ${goiDangDung.trangThai}</p>
            <p><strong>Giờ tập:</strong> ${goiDangDung.gioTap}</p>
            <button class="btn-register" onclick="huyGoiDangDung('${
              goiDangDung.idDangKy
            }')">Hủy gói</button>
          `;
        } else {
          window._daCoGoiDangDung = false;
          goiHienTai.style.display = "none";
        }

        // Hiển thị các gói đã hết hạn hoặc đã hủy
        let goiHetHanDiv = document.getElementById("goi-het-han");
        if (!goiHetHanDiv) {
          goiHetHanDiv = document.createElement("div");
          goiHetHanDiv.id = "goi-het-han";
          goiHienTai.parentNode.insertBefore(
            goiHetHanDiv,
            goiHienTai.nextSibling
          );
        }
        if (goiHetHan.length > 0) {
          goiHetHanDiv.style.display = "block";
          goiHetHanDiv.innerHTML = `
            <h3>Các gói dịch vụ đã hết hạn/đã hủy</h3>
            <div class="expired-list" id="expired-list">
              ${goiHetHan
                .map(
                  (goi) => `
                <div class="expired-package">
                  <p class="expired-ten"><strong>${goi.tenGoi}</strong></p>
                  <p class="expired-gia">Giá: ${formatCurrency(goi.gia)}</p>
                  <p class="expired-thoihan">Thời hạn: ${
                    goi.thoiHan || 0
                  } tháng</p>
                  <p class="expired-date">Ngày bắt đầu: ${
                    goi.ngayBatDau
                      ? new Date(goi.ngayBatDau).toLocaleDateString("vi-VN")
                      : ""
                  }</p>
                  <p class="expired-date">Ngày kết thúc: ${
                    goi.ngayKetThuc
                      ? new Date(goi.ngayKetThuc).toLocaleDateString("vi-VN")
                      : ""
                  }</p>
                  <p class="expired-status">Trạng thái: ${goi.trangThai}</p>
                  <p class="expired-gio-tap">Giờ tập: ${goi.gioTap}</p>
                  ${
                    goi.trangThai === "Đã hủy" && goi.thoiGianHuy
                      ? `<p class="expired-cancel"><strong>Thời gian hủy:</strong> ${new Date(
                          goi.thoiGianHuy
                        ).toLocaleString("vi-VN")}</p>`
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>
          `;
        } else {
          goiHetHanDiv.style.display = "none";
          goiHetHanDiv.innerHTML = "";
        }

        // Cập nhật lại bảng dịch vụ để disable/enable nút đăng ký
        await layDanhSachGoiDichVu();
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin gói hiện tại:", error);
    }
  }
});

// Hàm xem chi tiết gói hết hạn (hiển thị modal)
window.xemChiTietGoiHetHan = function (goiJson) {
  const goi = JSON.parse(decodeURIComponent(goiJson));
  // Tạo modal đơn giản, bạn có thể thay bằng modal đẹp hơn nếu muốn
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.style.display = "flex";
  modal.innerHTML = `
    <div class="modal-content" style="max-width:400px;">
      <span class="close" id="close-modal-goi-het-han">&times;</span>
      <h2>Chi tiết gói đã hết hạn</h2>
      <p><strong>Tên gói:</strong> ${goi.tenGoi}</p>
      <p><strong>Giá:</strong> ${formatCurrency(goi.gia)}</p>
      <p><strong>Thời hạn:</strong> ${goi.thoiHan || 0} tháng</p>
      <p><strong>Ngày bắt đầu:</strong> ${
        goi.ngayBatDau
          ? new Date(goi.ngayBatDau).toLocaleDateString("vi-VN")
          : ""
      }</p>
      <p><strong>Ngày kết thúc:</strong> ${
        goi.ngayKetThuc
          ? new Date(goi.ngayKetThuc).toLocaleDateString("vi-VN")
          : ""
      }</p>
      <p><strong>Trạng thái:</strong> ${goi.trangThai}</p>
      <p><strong>Giờ tập:</strong> ${goi.gioTap}</p>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById("close-modal-goi-het-han").onclick = function () {
    document.body.removeChild(modal);
  };
};
