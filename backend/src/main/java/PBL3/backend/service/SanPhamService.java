package PBL3.backend.service;

import PBL3.backend.model.SanPham;
import PBL3.backend.model.PhanLoaiSanPham;
import PBL3.backend.repository.SanPhamRepository;
import PBL3.backend.repository.PhanLoaiSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;
    
    @Autowired
    private PhanLoaiSanPhamRepository phanLoaiSanPhamRepository;
    
    public List<SanPham> layTatCaSanPham() {
        return sanPhamRepository.findAll();
    }
    
    public List<SanPham> laySanPhamTheoDanhMuc(int idDanhMuc) {
        return sanPhamRepository.findByDanhMucId(idDanhMuc);
    }
    
    public Optional<SanPham> laySanPhamTheoId(int id) {
        return sanPhamRepository.findById(id);
    }
    
    @Transactional
    public SanPham taoSanPham(String tenSanPham, int idDanhMuc, String donViDem, 
                             BigDecimal gia, String congDung, Integer soLuong) {
        PhanLoaiSanPham danhMuc = phanLoaiSanPhamRepository.findById(idDanhMuc)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + idDanhMuc));
        
        SanPham sanPham = new SanPham();
        sanPham.setTenSanPham(tenSanPham);
        sanPham.setDanhMuc(danhMuc);
        sanPham.setDonViDem(donViDem);
        sanPham.setGia(gia);
        sanPham.setCongDung(congDung);
        sanPham.setSoLuong(soLuong != null ? soLuong : 0);
        
        return sanPhamRepository.save(sanPham);
    }
    
    @Transactional
    public SanPham capNhatSanPham(int id, String tenSanPham, Integer idDanhMuc, 
                                 String donViDem, BigDecimal gia, String congDung, Integer soLuong) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
        
        if (tenSanPham != null) {
            sanPham.setTenSanPham(tenSanPham);
        }
        
        if (idDanhMuc != null) {
            PhanLoaiSanPham danhMuc = phanLoaiSanPhamRepository.findById(idDanhMuc)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + idDanhMuc));
            sanPham.setDanhMuc(danhMuc);
        }
        
        if (donViDem != null) {
            sanPham.setDonViDem(donViDem);
        }
        
        if (gia != null) {
            sanPham.setGia(gia);
        }
        
        if (congDung != null) {
            sanPham.setCongDung(congDung);
        }
        
        if (soLuong != null) {
            sanPham.setSoLuong(soLuong);
        }
        
        return sanPhamRepository.save(sanPham);
    }
    
    @Transactional
    public void xoaSanPham(int id) {
        sanPhamRepository.deleteById(id);
    }
    
    @Transactional
    public SanPham capNhatSoLuongSanPham(int id, int soLuongMoi) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
        
        sanPham.setSoLuong(soLuongMoi);
        return sanPhamRepository.save(sanPham);
    }
}