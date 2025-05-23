package PBL3.backend.repository;

import PBL3.backend.model.PhanLoaiSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhanLoaiSanPhamRepository extends JpaRepository<PhanLoaiSanPham, Integer> {
    PhanLoaiSanPham findByTenDanhMuc(String tenDanhMuc);
}