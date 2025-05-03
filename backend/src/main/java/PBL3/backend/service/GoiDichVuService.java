package PBL3.backend.service;

import PBL3.backend.dto.GoiDichVuDTO;
import PBL3.backend.model.GoiDichVu;
import PBL3.backend.repository.GoiDichVuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GoiDichVuService {

    @Autowired
    private GoiDichVuRepository goiDichVuRepository;

    public List<GoiDichVu> layTatCaGoiDichVu() {
        return goiDichVuRepository.findAll();
    }

    public Optional<GoiDichVu> layGoiDichVuTheoId(int id) {
        return goiDichVuRepository.findById(id);
    }

    public GoiDichVu taoGoiDichVu(GoiDichVuDTO goiDichVuDTO) {
        GoiDichVu goiDichVu = new GoiDichVu();
        goiDichVu.setTenGoi(goiDichVuDTO.getTenGoi());
        goiDichVu.setGia(goiDichVuDTO.getGia()); // Already BigDecimal in DTO
        goiDichVu.setMoTa(goiDichVuDTO.getMoTa());
        goiDichVu.setThoiGian(goiDichVuDTO.getThoiGian());
        return goiDichVuRepository.save(goiDichVu);
    }

    public GoiDichVu capNhatGoiDichVu(int id, GoiDichVuDTO goiDichVuDTO) {
        GoiDichVu goiDichVu = goiDichVuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy gói dịch vụ với ID: " + id));
        
        goiDichVu.setTenGoi(goiDichVuDTO.getTenGoi());
        goiDichVu.setGia(goiDichVuDTO.getGia()); // Already BigDecimal in DTO
        goiDichVu.setMoTa(goiDichVuDTO.getMoTa());
        goiDichVu.setThoiGian(goiDichVuDTO.getThoiGian());
        return goiDichVuRepository.save(goiDichVu);
    }

    public void xoaGoiDichVu(int id) {
        goiDichVuRepository.deleteById(id);
    }
}