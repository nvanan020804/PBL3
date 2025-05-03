package PBL3.backend.service;

import PBL3.backend.model.DoanhThu;
import PBL3.backend.repository.DoanhThuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class DoanhThuService {

    @Autowired
    private DoanhThuRepository doanhThuRepository;
    
    public List<DoanhThu> layTatCaDoanhThu() {
        return doanhThuRepository.findAll();
    }
    
    public Optional<DoanhThu> layDoanhThuTheoId(int id) {
        return doanhThuRepository.findById(id);
    }
    
    @Transactional
    public DoanhThu taoDoanhThuMoi(String thoiGian, BigDecimal tongThu, BigDecimal tongChi) {
        DoanhThu doanhThu = new DoanhThu();
        doanhThu.setThoiGian(thoiGian);
        doanhThu.setTongThu(tongThu != null ? tongThu : BigDecimal.ZERO);
        doanhThu.setTongChi(tongChi != null ? tongChi : BigDecimal.ZERO);
        return doanhThuRepository.save(doanhThu);
    }
    
    @Transactional
    public DoanhThu taoDoanhThuTheoThang(int thang, int nam, BigDecimal tongThu, BigDecimal tongChi) {
        String thoiGian = String.format("%02d/%d", thang, nam);
        return taoDoanhThuMoi(thoiGian, tongThu, tongChi);
    }
    
    @Transactional
    public DoanhThu capNhatDoanhThu(int id, BigDecimal tongThu, BigDecimal tongChi) {
        DoanhThu doanhThu = doanhThuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh thu với ID: " + id));
        
        if (tongThu != null) {
            doanhThu.setTongThu(tongThu);
        }
        
        if (tongChi != null) {
            doanhThu.setTongChi(tongChi);
        }
        
        return doanhThuRepository.save(doanhThu);
    }
    
    @Transactional
    public DoanhThu themThuNhap(int id, BigDecimal soTien) {
        if (soTien == null || soTien.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền phải lớn hơn 0");
        }
        
        DoanhThu doanhThu = doanhThuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh thu với ID: " + id));
        
        doanhThu.setTongThu(doanhThu.getTongThu().add(soTien));
        return doanhThuRepository.save(doanhThu);
    }
    
    @Transactional
    public DoanhThu themChiPhi(int id, BigDecimal soTien) {
        if (soTien == null || soTien.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền phải lớn hơn 0");
        }
        
        DoanhThu doanhThu = doanhThuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh thu với ID: " + id));
        
        doanhThu.setTongChi(doanhThu.getTongChi().add(soTien));
        return doanhThuRepository.save(doanhThu);
    }
    
    @Transactional
    public BigDecimal tinhLoiNhuanTheoDoanhThu(int id) {
        DoanhThu doanhThu = doanhThuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh thu với ID: " + id));
        
        return doanhThu.getTongThu().subtract(doanhThu.getTongChi());
    }
    
    @Transactional
    public DoanhThu layHoacTaoDoanhThuThangHienTai() {
        LocalDate ngayHienTai = LocalDate.now();
        String thoiGian = String.format("%02d/%d", ngayHienTai.getMonthValue(), ngayHienTai.getYear());
        
        // Find existing revenue record for current month
        Optional<DoanhThu> doanhThu = doanhThuRepository.findAll().stream()
                .filter(dt -> dt.getThoiGian().equals(thoiGian))
                .findFirst();
        
        return doanhThu.orElseGet(() -> taoDoanhThuMoi(thoiGian, BigDecimal.ZERO, BigDecimal.ZERO));
    }
}