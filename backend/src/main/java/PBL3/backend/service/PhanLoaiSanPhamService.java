package PBL3.backend.service;

import PBL3.backend.model.PhanLoaiSanPham;
import PBL3.backend.repository.PhanLoaiSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PhanLoaiSanPhamService {

    private final PhanLoaiSanPhamRepository phanLoaiSanPhamRepository;

    @Autowired
    public PhanLoaiSanPhamService(PhanLoaiSanPhamRepository phanLoaiSanPhamRepository) {
        this.phanLoaiSanPhamRepository = phanLoaiSanPhamRepository;
    }

    public List<PhanLoaiSanPham> getAllPhanLoaiSanPham() {
        return phanLoaiSanPhamRepository.findAll();
    }

    public Optional<PhanLoaiSanPham> getPhanLoaiSanPhamById(int id) {
        return phanLoaiSanPhamRepository.findById(id);
    }

    public PhanLoaiSanPham getPhanLoaiSanPhamByTen(String tenDanhMuc) {
        return phanLoaiSanPhamRepository.findByTenDanhMuc(tenDanhMuc);
    }

    @Transactional
    public PhanLoaiSanPham createPhanLoaiSanPham(PhanLoaiSanPham phanLoaiSanPham) {
        // Kiểm tra trùng tên danh mục
        if (phanLoaiSanPhamRepository.findByTenDanhMuc(phanLoaiSanPham.getTenDanhMuc()) != null) {
            throw new RuntimeException("Danh mục với tên này đã tồn tại");
        }
        
        return phanLoaiSanPhamRepository.save(phanLoaiSanPham);
    }

    @Transactional
    public PhanLoaiSanPham updatePhanLoaiSanPham(int id, PhanLoaiSanPham phanLoaiSanPhamDetails) {
        PhanLoaiSanPham phanLoaiSanPham = phanLoaiSanPhamRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));
        
        // Kiểm tra trùng tên với danh mục khác
        if (phanLoaiSanPhamDetails.getTenDanhMuc() != null) {
            PhanLoaiSanPham existingDanhMuc = phanLoaiSanPhamRepository.findByTenDanhMuc(phanLoaiSanPhamDetails.getTenDanhMuc());
            if (existingDanhMuc != null && existingDanhMuc.getIdDanhMuc() != id) {
                throw new RuntimeException("Danh mục với tên này đã tồn tại");
            }
        }
        
        // Cập nhật thông tin
        phanLoaiSanPham.setTenDanhMuc(phanLoaiSanPhamDetails.getTenDanhMuc());
        
        return phanLoaiSanPhamRepository.save(phanLoaiSanPham);
    }

    @Transactional
    public void deletePhanLoaiSanPham(int id) {
        PhanLoaiSanPham phanLoaiSanPham = phanLoaiSanPhamRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));
            
        // Kiểm tra liên kết với các sản phẩm trước khi xóa
        if (!phanLoaiSanPham.getSanPhamList().isEmpty()) {
            throw new RuntimeException("Không thể xóa danh mục đã có sản phẩm");
        }
        
        phanLoaiSanPhamRepository.deleteById(id);
    }
}