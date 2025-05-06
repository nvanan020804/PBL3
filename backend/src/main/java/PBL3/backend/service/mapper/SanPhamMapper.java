package PBL3.backend.service.mapper;

import PBL3.backend.dto.request.SanPhamRequest;
import PBL3.backend.dto.response.SanPhamResponse;
import PBL3.backend.model.PhanLoaiSanPham;
import PBL3.backend.model.SanPham;
import PBL3.backend.repository.PhanLoaiSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SanPhamMapper {

    @Autowired
    private PhanLoaiSanPhamRepository phanLoaiSanPhamRepository;

    public SanPham toEntity(SanPhamRequest request) {
        if (request == null) {
            return null;
        }

        SanPham sanPham = new SanPham();
        sanPham.setTenSanPham(request.getTenSanPham());
        
        if (request.getIdDanhMuc() != null) {
            PhanLoaiSanPham danhMuc = phanLoaiSanPhamRepository.findById(request.getIdDanhMuc())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + request.getIdDanhMuc()));
            sanPham.setDanhMuc(danhMuc);
        }
        
        sanPham.setDonViDem(request.getDonViDem());
        sanPham.setGia(request.getGia());
        sanPham.setCongDung(request.getCongDung());
        sanPham.setSoLuong(request.getSoLuong());
        
        return sanPham;
    }

    public SanPhamResponse toResponse(SanPham entity) {
        if (entity == null) {
            return null;
        }

        SanPhamResponse response = new SanPhamResponse();
        response.setIdSanPham(entity.getIdSanPham());
        response.setTenSanPham(entity.getTenSanPham());
        
        if (entity.getDanhMuc() != null) {
            response.setIdDanhMuc(entity.getDanhMuc().getIdDanhMuc());
            response.setTenDanhMuc(entity.getDanhMuc().getTenDanhMuc());
        }
        
        response.setDonViDem(entity.getDonViDem());
        response.setGia(entity.getGia());
        response.setCongDung(entity.getCongDung());
        response.setSoLuong(entity.getSoLuong());
        
        return response;
    }
    
    public List<SanPhamResponse> toResponseList(List<SanPham> entities) {
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}