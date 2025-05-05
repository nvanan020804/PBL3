package PBL3.backend.service;

import PBL3.backend.model.DoanhThu;
import PBL3.backend.repository.DoanhThuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class DoanhThuService {

    private final DoanhThuRepository doanhThuRepository;

    @Autowired
    public DoanhThuService(DoanhThuRepository doanhThuRepository) {
        this.doanhThuRepository = doanhThuRepository;
    }

    public List<DoanhThu> getAllDoanhThu() {
        return doanhThuRepository.findAll();
    }

    public Optional<DoanhThu> getDoanhThuById(int id) {
        return doanhThuRepository.findById(id);
    }

    public DoanhThu getDoanhThuByThoiGian(String thoiGian) {
        return doanhThuRepository.findByThoiGian(thoiGian);
    }

    @Transactional
    public DoanhThu createDoanhThu(DoanhThu doanhThu) {
        // Kiểm tra đã tồn tại thời gian này chưa
        if (doanhThuRepository.findByThoiGian(doanhThu.getThoiGian()) != null) {
            throw new RuntimeException("Doanh thu cho thời gian này đã tồn tại");
        }
        
        // Thiết lập giá trị mặc định nếu chưa có
        if (doanhThu.getTongChi() == null) {
            doanhThu.setTongChi(BigDecimal.ZERO);
        }
        
        if (doanhThu.getTongThu() == null) {
            doanhThu.setTongThu(BigDecimal.ZERO);
        }
        
        return doanhThuRepository.save(doanhThu);
    }

    @Transactional
    public DoanhThu updateDoanhThu(int id, DoanhThu doanhThuDetails) {
        DoanhThu doanhThu = doanhThuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh thu với ID: " + id));
        
        // Cập nhật thông tin
        if (doanhThuDetails.getThoiGian() != null) {
            // Kiểm tra trùng thời gian
            DoanhThu existingDoanhThu = doanhThuRepository.findByThoiGian(doanhThuDetails.getThoiGian());
            if (existingDoanhThu != null && existingDoanhThu.getIdDoanhThu() != id) {
                throw new RuntimeException("Doanh thu cho thời gian này đã tồn tại");
            }
            doanhThu.setThoiGian(doanhThuDetails.getThoiGian());
        }
        
        if (doanhThuDetails.getTongChi() != null) {
            doanhThu.setTongChi(doanhThuDetails.getTongChi());
        }
        
        if (doanhThuDetails.getTongThu() != null) {
            doanhThu.setTongThu(doanhThuDetails.getTongThu());
        }
        
        return doanhThuRepository.save(doanhThu);
    }

    @Transactional
    public void deleteDoanhThu(int id) {
        DoanhThu doanhThu = doanhThuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh thu với ID: " + id));
        
        doanhThuRepository.deleteById(id);
    }
    
    @Transactional
    public DoanhThu updateTongThu(int id, BigDecimal tongThuMoi) {
        DoanhThu doanhThu = doanhThuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh thu với ID: " + id));
            
        doanhThu.setTongThu(tongThuMoi);
        return doanhThuRepository.save(doanhThu);
    }
    
    @Transactional
    public DoanhThu updateTongChi(int id, BigDecimal tongChiMoi) {
        DoanhThu doanhThu = doanhThuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh thu với ID: " + id));
            
        doanhThu.setTongChi(tongChiMoi);
        return doanhThuRepository.save(doanhThu);
    }
    
    @Transactional
    public DoanhThu addTongThu(int id, BigDecimal soTien) {
        DoanhThu doanhThu = doanhThuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh thu với ID: " + id));
            
        doanhThu.setTongThu(doanhThu.getTongThu().add(soTien));
        return doanhThuRepository.save(doanhThu);
    }
    
    @Transactional
    public DoanhThu addTongChi(int id, BigDecimal soTien) {
        DoanhThu doanhThu = doanhThuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy doanh thu với ID: " + id));
            
        doanhThu.setTongChi(doanhThu.getTongChi().add(soTien));
        return doanhThuRepository.save(doanhThu);
    }
}