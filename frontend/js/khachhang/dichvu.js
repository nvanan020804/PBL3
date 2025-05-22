// Hàm để lấy danh sách gói dịch vụ từ API
async function layDanhSachGoiDichVu() {
  try {
    const response = await fetch("http://localhost:8080/api/goidichvu");
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu từ server");
    }
    const data = await response.json();
    console.log("Dữ liệu từ API:", data);
    hienThiDanhSachGoiDichVu(data);
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Có lỗi xảy ra khi lấy danh sách gói dịch vụ");
  }
}

// Hàm để hiển thị danh sách gói dịch vụ lên bảng
function hienThiDanhSachGoiDichVu(danhSachGoi) {
  const tbody = document.querySelector("#dichvu-table tbody");
  tbody.innerHTML = ""; // Xóa dữ liệu cũ

  danhSachGoi.forEach((goi, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${goi.tenGoi}</td>
            <td>${formatCurrency(goi.gia)}</td>
            <td>${goi.thoiGian || 0} tháng</td>
            <td>${goi.moTa || "Không có mô tả"}</td>
            <td>
                <button onclick="dangKyGoi(${
                  goi.id
                })" class="btn-register">Đăng ký</button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// Hàm format tiền tệ
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Hàm xử lý đăng ký gói dịch vụ
async function dangKyGoi(idGoi) {
  // Kiểm tra đăng nhập
  const userJson = localStorage.getItem("user");
  if (!userJson) {
    alert("Vui lòng đăng nhập để đăng ký gói dịch vụ!");
    window.location.href = "../trangchu/login.html";
    return;
  }

  const user = JSON.parse(userJson);

  // Hiển thị form đăng ký
  document.querySelector(".table-container").style.display = "none";
  const formDangKy = document.getElementById("form-dang-ky");
  formDangKy.style.display = "block";

  // Lưu ID gói đang đăng ký
  formDangKy.dataset.goiId = idGoi;
}

// Xử lý submit form đăng ký
document
  .getElementById("dangky-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const gioTap = document.getElementById("gio-tap").value;
    const idGoi = this.dataset.goiId;
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch("http://localhost:8080/api/dangky", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idKhachHang: user.idLienKet,
          idGOI: idGoi,
          ngayBatDau: new Date().toISOString().split("T")[0],
          trangThai: "pending",
          gioTap: gioTap,
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi đăng ký gói dịch vụ");
      }

      alert(
"Đăng ký gói dịch vụ thành công! Vui lòng chờ xác nhận từ nhân viên."
      );
      window.location.reload();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi đăng ký gói dịch vụ");
    }
  });

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
        const dangKyHienTai = await response.json();
        if (dangKyHienTai && dangKyHienTai.length > 0) {
          const goiHienTai = document.getElementById("goi-hien-tai");
          goiHienTai.style.display = "block";
          goiHienTai.innerHTML = `
                        <h3>Gói dịch vụ hiện tại</h3>
                        <p>Tên gói: ${dangKyHienTai[0].tenGoi}</p>
                        <p>Ngày bắt đầu: ${new Date(
                          dangKyHienTai[0].ngayBatDau
                        ).toLocaleDateString("vi-VN")}</p>
                        <p>Trạng thái: ${dangKyHienTai[0].trangThai}</p>
                        <p>Giờ tập: ${dangKyHienTai[0].gioTap}</p>
                    `;
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin gói hiện tại:", error);
    }
  }
});