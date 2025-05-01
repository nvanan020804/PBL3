package PBL3.backend.controller;

import PBL3.backend.model.GoiDichVu;
import PBL3.backend.service.GoiDichVuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goi-dich-vu")
public class GoiDichVuController {

    @Autowired
    private GoiDichVuService service;

    @GetMapping
    public List<GoiDichVu> layTatCaGoiDichVu() {
        return service.layTatCaGoiDichVu();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoiDichVu> layGoiDichVuTheoId(@PathVariable int id) {
        return service.layGoiDichVuTheoId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GoiDichVu taoMoiGoiDichVu(@RequestBody GoiDichVu goiDichVu) {
        return service.taoMoiGoiDichVu(goiDichVu);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoiDichVu> capNhatGoiDichVu(@PathVariable int id, @RequestBody GoiDichVu goiDichVuCapNhat) {
        try {
            return ResponseEntity.ok(service.capNhatGoiDichVu(id, goiDichVuCapNhat));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> xoaGoiDichVu(@PathVariable int id) {
        service.xoaGoiDichVu(id);
        return ResponseEntity.noContent().build();
    }
}