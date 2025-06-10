// Khởi tạo biến toàn cục
let danhSachGoi = [];
window._daCoGoiDangDung = false;

// Hàm tải danh sách gói dịch vụ từ server
async function layDanhSachGoiDichVu() {
  try {
    const response = await fetch("http://localhost:8080/api/goidichvu");
    if (!response.ok) {
      throw new Error("Không thể lấy danh sách gói dịch vụ");
    }
    
    danhSachGoi = await response.json();
    capNhatGiaoDienDanhSachGoi(danhSachGoi);
  } catch (error) {
    console.error("Lỗi:", error);
    const container = document.getElementById("goi-list");
    if (container) {
      container.innerHTML = `
        <div class="error-message" style="width: 100%; text-align: center; margin-top: 20px; color: #DA2128; font-size: 16px;">
          <p>Có lỗi khi tải danh sách gói dịch vụ. Vui lòng thử lại sau.</p>
        </div>
      `;
    }
  }
}

// Hàm cập nhật giao diện danh sách gói
function capNhatGiaoDienDanhSachGoi(danhSachGoi) {
  const container = document.getElementById("goi-list");
  if (!container) {
    console.error("Element with ID 'goi-list' not found");
    return;
  }
  container.innerHTML = "";

  danhSachGoi.forEach((goi) => {
    const goiElement = document.createElement("div");
    goiElement.className = "goi-card";
    goiElement.innerHTML = `
      <img src="../../assets/goidichvu/goi1.jpg" alt="">
      <div class="goi-info">
        <div class="goi-ten">${goi.tenGoi}</div>
        <div class="goi-gia">${formatCurrency(goi.gia)}</div>
        <div class="goi-thoihan">Thời hạn: ${goi.thoiGian || 0} tháng</div>
        <div class="goi-mota">${goi.moTa || mota(goi.id)}</div>
        <button onclick="dangKyGoi(${goi.id})" class="btn-register" ${
      window._daCoGoiDangDung ? "disabled" : ""
    }>Đăng ký</button>
      </div>
    `;
    container.appendChild(goiElement);
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
      // 1. Tạo yêu cầu đăng ký với trạng thái "Chờ xác nhận"
      const dangkyRes = await fetch("http://localhost:8080/api/dangky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idKhachHang: user.idLienKet,
          idGOI: idGoi,
          ngayBatDau: new Date().toISOString().split("T")[0],
          trangThai: "Chờ xác nhận", // Trạng thái ban đầu là chờ xác nhận, không phải Đang hoạt động
          gioTap: gioTap,
          phuongThucThanhToan: phuongThuc,
        }),
      });
      
      if (!dangkyRes.ok) throw new Error("Lỗi khi tạo yêu cầu đăng ký gói dịch vụ");
      
      // 2. Lấy dữ liệu đăng ký vừa tạo
      const dangKyData = await dangkyRes.json();
      
      // 3. Tạo hóa đơn liên kết với đăng ký
      const hoaDonRes = await fetch("http://localhost:8080/api/hoadon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dangKy: {
            idDangKy: dangKyData.idDangKy
          },
          trangThai: "Chờ xác nhận",
          tongTien: goi.gia,
          giamGia: 0,
          thanhToan: goi.gia,
          phuongThuc: phuongThuc,
          trangThaiThanhToan: "Chưa thanh toán"
        }),
      });
      
      if (!hoaDonRes.ok) throw new Error("Lỗi khi tạo hóa đơn cho đăng ký");
      
      // 4. Hiển thị thông báo thành công
      window.showModalHoaDon(goi, user, gioTap, phuongThuc, "Chờ xác nhận");
      
      // 5. Thông báo chi tiết
      setTimeout(() => {
        alert("Đăng ký gói dịch vụ thành công! Vui lòng chờ admin xác nhận và kích hoạt gói của bạn.");
      }, 1000);
      
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi đăng ký gói dịch vụ: " + error.message);
    }
  });
};

// Hàm xử lý hủy gói dịch vụ
window.huyGoiDangDung = async function (idDangKy) {
  if (!confirm("Bạn có chắc chắn muốn hủy gói dịch vụ hiện tại? Sau khi hủy, gói dịch vụ sẽ ngừng hoạt động ngay lập tức.")) return;
  try {
    // Gửi yêu cầu hủy, backend sẽ lưu lại thời gian hủy là thời gian hiện tại
    const response = await fetch(
      `http://localhost:8080/api/dangky/${idDangKy}/cancel`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi hủy gói dịch vụ");
    }
    
    alert("Đã hủy gói dịch vụ thành công!");
    // Tải lại trang để cập nhật thông tin
    location.reload();
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

        // Lọc gói đang sử dụng hoặc đang chờ xác nhận
        const goiDangDung = dangKyList.find(
          (dk) => dk.trangThai === "Đang hoạt động"
        );
        
        // Lọc gói đang chờ xác nhận
        const goiChoXacNhan = dangKyList.find(
          (dk) => dk.trangThai === "Chờ xác nhận"
        );
        
        // Lọc các gói đã hết hạn (chỉ trạng thái "Hết hạn" hoặc "Đã hủy")
        const goiHetHan = dangKyList.filter(
          (dk) => dk.trangThai === "Hết hạn" || dk.trangThai === "Đã hủy"
        );

        // Hiển thị gói đang sử dụng hoặc đang chờ xác nhận
        const goiHienTai = document.getElementById("goi-hien-tai");
        
        // Kiểm tra tồn tại của element trước khi thao tác
        if (goiHienTai) {
          // Nếu có gói đang sử dụng, hiển thị thông tin gói đó
          if (goiDangDung) {
            window._daCoGoiDangDung = true;
            goiHienTai.style.display = "block";
            goiHienTai.className = "active-package";
            goiHienTai.innerHTML = `
              <div class="active-package-header">
                <h3 style="color: white !important;">Gói dịch vụ hiện tại</h3>
              </div>
              <div class="active-package-content">
                <p><strong>Tên gói:</strong> ${goiDangDung.tenGoi}</p>
                <p><strong>Giá:</strong> ${formatCurrency(goiDangDung.gia)}</p>
                <p><strong>Thời hạn:</strong> ${goiDangDung.thoiHan || 0} tháng</p>
                <p><strong>Trạng thái:</strong> <span class="package-badge badge-active">Đang hoạt động</span></p>
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
                <p><strong>Giờ tập:</strong> ${goiDangDung.gioTap}</p>
                <button class="cancel-btn" onclick="huyGoiDangDung('${
                  goiDangDung.idDangKy
                }')">Hủy gói</button>
              </div>
            `;
          } else if (goiChoXacNhan) {
            // Nếu có gói đang chờ xác nhận, hiển thị nó
            window._daCoGoiDangDung = true; // Vẫn đánh dấu là có gói để vô hiệu hóa các nút đăng ký gói mới
            goiHienTai.style.display = "block";
            goiHienTai.className = "active-package";
            goiHienTai.innerHTML = `
              <div class="active-package-header">
                <h3 style="color: white !important;">Gói dịch vụ đã đăng ký</h3>
              </div>
              <div class="active-package-content">
                <p><strong>Tên gói:</strong> ${goiChoXacNhan.tenGoi}</p>
                <p><strong>Giá:</strong> ${formatCurrency(goiChoXacNhan.gia)}</p>
                <p><strong>Thời hạn:</strong> ${goiChoXacNhan.thoiHan || 0} tháng</p>
                <p><strong>Trạng thái:</strong> <span class="package-badge badge-pending">Chờ xác nhận</span></p>
                <p><strong>Ngày đăng ký:</strong> ${
                  goiChoXacNhan.ngayBatDau
                    ? new Date(goiChoXacNhan.ngayBatDau).toLocaleDateString("vi-VN")
                    : ""
                }</p>
                <p><strong>Giờ tập:</strong> ${goiChoXacNhan.gioTap || "Chưa xác định"}</p>
                
                <div class="pending-notice">
                  <strong>Lưu ý:</strong> Đăng ký của bạn đang chờ xác nhận và thanh toán từ admin. 
                  Gói dịch vụ sẽ được kích hoạt sau khi admin xác nhận thanh toán.
                </div>
              </div>
            `;
          } else {
            window._daCoGoiDangDung = false;
            goiHienTai.style.display = "none";
          }
        } else {
          console.error("Element with ID 'goi-hien-tai' not found");
        }

        // Hiển thị các gói đã hết hạn hoặc đã hủy
        if (goiHetHan && goiHetHan.length > 0) {
          const goiHetHanContainer = document.getElementById("goi-het-han");
          if (goiHetHanContainer) {
            goiHetHanContainer.style.display = "block";
            goiHetHanContainer.className = "history-section";
            
            // Tạo một hàm để lấy class badge dựa trên trạng thái
            const getStatusBadgeClass = (trangThai) => {
              switch(trangThai) {
                case "Đã hết hạn":
                case "Hết hạn":
                  return "badge-expired";
                case "Đang hoạt động":
                  return "badge-active";
                case "Chờ xác nhận":
                  return "badge-pending";
                case "Đã hủy":
                  return "badge-expired";
                default:
                  return "";
              }
            };
            
            const goiHetHanList = goiHetHan.map(goi => {
              const endDate = goi.ngayKetThuc ? new Date(goi.ngayKetThuc) : null;
              const isPast = endDate ? endDate < new Date() : false;
              const badgeClass = getStatusBadgeClass(goi.trangThai);
              
              return `
              <div class="expired-package-item">
                <div class="expired-date">
                  ${new Date(goi.ngayBatDau).toLocaleDateString("vi-VN")}
                </div>
                <div class="expired-details">
                  <h4>${goi.tenGoi}</h4>
                  <p><strong>Giá:</strong> ${formatCurrency(goi.gia)}</p>
                  <p><strong>Thời hạn:</strong> ${goi.thoiHan || 0} tháng</p>
                  <p><strong>Ngày bắt đầu:</strong> ${new Date(goi.ngayBatDau).toLocaleDateString("vi-VN")}</p>
                  <p><strong>Ngày kết thúc:</strong> ${endDate ? endDate.toLocaleDateString("vi-VN") : "N/A"}</p>
                  <p><strong>Trạng thái:</strong> <span class="status-badge ${badgeClass}">${goi.trangThai}</span></p>
                </div>
              </div>
              `;
            }).join("");
            
            const historyContent = goiHetHan.length > 0 ? `
              <div class="expired-packages">
                ${goiHetHanList}
              </div>
            ` : `
              <div class="empty-history">
                <i class="fas fa-history"></i>
                <p>Bạn chưa có lịch sử đăng ký nào.</p>
              </div>
            `;
            
            goiHetHanContainer.innerHTML = `
              <div class="history-header">
                <h3 class="history-title">Lịch sử đăng ký</h3>
                ${goiHetHan.length > 3 ? '<button class="view-all-btn" onclick="showModalGoiHetHan(' + JSON.stringify(goiHetHan) + ')">Xem tất cả</button>' : ''}
              </div>
              ${historyContent}
            `;
          } else {
            console.error("Element with ID 'goi-het-han' not found");
          }
        }
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra gói hiện tại:", error);
    }
  }
});

// Hàm mô tả gói
function mota(id) {
  const descriptions = {
    1: "Tập luyện không giới hạn số buổi trong tháng",
    2: "Được sử dụng phòng xông hơi",
    3: "Được huấn luyện viên cá nhân 1 lần/tuần"
  };
  return descriptions[id] || "Miễn phí vào cửa, sử dụng các dịch vụ cơ bản";
}

// Hiển thị modal lịch sử gói
window.showModalGoiHetHan = function (goiHetHan) {
  const modal = document.createElement("div");
  modal.id = "modal-goi-het-han";
  modal.className = "modal";
  
  // Function to determine badge class
  const getStatusBadgeClass = (trangThai) => {
    switch(trangThai) {
      case "Đã hết hạn":
      case "Hết hạn":
        return "badge-expired";
      case "Đang hoạt động":
        return "badge-active";
      case "Chờ xác nhận":
        return "badge-pending";
      case "Đã hủy":
        return "badge-expired";
      default:
        return "";
    }
  };
  
  // Sort packages by date (newest first)
  const sortedGoiHetHan = [...goiHetHan].sort((a, b) => 
    new Date(b.ngayBatDau) - new Date(a.ngayBatDau)
  );
  
  modal.innerHTML = `
    <div class="modal-content">
      <span id="close-modal-goi-het-han" class="close">&times;</span>
      <h2>Lịch sử đăng ký gói dịch vụ</h2>
      <div class="goi-het-han-list">
        ${sortedGoiHetHan.map(goi => {
          const badgeClass = getStatusBadgeClass(goi.trangThai);
          return `
          <div class="goi-het-han-item">
            <p><strong>Tên gói:</strong> ${goi.tenGoi}</p>
            <p><strong>Giá:</strong> ${formatCurrency(goi.gia)}</p>
            <p><strong>Thời hạn:</strong> ${goi.thoiHan || 0} tháng</p>
            <p><strong>Ngày bắt đầu:</strong> ${new Date(goi.ngayBatDau).toLocaleDateString("vi-VN")}</p>
            <p><strong>Ngày kết thúc:</strong> ${goi.ngayKetThuc ? new Date(goi.ngayKetThuc).toLocaleDateString("vi-VN") : "N/A"}</p>
            <p><strong>Trạng thái:</strong> <span class="status-badge ${badgeClass}">${goi.trangThai}</span></p>
          </div>
        `}).join("")}
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <button class="view-all-btn" style="width: 120px;" id="close-history-btn">Đóng</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  // Close modal using X button
  document.getElementById("close-modal-goi-het-han").onclick = function () {
    document.body.removeChild(modal);
  };
  
  // Close modal using the close button
  document.getElementById("close-history-btn").onclick = function () {
    document.body.removeChild(modal);
  };
  
  // Close modal when clicking outside
  window.onclick = function(event) {
    if (event.target === modal) {
      document.body.removeChild(modal);
    }
  };
};
