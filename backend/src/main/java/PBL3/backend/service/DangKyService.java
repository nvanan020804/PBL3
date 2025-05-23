package PBL3.backend.service;

import PBL3.backend.model.DangKy;
import PBL3.backend.model.GoiDichVu;
import PBL3.backend.model.KhachHang;
import PBL3.backend.repository.DangKyRepository;
import PBL3.backend.repository.GoiDichVuRepository;
import PBL3.backend.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DangKyService {

    private final DangKyRepository dangKyRepository;
    private final KhachHangRepository khachHangRepository;
    private final GoiDichVuRepository goiDichVuRepository;

    @Autowired
    public DangKyService(DangKyRepository dangKyRepository,
                         KhachHangRepository khachHangRepository,
                         GoiDichVuRepository goiDichVuRepository) {
        this.dangKyRepository = dangKyRepository;
        this.khachHangRepository = khachHangRepository;
        this.goiDichVuRepository = goiDichVuRepository;
    }

    public List<DangKy> getAllDangKy() {
        return dangKyRepository.findAll();
    }

    public Optional<DangKy> getDangKyById(int id) {
        return dangKyRepository.findById(id);
    }

    public List<DangKy> getDangKyByKhachHang(int idKhachHang) {
        KhachHang khachHang = khachHangRepository.findById(idKhachHang)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + idKhachHang));
        return dangKyRepository.findByKhachHang(khachHang);
    }

    public List<DangKy> getActiveDangKyByKhachHang(int idKhachHang) {
        return dangKyRepository.findActiveByKhachHangId(idKhachHang);
    }

    public List<DangKy> getDangKyByDateRange(LocalDate startDate, LocalDate endDate) {
        return dangKyRepository.findByNgayBatDauBetween(startDate, endDate);
    }

    @Transactional
    public DangKy createDangKy(DangKy dangKy) {
        // Kiểm tra tồn tại của gói dịch vụ và khách hàng
        if (dangKy.getGoiDichVu() == null || dangKy.getGoiDichVu().getId() == 0) {
            throw new RuntimeException("Gói dịch vụ không hợp lệ");
        }
        
        if (dangKy.getKhachHang() == null || dangKy.getKhachHang().getIdKhachHang() == 0) {
            throw new RuntimeException("Khách hàng không hợp lệ");
        }
        
        // Lấy thông tin đầy đủ
        GoiDichVu goiDichVu = goiDichVuRepository.findById(dangKy.getGoiDichVu().getId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy gói dịch vụ với ID: " + dangKy.getGoiDichVu().getId()));
            
        KhachHang khachHang = khachHangRepository.findById(dangKy.getKhachHang().getIdKhachHang())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + dangKy.getKhachHang().getIdKhachHang()));
        
        // Kiểm tra xem khách hàng đã có đăng ký đang hoạt động chưa
        List<DangKy> activeRegistrations = dangKyRepository.findActiveByKhachHangId(khachHang.getIdKhachHang());
        if (!activeRegistrations.isEmpty()) {
            throw new RuntimeException("Khách hàng đã có đăng ký đang hoạt động");
        }
        
        // Thiết lập thông tin mặc định
        if (dangKy.getNgayBatDau() == null) {
            dangKy.setNgayBatDau(LocalDate.now());
        }
        
        if (dangKy.getTrangThai() == null) {
            dangKy.setTrangThai("Đang hoạt động");
        }
        
        // Lưu đăng ký
        dangKy.setGoiDichVu(goiDichVu);
        dangKy.setKhachHang(khachHang); 
        
        // Cập nhật trạng thái khách hàng thành đang hoạt động
        khachHang.setTrangThai("Đang hoạt động");
        khachHangRepository.save(khachHang);
        
        return dangKyRepository.save(dangKy);
    }

    @Transactional
    public DangKy updateDangKy(int id, DangKy dangKyDetails) {
        DangKy dangKy = dangKyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + id));
        
        // Cập nhật thông tin
        if (dangKyDetails.getNgayBatDau() != null) {
            dangKy.setNgayBatDau(dangKyDetails.getNgayBatDau());
        }
        
        if (dangKyDetails.getTrangThai() != null) {
            dangKy.setTrangThai(dangKyDetails.getTrangThai());
        }
        
        if (dangKyDetails.getGioTap() != null) {
            dangKy.setGioTap(dangKyDetails.getGioTap());
        }
        
        return dangKyRepository.save(dangKy);
    }

    @Transactional
    public void deleteDangKy(int id) {
        DangKy dangKy = dangKyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + id));
            
        // Kiểm tra nếu có hóa đơn liên quan
        if (!dangKy.getHoaDons().isEmpty()) {
            throw new RuntimeException("Không thể xóa đăng ký đã có hóa đơn");
        }
        
        dangKyRepository.deleteById(id);
    }
    
    @Transactional
    public DangKy activateDangKy(int id) {
        DangKy dangKy = dangKyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + id));
            
        dangKy.setTrangThai("Đang hoạt động");
        return dangKyRepository.save(dangKy);
    }
    
    @Transactional
    public DangKy cancelDangKy(int id) {
        DangKy dangKy = dangKyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + id));
            
        dangKy.setTrangThai("Hết hạn");
        return dangKyRepository.save(dangKy);
    }
}