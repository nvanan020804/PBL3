# GYM Manager - Hệ thống quản lý phòng gym

## 📖 Giới thiệu

GYM Manager là một hệ thống quản lý phòng gym toàn diện, được phát triển với kiến trúc Client-Server. Hệ thống cho phép quản lý khách hàng, gói dịch vụ, đăng ký tập luyện, hóa đơn và các chức năng khác một cách hiệu quả.

## 🏗️ Kiến trúc hệ thống

```
GYM-Manager/
├── backend/          # Spring Boot REST API
├── frontend/         # Vanilla JavaScript + Bootstrap
└── temp/            # Thư mục tạm
```

## 💻 Công nghệ sử dụng

### Backend
- **Framework:** Spring Boot 3.2.4
- **Database:** MySQL
- **ORM:** Hibernate + Spring Data JPA
- **Security:** Spring Security + JWT
- **Build Tool:** Maven
- **Java Version:** 17

### Frontend
- **Language:** Vanilla JavaScript (ES6+)
- **CSS Framework:** Bootstrap 5.3.0
- **UI Library:** Font Awesome 6.5.0
- **Additional:** jQuery 3.6.0 (một số trang)

## 🚀 Chức năng chính

### Dành cho Admin
- ✅ Quản lý khách hàng
- ✅ Quản lý gói dịch vụ
- ✅ Quản lý đăng ký tập luyện
- ✅ Quản lý hóa đơn
- ✅ Quản lý sản phẩm
- ✅ Thống kê doanh thu

### Dành cho Khách hàng
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập/Đăng xuất
- ✅ Xem và đăng ký gói dịch vụ
- ✅ Quản lý hồ sơ cá nhân
- ✅ Xem lịch sử đăng ký
- ✅ Mua sắm sản phẩm
- ✅ Quản lý giỏ hàng

### Chức năng chung
- ✅ Xác thực và phân quyền
- ✅ Quản lý session
- ✅ Quên mật khẩu
- ✅ Responsive design

## 📋 Yêu cầu hệ thống

### Phần mềm cần thiết
- **Java:** JDK 17 trở lên
- **Maven:** 3.6+
- **MySQL:** 8.0+
- **Web Browser:** Chrome, Firefox, Safari, Edge (phiên bản mới nhất)

### Phần cứng khuyến nghị
- **RAM:** 4GB trở lên
- **Disk:** 2GB dung lượng trống
- **CPU:** Dual-core trở lên

## ⚙️ Cài đặt và chạy dự án

### 1. Chuẩn bị database

```sql
-- Tạo database
CREATE DATABASE gym_manager;
USE gym_manager;

-- Tạo tài khoản admin mặc định
INSERT INTO account (ten_dang_nhap, mat_khau, phan_quyen, id_lien_ket) 
VALUES ('admin', '$2a$10$YourBcryptHashHere', 'admin', NULL);
```

### 2. Cấu hình backend

```bash
# Clone repository
git clone <repository-url>
cd PBL3/backend

# Cấu hình database trong application.properties
# src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/gym_manager
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Chạy backend

```bash
# Cách 1: Sử dụng Maven wrapper
./mvnw spring-boot:run

# Cách 2: Sử dụng Maven
mvn spring-boot:run

# Cách 3: Build và chạy JAR
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### 4. Chạy frontend

```bash
# Mở frontend trong browser
# Truy cập: file:///path/to/PBL3/frontend/pages/trangchu/index.html
# Hoặc sử dụng Live Server trong VS Code
```

### 5. Truy cập ứng dụng

- **Frontend:** http://localhost:5500 (nếu dùng Live Server)
- **Backend API:** http://localhost:8080
- **Tài khoản admin mặc định:** admin / 123456

## 📁 Cấu trúc thư mục

### Backend
```
backend/
├── src/main/java/PBL3/backend/
│   ├── controller/     # REST Controllers
│   ├── service/       # Business Logic
│   ├── repository/    # Data Access Layer
│   ├── model/         # Entity Models
│   ├── dto/          # Data Transfer Objects
│   └── config/       # Configuration Classes
├── src/main/resources/
│   ├── application.properties
│   └── db/           # Database migration files
└── pom.xml           # Maven dependencies
```

### Frontend
```
frontend/
├── assets/           # Images và media files
├── components/       # HTML components (header, footer, menu)
├── css/             # Stylesheets
│   ├── admin/       # Admin page styles
│   ├── khachhang/   # Customer page styles
│   ├── trangchu/    # Homepage styles
│   └── components/  # Component styles
├── js/              # JavaScript files
│   ├── admin/       # Admin functionality
│   ├── khachhang/   # Customer functionality
│   ├── trangchu/    # Homepage functionality
│   ├── components/  # Shared components
│   └── utils/       # Utility functions
└── pages/           # HTML pages
    ├── admin/       # Admin pages
    ├── khachhang/   # Customer pages
    └── trangchu/    # Public pages
```

## 🔗 API Endpoints

### Xác thực
- `POST /api/accounts/login` - Đăng nhập
- `POST /api/accounts/register/customer` - Đăng ký khách hàng
- `POST /api/accounts/forgot-password` - Quên mật khẩu
- `POST /api/accounts/reset-password` - Đặt lại mật khẩu

### Quản lý khách hàng
- `GET /api/khachhang` - Lấy danh sách khách hàng
- `POST /api/khachhang` - Tạo khách hàng mới
- `PUT /api/khachhang/{id}` - Cập nhật khách hàng
- `DELETE /api/khachhang/{id}` - Xóa khách hàng

### Quản lý gói dịch vụ
- `GET /api/goidichvu` - Lấy danh sách gói
- `POST /api/goidichvu` - Tạo gói mới
- `PUT /api/goidichvu/{id}` - Cập nhật gói
- `DELETE /api/goidichvu/{id}` - Xóa gói

### Quản lý đăng ký
- `GET /api/dangky` - Lấy danh sách đăng ký
- `POST /api/dangky` - Tạo đăng ký mới
- `PUT /api/dangky/{id}` - Cập nhật đăng ký
- `DELETE /api/dangky/{id}` - Xóa đăng ký

## 🔒 Bảo mật

- **Authentication:** JWT Token
- **Authorization:** Role-based (Admin, Customer)
- **Password Hashing:** BCrypt
- **CORS:** Configured for cross-origin requests
- **Input Validation:** Server-side validation
- **SQL Injection:** Protected by JPA/Hibernate

## 🧪 Testing

### Backend Testing
```bash
# Chạy unit tests
./mvnw test

# Chạy integration tests
./mvnw verify
```

### API Testing
- Sử dụng Postman collection: `src/main/postman.json`
- Import collection vào Postman để test các API endpoints

## 🐛 Debug và Troubleshooting

### Lỗi thường gặp

1. **Lỗi kết nối database**
   ```
   Solution: Kiểm tra MySQL service, username, password trong application.properties
   ```

2. **Port 8080 đã được sử dụng**
   ```bash
   # Thay đổi port trong application.properties
   server.port=8081
   ```

3. **CORS errors**
   ```
   Solution: Đảm bảo frontend chạy trên HTTP server, không phải file://
   ```

### Logging
- **Backend logs:** Console output từ Spring Boot
- **Frontend logs:** Browser Developer Console (F12)

## 📈 Performance

### Tối ưu hóa
- **Backend:** Connection pooling, JPA second level cache
- **Frontend:** Image optimization, minified CSS/JS
- **Database:** Proper indexing, query optimization

### Monitoring
- **Health Check:** http://localhost:8080/actuator/health
- **Metrics:** Spring Boot Actuator endpoints

## 🚀 Deployment

### Production Build
```bash
# Backend
./mvnw clean package -Pprod

# Frontend
# Minify CSS/JS và optimize images
```

### Docker (Optional)
```dockerfile
# Dockerfile có thể được thêm vào sau
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer:** [Your Team Name]
- **Project:** PBL3
- **Institution:** [Your University/School]

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi:
- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues URL]
- 📚 Documentation: [Wiki URL nếu có]

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Hoàn thành các chức năng cơ bản
- ✅ Authentication & Authorization
- ✅ CRUD operations cho tất cả entities
- ✅ Responsive UI design

### Upcoming Features
- 🔄 Email notifications
- 📱 Mobile app
- 📊 Advanced analytics
- 🔄 Real-time updates
- 🌐 Multi-language support

---

**🎯 Made with ❤️ for PBL3 Project**
