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
        alert("Cập nhật thành công!");
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (e) {
      alert("Có lỗi khi cập nhật!");
    }
    $("#btn-edit").show();
    $("#btn-save, #btn-cancel").hide();
    $(
      "#profile-name, #profile-birthyear, #profile-cccd, #profile-email, #profile-phone"
    ).show();
    $(
      "#edit-name, #edit-birthyear, #edit-cccd, #edit-email, #edit-phone"
    ).hide();
  });

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
