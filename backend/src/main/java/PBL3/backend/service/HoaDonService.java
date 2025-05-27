package PBL3.backend.service;

import PBL3.backend.model.DangKy;
import PBL3.backend.model.HoaDon;
import PBL3.backend.model.HoaDonChiTiet;
import PBL3.backend.repository.DangKyRepository;
import PBL3.backend.repository.HoaDonChiTietRepository;
import PBL3.backend.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HoaDonService {

    private final HoaDonRepository hoaDonRepository;
    private final DangKyRepository dangKyRepository;
    private final HoaDonChiTietRepository hoaDonChiTietRepository;

    @Autowired
    public HoaDonService(HoaDonRepository hoaDonRepository, 
                         DangKyRepository dangKyRepository,
                         HoaDonChiTietRepository hoaDonChiTietRepository) {
        this.hoaDonRepository = hoaDonRepository;
        this.dangKyRepository = dangKyRepository;
        this.hoaDonChiTietRepository = hoaDonChiTietRepository;
    }

    public List<HoaDon> getAllHoaDon() {
        return hoaDonRepository.findAll();
    }

    public Optional<HoaDon> getHoaDonById(int id) {
        return hoaDonRepository.findById(id);
    }

    public List<HoaDon> getHoaDonByDangKy(int idDangKy) {
        DangKy dangKy = dangKyRepository.findById(idDangKy)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + idDangKy));
        return hoaDonRepository.findByDangKy(dangKy);
    }

    public List<HoaDon> getHoaDonByKhachHang(int idKhachHang) {
        return hoaDonRepository.findByDangKyKhachHangId(idKhachHang);
    }

    @Transactional
    public HoaDon createHoaDon(HoaDon hoaDon) {
        if (hoaDon.getDangKy() != null && hoaDon.getDangKy().getIdDangKy() > 0) {
            DangKy dangKy = dangKyRepository.findById(hoaDon.getDangKy().getIdDangKy())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + hoaDon.getDangKy().getIdDangKy()));
            hoaDon.setDangKy(dangKy);
            
            if (dangKy.getGoiDichVu() != null && (hoaDon.getTongTien() == null || hoaDon.getTongTien().compareTo(BigDecimal.ZERO) == 0)) {
                BigDecimal giaGoi = dangKy.getGoiDichVu().getGia();
                hoaDon.setTongTien(giaGoi);
                
                if (hoaDon.getGiamGia() == null || hoaDon.getGiamGia().compareTo(BigDecimal.ZERO) == 0) {
                    hoaDon.setGiamGia(BigDecimal.ZERO);
                }
                
                BigDecimal thanhToan = giaGoi.subtract(hoaDon.getGiamGia());
                hoaDon.setThanhToan(thanhToan.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : thanhToan);
            }
        } else {
            hoaDon.setDangKy(null);
        }
        
        if (hoaDon.getThoiGianTao() == null) {
            hoaDon.setThoiGianTao(LocalDateTime.now());
        }
        
        if (hoaDon.getTrangThai() == null) {
            hoaDon.setTrangThai("Chờ xử lý");
        }
        
        if (hoaDon.getTrangThaiThanhToan() == null) {
            hoaDon.setTrangThaiThanhToan("Chưa thanh toán");
        }
        
        if (hoaDon.getTongTien() == null) {
            hoaDon.setTongTien(BigDecimal.ZERO);
        }
        
        if (hoaDon.getGiamGia() == null) {
            hoaDon.setGiamGia(BigDecimal.ZERO);
        }
        
        if (hoaDon.getThanhToan() == null) {
            hoaDon.setThanhToan(BigDecimal.ZERO);
        }
        
        if (hoaDon.getPhuongThuc() == null) {
            hoaDon.setPhuongThuc("tienmat");
        }
        
        if ("Tiền mặt".equals(hoaDon.getPhuongThuc())) {
            hoaDon.setPhuongThuc("tienmat");
        } else if ("Chuyển khoản".equals(hoaDon.getPhuongThuc())) {
            hoaDon.setPhuongThuc("chuyenkhoan");
        } else if ("Thẻ tín dụng".equals(hoaDon.getPhuongThuc())) {
            hoaDon.setPhuongThuc("thetindung");
        }
        
        return hoaDonRepository.save(hoaDon);
    }

    @Transactional
    public HoaDon updateHoaDon(int id, HoaDon hoaDonDetails) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
        
        if (hoaDonDetails.getTrangThai() != null) {
            hoaDon.setTrangThai(hoaDonDetails.getTrangThai());
        }
        
        if (hoaDonDetails.getTongTien() != null) {
            hoaDon.setTongTien(hoaDonDetails.getTongTien());
        }
        
        if (hoaDonDetails.getGiamGia() != null) {
            hoaDon.setGiamGia(hoaDonDetails.getGiamGia());
        }
        
        if (hoaDonDetails.getThanhToan() != null) {
            hoaDon.setThanhToan(hoaDonDetails.getThanhToan());
        }
        
        if (hoaDonDetails.getPhuongThuc() != null) {
            hoaDon.setPhuongThuc(hoaDonDetails.getPhuongThuc());
        }
        
        if (hoaDonDetails.getTrangThaiThanhToan() != null) {
            hoaDon.setTrangThaiThanhToan(hoaDonDetails.getTrangThaiThanhToan());
        }
        
        return hoaDonRepository.save(hoaDon);
    }

    @Transactional
    public void deleteHoaDon(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        if (!hoaDon.getChiTietList().isEmpty()) {
            throw new RuntimeException("Không thể xóa hóa đơn đã có chi tiết");
        }
        
        hoaDonRepository.deleteById(id);
    }
    
    @Transactional
    public HoaDon hoanThanhHoaDon(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        hoaDon.setTrangThai("Hoàn thành");
        return hoaDonRepository.save(hoaDon);
    }
    
    @Transactional
    public HoaDon huyHoaDon(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        hoaDon.setTrangThai("Hủy");
        return hoaDonRepository.save(hoaDon);
    }
    
    @Transactional
    public HoaDon calculateTotals(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        List<HoaDonChiTiet> chiTietList = hoaDonChiTietRepository.findByHoaDon(hoaDon);
        
        BigDecimal tongTien = BigDecimal.ZERO;
        for (HoaDonChiTiet chiTiet : chiTietList) {
            tongTien = tongTien.add(chiTiet.getThanhTien() != null ? chiTiet.getThanhTien() : BigDecimal.ZERO);
        }
        
        hoaDon.setTongTien(tongTien);
        
        BigDecimal giamGia = hoaDon.getGiamGia() != null ? hoaDon.getGiamGia() : BigDecimal.ZERO;
        BigDecimal thanhToan = tongTien.subtract(giamGia);
        hoaDon.setThanhToan(thanhToan.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : thanhToan);
        
        return hoaDonRepository.save(hoaDon);
    }
    
    @Transactional
    public HoaDon daThanhToan(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        hoaDon.setTrangThaiThanhToan("Đã thanh toán");
        return hoaDonRepository.save(hoaDon);
    }
    
    @Transactional
    public HoaDon chuaThanhToan(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        hoaDon.setTrangThaiThanhToan("Chưa thanh toán");
        return hoaDonRepository.save(hoaDon);
    }
}