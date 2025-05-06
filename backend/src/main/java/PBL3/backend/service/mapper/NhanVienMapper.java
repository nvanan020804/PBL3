package PBL3.backend.service.mapper;

import PBL3.backend.dto.request.NhanVienRequest;
import PBL3.backend.dto.response.NhanVienResponse;
import PBL3.backend.model.NhanVien;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NhanVienMapper {

    public NhanVien toEntity(NhanVienRequest request) {
        if (request == null) {
            return null;
        }

        NhanVien nhanVien = new NhanVien();
        nhanVien.setTenNhanVien(request.getTenNhanVien());
        nhanVien.setTuoi(request.getTuoi());
        nhanVien.setSoDienThoai1(request.getSoDienThoai1());
        nhanVien.setCccd(request.getCccd());
        nhanVien.setEmail(request.getEmail());
        nhanVien.setViTri(request.getViTri());
        
        return nhanVien;
    }

    public NhanVienResponse toResponse(NhanVien entity) {
        if (entity == null) {
            return null;
        }

        NhanVienResponse response = new NhanVienResponse();
        response.setIdNhanVien(entity.getIdNhanVien());
        response.setTenNhanVien(entity.getTenNhanVien());
        response.setTuoi(entity.getTuoi());
        response.setSoDienThoai1(entity.getSoDienThoai1());
        response.setCccd(entity.getCccd());
        response.setEmail(entity.getEmail());
        response.setViTri(entity.getViTri());
        
        return response;
    }
    
    public List<NhanVienResponse> toResponseList(List<NhanVien> entities) {
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}