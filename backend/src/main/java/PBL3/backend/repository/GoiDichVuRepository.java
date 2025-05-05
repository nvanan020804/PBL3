package PBL3.backend.repository;

import PBL3.backend.model.GoiDichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoiDichVuRepository extends JpaRepository<GoiDichVu, Integer> {
    GoiDichVu findByTenGoi(String tenGoi);
}