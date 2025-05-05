package PBL3.backend.service;

import PBL3.backend.model.HoaDon;
import PBL3.backend.model.HoaDonChiTiet;
import PBL3.backend.model.SanPham;
import PBL3.backend.repository.HoaDonChiTietRepository;
import PBL3.backend.repository.HoaDonRepository;
import PBL3.backend.repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class HoaDonChiTietService {

    private final HoaDonChiTietRepository hoaDonChiTietRepository;
    private final HoaDonRepository hoaDonRepository;
    private final SanPhamRepository sanPhamRepository;

    @Autowired
    public HoaDonChiTietService(HoaDonChiTietRepository hoaDonChiTietRepository,
                                HoaDonRepository hoaDonRepository,
                                SanPhamRepository sanPhamRepository) {
        this.hoaDonChiTietRepository = hoaDonChiTietRepository;
        this.hoaDonRepository = hoaDonRepository;
        this.sanPhamRepository = sanPhamRepository;
    }

    public List<HoaDonChiTiet> getAllHoaDonChiTiet() {
        return hoaDonChiTietRepository.findAll();
    }

    public Optional<HoaDonChiTiet> getHoaDonChiTietById(int id) {
        return hoaDonChiTietRepository.findById(id);
    }

    public List<HoaDonChiTiet> getChiTietByHoaDon(int idHoaDon) {
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + idHoaDon));
        return hoaDonChiTietRepository.findByHoaDon(hoaDon);
    }

    @Transactional
    public HoaDonChiTiet createHoaDonChiTiet(HoaDonChiTiet hoaDonChiTiet) {
        // Kiểm tra tồn tại của hóa đơn và sản phẩm
        if (hoaDonChiTiet.getHoaDon() == null || hoaDonChiTiet.getHoaDon().getIdHoaDon() == 0) {
            throw new RuntimeException("Hóa đơn không hợp lệ");
        }
        
        if (hoaDonChiTiet.getSanPham() == null || hoaDonChiTiet.getSanPham().getIdSanPham() == 0) {
            throw new RuntimeException("Sản phẩm không hợp lệ");
        }
        
        // Lấy thông tin đầy đủ
        HoaDon hoaDon = hoaDonRepository.findById(hoaDonChiTiet.getHoaDon().getIdHoaDon())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + hoaDonChiTiet.getHoaDon().getIdHoaDon()));
            
        SanPham sanPham = sanPhamRepository.findById(hoaDonChiTiet.getSanPham().getIdSanPham())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + hoaDonChiTiet.getSanPham().getIdSanPham()));
        
        // Kiểm tra số lượng sản phẩm
        if (hoaDonChiTiet.getSoLuong() <= 0) {
            throw new RuntimeException("Số lượng sản phẩm phải lớn hơn 0");
        }
        
        if (sanPham.getSoLuong() < hoaDonChiTiet.getSoLuong()) {
            throw new RuntimeException("Sản phẩm không đủ số lượng. Hiện có: " + sanPham.getSoLuong());
        }
        
        // Thiết lập giá (có thể lấy giá tại thời điểm mua hoặc được truyền vào)
        if (hoaDonChiTiet.getGia() == null || hoaDonChiTiet.getGia().compareTo(BigDecimal.ZERO) == 0) {
            hoaDonChiTiet.setGia(sanPham.getGia());
        }
        
        // Cập nhật số lượng sản phẩm
        sanPham.setSoLuong(sanPham.getSoLuong() - hoaDonChiTiet.getSoLuong());
        sanPhamRepository.save(sanPham);
        
        // Lưu chi tiết hóa đơn
        hoaDonChiTiet.setHoaDon(hoaDon);
        hoaDonChiTiet.setSanPham(sanPham);
        
        return hoaDonChiTietRepository.save(hoaDonChiTiet);
    }

    @Transactional
    public HoaDonChiTiet updateHoaDonChiTiet(int id, HoaDonChiTiet hoaDonChiTietDetails) {
        HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết hóa đơn với ID: " + id));
        
        // Lấy sản phẩm
        SanPham sanPham = hoaDonChiTiet.getSanPham();
        
        // Tính toán số lượng sản phẩm sẽ cần điều chỉnh
        int oldQuantity = hoaDonChiTiet.getSoLuong();
        int newQuantity = hoaDonChiTietDetails.getSoLuong();
        int quantityDiff = newQuantity - oldQuantity;
        
        // Kiểm tra nếu tăng số lượng, xem có đủ trong kho không
        if (quantityDiff > 0 && sanPham.getSoLuong() < quantityDiff) {
            throw new RuntimeException("Sản phẩm không đủ số lượng. Hiện có: " + sanPham.getSoLuong());
        }
        
        // Cập nhật số lượng trong kho
        sanPham.setSoLuong(sanPham.getSoLuong() - quantityDiff);
        sanPhamRepository.save(sanPham);
        
        // Cập nhật thông tin chi tiết hóa đơn
        hoaDonChiTiet.setSoLuong(newQuantity);
        if (hoaDonChiTietDetails.getGia() != null && hoaDonChiTietDetails.getGia().compareTo(BigDecimal.ZERO) > 0) {
            hoaDonChiTiet.setGia(hoaDonChiTietDetails.getGia());
        }
        
        return hoaDonChiTietRepository.save(hoaDonChiTiet);
    }

    @Transactional
    public void deleteHoaDonChiTiet(int id) {
        HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết hóa đơn với ID: " + id));
            
        // Hoàn lại số lượng sản phẩm
        SanPham sanPham = hoaDonChiTiet.getSanPham();
        sanPham.setSoLuong(sanPham.getSoLuong() + hoaDonChiTiet.getSoLuong());
        sanPhamRepository.save(sanPham);
        
        hoaDonChiTietRepository.deleteById(id);
    }
}