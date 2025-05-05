package PBL3.backend.repository;

import PBL3.backend.model.DoanhThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoanhThuRepository extends JpaRepository<DoanhThu, Integer> {
    DoanhThu findByThoiGian(String thoiGian);
}