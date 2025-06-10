// Xử lý đặt lại mật khẩu
// Thực tế sẽ gọi API backend để cập nhật mật khẩu mới

// Hàm gọi API đặt lại mật khẩu
async function resetPasswordAPI(username, newPassword) {
  const response = await fetch(
    "http://localhost:8080/api/accounts/reset-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, newPassword }),
    }
  );
  return response.json();
}

document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorDiv = document.getElementById("resetError");
    errorDiv.textContent = "";

    if (newPassword.length < 6) {
      errorDiv.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
      return;
    }
    if (newPassword !== confirmPassword) {
      errorDiv.textContent = "Mật khẩu nhập lại không khớp.";
      return;
    }
    // Lấy username từ localStorage
    const username = localStorage.getItem("reset_username");
    if (!username) {
      errorDiv.textContent = "Không tìm thấy thông tin tài khoản.";
      return;
    }
    try {
      const result = await resetPasswordAPI(username, newPassword);
      if (result.success) {
        alert("Đặt lại mật khẩu thành công!");
        localStorage.removeItem("reset_username");
        window.location.href = "login.html";
      } else {
        errorDiv.textContent =
          result.message || "Có lỗi xảy ra, vui lòng thử lại!";
      }
    } catch (err) {
      errorDiv.textContent = "Có lỗi xảy ra, vui lòng thử lại!";
    }
  });
