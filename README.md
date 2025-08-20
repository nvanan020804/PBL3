# PBL3 - Hệ Thống Quản Lý Phòng Gym & Cửa Hàng Thể Thao

## Giới thiệu

PBL3 là một ứng dụng web quản lý tích hợp cho phòng gym và cửa hàng thể thao được phát triển bằng công nghệ Full-stack. Hệ thống bao gồm Spring Boot cho backend API và HTML/CSS/JavaScript cho frontend, cung cấp đầy đủ chức năng quản lý khách hàng, dịch vụ gym, sản phẩm thể thao, hóa đơn, doanh thu và thống kê.

## 🏗️ Công nghệ sử dụng

### Backend
- **Java 17** - Ngôn ngữ lập trình chính
- **Spring Boot 3.2.4** - Framework chính
- **Spring Data JPA** - Quản lý dữ liệu
- **Spring Web** - REST API
- **Spring Validation** - Validation dữ liệu
- **Hibernate 6.4.4** - ORM Framework
- **MySQL Connector** - Database driver
- **Lombok** - Giảm thiểu boilerplate code
- **Maven** - Quản lý dependencies

### Frontend
- **HTML5** - Cấu trúc trang web
- **CSS3** - Styling và responsive design
- **JavaScript (ES6+)** - Logic frontend
- **Font Awesome** - Icon library
- **Google Fonts** (Montserrat, Oswald) - Typography

### Database
- **MySQL 8.0+** - Cơ sở dữ liệu chính
- **Flyway** - Database Migration

## 🏛️ Cấu trúc dự án

```
PBL3/
├── backend/                           # Spring Boot API
│   ├── src/main/
│   │   ├── java/PBL3/backend/
│   │   │   ├── controller/            # REST API Controllers
│   │   │   │   ├── AccountController.java
│   │   │   │   ├── KhachHangController.java  
│   │   │   │   ├── GoiDichVuController.java
│   │   │   │   ├── SanPhamController.java
│   │   │   │   ├── HoaDonController.java
│   │   │   │   ├── DoanhThuController.java
│   │   │   │   ├── ThongKeController.java
│   │   │   │   └── ...
│   │   │   ├── service/               # Business Logic Layer
│   │   │   ├── model/                 # Entity Classes
│   │   │   │   ├── Account.java
│   │   │   │   ├── KhachHang.java
│   │   │   │   ├── GoiDichVu.java
│   │   │   │   ├── SanPham.java
│   │   │   │   ├── HoaDon.java
│   │   │   │   ├── HoaDonChiTiet.java
│   │   │   │   ├── DoanhThu.java
│   │   │   │   └── ...
│   │   │   ├── repository/            # Data Access Layer
│   │   │   ├── dto/                   # Data Transfer Objects
│   │   │   └── config/                # Configuration Classes
│   │   └── resources/
│   │       ├── application.properties  # App configuration
│   │       └── db/migration/          # Database migrations
│   └── pom.xml                        # Maven dependencies
├── frontend/                          # Frontend Application
│   ├── pages/
│   │   ├── admin/                     # Admin interface
│   │   │   ├── home.html
│   │   │   ├── khachhang.html
│   │   │   ├── dichvu.html
│   │   │   ├── sanpham.html
│   │   │   ├── hoadon.html
│   │   │   ├── thongke.html
│   │   │   └── dangky.html
│   │   ├── khachhang/                 # Customer interface
│   │   └── trangchu/                  # Public pages
│   ├── css/                           # Stylesheets
│   ├── js/                            # JavaScript files
│   ├── assets/                        # Images and media
│   └── components/                    # Reusable components
└── README.md
```

## ✨ Chức năng chính


### 🔐 Quản lý tài khoản & phân quyền
![đăng nhập](album/dangnhap.png)
![đăng ký](album/dangky.png)
- Đăng nhập/Đăng xuất hệ thống
- Phân quyền người dùng: Admin, Khách hàng
- Quản lý thông tin tài khoản cá nhân

### 👥 Quản lý khách hàng
![qlkhachhang](album/qlkhachhang.png)
- Đăng ký khách hàng mới với đầy đủ thông tin
- Cập nhật thông tin khách hàng (tên, năm sinh, SĐT, CCCD, email)
- Quản lý trạng thái khách hàng
- Liên kết tài khoản với thông tin khách hàng


### 🏋️ Quản lý gói dịch vụ gym

![qlgoidichvu](album/qlgoidichvu.png)
- Tạo và quản lý các gói tập gym
- Thiết lập giá và thời hạn cho từng gói
- Đăng ký gói tập cho khách hàng
- Theo dõi thời gian còn lại của gói

### 🛍️ Quản lý sản phẩm & cửa hàng
  ![qlsanpham](album/qlsanpham.png)
- **Quản lý danh mục sản phẩm**: Tạo, sửa, xóa các danh mục
- **Quản lý sản phẩm**: 
  - Thêm sản phẩm mới với đầy đủ thông tin (tên, giá, công dụng, hình ảnh)
  - Cập nhật thông tin sản phẩm
  - Quản lý tồn kho: cập nhật số lượng, nhập hàng
  - Tìm kiếm sản phẩm theo tên và danh mục
- **Quản lý thiết bị**: Theo dõi thiết bị phòng gym

### 🧾 Quản lý hóa đơn & thanh toán
  ![qlhoadon](album/qlhoadon.png)

- **Tạo hóa đơn**: Cho gói tập và mua sản phẩm
- **Quản lý trạng thái hóa đơn**: 
  - Đã hoàn thành / Chưa hoàn thành
  - Đã thanh toán / Chưa thanh toán
  - Hủy hóa đơn
- **Chi tiết hóa đơn**: Quản lý từng sản phẩm trong hóa đơn
- **Liên kết hóa đơn**: Với khách hàng và đăng ký gói

### 📊 Thống kê & báo cáo doanh thu
  ![thongke1](album/thongke1.png)
  ![thongke2](album/thongke2.png)
- **Quản lý doanh thu**: Theo dõi tổng thu, tổng chi theo thời gian
- **Thống kê theo thời gian**:
  - Doanh thu theo ngày (từ ngày đến ngày)
  - Doanh thu theo tháng
  - Doanh thu theo năm
- **Cập nhật doanh thu**: Thêm thu nhập, chi phí vào hệ thống
- **Báo cáo**: Xuất báo cáo doanh thu chi tiết


### 👤 Chức năng dành cho Khách hàng (User)

<div align="center">

#### 🏠 Trang chủ khách hàng
![user-home](album/user-home.png)

#### 🏋️ Xem và đăng ký gói dịch vụ
![user-dichvu1](album/user-dichvu1.png)
![user-dichvu2](album/user-dichvu2.png)


#### 🛒 Mua sắm sản phẩm
![user-sanpham](album/user-sanpham.png)

#### 🛒 Hoá đơn
![user-hoadon](album/user-hoadon.png)



</div>

**Chức năng chi tiết cho khách hàng:**
- ✅ **Đăng ký/Đăng nhập**: Tạo tài khoản và truy cập hệ thống
- ✅ **Xem gói dịch vụ**: Duyệt các gói tập gym có sẵn
- ✅ **Đăng ký gói tập**: Chọn và đăng ký gói phù hợp
- ✅ **Mua sắm sản phẩm**: Duyệt và mua các sản phẩm thể thao
- ✅ **Quản lý giỏ hàng**: Thêm/xóa sản phẩm khỏi giỏ hàng
- ✅ **Thanh toán**: Thực hiện thanh toán cho gói dịch vụ và sản phẩm
- ✅ **Quản lý hồ sơ**: Cập nhật thông tin cá nhân
- ✅ **Lịch sử đăng ký**: Xem các gói đã đăng ký
- ✅ **Lịch sử mua hàng**: Theo dõi đơn hàng và hóa đơn

### 🖥️ Giao diện đa vai trò
- **Trang Admin**: Quản lý toàn bộ hệ thống
- **Trang Khách hàng**: Xem dịch vụ, đăng ký gói tập
- **Trang chủ**: Giới thiệu dịch vụ, đăng nhập
- **Giao diện responsive**: Tương thích mobile và desktop

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Java JDK 17+
- Maven 3.6+
- MySQL 8.0+
- Web Browser hiện đại

### Bước 1: Clone repository
```bash
git clone https://github.com/nvanan020804/PBL3.git
cd PBL3
```



### Bước 2: Cấu hình database
1. Tạo database MySQL:
```sql
CREATE DATABASE DATA2_PBL3;
```

2. Cập nhật cấu hình trong `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/DATA2_PBL3?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
```

### Bước 3: Chạy Backend
```bash
cd backend
./mvnw spring-boot:run
```

Backend sẽ chạy trên: http://localhost:8080

### Bước 4: Chạy Frontend
Mở file `frontend/pages/trangchu/index.html` trong trình duyệt hoặc sử dụng web server:

```bash
cd frontend
python -m http.server 3000
# hoặc
npx serve . -p 3000
```

Frontend sẽ chạy trên: http://localhost:3000

## 🔗 API Endpoints

### Khách hàng (`/api/khachhang`)
- `GET /api/khachhang` - Lấy danh sách khách hàng
- `GET /api/khachhang/{id}` - Lấy thông tin khách hàng
- `POST /api/khachhang` - Tạo khách hàng mới
- `PUT /api/khachhang/{id}` - Cập nhật khách hàng

### Gói dịch vụ (`/api/goidichvu`)
- `GET /api/goidichvu` - Lấy danh sách gói dịch vụ
- `POST /api/goidichvu` - Tạo gói dịch vụ mới
- `PUT /api/goidichvu/{id}` - Cập nhật gói dịch vụ

### Sản phẩm (`/api/sanpham`)
- `GET /api/sanpham` - Lấy danh sách sản phẩm
- `GET /api/sanpham/{id}` - Lấy thông tin sản phẩm
- `GET /api/sanpham/danhmuc/{idDanhMuc}` - Lấy sản phẩm theo danh mục
- `GET /api/sanpham/name/{tenSanPham}` - Tìm sản phẩm theo tên
- `POST /api/sanpham` - Tạo sản phẩm mới
- `PUT /api/sanpham/{id}` - Cập nhật sản phẩm
- `PUT /api/sanpham/{id}/soluong` - Cập nhật số lượng
- `PUT /api/sanpham/{id}/nhaphang` - Nhập hàng
- `DELETE /api/sanpham/{id}` - Xóa sản phẩm

### Danh mục (`/api/danhmuc`)
- `GET /api/danhmuc` - Lấy danh sách danh mục
- `POST /api/danhmuc` - Tạo danh mục mới
- `PUT /api/danhmuc/{id}` - Cập nhật danh mục

### Hóa đơn (`/api/hoadon`)
- `GET /api/hoadon` - Lấy danh sách hóa đơn
- `GET /api/hoadon/{id}` - Lấy thông tin hóa đơn
- `POST /api/hoadon` - Tạo hóa đơn mới
- `PUT /api/hoadon/{id}/hoanthanh` - Hoàn thành hóa đơn
- `PUT /api/hoadon/{id}/huy` - Hủy hóa đơn
- `PUT /api/hoadon/{id}/dathanhtoan` - Đánh dấu đã thanh toán
- `PUT /api/hoadon/{id}/chuathanhtoan` - Đánh dấu chưa thanh toán

### Thống kê (`/api/hoadon`)
- `GET /api/hoadon/revenue/day?startDate&endDate` - Doanh thu theo ngày
- `GET /api/hoadon/revenue/month?startMonth&endMonth` - Doanh thu theo tháng
- `GET /api/hoadon/revenue/year?startYear&endYear` - Doanh thu theo năm

### Doanh thu (`/api/doanhthu`)
- `GET /api/doanhthu` - Lấy danh sách doanh thu
- `POST /api/doanhthu` - Tạo bản ghi doanh thu
- `PUT /api/doanhthu/{id}/themthu` - Thêm thu nhập
- `PUT /api/doanhthu/{id}/themchi` - Thêm chi phí

## 🗄️ Cấu trúc Database

### Các bảng chính:
- `accounts` - Quản lý tài khoản đăng nhập
- `khachhang` - Thông tin khách hàng
- `goidichvu` - Các gói dịch vụ gym
- `dangky` - Đăng ký gói tập của khách hàng
- `sanpham` - Sản phẩm thể thao
- `phanloaisanpham` - Danh mục sản phẩm
- `hoadon` - Hóa đơn bán hàng
- `hoadonchitiet` - Chi tiết từng sản phẩm trong hóa đơn
- `doanhthu` - Thống kê doanh thu theo thời gian
- `thietbi` - Thiết bị phòng gym

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phát triển cho mục đích học tập trong khuôn khổ môn học PBL3.

## 📞 Liên hệ

- **Repository**: [nvanan020804/PBL3](https://github.com/nvanan020804/PBL3)
- **Branch hiện tại**: An

---

**Lưu ý**: Đảm bảo cấu hình đúng thông tin database và khởi động MySQL trước khi chạy ứng dụng.
