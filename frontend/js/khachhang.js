// khachhang.js
const customers = [
  {
    name: "Nguyễn Văn A",
    phone: "0123456789",
    expiry: "2025-05-10",
    note: "Đã thanh toán",
  },
  {
    name: "Trần Thị B",
    phone: "0987654321",
    expiry: "2025-04-20",
    note: "Sắp hết hạn",
  },
  {
    name: "Lê Văn C",
    phone: "0112233445",
    expiry: "2025-03-30",
    note: "Chưa gia hạn",
  },
];

function daysLeft(expiryDate) {
  const now = new Date();
  const exp = new Date(expiryDate);
  const diff = Math.floor((exp - now) / (1000 * 60 * 60 * 24));
  return diff;
}

function renderCustomers() {
  const list = document.getElementById("customerList");
  const detail = document.getElementById("customerDetail");
  let active = 0,
    warning = 0,
    expired = 0;
  list.innerHTML = "";

  customers.forEach((c, index) => {
    const d = daysLeft(c.expiry);
    let status = "green";
    if (d <= 7 && d >= 0) status = "yellow";
    else if (d < 0) status = "red";

    if (status === "green") active++;
    if (status === "yellow") warning++;
    if (status === "red") expired++;

    const card = document.createElement("div");
    card.className = `card ${
      status === "yellow" ? "warning" : status === "red" ? "expired" : ""
    }`;
    card.innerHTML = `
        <h3>${c.name}</h3>
        <p>📞 ${c.phone}</p>
        <p>⏳ Hết hạn: ${c.expiry}</p>
      `;
    card.onclick = () => {
      detail.classList.remove("hidden");
      detail.innerHTML = `
          <h3>${c.name}</h3>
          <p>Số điện thoại: ${c.phone}</p>
          <p>Ngày hết hạn: ${c.expiry}</p>
          <p>Ghi chú: ${c.note}</p>
        `;
    };

    list.appendChild(card);
  });

  document.getElementById("activeCount").textContent = active;
  document.getElementById("warningCount").textContent = warning;
  document.getElementById("expiredCount").textContent = expired;
}

function searchCustomers(event) {
  const keyword = event.target.value.toLowerCase();
  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(keyword)
  );
  const temp = [...customers];
  customers.length = 0;
  customers.push(...filtered);
  renderCustomers();
  customers.length = 0;
  customers.push(...temp);
}

document
  .getElementById("searchInput")
  .addEventListener("input", searchCustomers);

renderCustomers();
