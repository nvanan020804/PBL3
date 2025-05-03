package PBL3.backend.controller;

import PBL3.backend.model.KhachHang;
import PBL3.backend.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/khachhang")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5503", "http://localhost:5503"})
public class KhachHangController {
    @Autowired
    private KhachHangService khachHangService;

    @GetMapping("/{id}")
    public ResponseEntity<?> layKhachHangTheoId(@PathVariable int id) {
        return khachHangService.layKhachHangTheoId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 