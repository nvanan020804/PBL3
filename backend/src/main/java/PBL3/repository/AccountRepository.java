package PBL3.repository;

import PBL3.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByUsername(String username);
}
