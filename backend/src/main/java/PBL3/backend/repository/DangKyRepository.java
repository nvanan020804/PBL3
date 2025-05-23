package PBL3.backend.repository;

import PBL3.backend.model.DangKy;
import PBL3.backend.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DangKyRepository extends JpaRepository<DangKy, Integer> {
    
    @Query("SELECT d FROM DangKy d WHERE d.khachHang.idKhachHang = :idKhachHang AND d.trangThai = 'Đang hoạt động'")
    Optional<DangKy> findGoiHienTaiByKhachHang(@Param("idKhachHang") int idKhachHang);
    
    List<DangKy> findByKhachHang(KhachHang khachHang);
    
    @Query("SELECT d FROM DangKy d WHERE d.khachHang.idKhachHang = :idKhachHang AND d.trangThai = 'Đang hoạt động'")
    List<DangKy> findActiveByKhachHangId(@Param("idKhachHang") int idKhachHang);
    
    List<DangKy> findByNgayBatDauBetween(LocalDate startDate, LocalDate endDate);
}