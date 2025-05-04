package PBL3.backend.service.mapper;

import PBL3.backend.dto.request.PhanLoaiSanPhamRequest;
import PBL3.backend.dto.response.PhanLoaiSanPhamResponse;
import PBL3.backend.model.PhanLoaiSanPham;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PhanLoaiSanPhamMapper {

    public PhanLoaiSanPham toEntity(PhanLoaiSanPhamRequest request) {
        if (request == null) {
            return null;
        }

        PhanLoaiSanPham phanLoaiSanPham = new PhanLoaiSanPham();
        phanLoaiSanPham.setTenDanhMuc(request.getTenDanhMuc());
        
        return phanLoaiSanPham;
    }

    public PhanLoaiSanPhamResponse toResponse(PhanLoaiSanPham entity) {
        if (entity == null) {
            return null;
        }

        PhanLoaiSanPhamResponse response = new PhanLoaiSanPhamResponse();
        response.setIdDanhMuc(entity.getIdDanhMuc());
        response.setTenDanhMuc(entity.getTenDanhMuc());
        
        return response;
    }
    
    public List<PhanLoaiSanPhamResponse> toResponseList(List<PhanLoaiSanPham> entities) {
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}