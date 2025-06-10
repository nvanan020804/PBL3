$(document).ready(async function () {
  // Định nghĩa các hàm tiện ích
  function showNotification(message, type = "success") {
    const notification = $("#notification");
    notification.text(message);
    notification
      .removeClass("notification-success notification-error")
      .addClass(`notification-${type}`);
    notification.fadeIn();

    // Auto hide after 5 seconds
    setTimeout(() => {
      notification.fadeOut();
    }, 5000);
  }

  // Luôn luôn lấy thông tin khách hàng mới nhất từ API dựa vào idLienKet
  const baseUrl = "http://127.0.0.1:8080";
  const idLienKet = localStorage.getItem("idLienKet");
  let khachhang = null;

  if (idLienKet) {
    try {
      const response = await fetch(`${baseUrl}/api/khachhang/${idLienKet}`);
      if (response.ok) {
        khachhang = await response.json();
        // Hiển thị thông tin lên giao diện
        setProfileView(khachhang);
        localStorage.setItem("khachhang", JSON.stringify(khachhang));
      } else {
        showNotification("Không thể tải thông tin tài khoản", "error");
      }
    } catch (e) {
      showNotification("Lỗi kết nối đến máy chủ", "error");
      console.error("Error fetching profile:", e);
    }
  }

  if (!khachhang) {
    khachhang = JSON.parse(localStorage.getItem("khachhang"));
    if (khachhang) setProfileView(khachhang);
    else {
      setProfileView(null);
      showNotification("Vui lòng đăng nhập để xem thông tin", "error");
    }
  }

  // Sự kiện nút Sửa
  $("#btn-edit").click(function () {
    $("#btn-edit").hide();
    $("#btn-save, #btn-cancel").show();
    // Hiện input, ẩn text
    $(
      "#profile-name, #profile-birthyear, #profile-cccd, #profile-email, #profile-phone"
    ).hide();
    $(
      "#edit-name, #edit-birthyear, #edit-cccd, #edit-email, #edit-phone"
    ).show();
    // Gán giá trị input
    $("#edit-name").val(khachhang?.tenKhachHang || "");
    $("#edit-birthyear").val(khachhang?.namSinh || "");
    $("#edit-cccd").val(khachhang?.cccd || "");
    $("#edit-email").val(khachhang?.email || "");
    $("#edit-phone").val(khachhang?.soDienThoai || "");
  });

  // Sự kiện nút Quay lại
  $("#btn-cancel").click(function () {
    $("#btn-edit").show();
    $("#btn-save, #btn-cancel").hide();
    $(
      "#profile-name, #profile-birthyear, #profile-cccd, #profile-email, #profile-phone"
    ).show();
    $(
      "#edit-name, #edit-birthyear, #edit-cccd, #edit-email, #edit-phone"
    ).hide();
  });
  // Sự kiện nút Lưu
  $("#btn-save").click(async function () {
    // Validate form fields before submission
    const name = $("#edit-name").val();
    const birthYear = $("#edit-birthyear").val();
    const cccd = $("#edit-cccd").val();
    const email = $("#edit-email").val();
    const phone = $("#edit-phone").val();

    // Basic validation
    if (!name || name.trim() === "") {
      showNotification("Vui lòng nhập họ tên", "error");
      $("#edit-name").focus();
      return;
    }

    if (
      birthYear &&
      (birthYear < 1900 || birthYear > new Date().getFullYear())
    ) {
      showNotification("Năm sinh không hợp lệ", "error");
      $("#edit-birthyear").focus();
      return;
    }

    if (email && !isValidEmail(email)) {
      showNotification("Email không hợp lệ", "error");
      $("#edit-email").focus();
      return;
    }

    if (phone && !isValidPhone(phone)) {
      showNotification("Số điện thoại không hợp lệ", "error");
      $("#edit-phone").focus();
      return;
    }

    // Create updated object with validated data
    const updated = {
      tenKhachHang: name,
      namSinh: birthYear,
      cccd: cccd,
      email: email,
      soDienThoai: phone,
      trangThai: khachhang?.trangThai || "",
    };

    // Show loading state
    $("#btn-save")
      .prop("disabled", true)
      .html('<i class="fas fa-spinner fa-spin"></i> Đang lưu...');

    try {
      const response = await fetch(`${baseUrl}/api/khachhang/${idLienKet}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (response.ok) {
        const newData = await response.json();
        localStorage.setItem("khachhang", JSON.stringify(newData));
        setProfileView(newData);
        khachhang = newData;
        showNotification("Cập nhật thông tin thành công!", "success");
      } else {
        const errorData = await response.json().catch(() => null);
        showNotification(errorData?.message || "Cập nhật thất bại!", "error");
      }
    } catch (e) {
      console.error("Update error:", e);
      showNotification("Có lỗi khi kết nối đến máy chủ", "error");
    } finally {
      // Reset button state
      $("#btn-save")
        .prop("disabled", false)
        .html('<i class="fas fa-save"></i> Lưu thay đổi');

      // Return to view mode
      $("#btn-edit").show();
      $("#btn-save, #btn-cancel").hide();
      $(
        "#profile-name, #profile-birthyear, #profile-cccd, #profile-email, #profile-phone"
      ).show();
      $(
        "#edit-name, #edit-birthyear, #edit-cccd, #edit-email, #edit-phone"
      ).hide();
    }
  });

  // Helper validation functions
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[0-9]{10}$/.test(phone);
  }
  function setProfileView(khachhang) {
    if (khachhang) {
      // Format data for display
      const getDisplayValue = (value) =>
        value ||
        "<span style='color:#aaa;font-style:italic'>Chưa cập nhật</span>";

      $("#profile-name").html(getDisplayValue(khachhang.tenKhachHang));
      $("#profile-birthyear").html(getDisplayValue(khachhang.namSinh));
      $("#profile-cccd").html(getDisplayValue(khachhang.cccd));
      $("#profile-email").html(getDisplayValue(khachhang.email));
      $("#profile-phone").html(getDisplayValue(khachhang.soDienThoai));

      // Update page title with user name if available
      if (khachhang.tenKhachHang) {
        document.title = `Hồ sơ của ${khachhang.tenKhachHang}`;
      }
    } else {
      $("#profile-name").html(
        "<span style='color:#e74a3b'>Không tìm thấy thông tin khách hàng!</span>"
      );
      $("#profile-birthyear").html("<span style='color:#aaa'>--</span>");
      $("#profile-cccd").html("<span style='color:#aaa'>--</span>");
      $("#profile-email").html("<span style='color:#aaa'>--</span>");
      $("#profile-phone").html("<span style='color:#aaa'>--</span>");

      // Disable edit button if no customer data
      $("#btn-edit").prop("disabled", true);
    }

    // Always reset to view mode when refreshing data
    $(
      "#edit-name, #edit-birthyear, #edit-cccd, #edit-email, #edit-phone"
    ).hide();
    $(
      "#profile-name, #profile-birthyear, #profile-cccd, #profile-email, #profile-phone"
    ).show();
    $("#btn-edit").show();
    $("#btn-save, #btn-cancel").hide();
  }
});
