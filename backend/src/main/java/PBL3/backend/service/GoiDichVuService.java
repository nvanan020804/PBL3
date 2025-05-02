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
    private GoiDichVuRepository repository;

    public List<GoiDichVu> layTatCaGoiDichVu() {
        return repository.findAll();
    }

    public Optional<GoiDichVu> layGoiDichVuTheoId(int id) {
        return repository.findById(id);
    }

    public GoiDichVu taoMoiGoiDichVu(GoiDichVuDTO dto) {
        GoiDichVu goiDichVu = new GoiDichVu();
        chuyenDoiDtoSangEntity(dto, goiDichVu);
        return repository.save(goiDichVu);
    }

    public GoiDichVu capNhatGoiDichVu(int id, GoiDichVuDTO dto) {
        return repository.findById(id).map(goiDichVu -> {
            chuyenDoiDtoSangEntity(dto, goiDichVu);
            return repository.save(goiDichVu);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy gói dịch vụ với ID: " + id));
    }

    private void chuyenDoiDtoSangEntity(GoiDichVuDTO dto, GoiDichVu entity) {
        entity.setTenGoi(dto.getTenGoi());
        entity.setGia(dto.getGia());
        entity.setMoTa(dto.getMoTa());
        entity.setThoiGian(dto.getThoiGian());
    }

    public void xoaGoiDichVu(int id) {
        repository.deleteById(id);
    }
}