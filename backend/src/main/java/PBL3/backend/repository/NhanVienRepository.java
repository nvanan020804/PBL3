package PBL3.backend.repository;

import PBL3.backend.model.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Integer> {
    NhanVien findBySoDienThoai1(String soDienThoai1);
    NhanVien findByEmail(String email);
    NhanVien findByCccd(String cccd);
}