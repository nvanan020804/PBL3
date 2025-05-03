package PBL3.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import PBL3.backend.dto.LoginRequest;
import PBL3.backend.model.Account;
import PBL3.backend.service.AccountService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://127.0.0.1:5502", "http://localhost:5500", "http://localhost:5502", "http://127.0.0.1:5503"}, allowCredentials = "false")
public class AccountController {
    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

    @Autowired
    private AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            if (loginRequest == null || loginRequest.getTenDangNhap() == null || loginRequest.getMatKhau() == null) {
                logger.error("Invalid login request: {}", loginRequest);
                return ResponseEntity.badRequest().body("Thông tin đăng nhập không hợp lệ");
            }

            logger.info("Login request received for username: {}", loginRequest.getTenDangNhap());
            
            Account account = accountService.login(loginRequest.getTenDangNhap(), loginRequest.getMatKhau());
            
            if (account != null) {
                logger.info("Login successful for user: {}", loginRequest.getTenDangNhap());
                return ResponseEntity.ok(account);
            }
            
            logger.info("Login failed for user: {}", loginRequest.getTenDangNhap());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Tên đăng nhập hoặc mật khẩu không đúng");
        } catch (Exception e) {
            logger.error("Error during login: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra trong quá trình đăng nhập: " + e.getMessage());
        }
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        return response;
    }

}