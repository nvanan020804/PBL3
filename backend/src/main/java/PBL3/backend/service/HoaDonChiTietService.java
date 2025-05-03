package PBL3.backend.service;

import PBL3.backend.model.HoaDonChiTiet;
import PBL3.backend.model.HoaDon;
import PBL3.backend.model.SanPham;
import PBL3.backend.repository.HoaDonChiTietRepository;
import PBL3.backend.repository.HoaDonRepository;
import PBL3.backend.repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class HoaDonChiTietService {

    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;
    
    @Autowired
    private HoaDonRepository hoaDonRepository;
    
    @Autowired
    private SanPhamRepository sanPhamRepository;

    public List<HoaDonChiTiet> layChiTietTheoHoaDon(int idHoaDon) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + idHoaDon));
        return hoaDon.getChiTietList();
    }

    @Transactional
    public HoaDonChiTiet themSanPhamVaoHoaDon(int idHoaDon, int idSanPham, int soLuong) {
        // Get related entities
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + idHoaDon));
        
        SanPham sanPham = sanPhamRepository.findById(idSanPham)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + idSanPham));
        
        // Verify product quantity
        if (sanPham.getSoLuong() < soLuong) {
            throw new RuntimeException("Số lượng sản phẩm không đủ. Hiện có: " + sanPham.getSoLuong());
        }
        
        // Create and save invoice detail
        HoaDonChiTiet chiTiet = new HoaDonChiTiet();
        chiTiet.setHoaDon(hoaDon);
        chiTiet.setSanPham(sanPham);
        chiTiet.setSoLuong(soLuong);
        chiTiet.setGia(sanPham.getGia());
        
        // Update product quantity
        sanPham.setSoLuong(sanPham.getSoLuong() - soLuong);
        sanPhamRepository.save(sanPham);
        
        return hoaDonChiTietRepository.save(chiTiet);
    }

    @Transactional
    public void xoaChiTietHoaDon(int idChiTiet) {
        Optional<HoaDonChiTiet> chiTietOpt = hoaDonChiTietRepository.findById(idChiTiet);
        
        if (chiTietOpt.isPresent()) {
            HoaDonChiTiet chiTiet = chiTietOpt.get();
            
            // Return product quantity
            SanPham sanPham = chiTiet.getSanPham();
            sanPham.setSoLuong(sanPham.getSoLuong() + chiTiet.getSoLuong());
            sanPhamRepository.save(sanPham);
            
            // Delete the detail
            hoaDonChiTietRepository.deleteById(idChiTiet);
        }
    }
}