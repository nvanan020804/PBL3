package PBL3.backend.service.mapper;

import PBL3.backend.dto.request.AccountRequest;
import PBL3.backend.dto.response.AccountResponse;
import PBL3.backend.model.Account;
import org.springframework.stereotype.Service;

@Service
public class AccountMapper {

    public Account toEntity(AccountRequest request) {
        if (request == null) {
            return null;
        }

        Account account = new Account();
        account.setTenDangNhap(request.getTenDangNhap());
        account.setMatKhau(request.getMatKhau());
        account.setPhanQuyen(request.getPhanQuyen());
        account.setIdLienKet(request.getIdLienKet());
        
        return account;
    }

    public AccountResponse toResponse(Account entity) {
        if (entity == null) {
            return null;
        }

        AccountResponse response = new AccountResponse();
        response.setTenDangNhap(entity.getTenDangNhap());
        response.setPhanQuyen(entity.getPhanQuyen());
        response.setIdLienKet(entity.getIdLienKet());
        
        return response;
    }
}