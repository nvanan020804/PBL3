package PBL3.backend.repository;

import PBL3.backend.model.DangKy;
import PBL3.backend.model.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {
    List<HoaDon> findByDangKy(DangKy dangKy);
    List<HoaDon> findByDangKyIsNotNull();
    
    // Lấy danh sách hóa đơn theo trạng thái và khoảng thời gian tạo
    List<HoaDon> findByTrangThaiAndThoiGianTaoBetween(String trangThai, LocalDateTime start, LocalDateTime end);
}