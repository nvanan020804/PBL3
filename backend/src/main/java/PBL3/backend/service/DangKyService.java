package PBL3.backend.service;
import PBL3.backend.dto.request.DangKyRequest;
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

    public DangKy taoDangKy(DangKyRequest dangKyRequest) {
        DangKy dangKy = new DangKy();
        
        // Get KhachHang and GoiDichVu entities instead of just IDs
        KhachHang khachHang = khachHangRepository.findById(dangKyRequest.getIdKhachHang())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + dangKyRequest.getIdKhachHang()));
        
        GoiDichVu goiDichVu = goiDichVuRepository.findById(dangKyRequest.getIdGOI())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy gói dịch vụ với ID: " + dangKyRequest.getIdGOI()));
        
        // Set entity references instead of just IDs
        dangKy.setKhachHang(khachHang);
        dangKy.setGoiDichVu(goiDichVu);
        dangKy.setNgayBatDau(dangKyRequest.getNgayBatDau());
        dangKy.setTrangThai(dangKyRequest.getTrangThai() != null ? dangKyRequest.getTrangThai() : "Đang hoạt động");
        dangKy.setGioTap(dangKyRequest.getGioTap());
        
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