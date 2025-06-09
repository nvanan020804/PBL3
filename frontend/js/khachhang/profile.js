$(document).ready(async function () {
  // Luôn luôn lấy thông tin khách hàng mới nhất từ API dựa vào idLienKet
  const idLienKet = localStorage.getItem("idLienKet");
  let khachhang = null;
  if (idLienKet) {
    try {
      const baseUrl = "http://127.0.0.1:8080";
      const response = await fetch(`${baseUrl}/api/khachhang/${idLienKet}`);
      if (response.ok) {
        khachhang = await response.json();
        // Hiển thị thông tin lên giao diện
        setProfileView(khachhang);
        localStorage.setItem("khachhang", JSON.stringify(khachhang));
      }
    } catch (e) {
      // Có thể log lỗi hoặc chuyển hướng về login
    }
  }
  if (!khachhang) {
    khachhang = JSON.parse(localStorage.getItem("khachhang"));
    if (khachhang) setProfileView(khachhang);
    else setProfileView(null);
  } // Hiệu ứng khi tải trang - nhẹ nhàng hơn
  $(".profile-container").css("opacity", "0.5").animate({ opacity: 1 }, 300);
  $(".info-row").each(function (i) {
    $(this)
      .css("opacity", "0.7")
      .delay(50 * i)
      .animate({ opacity: 1 }, 200);
  });

  // Sự kiện nút Sửa
  $("#btn-edit").click(function () {
    // Hiệu ứng chuyển đổi nhẹ nhàng hơn
    $(this).hide();
    $("#btn-save, #btn-cancel").fadeIn(150);

    // Hiện input, ẩn text với hiệu ứng nhẹ nhàng hơn
    $(
      "#profile-name, #profile-birthyear, #profile-cccd, #profile-email, #profile-phone"
    ).hide();
    $(
      "#edit-name, #edit-birthyear, #edit-cccd, #edit-email, #edit-phone"
    ).fadeIn(150);

    // Gán giá trị input
    $("#edit-name").val(khachhang?.tenKhachHang || "");
    $("#edit-birthyear").val(khachhang?.namSinh || "");
    $("#edit-cccd").val(khachhang?.cccd || "");
    $("#edit-email").val(khachhang?.email || "");
    $("#edit-phone").val(khachhang?.soDienThoai || "");

    // Tạo hiệu ứng nhấn mạnh
    $(".profile-container").addClass("editing");
  });
  // Sự kiện nút Quay lại
  $("#btn-cancel").click(function () {
    // Hiệu ứng chuyển đổi nhẹ nhàng hơn
    $(this).hide();
    $("#btn-save").hide();
    $("#btn-edit").fadeIn(150);

    // Hiện text, ẩn input với hiệu ứng nhẹ nhàng hơn
    $(
      "#edit-name, #edit-birthyear, #edit-cccd, #edit-email, #edit-phone"
    ).hide();
    $(
      "#profile-name, #profile-birthyear, #profile-cccd, #profile-email, #profile-phone"
    ).fadeIn(150);

    // Xóa hiệu ứng nhấn mạnh
    $(".profile-container").removeClass("editing");
  });

  // Sự kiện nút Lưu
  $("#btn-save").click(async function () {
    const updated = {
      tenKhachHang: $("#edit-name").val(),
      namSinh: $("#edit-birthyear").val(),
      cccd: $("#edit-cccd").val(),
      email: $("#edit-email").val(),
      soDienThoai: $("#edit-phone").val(),
      trangThai: khachhang?.trangThai || "",
    };
    try {
      const baseUrl = "http://127.0.0.1:8080";
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
        showNotification("Cập nhật thông tin thành công!");
      } else {
        showNotification("Cập nhật thất bại! Vui lòng thử lại.", "error");
      }
    } catch (e) {
      showNotification("Có lỗi khi cập nhật!", "error");
    } // Hiệu ứng chuyển đổi nhẹ nhàng hơn
    $("#btn-save, #btn-cancel").hide();
    $("#btn-edit").fadeIn(150);

    // Hiện text, ẩn input với hiệu ứng nhẹ nhàng hơn
    $(
      "#edit-name, #edit-birthyear, #edit-cccd, #edit-email, #edit-phone"
    ).hide();
    $(
      "#profile-name, #profile-birthyear, #profile-cccd, #profile-email, #profile-phone"
    ).fadeIn(150);

    // Xóa hiệu ứng nhấn mạnh
    $(".profile-container").removeClass("editing");
  });

  // Hàm hiển thị thông báo
  function showNotification(message, type = "success") {
    // Kiểm tra xem đã có notification hay chưa
    if ($(".notification").length === 0) {
      $("body").append('<div class="notification"></div>');
    }

    // Thiết lập class dựa vào loại thông báo
    let notifClass = "notification-" + type;
    let icon =
      type === "success"
        ? '<i class="fas fa-check-circle"></i>'
        : '<i class="fas fa-exclamation-circle"></i>';
    $(".notification")
      .removeClass()
      .addClass("notification " + notifClass)
      .html(icon + " " + message)
      .fadeIn(200)
      .delay(2000)
      .fadeOut(300);
  }

  function setProfileView(khachhang) {
    if (khachhang) {
      $("#profile-name").text(khachhang.tenKhachHang || "N/A");
      $("#profile-birthyear").text(khachhang.namSinh || "N/A");
      $("#profile-cccd").text(khachhang.cccd || "N/A");
      $("#profile-email").text(khachhang.email || "N/A");
      $("#profile-phone").text(khachhang.soDienThoai || "N/A");
    } else {
      $("#profile-name").text("Không tìm thấy thông tin khách hàng!");
      $("#profile-birthyear").text("N/A");
      $("#profile-cccd").text("N/A");
      $("#profile-email").text("N/A");
      $("#profile-phone").text("N/A");
    }
    // Luôn ẩn input khi load lại
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
