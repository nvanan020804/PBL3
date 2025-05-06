package PBL3.backend.service.mapper;

import PBL3.backend.dto.request.KhachHangRequest;
import PBL3.backend.dto.response.KhachHangResponse;
import PBL3.backend.model.KhachHang;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KhachHangMapper {

    public KhachHang toEntity(KhachHangRequest request) {
        if (request == null) {
            return null;
        }

        KhachHang khachHang = new KhachHang();
        khachHang.setTenKhachHang(request.getTenKhachHang());
        khachHang.setNamSinh(request.getNamSinh());
        khachHang.setSoDienThoai(request.getSoDienThoai());
        khachHang.setCccd(request.getCccd());
        khachHang.setEmail(request.getEmail());
        khachHang.setTrangThai(request.getTrangThai());
        
        return khachHang;
    }

    public KhachHangResponse toResponse(KhachHang entity) {
        if (entity == null) {
            return null;
        }

        KhachHangResponse response = new KhachHangResponse();
        response.setIdKhachHang(entity.getIdKhachHang());
        response.setTenKhachHang(entity.getTenKhachHang());
        response.setNamSinh(entity.getNamSinh());
        response.setSoDienThoai(entity.getSoDienThoai());
        response.setCccd(entity.getCccd());
        response.setEmail(entity.getEmail());
        response.setTrangThai(entity.getTrangThai());
        
        return response;
    }
    
    public List<KhachHangResponse> toResponseList(List<KhachHang> entities) {
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}