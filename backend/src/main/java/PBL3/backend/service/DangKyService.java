package PBL3.backend.service;
import PBL3.backend.dto.DangKyDTO;
import PBL3.backend.model.DangKy;
import PBL3.backend.model.KhachHang;
import PBL3.backend.model.GoiDichVu;
import PBL3.backend.repository.DangKyRepository;
import PBL3.backend.repository.KhachHangRepository;
import PBL3.backend.repository.GoiDichVuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DangKyService {

    @Autowired
    private DangKyRepository dangKyRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;
    
    @Autowired
    private GoiDichVuRepository goiDichVuRepository;

    public DangKy taoDangKy(DangKyDTO dangKyDTO) {
        DangKy dangKy = new DangKy();
        
        // Get KhachHang and GoiDichVu entities instead of just IDs
        KhachHang khachHang = khachHangRepository.findById(dangKyDTO.getIdKhachHang())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + dangKyDTO.getIdKhachHang()));
        
        GoiDichVu goiDichVu = goiDichVuRepository.findById(dangKyDTO.getIdGOI())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy gói dịch vụ với ID: " + dangKyDTO.getIdGOI()));
        
        // Set entity references instead of just IDs
        dangKy.setKhachHang(khachHang);
        dangKy.setGoiDichVu(goiDichVu);
        dangKy.setNgayBatDau(dangKyDTO.getNgayBatDau());
        dangKy.setTrangThai("Đang hoạt động");
        
        DangKy saved = dangKyRepository.save(dangKy);

        // Cập nhật trạng thái khách hàng
        khachHang.setTrangThai("Đang sử dụng");
        khachHangRepository.save(khachHang);
        
        return saved;
    }
    
    public Optional<DangKy> layGoiHienTaiCuaKhach(int idKhachHang) {
        return dangKyRepository.findGoiHienTaiByKhachHang(idKhachHang);
    }
}