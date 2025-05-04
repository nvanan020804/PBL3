package PBL3.backend.service.mapper;

import PBL3.backend.dto.request.HoaDonRequest;
import PBL3.backend.dto.response.HoaDonResponse;
import PBL3.backend.model.DangKy;
import PBL3.backend.model.HoaDon;
import PBL3.backend.model.NhanVien;
import PBL3.backend.repository.DangKyRepository;
import PBL3.backend.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HoaDonMapper {

    @Autowired
    private DangKyRepository dangKyRepository;
    
    @Autowired
    private NhanVienRepository nhanVienRepository;
    
    @Autowired
    private HoaDonChiTietMapper hoaDonChiTietMapper;

    public HoaDon toEntity(HoaDonRequest request) {
        if (request == null) {
            return null;
        }

        HoaDon hoaDon = new HoaDon();
        
        if (request.getIdDangKy() != null) {
            DangKy dangKy = dangKyRepository.findById(request.getIdDangKy())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + request.getIdDangKy()));
            hoaDon.setDangKy(dangKy);
        }
        
        if (request.getIdNhanVien() != null) {
            NhanVien nhanVien = nhanVienRepository.findById(request.getIdNhanVien())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + request.getIdNhanVien()));
            hoaDon.setNhanVien(nhanVien);
        }
        
        hoaDon.setThoiGianTao(LocalDateTime.now());
        hoaDon.setTrangThai(request.getTrangThai());
        
        return hoaDon;
    }

    public HoaDonResponse toResponse(HoaDon entity) {
        if (entity == null) {
            return null;
        }

        HoaDonResponse response = new HoaDonResponse();
        response.setIdHoaDon(entity.getIdHoaDon());
        
        if (entity.getDangKy() != null) {
            response.setIdDangKy(entity.getDangKy().getIdDangKy());
            if (entity.getDangKy().getKhachHang() != null) {
                response.setTenKhachHang(entity.getDangKy().getKhachHang().getTenKhachHang());
            }
        }
        
        if (entity.getNhanVien() != null) {
            response.setIdNhanVien(entity.getNhanVien().getIdNhanVien());
            response.setTenNhanVien(entity.getNhanVien().getTenNhanVien());
        }
        
        response.setThoiGianTao(entity.getThoiGianTao());
        response.setTrangThai(entity.getTrangThai());
        
        if (entity.getChiTietList() != null && !entity.getChiTietList().isEmpty()) {
            response.setChiTietList(hoaDonChiTietMapper.toResponseList(entity.getChiTietList()));
        }
        
        return response;
    }
    
    public List<HoaDonResponse> toResponseList(List<HoaDon> entities) {
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}