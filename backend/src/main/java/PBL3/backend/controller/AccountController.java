package PBL3.backend.controller;

import PBL3.backend.dto.request.LoginRequest;
import PBL3.backend.dto.response.AccountResponse;
import PBL3.backend.dto.response.ApiResponse;
import PBL3.backend.model.Account;
import PBL3.backend.service.AccountMapper;
import PBL3.backend.service.AccountService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://127.0.0.1:5502", "http://localhost:5500", "http://localhost:5502", "http://127.0.0.1:5503"}, allowCredentials = "false")
public class AccountController {
    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

    @Autowired
    private AccountService accountService;
    
    @Autowired
    private AccountMapper accountMapper;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AccountResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Login request received for username: {}", loginRequest.getTenDangNhap());
            
            Account account = accountService.login(loginRequest.getTenDangNhap(), loginRequest.getMatKhau());
            
            if (account != null) {
                logger.info("Login successful for user: {}", loginRequest.getTenDangNhap());
                return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", accountMapper.toResponse(account)));
            }
            
            logger.info("Login failed for user: {}", loginRequest.getTenDangNhap());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Tên đăng nhập hoặc mật khẩu không đúng"));
        } catch (Exception e) {
            logger.error("Error during login: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Có lỗi xảy ra trong quá trình đăng nhập: " + e.getMessage()));
        }
    }
}