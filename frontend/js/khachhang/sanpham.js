document.addEventListener("DOMContentLoaded", async () => {
  let products = [];
  let categories = [];

  // Lấy danh mục sản phẩm
  async function loadCategories() {
    const res = await fetch("http://localhost:8080/api/danhmuc");
    categories = await res.json();
    const select = document.getElementById("categoryFilter");
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.idDanhMuc;
      option.textContent = cat.tenDanhMuc;
      select.appendChild(option);
    });
  }

  // Lấy danh sách sản phẩm
  async function loadProducts() {
    const res = await fetch("http://localhost:8080/api/sanpham");
    products = await res.json();
    renderProducts(products);
    updateCartCount();
  }

  // Hiển thị sản phẩm dạng card
  function renderProducts(list) {
    const container = document.getElementById("productList");
    container.innerHTML = "";
    if (!list.length) {
      container.innerHTML = "<p>Không có sản phẩm nào.</p>";
      return;
    }
    list.forEach((sp) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${
          sp.anh ? "../../assets/" + sp.anh : "../../assets/login.jpg"
        }" class="card-img-top" alt="Ảnh sản phẩm" style="height:220px;object-fit:cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${sp.tenSanPham}</h5>
          <p class="card-text mb-1"><strong>Giá:</strong> ${sp.gia.toLocaleString()}₫</p>
          <p class="card-text mb-1"><strong>Còn lại:</strong> ${sp.soLuong}</p>
          <div class="mt-auto d-flex gap-2">
            <button class="btn btn-primary btn-detail flex-fill" data-id="${
              sp.idSanPham
            }"><i class="fas fa-eye"></i> Xem chi tiết</button>
            <button class="btn btn-success flex-fill" onclick="addToCart(${
              sp.idSanPham
            })" ${
        sp.soLuong <= 0 ? "disabled" : ""
      }><i class="fas fa-cart-plus"></i> Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    `;
      container.appendChild(col);
    });

    // Gắn sự kiện xem chi tiết
    container.querySelectorAll(".btn-detail").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = Number(this.getAttribute("data-id"));
        showProductDetail(id);
      });
    });
  }

  // Tìm kiếm và lọc
  document
    .getElementById("searchInput")
    .addEventListener("input", filterProducts);
  document
    .getElementById("categoryFilter")
    .addEventListener("change", filterProducts);

  function filterProducts() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const catId = document.getElementById("categoryFilter").value;
    let filtered = products.filter((sp) =>
      sp.tenSanPham.toLowerCase().includes(keyword)
    );
    if (catId !== "all") {
      filtered = filtered.filter(
        (sp) => sp.danhMuc && sp.danhMuc.idDanhMuc == catId
      );
    }
    renderProducts(filtered);
  }

  // Thêm vào giỏ hàng (localStorage)
  window.addToCart = function (idSanPham) {
    const sp = products.find((p) => p.idSanPham === idSanPham);
    if (!sp) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const idx = cart.findIndex((item) => item.idSanPham === idSanPham);
    if (idx > -1) {
      if (cart[idx].soLuong < sp.soLuong) cart[idx].soLuong++;
    } else {
      cart.push({
        idSanPham,
        tenSanPham: sp.tenSanPham,
        gia: sp.gia,
        soLuong: 1,
        anh: sp.anh,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Đã thêm vào giỏ hàng!");
  };

  // Cập nhật số lượng giỏ hàng
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.soLuong, 0);
    document.getElementById("cartCount").textContent = count;
  }

  function showProductDetail(idSanPham) {
    const sp = products.find((p) => p.idSanPham === idSanPham);
    if (!sp) return;
    // Đường dẫn ảnh mặc định đúng
    document.getElementById("detailImage").src =
      sp.anh || "../../assets/login.jpg";
    document.getElementById("detailName").textContent = sp.tenSanPham;
    document.getElementById("detailCategory").textContent =
      sp.danhMuc?.tenDanhMuc || "";
    document.getElementById("detailPrice").textContent =
      sp.gia.toLocaleString() + "₫";
    document.getElementById("detailQuantity").textContent = sp.soLuong;
    document.getElementById("detailDescription").textContent =
      sp.moTa || "Không có mô tả";

    // Thêm nút "Thêm vào giỏ hàng" vào modal nếu chưa có
    let btnAdd = document.getElementById("btnAddToCartModal");
    if (!btnAdd) {
      btnAdd = document.createElement("button");
      btnAdd.id = "btnAddToCartModal";
      btnAdd.className = "btn btn-success";
      btnAdd.innerHTML = '<i class="fas fa-cart-plus"></i> Thêm vào giỏ hàng';
      btnAdd.onclick = function () {
        window.addToCart(idSanPham);
      };
      document
        .querySelector("#productDetailModal .modal-footer")
        .prepend(btnAdd);
    } else {
      btnAdd.onclick = function () {
        window.addToCart(idSanPham);
      };
    }

    // Hiển thị modal
    const modal = new bootstrap.Modal(
      document.getElementById("productDetailModal")
    );
    modal.show();
  }

  await loadCategories();
  await loadProducts();
});
