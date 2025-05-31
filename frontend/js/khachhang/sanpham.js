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
  }

  // Hiển thị sản phẩm dạng card
  function renderProducts(list) {
    const container = document.getElementById("productsContainer");
    container.innerHTML = "";

    if (!list.length) {
      container.innerHTML =
        '<div class="col-12 text-center">Không có sản phẩm nào!</div>';
      return;
    }

    list.forEach((sp) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.innerHTML = `
      <div class="card h-100 product-card">
        <div class="position-relative">
          <img src="${sp.hinhAnh || '../../assets/goidichvu/goi1.jpg'}" 
               class="card-img-top product-image" 
               alt="${sp.tenSanPham}" 
               style="height:220px;object-fit:cover;">
          ${
            sp.soLuong <= 0
              ? '<div class="product-status status-outofstock">Hết hàng</div>'
              : sp.soLuong <= 10
              ? '<div class="product-status status-lowstock">Sắp hết</div>'
              : '<div class="product-status status-instock">Còn hàng</div>'
          }
        </div>
        <div class="card-body d-flex flex-column">  
          <h5 class="card-title product-title">${sp.tenSanPham}</h5>
          <p class="card-text mb-1"><strong>Giá:</strong> ${sp.gia.toLocaleString()}₫</p>
          <p class="card-text mb-1"><strong>Còn lại:</strong> ${sp.soLuong}</p>
          <div class="mt-auto d-flex gap-2">
            <button class="btn btn-primary btn-detail flex-fill" data-id="${sp.idSanPham}">
              <i class="fas fa-eye"></i> Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    `;
      container.appendChild(col);
    });

    // Gắn sự kiện cho nút xem chi tiết
    document.querySelectorAll('.btn-detail').forEach(btn => {
      btn.addEventListener('click', () => showProductDetail(btn.dataset.id));
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

  function showProductDetail(idSanPham) {
    const sp = products.find((p) => p.idSanPham == idSanPham);
    if (!sp) return;

    const modal = document.getElementById("productModal");
    modal.querySelector(".modal-title").textContent = sp.tenSanPham;
    modal.querySelector(".modal-body").innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <img src="${sp.hinhAnh || '../../assets/goidichvu/goi1.jpg'}" 
               class="img-fluid rounded" 
               alt="${sp.tenSanPham}"
               style="max-height: 300px; width: 100%; object-fit: cover;">
        </div>
        <div class="col-md-6">
          <p><strong>Giá:</strong> ${sp.gia.toLocaleString()}₫</p>
          <p><strong>Số lượng còn:</strong> ${sp.soLuong}</p>
          <p><strong>Danh mục:</strong> ${
            sp.danhMuc ? sp.danhMuc.tenDanhMuc : "Chưa phân loại"
          }</p>
          ${
            sp.moTa
              ? `<p><strong>Mô tả:</strong> ${sp.moTa}</p>`
              : ""
          }
        </div>
      </div>
    `;

    new bootstrap.Modal(modal).show();
  }

  await loadCategories();
  await loadProducts();
});
