package PBL3.backend.controller;

import PBL3.backend.model.DoanhThu;
import PBL3.backend.service.DoanhThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doanhthu")
@CrossOrigin(origins = "*")
public class DoanhThuController {

    private final DoanhThuService doanhThuService;

    @Autowired
    public DoanhThuController(DoanhThuService doanhThuService) {
        this.doanhThuService = doanhThuService;
    }

    @GetMapping
    public ResponseEntity<List<DoanhThu>> getAllDoanhThu() {
        List<DoanhThu> doanhThuList = doanhThuService.getAllDoanhThu();
        return new ResponseEntity<>(doanhThuList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoanhThu> getDoanhThuById(@PathVariable int id) {
        return doanhThuService.getDoanhThuById(id)
                .map(doanhThu -> new ResponseEntity<>(doanhThu, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/thoigian/{thoiGian}")
    public ResponseEntity<DoanhThu> getDoanhThuByThoiGian(@PathVariable String thoiGian) {
        DoanhThu doanhThu = doanhThuService.getDoanhThuByThoiGian(thoiGian);
        if (doanhThu != null) {
            return new ResponseEntity<>(doanhThu, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createDoanhThu(@RequestBody DoanhThu doanhThu) {
        try {
            DoanhThu newDoanhThu = doanhThuService.createDoanhThu(doanhThu);
            return new ResponseEntity<>(newDoanhThu, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoanhThu(@PathVariable int id, @RequestBody DoanhThu doanhThuDetails) {
        try {
            DoanhThu updatedDoanhThu = doanhThuService.updateDoanhThu(id, doanhThuDetails);
            return new ResponseEntity<>(updatedDoanhThu, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoanhThu(@PathVariable int id) {
        try {
            doanhThuService.deleteDoanhThu(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/tongthu")
    public ResponseEntity<?> updateTongThu(@PathVariable int id, @RequestBody Map<String, BigDecimal> tongThuMap) {
        try {
            BigDecimal tongThuMoi = tongThuMap.get("tongThu");
            if (tongThuMoi == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Tổng thu không được để trống");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            
            DoanhThu updatedDoanhThu = doanhThuService.updateTongThu(id, tongThuMoi);
            return new ResponseEntity<>(updatedDoanhThu, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/tongchi")
    public ResponseEntity<?> updateTongChi(@PathVariable int id, @RequestBody Map<String, BigDecimal> tongChiMap) {
        try {
            BigDecimal tongChiMoi = tongChiMap.get("tongChi");
            if (tongChiMoi == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Tổng chi không được để trống");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            
            DoanhThu updatedDoanhThu = doanhThuService.updateTongChi(id, tongChiMoi);
            return new ResponseEntity<>(updatedDoanhThu, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/themthu")
    public ResponseEntity<?> addTongThu(@PathVariable int id, @RequestBody Map<String, BigDecimal> soTienMap) {
        try {
            BigDecimal soTien = soTienMap.get("soTien");
            if (soTien == null || soTien.compareTo(BigDecimal.ZERO) <= 0) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Số tiền phải lớn hơn 0");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            
            DoanhThu updatedDoanhThu = doanhThuService.addTongThu(id, soTien);
            return new ResponseEntity<>(updatedDoanhThu, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/themchi")
    public ResponseEntity<?> addTongChi(@PathVariable int id, @RequestBody Map<String, BigDecimal> soTienMap) {
        try {
            BigDecimal soTien = soTienMap.get("soTien");
            if (soTien == null || soTien.compareTo(BigDecimal.ZERO) <= 0) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Số tiền phải lớn hơn 0");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            
            DoanhThu updatedDoanhThu = doanhThuService.addTongChi(id, soTien);
            return new ResponseEntity<>(updatedDoanhThu, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}