package PBL3.backend.repository;

import PBL3.backend.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {
    KhachHang findBySoDienThoai(String soDienThoai);
    KhachHang findByEmail(String email);
    KhachHang findByCccd(String cccd);
    
    @Query(value = "SELECT * FROM khachhang", nativeQuery = true)
    List<KhachHang> findAllKhachHang();
}