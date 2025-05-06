package PBL3.backend.service.mapper;

import PBL3.backend.dto.request.DoanhThuRequest;
import PBL3.backend.dto.response.DoanhThuResponse;
import PBL3.backend.model.DoanhThu;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoanhThuMapper {

    public DoanhThu toEntity(DoanhThuRequest request) {
        if (request == null) {
            return null;
        }

        DoanhThu doanhThu = new DoanhThu();
        doanhThu.setThoiGian(request.getThoiGian());
        doanhThu.setTongChi(request.getTongChi());
        doanhThu.setTongThu(request.getTongThu());
        
        return doanhThu;
    }

    public DoanhThuResponse toResponse(DoanhThu entity) {
        if (entity == null) {
            return null;
        }

        DoanhThuResponse response = new DoanhThuResponse();
        response.setIdDoanhThu(entity.getIdDoanhThu());
        response.setThoiGian(entity.getThoiGian());
        response.setTongChi(entity.getTongChi());
        response.setTongThu(entity.getTongThu());
        
        // Calculate profit
        BigDecimal loiNhuan = BigDecimal.ZERO;
        if (entity.getTongThu() != null && entity.getTongChi() != null) {
            loiNhuan = entity.getTongThu().subtract(entity.getTongChi());
        }
        response.setLoiNhuan(loiNhuan);
        
        return response;
    }
    
    public List<DoanhThuResponse> toResponseList(List<DoanhThu> entities) {
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}