package PBL3.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import PBL3.model.Account;
import PBL3.repository.AccountRepository;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;
    public boolean authenticate(String username, String password) {
        Account account= accountRepository.findByUsername(username);
        return account != null && account.getPasswordACC().equals(password);
    }
    public Account getAccoutByUsername (String username){
        return accountRepository.findByUsername(username);
    }
}
