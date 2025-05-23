package PBL3.backend.service;

import PBL3.backend.model.ThietBi;
import PBL3.backend.repository.ThietBiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ThietBiService {

    private final ThietBiRepository thietBiRepository;

    @Autowired
    public ThietBiService(ThietBiRepository thietBiRepository) {
        this.thietBiRepository = thietBiRepository;
    }

    public List<ThietBi> getAllThietBi() {
        return thietBiRepository.findAll();
    }

    public Optional<ThietBi> getThietBiById(int id) {
        return thietBiRepository.findById(id);
    }

    public List<ThietBi> getThietBiByTrangThai(String trangThai) {
        return thietBiRepository.findByTrangThai(trangThai);
    }

    @Transactional
    public ThietBi createThietBi(ThietBi thietBi) {
        // Thiết lập thông tin mặc định nếu cần
        if (thietBi.getNgayNhap() == null) {
            thietBi.setNgayNhap(LocalDate.now());
        }
        
        if (thietBi.getTrangThai() == null) {
            thietBi.setTrangThai("Đang sử dụng"); // Sử dụng trạng thái có dấu để nhất quán với các phần khác
        }
        
        return thietBiRepository.save(thietBi);
    }

    @Transactional
    public ThietBi updateThietBi(int id, ThietBi thietBiDetails) {
        ThietBi thietBi = thietBiRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị với ID: " + id));
        
        // Cập nhật thông tin
        if (thietBiDetails.getTenThietBi() != null) {
            thietBi.setTenThietBi(thietBiDetails.getTenThietBi());
        }
        
        if (thietBiDetails.getCongDung() != null) {
            thietBi.setCongDung(thietBiDetails.getCongDung());
        }
        
        if (thietBiDetails.getNgayNhap() != null) {
            thietBi.setNgayNhap(thietBiDetails.getNgayNhap());
        }
        
        if (thietBiDetails.getGiaTien() != null) {
            thietBi.setGiaTien(thietBiDetails.getGiaTien());
        }
        
        if (thietBiDetails.getTrangThai() != null) {
            thietBi.setTrangThai(thietBiDetails.getTrangThai());
        }
        
        return thietBiRepository.save(thietBi);
    }

    @Transactional
    public void deleteThietBi(int id) {
        ThietBi thietBi = thietBiRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị với ID: " + id));
        
        thietBiRepository.deleteById(id);
    }
    
    @Transactional
    public ThietBi updateTrangThaiThietBi(int id, String trangThai) {
        ThietBi thietBi = thietBiRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị với ID: " + id));
            
        thietBi.setTrangThai(trangThai);
        return thietBiRepository.save(thietBi);
    }
}