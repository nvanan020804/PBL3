package PBL3.backend.controller;

import PBL3.backend.model.Account;
import PBL3.backend.model.KhachHang;
import PBL3.backend.model.NhanVien;
import PBL3.backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    @GetMapping("/{username}")
    public ResponseEntity<Account> getAccountByUsername(@PathVariable String username) {
        Optional<Account> account = accountService.getAccountByUsername(username);
        return account.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        try {
            Account createdAccount = accountService.createAccount(account);
            return new ResponseEntity<>(createdAccount, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{username}")
    public ResponseEntity<Account> updateAccount(@PathVariable String username, @RequestBody Account accountDetails) {
        try {
            Account updatedAccount = accountService.updateAccount(username, accountDetails);
            return new ResponseEntity<>(updatedAccount, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteAccount(@PathVariable String username) {
        try {
            accountService.deleteAccount(username);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/register/customer")
    public ResponseEntity<Account> registerCustomer(@RequestBody Map<String, Object> registrationData) {
        try {
            // Trích xuất dữ liệu
            String username = (String) registrationData.get("username");
            String password = (String) registrationData.get("password");
            
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
            khachHang.setGioTap((String) customerData.get("gioTap"));
            khachHang.setTrangThai("active");
            
            Account account = accountService.createCustomerAccount(khachHang, username, password);
            return new ResponseEntity<>(account, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/register/staff")
    public ResponseEntity<Account> registerStaff(@RequestBody Map<String, Object> registrationData) {
        try {
            // Trích xuất dữ liệu
            String username = (String) registrationData.get("username");
            String password = (String) registrationData.get("password");
            String role = (String) registrationData.get("role"); // "nhanvien" hoặc "admin"
            
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
            
            Account account = accountService.createStaffAccount(nhanVien, username, password, role);
            return new ResponseEntity<>(account, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        
        Account account = accountService.login(username, password);
        if (account != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("account", account);
            response.put("message", "Đăng nhập thành công");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tên đăng nhập hoặc mật khẩu không đúng");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
}