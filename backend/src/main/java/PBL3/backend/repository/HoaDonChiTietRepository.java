package PBL3.backend.repository;

import PBL3.backend.model.HoaDon;
import PBL3.backend.model.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Integer> {
    List<HoaDonChiTiet> findByHoaDon(HoaDon hoaDon);
    
    @Query("SELECT hct FROM HoaDonChiTiet hct JOIN FETCH hct.sanPham WHERE hct.hoaDon = :hoaDon")
    List<HoaDonChiTiet> findByHoaDonWithSanPham(@Param("hoaDon") HoaDon hoaDon);
}