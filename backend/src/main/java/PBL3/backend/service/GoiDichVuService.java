package PBL3.backend.service;

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

    public GoiDichVu taoMoiGoiDichVu(GoiDichVu goiDichVu) {
        return repository.save(goiDichVu);
    }

    public GoiDichVu capNhatGoiDichVu(int id, GoiDichVu goiDichVuCapNhat) {
        return repository.findById(id).map(goiDichVuHienTai -> {
            goiDichVuHienTai.setTenGoi(goiDichVuCapNhat.getTenGoi());
            goiDichVuHienTai.setGia(goiDichVuCapNhat.getGia());
            goiDichVuHienTai.setMoTa(goiDichVuCapNhat.getMoTa());
            goiDichVuHienTai.setThoiGian(goiDichVuCapNhat.getThoiGian());
            return repository.save(goiDichVuHienTai);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy gói dịch vụ"));
    }

    public void xoaGoiDichVu(int id) {
        repository.deleteById(id);
    }
}