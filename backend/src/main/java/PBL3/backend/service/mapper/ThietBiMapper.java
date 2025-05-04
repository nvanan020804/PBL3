package PBL3.backend.service.mapper;

import PBL3.backend.dto.request.ThietBiRequest;
import PBL3.backend.dto.response.ThietBiResponse;
import PBL3.backend.model.ThietBi;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThietBiMapper {

    public ThietBi toEntity(ThietBiRequest request) {
        if (request == null) {
            return null;
        }

        ThietBi thietBi = new ThietBi();
        thietBi.setTenThietBi(request.getTenThietBi());
        thietBi.setCongDung(request.getCongDung());
        thietBi.setNgayNhap(request.getNgayNhap());
        thietBi.setGiaTien(request.getGiaTien());
        thietBi.setTrangThai(request.getTrangThai());
        
        return thietBi;
    }

    public ThietBiResponse toResponse(ThietBi entity) {
        if (entity == null) {
            return null;
        }

        ThietBiResponse response = new ThietBiResponse();
        response.setIdThietBi(entity.getIdThietBi());
        response.setTenThietBi(entity.getTenThietBi());
        response.setCongDung(entity.getCongDung());
        response.setNgayNhap(entity.getNgayNhap());
        response.setGiaTien(entity.getGiaTien());
        response.setTrangThai(entity.getTrangThai());
        
        return response;
    }
    
    public List<ThietBiResponse> toResponseList(List<ThietBi> entities) {
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}