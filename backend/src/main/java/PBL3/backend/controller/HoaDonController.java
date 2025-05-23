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
    public ResponseEntity<List<HoaDon>> getAllHoaDon() {
        List<HoaDon> hoaDonList = hoaDonService.getAllHoaDon();
        return new ResponseEntity<>(hoaDonList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HoaDon> getHoaDonById(@PathVariable int id) {
        return hoaDonService.getHoaDonById(id)
                .map(hoaDon -> new ResponseEntity<>(hoaDon, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/dangky/{idDangKy}")
    public ResponseEntity<List<HoaDon>> getHoaDonByDangKy(@PathVariable int idDangKy) {
        try {
            List<HoaDon> hoaDonList = hoaDonService.getHoaDonByDangKy(idDangKy);
            return new ResponseEntity<>(hoaDonList, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/nhanvien/{idNhanVien}")
    public ResponseEntity<List<HoaDon>> getHoaDonByNhanVien(@PathVariable int idNhanVien) {
        try {
            List<HoaDon> hoaDonList = hoaDonService.getHoaDonByNhanVien(idNhanVien);
            return new ResponseEntity<>(hoaDonList, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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