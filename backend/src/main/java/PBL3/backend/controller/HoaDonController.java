package PBL3.backend.controller;

import PBL3.backend.model.HoaDon;
import PBL3.backend.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hoa-don")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5503", "http://localhost:5503"})
public class HoaDonController {

    @Autowired
    private HoaDonService hoaDonService;

    @GetMapping
    public List<HoaDon> layTatCaHoaDon() {
        return hoaDonService.layTatCaHoaDon();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> layHoaDonTheoId(@PathVariable int id) {
        return hoaDonService.layHoaDonTheoId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> taoHoaDon(@RequestBody Map<String, Integer> request) {
        Integer idDangKy = request.get("idDangKy");
        Integer idNhanVien = request.get("idNhanVien");
        
        if (idDangKy == null || idNhanVien == null) {
            return ResponseEntity.badRequest().body("Thiếu thông tin idDangKy hoặc idNhanVien");
        }
        
        HoaDon hoaDon = hoaDonService.taoHoaDon(idDangKy, idNhanVien);
        return ResponseEntity.ok(hoaDon);
    }

    @PutMapping("/{id}/trang-thai")
    public ResponseEntity<?> capNhatTrangThai(@PathVariable int id, @RequestBody Map<String, String> request) {
        String trangThai = request.get("trangThai");
        
        if (trangThai == null) {
            return ResponseEntity.badRequest().body("Thiếu thông tin trạng thái");
        }
        
        HoaDon hoaDon = hoaDonService.capNhatTrangThaiHoaDon(id, trangThai);
        return ResponseEntity.ok(hoaDon);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoaHoaDon(@PathVariable int id) {
        hoaDonService.xoaHoaDon(id);
        return ResponseEntity.ok().build();
    }
}