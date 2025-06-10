package PBL3.backend.service;

import PBL3.backend.model.Account;
import PBL3.backend.model.KhachHang;
import PBL3.backend.repository.AccountRepository;
import PBL3.backend.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {    private final AccountRepository accountRepository;
    private final KhachHangRepository khachHangRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AccountService(AccountRepository accountRepository, 
                         KhachHangRepository khachHangRepository,
                         PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.khachHangRepository = khachHangRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Optional<Account> getAccountByUsername(String username) {
        return Optional.ofNullable(accountRepository.findByTenDangNhap(username));
    }

    @Transactional
    public Account createAccount(Account account) {
        // Kiểm tra xem tài khoản đã tồn tại chưa
        if (accountRepository.findByTenDangNhap(account.getTenDangNhap()) != null) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }

        // Kiểm tra tính hợp lệ của id liên kết
        if (account.getIdLienKet() != null) {
            if ("khachhang".equals(account.getPhanQuyen())) {
                if (!khachHangRepository.existsById(account.getIdLienKet())) {
                    throw new RuntimeException("ID khách hàng không tồn tại");
                }
            } else if ("admin".equals(account.getPhanQuyen())) {
                // Admin account không cần liên kết
            }
        }

        return accountRepository.save(account);
    }

    @Transactional
    public Account updateAccount(String username, Account accountDetails) {
        Account account = accountRepository.findByTenDangNhap(username);
        if (account == null) {
            throw new RuntimeException("Tài khoản không tồn tại");
        }

        // Không cho phép thay đổi tên đăng nhập
        // Cập nhật các trường khác
        account.setMatKhau(accountDetails.getMatKhau());
        account.setPhanQuyen(accountDetails.getPhanQuyen());
        account.setIdLienKet(accountDetails.getIdLienKet());

        return accountRepository.save(account);
    }

    @Transactional
    public void deleteAccount(String username) {
        Account account = accountRepository.findByTenDangNhap(username);
        if (account == null) {
            throw new RuntimeException("Tài khoản không tồn tại");
        }
        accountRepository.delete(account);
    }

    @Transactional
    public Account createCustomerAccount(KhachHang khachHang, String username, String password) {
        // Kiểm tra xem tên đăng nhập đã tồn tại chưa
        if (accountRepository.findByTenDangNhap(username) != null) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }
        
        // Lưu khách hàng để lấy ID - không kiểm tra trùng lặp thông tin
        khachHang = khachHangRepository.save(khachHang);
        
        // Tạo tài khoản cho khách hàng
        Account account = new Account();
        account.setTenDangNhap(username);
        account.setMatKhau(passwordEncoder.encode(password));
        account.setPhanQuyen("khachhang");
        account.setIdLienKet(khachHang.getIdKhachHang());
        
        return accountRepository.save(account);
    }

    // Phương thức tạo tài khoản admin đã được loại bỏ vì admin sẽ được tạo trực tiếp trong database

    public Account login(String username, String password) {
    Account account = accountRepository.findByTenDangNhap(username);
    if (account != null) {
        if ("admin".equals(account.getPhanQuyen())) {
            // Đăng nhập admin: So sánh mật khẩu plaintext
            if (account.getMatKhau().equals(password)) {
                return account;
            }
        } else if ("khachhang".equals(account.getPhanQuyen())) {
            // Đăng nhập khách hàng: So sánh mật khẩu đã mã hóa
            if (passwordEncoder.matches(password, account.getMatKhau())) {
                return account;
            }
        }
    }
    return null;
}

    // Thêm hàm public để mã hóa mật khẩu
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}
