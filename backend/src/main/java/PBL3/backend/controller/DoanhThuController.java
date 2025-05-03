package PBL3.backend.controller;

import PBL3.backend.model.DoanhThu;
import PBL3.backend.service.DoanhThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doanh-thu")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5503", "http://localhost:5503"})
public class DoanhThuController {

    @Autowired
    private DoanhThuService doanhThuService;

    @GetMapping
    public List<DoanhThu> layTatCaDoanhThu() {
        return doanhThuService.layTatCaDoanhThu();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> layDoanhThuTheoId(@PathVariable int id) {
        return doanhThuService.layDoanhThuTheoId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/hien-tai")
    public DoanhThu layDoanhThuHienTai() {
        return doanhThuService.layHoacTaoDoanhThuThangHienTai();
    }

    @PostMapping
    public ResponseEntity<?> taoDoanhThuMoi(@RequestBody Map<String, Object> request) {
        try {
            String thoiGian = (String) request.get("thoiGian");
            BigDecimal tongThu = null;
            if (request.get("tongThu") != null) {
                tongThu = new BigDecimal(request.get("tongThu").toString());
            }
            
            BigDecimal tongChi = null;
            if (request.get("tongChi") != null) {
                tongChi = new BigDecimal(request.get("tongChi").toString());
            }
            
            if (thoiGian == null) {
                return ResponseEntity.badRequest().body("Thời gian không được để trống");
            }
            
            DoanhThu doanhThu = doanhThuService.taoDoanhThuMoi(thoiGian, tongThu, tongChi);
            return ResponseEntity.ok(doanhThu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/thang")
    public ResponseEntity<?> taoDoanhThuTheoThang(@RequestBody Map<String, Object> request) {
        try {
            Integer thang = (Integer) request.get("thang");
            Integer nam = (Integer) request.get("nam");
            
            BigDecimal tongThu = null;
            if (request.get("tongThu") != null) {
                tongThu = new BigDecimal(request.get("tongThu").toString());
            }
            
            BigDecimal tongChi = null;
            if (request.get("tongChi") != null) {
                tongChi = new BigDecimal(request.get("tongChi").toString());
            }
            
            if (thang == null || nam == null) {
                return ResponseEntity.badRequest().body("Tháng và năm không được để trống");
            }
            
            DoanhThu doanhThu = doanhThuService.taoDoanhThuTheoThang(thang, nam, tongThu, tongChi);
            return ResponseEntity.ok(doanhThu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> capNhatDoanhThu(@PathVariable int id, @RequestBody Map<String, Object> request) {
        try {
            BigDecimal tongThu = null;
            if (request.get("tongThu") != null) {
                tongThu = new BigDecimal(request.get("tongThu").toString());
            }
            
            BigDecimal tongChi = null;
            if (request.get("tongChi") != null) {
                tongChi = new BigDecimal(request.get("tongChi").toString());
            }
            
            DoanhThu doanhThu = doanhThuService.capNhatDoanhThu(id, tongThu, tongChi);
            return ResponseEntity.ok(doanhThu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/thu")
    public ResponseEntity<?> themThuNhap(@PathVariable int id, @RequestBody Map<String, Object> request) {
        try {
            BigDecimal soTien = new BigDecimal(request.get("soTien").toString());
            DoanhThu doanhThu = doanhThuService.themThuNhap(id, soTien);
            return ResponseEntity.ok(doanhThu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/chi")
    public ResponseEntity<?> themChiPhi(@PathVariable int id, @RequestBody Map<String, Object> request) {
        try {
            BigDecimal soTien = new BigDecimal(request.get("soTien").toString());
            DoanhThu doanhThu = doanhThuService.themChiPhi(id, soTien);
            return ResponseEntity.ok(doanhThu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/loi-nhuan")
    public ResponseEntity<?> tinhLoiNhuan(@PathVariable int id) {
        try {
            BigDecimal loiNhuan = doanhThuService.tinhLoiNhuanTheoDoanhThu(id);
            return ResponseEntity.ok(Map.of("loiNhuan", loiNhuan));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}