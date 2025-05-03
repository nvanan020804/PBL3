package PBL3.backend.service;

import PBL3.backend.model.ThietBi;
import PBL3.backend.repository.ThietBiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ThietBiService {

    @Autowired
    private ThietBiRepository thietBiRepository;
    
    public List<ThietBi> layTatCaThietBi() {
        return thietBiRepository.findAll();
    }
    
    public Optional<ThietBi> layThietBiTheoId(int id) {
        return thietBiRepository.findById(id);
    }
    
    @Transactional
    public ThietBi taoThietBi(String tenThietBi, String congDung, LocalDate ngayNhap, BigDecimal giaTien, String trangThai) {
        ThietBi thietBi = new ThietBi();
        thietBi.setTenThietBi(tenThietBi);
        thietBi.setCongDung(congDung);
        thietBi.setNgayNhap(ngayNhap);
        thietBi.setGiaTien(giaTien);
        thietBi.setTrangThai(trangThai != null ? trangThai : "Hoạt động tốt");
        
        return thietBiRepository.save(thietBi);
    }
    
    @Transactional
    public ThietBi capNhatThietBi(int id, String tenThietBi, String congDung, 
                               LocalDate ngayNhap, BigDecimal giaTien, String trangThai) {
        ThietBi thietBi = thietBiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị với ID: " + id));
        
        if (tenThietBi != null) {
            thietBi.setTenThietBi(tenThietBi);
        }
        
        if (congDung != null) {
            thietBi.setCongDung(congDung);
        }
        
        if (ngayNhap != null) {
            thietBi.setNgayNhap(ngayNhap);
        }
        
        if (giaTien != null) {
            thietBi.setGiaTien(giaTien);
        }
        
        if (trangThai != null) {
            thietBi.setTrangThai(trangThai);
        }
        
        return thietBiRepository.save(thietBi);
    }
    
    @Transactional
    public void xoaThietBi(int id) {
        thietBiRepository.deleteById(id);
    }
    
    @Transactional
    public ThietBi capNhatTrangThaiThietBi(int id, String trangThai) {
        ThietBi thietBi = thietBiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị với ID: " + id));
        
        thietBi.setTrangThai(trangThai);
        return thietBiRepository.save(thietBi);
    }
}