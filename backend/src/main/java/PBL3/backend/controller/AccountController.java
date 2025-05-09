package PBL3.backend.controller;

import PBL3.backend.model.Account;
import PBL3.backend.model.KhachHang;
import PBL3.backend.model.NhanVien;
import PBL3.backend.service.AccountService;
import PBL3.backend.service.KhachHangService;
import PBL3.backend.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller quản lý các API liên quan đến tài khoản người dùng
 * Bao gồm các chức năng đăng nhập, đăng ký, quản lý tài khoản
 */
@RestController
@RequestMapping("/api/accounts") // Đường dẫn API cho tài khoản
@CrossOrigin(origins = "*")
public class AccountController {

    private final AccountService accountService;
    private final KhachHangService khachHangService;
    private final NhanVienService nhanVienService;

    @Autowired
    public AccountController(AccountService accountService, KhachHangService khachHangService, NhanVienService nhanVienService) {
        this.accountService = accountService;
        this.khachHangService = khachHangService;
        this.nhanVienService = nhanVienService;
    }

    /**
     * Lấy danh sách tất cả tài khoản trong hệ thống
     * @return Danh sách tài khoản và status code 200 OK
     */
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    /**
     * Lấy thông tin tài khoản theo tên đăng nhập (username)
     * @param username Tên đăng nhập cần tìm kiếm
     * @return Thông tin tài khoản nếu tìm thấy (200 OK) hoặc 404 NOT FOUND nếu không tìm thấy
     */
    @GetMapping("/{username}")  // Lấy thông tin tài khoản theo tên đăng nhập
    public ResponseEntity<Account> getAccountByUsername(@PathVariable String username) {
        Optional<Account> account = accountService.getAccountByUsername(username);
        return account.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Tạo tài khoản mới trong hệ thống
     * @param account Thông tin tài khoản cần tạo
     * @return Tài khoản đã tạo và status code 201 CREATED hoặc 400 BAD REQUEST nếu thất bại
     */
    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        try {
            Account createdAccount = accountService.createAccount(account);
            return new ResponseEntity<>(createdAccount, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Cập nhật thông tin tài khoản theo tên đăng nhập
     * @param username Tên đăng nhập của tài khoản cần cập nhật
     * @param accountDetails Thông tin tài khoản mới
     * @return Tài khoản đã cập nhật và status code 200 OK hoặc 404 NOT FOUND nếu không tìm thấy
     */
    @PutMapping("/{username}")
    public ResponseEntity<Account> updateAccount(@PathVariable String username, @RequestBody Account accountDetails) {
        try {
            Account updatedAccount = accountService.updateAccount(username, accountDetails);
            return new ResponseEntity<>(updatedAccount, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Xóa tài khoản khỏi hệ thống theo tên đăng nhập
     * @param username Tên đăng nhập của tài khoản cần xóa
     * @return Status code 204 NO CONTENT nếu xóa thành công hoặc 404 NOT FOUND nếu không tìm thấy
     */
    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteAccount(@PathVariable String username) {
        try {
            accountService.deleteAccount(username);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Đăng ký tài khoản mới cho khách hàng
     * @param registrationData Dữ liệu đăng ký bao gồm username, password và thông tin khách hàng
     * @return Tài khoản đã tạo và status code 201 CREATED hoặc 400 BAD REQUEST nếu thất bại
     */
    @PostMapping("/register/customer")
    public ResponseEntity<?> registerCustomer(@RequestBody Map<String, Object> registrationData) {
        try {
            // Trích xuất dữ liệu
            String username = (String) registrationData.get("username");
            String password = (String) registrationData.get("password");
            
            // Kiểm tra tên đăng nhập đã tồn tại chưa
            if (accountService.getAccountByUsername(username).isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Tên đăng nhập đã tồn tại");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Kiểm tra độ mạnh của mật khẩu
            if (password.length() < 6) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Mật khẩu phải có ít nhất 6 ký tự");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            @SuppressWarnings("unchecked")
            Map<String, Object> customerData = (Map<String, Object>) registrationData.get("khachHang");
            
            KhachHang khachHang = new KhachHang();
            khachHang.setTenKhachHang((String) customerData.get("tenKhachHang"));
            if (customerData.get("namSinh") != null) {
                khachHang.setNamSinh(Integer.valueOf(customerData.get("namSinh").toString()));
            }
            khachHang.setSoDienThoai((String) customerData.get("soDienThoai"));
            khachHang.setCccd((String) customerData.get("cccd"));
            khachHang.setEmail((String) customerData.get("email"));
            khachHang.setTrangThai("active");
            
            // Kiểm tra thông tin trùng lặp
            KhachHang existingByPhone = khachHangService.getKhachHangBySoDienThoai(khachHang.getSoDienThoai());
            if (existingByPhone != null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Số điện thoại đã được đăng ký");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            if (khachHang.getEmail() != null) {
                KhachHang existingByEmail = khachHangService.getKhachHangByEmail(khachHang.getEmail());
                if (existingByEmail != null) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("message", "Email đã được đăng ký");
                    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
                }
            }
            
            if (khachHang.getCccd() != null) {
                KhachHang existingByCccd = khachHangService.getKhachHangByCccd(khachHang.getCccd());
                if (existingByCccd != null) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("message", "CCCD đã được đăng ký");
                    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
                }
            }
            
            Account account = accountService.createCustomerAccount(khachHang, username, password);
            return new ResponseEntity<>(account, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Đăng ký tài khoản mới cho nhân viên hoặc admin
     * @param registrationData Dữ liệu đăng ký bao gồm username, password, role và thông tin nhân viên
     * @return Tài khoản đã tạo và status code 201 CREATED hoặc 400 BAD REQUEST nếu thất bại
     */
    @PostMapping("/register/staff")
    public ResponseEntity<?> registerStaff(@RequestBody Map<String, Object> registrationData) {
        try {
            // Trích xuất dữ liệu
            String username = (String) registrationData.get("username");
            String password = (String) registrationData.get("password");
            String role = (String) registrationData.get("role"); // "nhanvien" hoặc "admin"
            
            // Kiểm tra tên đăng nhập đã tồn tại chưa
            if (accountService.getAccountByUsername(username).isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Tên đăng nhập đã tồn tại");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            // Kiểm tra độ mạnh của mật khẩu
            if (password.length() < 6) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Mật khẩu phải có ít nhất 6 ký tự");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            @SuppressWarnings("unchecked")
            Map<String, Object> staffData = (Map<String, Object>) registrationData.get("nhanVien");
            
            NhanVien nhanVien = new NhanVien();
            nhanVien.setTenNhanVien((String) staffData.get("tenNhanVien"));
            if (staffData.get("tuoi") != null) {
                nhanVien.setTuoi(Integer.valueOf(staffData.get("tuoi").toString()));
            }
            nhanVien.setSoDienThoai1((String) staffData.get("soDienThoai1"));
            nhanVien.setCccd((String) staffData.get("cccd"));
            nhanVien.setEmail((String) staffData.get("email"));
            nhanVien.setViTri((String) staffData.get("viTri"));
            
            // Kiểm tra thông tin trùng lặp với bảng nhân viên
            NhanVien existingByPhone = nhanVienService.getNhanVienBySoDienThoai(nhanVien.getSoDienThoai1());
            if (existingByPhone != null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Số điện thoại đã được đăng ký");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            if (nhanVien.getEmail() != null) {
                NhanVien existingByEmail = nhanVienService.getNhanVienByEmail(nhanVien.getEmail());
                if (existingByEmail != null) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("message", "Email đã được đăng ký");
                    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
                }
            }
            
            if (nhanVien.getCccd() != null) {
                NhanVien existingByCccd = nhanVienService.getNhanVienByCccd(nhanVien.getCccd());
                if (existingByCccd != null) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("message", "CCCD đã được đăng ký");
                    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
                }
            }
            
            // Kiểm tra thông tin trùng lặp với bảng khách hàng
            KhachHang existingCustomerByPhone = khachHangService.getKhachHangBySoDienThoai(nhanVien.getSoDienThoai1());
            if (existingCustomerByPhone != null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Số điện thoại đã được đăng ký cho khách hàng");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
            
            if (nhanVien.getEmail() != null) {
                KhachHang existingCustomerByEmail = khachHangService.getKhachHangByEmail(nhanVien.getEmail());
                if (existingCustomerByEmail != null) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("message", "Email đã được đăng ký cho khách hàng");
                    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
                }
            }
            
            if (nhanVien.getCccd() != null) {
                KhachHang existingCustomerByCccd = khachHangService.getKhachHangByCccd(nhanVien.getCccd());
                if (existingCustomerByCccd != null) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("message", "CCCD đã được đăng ký cho khách hàng");
                    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
                }
            }
            
            Account account = accountService.createStaffAccount(nhanVien, username, password, role);
            return new ResponseEntity<>(account, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Xác thực đăng nhập vào hệ thống
     * @param loginData Dữ liệu đăng nhập bao gồm username và password
     * @return Thông tin tài khoản và thông báo nếu đăng nhập thành công (200 OK) 
     *         hoặc thông báo lỗi nếu thất bại (401 UNAUTHORIZED)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        // In thông tin để debug
        System.out.println("Received login data: " + loginData);
        
        String username = loginData.get("username");
        String password = loginData.get("password");
        
        // Kiểm tra dữ liệu đầu vào
        if (username == null || password == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tên đăng nhập và mật khẩu không được để trống");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        
        System.out.println("Attempting login with username: " + username);
        
        // Gọi service để xác thực
        Account account = accountService.login(username, password);
        
        if (account != null) {
            System.out.println("Login successful for user: " + username);
            Map<String, Object> response = new HashMap<>();
            response.put("account", account);
            response.put("message", "Đăng nhập thành công");
            
            // Thêm token vào response (phần này sẽ được thay thế bằng JWT thực tế sau)
            String mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
            response.put("token", mockToken);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            System.out.println("Login failed for user: " + username);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tên đăng nhập hoặc mật khẩu không đúng");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
}