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
            return account;
        }
        
        logger.info("Password does not match for user: {}", tenDangNhap);
        return null;
    }
}
