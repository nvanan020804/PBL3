package PBL3.backend.repository;

import PBL3.backend.model.DangKy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DangKyRepository extends JpaRepository<DangKy, Integer> {
    
    @Query("SELECT d FROM DangKy d WHERE d.khachHang.idKhachHang = :idKhachHang AND d.trangThai = 'Đang hoạt động'")
    Optional<DangKy> findGoiHienTaiByKhachHang(@Param("idKhachHang") int idKhachHang);
}