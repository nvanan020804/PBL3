package PBL3.backend.repository;

import PBL3.backend.model.ThietBi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ThietBiRepository extends JpaRepository<ThietBi, Integer> {
    List<ThietBi> findByTrangThai(String trangThai);
}