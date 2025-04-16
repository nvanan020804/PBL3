package PBL3.backend.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import PBL3.backend.model.Account;
import PBL3.backend.repository.AccountRepository;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public Account login(String username, String password) {
        return accountRepository.findByUserACCAndPassACC(username, password);
    }
}
