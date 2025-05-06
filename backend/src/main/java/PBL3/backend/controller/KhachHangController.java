package PBL3.backend.controller;

import PBL3.backend.dto.response.KhachHangResponse;
import PBL3.backend.model.KhachHang;
import PBL3.backend.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/khachhang")
@CrossOrigin(origins = "*")
public class KhachHangController {

    private final KhachHangService khachHangService;

    @Autowired
    public KhachHangController(KhachHangService khachHangService) {
        this.khachHangService = khachHangService;
    }

    @GetMapping
    public ResponseEntity<?> getAllKhachHang() {
        try {
            List<KhachHangResponse> khachHangList = khachHangService.getAllKhachHang();
            return new ResponseEntity<>(khachHangList, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Không thể lấy danh sách khách hàng: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhachHang> getKhachHangById(@PathVariable int id) {
        return khachHangService.getKhachHangById(id)
                .map(khachHang -> new ResponseEntity<>(khachHang, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/phone/{soDienThoai}")
    public ResponseEntity<KhachHang> getKhachHangBySoDienThoai(@PathVariable String soDienThoai) {
        KhachHang khachHang = khachHangService.getKhachHangBySoDienThoai(soDienThoai);
        if (khachHang != null) {
            return new ResponseEntity<>(khachHang, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<KhachHang> getKhachHangByEmail(@PathVariable String email) {
        KhachHang khachHang = khachHangService.getKhachHangByEmail(email);
        if (khachHang != null) {
            return new ResponseEntity<>(khachHang, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createKhachHang(@RequestBody KhachHang khachHang) {
        try {
            KhachHang newKhachHang = khachHangService.createKhachHang(khachHang);
            return new ResponseEntity<>(newKhachHang, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateKhachHang(@PathVariable int id, @RequestBody KhachHang khachHangDetails) {
        try {
            KhachHang updatedKhachHang = khachHangService.updateKhachHang(id, khachHangDetails);
            return new ResponseEntity<>(updatedKhachHang, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteKhachHang(@PathVariable int id) {
        try {
            khachHangService.deleteKhachHang(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}