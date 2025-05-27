package PBL3.backend.controller;

import PBL3.backend.model.HoaDon;
import PBL3.backend.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hoadon")
@CrossOrigin(origins = "*")
public class HoaDonController {

    private final HoaDonService hoaDonService;

    @Autowired
    public HoaDonController(HoaDonService hoaDonService) {
        this.hoaDonService = hoaDonService;
    }

    @GetMapping
    public ResponseEntity<?> getAllHoaDon() {
        try {
            List<HoaDon> hoaDonList = hoaDonService.getAllHoaDon();
            return new ResponseEntity<>(hoaDonList, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Không thể lấy danh sách hóa đơn: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHoaDonById(@PathVariable int id) {
        try {
            return hoaDonService.getHoaDonById(id)
                    .map(hoaDon -> new ResponseEntity<>(hoaDon, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Không thể lấy hóa đơn: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/dangky/{idDangKy}")
    public ResponseEntity<?> getHoaDonByDangKy(@PathVariable int idDangKy) {
        try {
            List<HoaDon> hoaDonList = hoaDonService.getHoaDonByDangKy(idDangKy);
            return new ResponseEntity<>(hoaDonList, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Không tìm thấy hóa đơn cho đăng ký: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/khachhang/{idKhachHang}")
    public ResponseEntity<?> getHoaDonByKhachHang(@PathVariable int idKhachHang) {
        try {
            List<HoaDon> hoaDonList = hoaDonService.getHoaDonByKhachHang(idKhachHang);
            return new ResponseEntity<>(hoaDonList, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Không tìm thấy hóa đơn cho khách hàng: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping
    public ResponseEntity<?> createHoaDon(@RequestBody HoaDon hoaDon) {
        try {
            HoaDon newHoaDon = hoaDonService.createHoaDon(hoaDon);
            return new ResponseEntity<>(newHoaDon, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHoaDon(@PathVariable int id, @RequestBody HoaDon hoaDonDetails) {
        try {
            HoaDon updatedHoaDon = hoaDonService.updateHoaDon(id, hoaDonDetails);
            return new ResponseEntity<>(updatedHoaDon, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHoaDon(@PathVariable int id) {
        try {
            hoaDonService.deleteHoaDon(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/hoanthanh")
    public ResponseEntity<?> hoanThanhHoaDon(@PathVariable int id) {
        try {
            HoaDon updatedHoaDon = hoaDonService.hoanThanhHoaDon(id);
            return new ResponseEntity<>(updatedHoaDon, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/huy")
    public ResponseEntity<?> huyHoaDon(@PathVariable int id) {
        try {
            HoaDon updatedHoaDon = hoaDonService.huyHoaDon(id);
            return new ResponseEntity<>(updatedHoaDon, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
    
    @PutMapping("/{id}/dathanhtoan")
    public ResponseEntity<?> daThanhToan(@PathVariable int id) {
        try {
            HoaDon updatedHoaDon = hoaDonService.daThanhToan(id);
            return new ResponseEntity<>(updatedHoaDon, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
    
    @PutMapping("/{id}/chuathanhtoan")
    public ResponseEntity<?> chuaThanhToan(@PathVariable int id) {
        try {
            HoaDon updatedHoaDon = hoaDonService.chuaThanhToan(id);
            return new ResponseEntity<>(updatedHoaDon, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}