package PBL3.backend.repository;

import PBL3.backend.model.DangKy;
import PBL3.backend.model.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {
    List<HoaDon> findByDangKy(DangKy dangKy);
    @Query("SELECT h FROM HoaDon h WHERE h.dangKy.khachHang.idKhachHang = :idKhachHang")
    List<HoaDon> findByDangKyKhachHangId(@Param("idKhachHang") int idKhachHang);
}