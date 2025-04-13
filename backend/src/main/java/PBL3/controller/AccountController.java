package PBL3.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import PBL3.model.Account;
import PBL3.service.AccountService;

@RestController
@RequestMapping("/api")
public class AccountController {
    @Autowired
    private AccountService accountService;
    
    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        if (accountService.authenticate(username, password)){
            Account acc = accountService.getAccoutByUsername(username);
            return "Đăng nhập thành công với tài khoảng " + acc.getRoleAsString();
        } else { 
            return "Thông tin đăng nhập không chính xác!";
        } 
    }
}
