package PBL3.backend.controller;

import PBL3.backend.model.ThietBi;
import PBL3.backend.service.ThietBiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/thiet-bi")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5503", "http://localhost:5503"})
public class ThietBiController {

    @Autowired
    private ThietBiService thietBiService;

    @GetMapping
    public List<ThietBi> layTatCaThietBi() {
        return thietBiService.layTatCaThietBi();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> layThietBiTheoId(@PathVariable int id) {
        return thietBiService.layThietBiTheoId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> taoThietBi(@RequestBody Map<String, Object> request) {
        try {
            String tenThietBi = (String) request.get("tenThietBi");
            String congDung = (String) request.get("congDung");
            
            LocalDate ngayNhap = null;
            if (request.get("ngayNhap") != null) {
                ngayNhap = LocalDate.parse((String) request.get("ngayNhap"));
            }
            
            BigDecimal giaTien = null;
            if (request.get("giaTien") != null) {
                giaTien = new BigDecimal(request.get("giaTien").toString());
            }
            
            String trangThai = (String) request.get("trangThai");
            
            if (tenThietBi == null) {
                return ResponseEntity.badRequest().body("Tên thiết bị không được để trống");
            }
            
            ThietBi thietBi = thietBiService.taoThietBi(tenThietBi, congDung, ngayNhap, giaTien, trangThai);
            return ResponseEntity.ok(thietBi);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> capNhatThietBi(@PathVariable int id, @RequestBody Map<String, Object> request) {
        try {
            String tenThietBi = (String) request.get("tenThietBi");
            String congDung = (String) request.get("congDung");
            
            LocalDate ngayNhap = null;
            if (request.get("ngayNhap") != null) {
                ngayNhap = LocalDate.parse((String) request.get("ngayNhap"));
            }
            
            BigDecimal giaTien = null;
            if (request.get("giaTien") != null) {
                giaTien = new BigDecimal(request.get("giaTien").toString());
            }
            
            String trangThai = (String) request.get("trangThai");
            
            ThietBi thietBi = thietBiService.capNhatThietBi(id, tenThietBi, congDung, ngayNhap, giaTien, trangThai);
            return ResponseEntity.ok(thietBi);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/trang-thai")
    public ResponseEntity<?> capNhatTrangThai(@PathVariable int id, @RequestBody Map<String, String> request) {
        String trangThai = request.get("trangThai");
        
        if (trangThai == null) {
            return ResponseEntity.badRequest().body("Trạng thái không được để trống");
        }
        
        try {
            ThietBi thietBi = thietBiService.capNhatTrangThaiThietBi(id, trangThai);
            return ResponseEntity.ok(thietBi);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoaThietBi(@PathVariable int id) {
        try {
            thietBiService.xoaThietBi(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}