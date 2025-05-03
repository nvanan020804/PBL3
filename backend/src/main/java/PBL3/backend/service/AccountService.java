package PBL3.backend.service;

import PBL3.backend.model.Account;
import PBL3.backend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AccountService {
    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);
    
    @Autowired
    private AccountRepository accountRepository;

    public Account login(String tenDangNhap, String matKhau) {
        logger.info("Attempting login with username: {}", tenDangNhap);
        
        Account account = accountRepository.findByTenDangNhap(tenDangNhap);
        
        if (account == null) {
            logger.info("No account found with username: {}", tenDangNhap);
            return null;
        }
        
        logger.info("Found account: {}", account);
        
        if (account.getMatKhau().equals(matKhau)) {
            logger.info("Password matches for user: {}", tenDangNhap);
            // Load associated entity based on role
            if ("khachhang".equals(account.getPhanQuyen()) && account.getIdLienKet() != null) {
                account.getKhachHang(); // This will trigger lazy loading of the customer
            } else if (("nhanvien".equals(account.getPhanQuyen()) || "admin".equals(account.getPhanQuyen())) 
                    && account.getIdLienKet() != null) {
                account.getNhanVien(); // This will trigger lazy loading of the staff
            }
            return account;
        }
        
        logger.info("Password does not match for user: {}", tenDangNhap);
        return null;
    }
}
