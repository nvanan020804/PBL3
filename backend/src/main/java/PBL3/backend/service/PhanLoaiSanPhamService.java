package PBL3.backend.service;

import PBL3.backend.model.PhanLoaiSanPham;
import PBL3.backend.repository.PhanLoaiSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PhanLoaiSanPhamService {

    @Autowired
    private PhanLoaiSanPhamRepository phanLoaiSanPhamRepository;
    
    public List<PhanLoaiSanPham> layTatCaPhanLoai() {
        return phanLoaiSanPhamRepository.findAll();
    }
    
    public Optional<PhanLoaiSanPham> layPhanLoaiTheoId(int id) {
        return phanLoaiSanPhamRepository.findById(id);
    }
    
    @Transactional
    public PhanLoaiSanPham taoPhanLoai(String tenDanhMuc) {
        PhanLoaiSanPham danhMuc = new PhanLoaiSanPham();
        danhMuc.setTenDanhMuc(tenDanhMuc);
        return phanLoaiSanPhamRepository.save(danhMuc);
    }
    
    @Transactional
    public PhanLoaiSanPham capNhatPhanLoai(int id, String tenDanhMuc) {
        PhanLoaiSanPham danhMuc = phanLoaiSanPhamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));
        
        danhMuc.setTenDanhMuc(tenDanhMuc);
        return phanLoaiSanPhamRepository.save(danhMuc);
    }
    
    @Transactional
    public void xoaPhanLoai(int id) {
        PhanLoaiSanPham danhMuc = phanLoaiSanPhamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));
        
        // Check if the category has any products
        if (!danhMuc.getSanPhamList().isEmpty()) {
            throw new RuntimeException("Không thể xóa danh mục này vì có sản phẩm đang sử dụng");
        }
        
        phanLoaiSanPhamRepository.deleteById(id);
    }
}