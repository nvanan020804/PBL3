package PBL3.backend.service.mapper;

import PBL3.backend.dto.request.GoiDichVuRequest;
import PBL3.backend.dto.response.GoiDichVuResponse;
import PBL3.backend.model.GoiDichVu;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoiDichVuMapper {

    public GoiDichVu toEntity(GoiDichVuRequest request) {
        if (request == null) {
            return null;
        }

        GoiDichVu goiDichVu = new GoiDichVu();
        goiDichVu.setTenGoi(request.getTenGoi());
        goiDichVu.setGia(request.getGia());
        goiDichVu.setMoTa(request.getMoTa());
        goiDichVu.setThoiGian(request.getThoiGian());
        
        return goiDichVu;
    }

    public GoiDichVuResponse toResponse(GoiDichVu entity) {
        if (entity == null) {
            return null;
        }

        GoiDichVuResponse response = new GoiDichVuResponse();
        response.setId(entity.getId());
        response.setTenGoi(entity.getTenGoi());
        response.setGia(entity.getGia());
        response.setMoTa(entity.getMoTa());
        response.setThoiGian(entity.getThoiGian());
        
        return response;
    }
    
    public List<GoiDichVuResponse> toResponseList(List<GoiDichVu> entities) {
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}