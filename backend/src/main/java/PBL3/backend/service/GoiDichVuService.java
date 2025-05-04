package PBL3.backend.service;

import PBL3.backend.dto.request.GoiDichVuRequest;
import PBL3.backend.exception.ResourceNotFoundException;
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

    public GoiDichVu taoGoiDichVu(GoiDichVuRequest goiDichVuRequest) {
        GoiDichVu goiDichVu = new GoiDichVu();
        goiDichVu.setTenGoi(goiDichVuRequest.getTenGoi());
        goiDichVu.setGia(goiDichVuRequest.getGia());
        goiDichVu.setMoTa(goiDichVuRequest.getMoTa());
        goiDichVu.setThoiGian(goiDichVuRequest.getThoiGian());
        return goiDichVuRepository.save(goiDichVu);
    }

    public GoiDichVu capNhatGoiDichVu(int id, GoiDichVuRequest goiDichVuRequest) {
        GoiDichVu goiDichVu = goiDichVuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GoiDichVu", "id", id));
        
        goiDichVu.setTenGoi(goiDichVuRequest.getTenGoi());
        goiDichVu.setGia(goiDichVuRequest.getGia());
        goiDichVu.setMoTa(goiDichVuRequest.getMoTa());
        goiDichVu.setThoiGian(goiDichVuRequest.getThoiGian());
        return goiDichVuRepository.save(goiDichVu);
    }

    public void xoaGoiDichVu(int id) {
        if (!goiDichVuRepository.existsById(id)) {
            throw new ResourceNotFoundException("GoiDichVu", "id", id);
        }
        goiDichVuRepository.deleteById(id);
    }
}