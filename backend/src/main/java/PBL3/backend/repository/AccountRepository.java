package PBL3.backend.repository;

import PBL3.backend.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Account findByTenDangNhap(String tenDangNhap);
    Account findByIdLienKetAndPhanQuyen(Integer idLienKet, String phanQuyen);
}