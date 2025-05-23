package PBL3.backend.service.mapper;

import PBL3.backend.dto.request.DangKyRequest;
import PBL3.backend.dto.response.DangKyResponse;
import PBL3.backend.model.DangKy;
import PBL3.backend.model.GoiDichVu;
import PBL3.backend.model.KhachHang;
import PBL3.backend.repository.GoiDichVuRepository;
import PBL3.backend.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DangKyMapper {

    @Autowired
    private KhachHangRepository khachHangRepository;
    
    @Autowired
    private GoiDichVuRepository goiDichVuRepository;

    public DangKy toEntity(DangKyRequest request) {
        if (request == null) {
            return null;
        }

        DangKy dangKy = new DangKy();
        
        if (request.getIdKhachHang() != null) {
            KhachHang khachHang = khachHangRepository.findById(request.getIdKhachHang())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + request.getIdKhachHang()));
            dangKy.setKhachHang(khachHang);
        }
        
        if (request.getIdGOI() != null) {
            GoiDichVu goiDichVu = goiDichVuRepository.findById(request.getIdGOI())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy gói dịch vụ với ID: " + request.getIdGOI()));
            dangKy.setGoiDichVu(goiDichVu);
        }
        
        dangKy.setNgayBatDau(request.getNgayBatDau());
        dangKy.setTrangThai(request.getTrangThai());
        dangKy.setGioTap(request.getGioTap());
        
        return dangKy;
    }

    public DangKyResponse toResponse(DangKy entity) {
        if (entity == null) {
            return null;
        }

        DangKyResponse response = new DangKyResponse();
        response.setIdDangKy(entity.getIdDangKy());
        
        if (entity.getKhachHang() != null) {
            response.setIdKhachHang(entity.getKhachHang().getIdKhachHang());
            response.setTenKhachHang(entity.getKhachHang().getTenKhachHang());
        }
        
        if (entity.getGoiDichVu() != null) {
            response.setIdGOI(entity.getGoiDichVu().getId());
            response.setTenGoi(entity.getGoiDichVu().getTenGoi());
        }
        
        response.setNgayBatDau(entity.getNgayBatDau());
        response.setTrangThai(entity.getTrangThai());
        response.setGioTap(entity.getGioTap());
        
        return response;
    }
    
    public List<DangKyResponse> toResponseList(List<DangKy> entities) {
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}