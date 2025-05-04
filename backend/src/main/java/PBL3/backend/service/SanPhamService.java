package PBL3.backend.service;

import PBL3.backend.dto.request.SanPhamRequest;
import PBL3.backend.dto.response.SanPhamResponse;
import PBL3.backend.exception.ResourceNotFoundException;
import PBL3.backend.model.PhanLoaiSanPham;
import PBL3.backend.model.SanPham;
import PBL3.backend.repository.PhanLoaiSanPhamRepository;
import PBL3.backend.repository.SanPhamRepository;
import PBL3.backend.service.mapper.SanPhamMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;
    
    @Autowired
    private PhanLoaiSanPhamRepository phanLoaiSanPhamRepository;
    
    @Autowired
    private SanPhamMapper sanPhamMapper;

    public List<SanPham> layTatCaSanPham() {
        return sanPhamRepository.findAll();
    }
    
    public List<SanPhamResponse> layTatCaSanPhamResponse() {
        return sanPhamMapper.toResponseList(sanPhamRepository.findAll());
    }
    
    public List<SanPham> laySanPhamTheoDanhMuc(int idDanhMuc) {
        // Check if category exists
        if (!phanLoaiSanPhamRepository.existsById(idDanhMuc)) {
            throw new ResourceNotFoundException("Danh mục", "ID", idDanhMuc);
        }
        return sanPhamRepository.findByDanhMucId(idDanhMuc);
    }
    
    public List<SanPhamResponse> laySanPhamTheoDanhMucResponse(int idDanhMuc) {
        return sanPhamMapper.toResponseList(laySanPhamTheoDanhMuc(idDanhMuc));
    }
    
    public Optional<SanPham> laySanPhamTheoId(int id) {
        return sanPhamRepository.findById(id);
    }
    
    public Optional<SanPhamResponse> laySanPhamTheoIdResponse(int id) {
        return sanPhamRepository.findById(id).map(sanPhamMapper::toResponse);
    }
    
    @Transactional
    public SanPham taoSanPham(String tenSanPham, int idDanhMuc, String donViDem, 
                             BigDecimal gia, String congDung, Integer soLuong) {
        PhanLoaiSanPham danhMuc = phanLoaiSanPhamRepository.findById(idDanhMuc)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "ID", idDanhMuc));
        
        SanPham sanPham = new SanPham();
        sanPham.setTenSanPham(tenSanPham);
        sanPham.setDanhMuc(danhMuc);
        sanPham.setDonViDem(donViDem);
        sanPham.setGia(gia);
        sanPham.setCongDung(congDung);
        sanPham.setSoLuong(soLuong != null ? soLuong : 0);
        
        return sanPhamRepository.save(sanPham);
    }
    
    @Transactional
    public SanPhamResponse taoSanPhamResponse(SanPhamRequest request) {
        PhanLoaiSanPham danhMuc = phanLoaiSanPhamRepository.findById(request.getIdDanhMuc())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "ID", request.getIdDanhMuc()));
        
        SanPham sanPham = new SanPham();
        sanPham.setTenSanPham(request.getTenSanPham());
        sanPham.setDanhMuc(danhMuc);
        sanPham.setDonViDem(request.getDonViDem());
        sanPham.setGia(request.getGia());
        sanPham.setCongDung(request.getCongDung());
        sanPham.setSoLuong(request.getSoLuong() != null ? request.getSoLuong() : 0);
        
        SanPham savedEntity = sanPhamRepository.save(sanPham);
        return sanPhamMapper.toResponse(savedEntity);
    }
    
    @Transactional
    public SanPham capNhatSanPham(int id, String tenSanPham, Integer idDanhMuc, 
                                 String donViDem, BigDecimal gia, String congDung, Integer soLuong) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "ID", id));
        
        if (tenSanPham != null) {
            sanPham.setTenSanPham(tenSanPham);
        }
        
        if (idDanhMuc != null) {
            PhanLoaiSanPham danhMuc = phanLoaiSanPhamRepository.findById(idDanhMuc)
                    .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "ID", idDanhMuc));
            sanPham.setDanhMuc(danhMuc);
        }
        
        if (donViDem != null) {
            sanPham.setDonViDem(donViDem);
        }
        
        if (gia != null) {
            sanPham.setGia(gia);
        }
        
        if (congDung != null) {
            sanPham.setCongDung(congDung);
        }
        
        if (soLuong != null) {
            sanPham.setSoLuong(soLuong);
        }
        
        return sanPhamRepository.save(sanPham);
    }
    
    @Transactional
    public SanPhamResponse capNhatSanPhamResponse(int id, SanPhamRequest request) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "ID", id));
        
        if (request.getTenSanPham() != null) {
            sanPham.setTenSanPham(request.getTenSanPham());
        }
        
        if (request.getIdDanhMuc() != null) {
            PhanLoaiSanPham danhMuc = phanLoaiSanPhamRepository.findById(request.getIdDanhMuc())
                    .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "ID", request.getIdDanhMuc()));
            sanPham.setDanhMuc(danhMuc);
        }
        
        if (request.getDonViDem() != null) {
            sanPham.setDonViDem(request.getDonViDem());
        }
        
        if (request.getGia() != null) {
            sanPham.setGia(request.getGia());
        }
        
        if (request.getCongDung() != null) {
            sanPham.setCongDung(request.getCongDung());
        }
        
        if (request.getSoLuong() != null) {
            sanPham.setSoLuong(request.getSoLuong());
        }
        
        SanPham updatedEntity = sanPhamRepository.save(sanPham);
        return sanPhamMapper.toResponse(updatedEntity);
    }
    
    @Transactional
    public void xoaSanPham(int id) {
        if (!sanPhamRepository.existsById(id)) {
            throw new ResourceNotFoundException("Sản phẩm", "ID", id);
        }
        
        sanPhamRepository.deleteById(id);
    }
    
    @Transactional
    public SanPham capNhatSoLuongSanPham(int id, int soLuongMoi) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "ID", id));
        
        sanPham.setSoLuong(soLuongMoi);
        
        return sanPhamRepository.save(sanPham);
    }
    
    @Transactional
    public SanPhamResponse capNhatSoLuongSanPhamResponse(int id, int soLuongMoi) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "ID", id));
        
        sanPham.setSoLuong(soLuongMoi);
        
        SanPham updatedEntity = sanPhamRepository.save(sanPham);
        return sanPhamMapper.toResponse(updatedEntity);
    }
}