package PBL3.backend.repository;

import PBL3.backend.model.PhanLoaiSanPham;
import PBL3.backend.model.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {
    @Query("SELECT s FROM SanPham s WHERE s.danhMuc.idDanhMuc = :idDanhMuc")
    List<SanPham> findByDanhMucId(@Param("idDanhMuc") int idDanhMuc);
    
    List<SanPham> findByDanhMuc(PhanLoaiSanPham danhMuc);
    
    SanPham findByTenSanPham(String tenSanPham);
}