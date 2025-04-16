const form = document.getElementById("form-login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = form.querySelector("input[name='username']").value;
  const password = form.querySelector("input[name='password']").value;

  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/accounts/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(`Đăng nhập thành công! Vai trò: ${result.role}`);
      // Chuyển hướng sau khi đăng nhập thành công
      window.location.href = "../index.html";
    } else {
      alert(
        result.message || "Đăng nhập thất bại, sai tài khoản hoặc mật khẩu"
      );
    }
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Lỗi kết nối đến server");
  }
});
