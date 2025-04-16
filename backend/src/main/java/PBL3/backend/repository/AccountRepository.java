package PBL3.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import PBL3.backend.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Account findByUserACCAndPassACC(String userACC, String passACC);
}