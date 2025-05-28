function formatCurrency(amount) {
  if (!amount) return "0 ₫";
  return amount.toLocaleString("vi-VN") + "₫";
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContent = document.getElementById("cartContent");
  if (!cart.length) {
    cartContent.innerHTML =
      '<div class="cart-empty"><i class="fas fa-box-open fa-2x mb-2"></i><br>Giỏ hàng của bạn đang trống!</div>';
    return;
  }
  let total = 0;
  cartContent.innerHTML = `
    <div class="table-responsive">
      <table class="table cart-table align-middle">
        <thead class="table-light">
          <tr>
            <th></th>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th class="cart-actions">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${cart
            .map((item, idx) => {
              const itemTotal = item.gia * item.soLuong;
              total += itemTotal;
              return `
              <tr>
                <td><img src="${
                  item.anh || "../../assets/login.jpg"
                }" class="cart-img" alt=""></td>
                <td>${item.tenSanPham}</td>
                <td>${formatCurrency(item.gia)}</td>
                <td>
                  <div class="input-group input-group-sm" style="max-width:120px;">
                    <button class="btn btn-outline-secondary" onclick="updateQty(${idx}, -1)"><i class="fas fa-minus"></i></button>
                    <input type="number" min="1" class="form-control text-center" value="${
                      item.soLuong
                    }" onchange="setQty(${idx}, this.value)">
                    <button class="btn btn-outline-secondary" onclick="updateQty(${idx}, 1)"><i class="fas fa-plus"></i></button>
                  </div>
                </td>
                <td>${formatCurrency(itemTotal)}</td>
                <td>
                  <button class="btn btn-danger btn-sm" onclick="removeItem(${idx})"><i class="fas fa-trash"></i> Xóa</button>
                </td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-end align-items-center mt-3">
      <h5 class="me-4">Tổng cộng: <span class="text-danger">${formatCurrency(
        total
      )}</span></h5>
      <button class="btn btn-success btn-lg" onclick="checkout()"><i class="fas fa-credit-card"></i> Đặt hàng</button>
    </div>
  `;
}

// Hàm lấy số lượng tồn kho từ localStorage (hoặc API nếu có)
function getProductStock(idSanPham) {
  // Nếu bạn lưu số lượng tồn trong cart, lấy từ đó
  // Nếu không, nên lấy từ localStorage hoặc API sản phẩm
  // Ở đây giả sử lưu trong cart từng item: item.soLuongTon
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((i) => i.idSanPham === idSanPham);
  return item && item.soLuongTon ? item.soLuongTon : 99; // 99 là mặc định nếu không có
}

window.updateQty = async function (idx, delta) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[idx]) return;
  const idSanPham = cart[idx].idSanPham;

  // Lấy số lượng tồn kho thực tế từ API
  try {
    const res = await fetch(`http://localhost:8080/api/sanpham/${idSanPham}`);
    if (!res.ok) throw new Error();
    const sp = await res.json();
    const soLuongTon = sp.soLuong;

    let newQty = cart[idx].soLuong + delta;
    if (newQty < 1) newQty = 1;
    if (newQty > soLuongTon) {
      alert("Số lượng sản phẩm còn lại chỉ còn " + soLuongTon + "!");
      newQty = soLuongTon;
    }
    cart[idx].soLuong = newQty;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  } catch (e) {
    alert("Không kiểm tra được số lượng tồn kho!");
  }
};

window.setQty = async function (idx, value) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[idx]) return;
  const idSanPham = cart[idx].idSanPham;
  let qty = parseInt(value);
  if (isNaN(qty) || qty < 1) qty = 1;

  // Lấy số lượng tồn kho thực tế từ API
  try {
    const res = await fetch(`http://localhost:8080/api/sanpham/${idSanPham}`);
    if (!res.ok) throw new Error();
    const sp = await res.json();
    const soLuongTon = sp.soLuong;

    if (qty > soLuongTon) {
      alert("Số lượng sản phẩm còn lại chỉ còn " + soLuongTon + "!");
      qty = soLuongTon;
    }
    cart[idx].soLuong = qty;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  } catch (e) {
    alert("Không kiểm tra được số lượng tồn kho!");
  }
};

window.checkout = function () {
  alert("Chức năng đặt hàng sẽ được phát triển sau!");
};

document.addEventListener("DOMContentLoaded", renderCart);
