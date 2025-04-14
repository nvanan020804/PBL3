package com.example.gym.controller;
import com.example.gym.entity.GoiDichVu;
import com.example.gym.entity.KhachHang;
import com.example.gym.repository.GoiDichVuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goi")
@CrossOrigin(origins = "*")

public class GoiDichVuController {


    @Autowired
    private GoiDichVuRepository repository;
    @GetMapping("/{id}/khachhang")
    public List<KhachHang> getKhachHangsByGoi(@PathVariable int id) {
        return repository.findById(id)
                .map(GoiDichVu::getKhachHangs)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy gói dịch vụ với id: " + id));
    }
    @GetMapping
    public List<GoiDichVu> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public GoiDichVu create(@RequestBody GoiDichVu goi) {
        return repository.save(goi);
    }

    @PutMapping("/{id}")
    public GoiDichVu update(@PathVariable int id, @RequestBody GoiDichVu goi) {
        goi.setIdGOI(id);
        return repository.save(goi);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        repository.deleteById(id);
    }
}
