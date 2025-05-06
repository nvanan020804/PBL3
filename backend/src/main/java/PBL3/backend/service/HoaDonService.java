package PBL3.backend.service;

import PBL3.backend.model.DangKy;
import PBL3.backend.model.HoaDon;
import PBL3.backend.model.NhanVien;
import PBL3.backend.repository.DangKyRepository;
import PBL3.backend.repository.HoaDonRepository;
import PBL3.backend.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HoaDonService {

    private final HoaDonRepository hoaDonRepository;
    private final DangKyRepository dangKyRepository;
    private final NhanVienRepository nhanVienRepository;

    @Autowired
    public HoaDonService(HoaDonRepository hoaDonRepository, 
                         DangKyRepository dangKyRepository,
                         NhanVienRepository nhanVienRepository) {
        this.hoaDonRepository = hoaDonRepository;
        this.dangKyRepository = dangKyRepository;
        this.nhanVienRepository = nhanVienRepository;
    }

    public List<HoaDon> getAllHoaDon() {
        return hoaDonRepository.findAll();
    }

    public Optional<HoaDon> getHoaDonById(int id) {
        return hoaDonRepository.findById(id);
    }

    public List<HoaDon> getHoaDonByDangKy(int idDangKy) {
        DangKy dangKy = dangKyRepository.findById(idDangKy)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + idDangKy));
        return hoaDonRepository.findByDangKy(dangKy);
    }

    public List<HoaDon> getHoaDonByNhanVien(int idNhanVien) {
        NhanVien nhanVien = nhanVienRepository.findById(idNhanVien)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + idNhanVien));
        return hoaDonRepository.findByNhanVien(nhanVien);
    }

    @Transactional
    public HoaDon createHoaDon(HoaDon hoaDon) {
        // Kiểm tra tồn tại của đăng ký và nhân viên
        if (hoaDon.getDangKy() == null || hoaDon.getDangKy().getIdDangKy() == 0) {
            throw new RuntimeException("Đăng ký không hợp lệ");
        }
        
        if (hoaDon.getNhanVien() == null || hoaDon.getNhanVien().getIdNhanVien() == 0) {
            throw new RuntimeException("Nhân viên không hợp lệ");
        }
        
        // Lấy thông tin đầy đủ
        DangKy dangKy = dangKyRepository.findById(hoaDon.getDangKy().getIdDangKy())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + hoaDon.getDangKy().getIdDangKy()));
            
        NhanVien nhanVien = nhanVienRepository.findById(hoaDon.getNhanVien().getIdNhanVien())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + hoaDon.getNhanVien().getIdNhanVien()));
        
        // Thiết lập thông tin mặc định
        if (hoaDon.getThoiGianTao() == null) {
            hoaDon.setThoiGianTao(LocalDateTime.now());
        }
        
        if (hoaDon.getTrangThai() == null) {
            hoaDon.setTrangThai("pending"); // hoặc "completed" tùy theo logic nghiệp vụ
        }
        
        // Lưu hóa đơn
        hoaDon.setDangKy(dangKy);
        hoaDon.setNhanVien(nhanVien);
        
        return hoaDonRepository.save(hoaDon);
    }

    @Transactional
    public HoaDon updateHoaDon(int id, HoaDon hoaDonDetails) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
        
        // Cập nhật thông tin
        if (hoaDonDetails.getTrangThai() != null) {
            hoaDon.setTrangThai(hoaDonDetails.getTrangThai());
        }
        
        return hoaDonRepository.save(hoaDon);
    }

    @Transactional
    public void deleteHoaDon(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        // Kiểm tra nếu có chi tiết hóa đơn
        if (!hoaDon.getChiTietList().isEmpty()) {
            throw new RuntimeException("Không thể xóa hóa đơn đã có chi tiết");
        }
        
        hoaDonRepository.deleteById(id);
    }
    
    @Transactional
    public HoaDon completeHoaDon(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        hoaDon.setTrangThai("completed");
        return hoaDonRepository.save(hoaDon);
    }
    
    @Transactional
    public HoaDon cancelHoaDon(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        hoaDon.setTrangThai("cancelled");
        return hoaDonRepository.save(hoaDon);
    }
}