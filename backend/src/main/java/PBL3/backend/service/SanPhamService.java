package PBL3.backend.service;

import PBL3.backend.model.PhanLoaiSanPham;
import PBL3.backend.model.SanPham;
import PBL3.backend.repository.PhanLoaiSanPhamRepository;
import PBL3.backend.repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SanPhamService {

    private final SanPhamRepository sanPhamRepository;
    private final PhanLoaiSanPhamRepository phanLoaiSanPhamRepository;

    @Autowired
    public SanPhamService(SanPhamRepository sanPhamRepository,
                          PhanLoaiSanPhamRepository phanLoaiSanPhamRepository) {
        this.sanPhamRepository = sanPhamRepository;
        this.phanLoaiSanPhamRepository = phanLoaiSanPhamRepository;
    }

    public List<SanPham> getAllSanPham() {
        return sanPhamRepository.findAll();
    }

    public Optional<SanPham> getSanPhamById(int id) {
        return sanPhamRepository.findById(id);
    }

    public List<SanPham> getSanPhamByDanhMuc(int idDanhMuc) {
        PhanLoaiSanPham danhMuc = phanLoaiSanPhamRepository.findById(idDanhMuc)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + idDanhMuc));
        return sanPhamRepository.findByDanhMuc(danhMuc);
    }

    public SanPham getSanPhamByTen(String tenSanPham) {
        return sanPhamRepository.findByTenSanPham(tenSanPham);
    }

    @Transactional
    public SanPham createSanPham(SanPham sanPham) {
        // Kiểm tra tồn tại của danh mục
        if (sanPham.getDanhMuc() == null || sanPham.getDanhMuc().getIdDanhMuc() == 0) {
            throw new RuntimeException("Danh mục không hợp lệ");
        }
        
        PhanLoaiSanPham danhMuc = phanLoaiSanPhamRepository.findById(sanPham.getDanhMuc().getIdDanhMuc())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + sanPham.getDanhMuc().getIdDanhMuc()));
        
        // Kiểm tra trùng tên sản phẩm
        if (sanPhamRepository.findByTenSanPham(sanPham.getTenSanPham()) != null) {
            throw new RuntimeException("Sản phẩm với tên này đã tồn tại");
        }
        
        // Thiết lập thông tin mặc định nếu cần
        if (sanPham.getSoLuong() == null) {
            sanPham.setSoLuong(0);
        }
        
        sanPham.setDanhMuc(danhMuc);
        return sanPhamRepository.save(sanPham);
    }

    @Transactional
    public SanPham updateSanPham(int id, SanPham sanPhamDetails) {
        SanPham sanPham = sanPhamRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
        
        // Kiểm tra trùng tên với sản phẩm khác
        if (sanPhamDetails.getTenSanPham() != null) {
            SanPham existingSanPham = sanPhamRepository.findByTenSanPham(sanPhamDetails.getTenSanPham());
            if (existingSanPham != null && existingSanPham.getIdSanPham() != id) {
                throw new RuntimeException("Sản phẩm với tên này đã tồn tại");
            }
        }
        
        // Kiểm tra tồn tại của danh mục nếu thay đổi
        if (sanPhamDetails.getDanhMuc() != null && sanPhamDetails.getDanhMuc().getIdDanhMuc() != 0 
                && sanPhamDetails.getDanhMuc().getIdDanhMuc() != sanPham.getDanhMuc().getIdDanhMuc()) {
            PhanLoaiSanPham danhMuc = phanLoaiSanPhamRepository.findById(sanPhamDetails.getDanhMuc().getIdDanhMuc())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + sanPhamDetails.getDanhMuc().getIdDanhMuc()));
            sanPham.setDanhMuc(danhMuc);
        }
        
        // Cập nhật thông tin
        if (sanPhamDetails.getTenSanPham() != null) {
            sanPham.setTenSanPham(sanPhamDetails.getTenSanPham());
        }
        
        if (sanPhamDetails.getDonViDem() != null) {
            sanPham.setDonViDem(sanPhamDetails.getDonViDem());
        }
        
        if (sanPhamDetails.getGia() != null) {
            sanPham.setGia(sanPhamDetails.getGia());
        }
        
        if (sanPhamDetails.getCongDung() != null) {
            sanPham.setCongDung(sanPhamDetails.getCongDung());
        }
        
        if (sanPhamDetails.getSoLuong() != null) {
            sanPham.setSoLuong(sanPhamDetails.getSoLuong());
        }
        
        return sanPhamRepository.save(sanPham);
    }

    @Transactional
    public void deleteSanPham(int id) {
        SanPham sanPham = sanPhamRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
            
        // Kiểm tra liên kết với chi tiết hóa đơn trước khi xóa
        if (!sanPham.getHoaDonChiTietList().isEmpty()) {
            throw new RuntimeException("Không thể xóa sản phẩm đã có trong hóa đơn");
        }
        
        sanPhamRepository.deleteById(id);
    }
    
    @Transactional
    public SanPham updateSanPhamSoLuong(int id, int soLuongMoi) {
        SanPham sanPham = sanPhamRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
            
        sanPham.setSoLuong(soLuongMoi);
        return sanPhamRepository.save(sanPham);
    }
    
    @Transactional
    public SanPham addSanPhamSoLuong(int id, int soLuongThem) {
        SanPham sanPham = sanPhamRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
            
        sanPham.setSoLuong(sanPham.getSoLuong() + soLuongThem);
        return sanPhamRepository.save(sanPham);
    }
}