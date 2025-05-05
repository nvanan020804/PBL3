package PBL3.backend.service;

import PBL3.backend.model.GoiDichVu;
import PBL3.backend.repository.GoiDichVuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GoiDichVuService {

    private final GoiDichVuRepository goiDichVuRepository;

    @Autowired
    public GoiDichVuService(GoiDichVuRepository goiDichVuRepository) {
        this.goiDichVuRepository = goiDichVuRepository;
    }

    public List<GoiDichVu> getAllGoiDichVu() {
        return goiDichVuRepository.findAll();
    }

    public Optional<GoiDichVu> getGoiDichVuById(int id) {
        return goiDichVuRepository.findById(id);
    }

    public GoiDichVu getGoiDichVuByTen(String tenGoi) {
        return goiDichVuRepository.findByTenGoi(tenGoi);
    }

    @Transactional
    public GoiDichVu createGoiDichVu(GoiDichVu goiDichVu) {
        // Kiểm tra trùng tên gói dịch vụ
        if (goiDichVuRepository.findByTenGoi(goiDichVu.getTenGoi()) != null) {
            throw new RuntimeException("Gói dịch vụ với tên này đã tồn tại");
        }
        
        return goiDichVuRepository.save(goiDichVu);
    }

    @Transactional
    public GoiDichVu updateGoiDichVu(int id, GoiDichVu goiDichVuDetails) {
        GoiDichVu goiDichVu = goiDichVuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy gói dịch vụ với ID: " + id));
        
        // Kiểm tra trùng tên với gói dịch vụ khác
        if (goiDichVuDetails.getTenGoi() != null) {
            GoiDichVu existingGoiDichVu = goiDichVuRepository.findByTenGoi(goiDichVuDetails.getTenGoi());
            if (existingGoiDichVu != null && existingGoiDichVu.getId() != id) {
                throw new RuntimeException("Gói dịch vụ với tên này đã tồn tại");
            }
        }
        
        // Cập nhật thông tin
        goiDichVu.setTenGoi(goiDichVuDetails.getTenGoi());
        goiDichVu.setGia(goiDichVuDetails.getGia());
        goiDichVu.setMoTa(goiDichVuDetails.getMoTa());
        goiDichVu.setThoiGian(goiDichVuDetails.getThoiGian());
        
        return goiDichVuRepository.save(goiDichVu);
    }

    @Transactional
    public void deleteGoiDichVu(int id) {
        GoiDichVu goiDichVu = goiDichVuRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy gói dịch vụ với ID: " + id));
            
        // Kiểm tra liên kết với các đăng ký trước khi xóa
        if (!goiDichVu.getDangKyList().isEmpty()) {
            throw new RuntimeException("Không thể xóa gói dịch vụ đã có người đăng ký");
        }
        
        goiDichVuRepository.deleteById(id);
    }
}