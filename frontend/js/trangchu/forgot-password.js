// Hàm gọi API quên mật khẩu
async function forgotPasswordAPI(username, contact) {
  // Gọi API backend kiểm tra username và contact (email/sdt)
  const response = await fetch(
    "http://localhost:8080/api/accounts/forgot-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, contact }),
    }
  );
  return response.json();
}

// Xử lý submit form quên mật khẩu
const form = document.getElementById("forgotPasswordForm");
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const errorDiv = document.getElementById("forgotError");
  errorDiv.textContent = "";

  if (!username || !contact) {
    errorDiv.textContent = "Vui lòng nhập đầy đủ thông tin.";
    return;
  }

  try {
    const result = await forgotPasswordAPI(username, contact);
    if (result.success) {
      // Lưu username vào localStorage để dùng cho reset password
      localStorage.setItem("reset_username", username);
      window.location.href = "reset-password.html";
    } else {
      errorDiv.textContent = result.message || "Thông tin không chính xác!";
    }
  } catch (err) {
    errorDiv.textContent = "Có lỗi xảy ra, vui lòng thử lại!";
  }
});
