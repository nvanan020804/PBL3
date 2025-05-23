package PBL3.backend.service.mapper;

import PBL3.backend.dto.request.HoaDonChiTietRequest;
import PBL3.backend.dto.response.HoaDonChiTietResponse;
import PBL3.backend.model.HoaDon;
import PBL3.backend.model.HoaDonChiTiet;
import PBL3.backend.model.SanPham;
import PBL3.backend.repository.HoaDonRepository;
import PBL3.backend.repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HoaDonChiTietMapper {

    @Autowired
    private HoaDonRepository hoaDonRepository;
    
    @Autowired
    private SanPhamRepository sanPhamRepository;

    public HoaDonChiTiet toEntity(HoaDonChiTietRequest request) {
        if (request == null) {
            return null;
        }

        HoaDonChiTiet chiTiet = new HoaDonChiTiet();
        
        if (request.getIdHoaDon() != null) {
            HoaDon hoaDon = hoaDonRepository.findById(request.getIdHoaDon())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + request.getIdHoaDon()));
            chiTiet.setHoaDon(hoaDon);
        }
        
        if (request.getIdSanPham() != null) {
            SanPham sanPham = sanPhamRepository.findById(request.getIdSanPham())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + request.getIdSanPham()));
            chiTiet.setSanPham(sanPham);
            chiTiet.setGia(sanPham.getGia());
        }
        
        chiTiet.setSoLuong(request.getSoLuong());
        
        return chiTiet;
    }

    public HoaDonChiTietResponse toResponse(HoaDonChiTiet entity) {
        if (entity == null) {
            return null;
        }

        HoaDonChiTietResponse response = new HoaDonChiTietResponse();
        response.setIdHoaDonChiTiet(entity.getIdHoaDonChiTiet());
        
        if (entity.getHoaDon() != null) {
            response.setIdHoaDon(entity.getHoaDon().getIdHoaDon());
        }
        
        if (entity.getSanPham() != null) {
            response.setIdSanPham(entity.getSanPham().getIdSanPham());
            response.setTenSanPham(entity.getSanPham().getTenSanPham());
        }
        
        response.setSoLuong(entity.getSoLuong());
        response.setGia(entity.getGia());
        
        // Calculate total amount
        if (entity.getGia() != null && entity.getSoLuong() > 0) {
            response.setThanhTien(entity.getGia().multiply(BigDecimal.valueOf(entity.getSoLuong())));
        } else {
            response.setThanhTien(BigDecimal.ZERO);
        }
        
        return response;
    }
    
    public List<HoaDonChiTietResponse> toResponseList(List<HoaDonChiTiet> entities) {
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}