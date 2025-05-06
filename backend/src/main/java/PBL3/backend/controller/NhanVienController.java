package PBL3.backend.controller;

import PBL3.backend.dto.response.NhanVienResponse;
import PBL3.backend.model.NhanVien;
import PBL3.backend.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nhanvien")
@CrossOrigin(origins = "*")
public class NhanVienController {

    private final NhanVienService nhanVienService;

    @Autowired
    public NhanVienController(NhanVienService nhanVienService) {
        this.nhanVienService = nhanVienService;
    }

    @GetMapping
    public ResponseEntity<?> getAllNhanVien() {
        try {
            List<NhanVienResponse> nhanVienList = nhanVienService.getAllNhanVien();
            return new ResponseEntity<>(nhanVienList, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Không thể lấy danh sách nhân viên: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhanVien> getNhanVienById(@PathVariable int id) {
        return nhanVienService.getNhanVienById(id)
                .map(nhanVien -> new ResponseEntity<>(nhanVien, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/phone/{soDienThoai}")
    public ResponseEntity<NhanVien> getNhanVienBySoDienThoai(@PathVariable String soDienThoai) {
        NhanVien nhanVien = nhanVienService.getNhanVienBySoDienThoai(soDienThoai);
        if (nhanVien != null) {
            return new ResponseEntity<>(nhanVien, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<NhanVien> getNhanVienByEmail(@PathVariable String email) {
        NhanVien nhanVien = nhanVienService.getNhanVienByEmail(email);
        if (nhanVien != null) {
            return new ResponseEntity<>(nhanVien, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createNhanVien(@RequestBody NhanVien nhanVien) {
        try {
            NhanVien newNhanVien = nhanVienService.createNhanVien(nhanVien);
            return new ResponseEntity<>(newNhanVien, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNhanVien(@PathVariable int id, @RequestBody NhanVien nhanVienDetails) {
        try {
            NhanVien updatedNhanVien = nhanVienService.updateNhanVien(id, nhanVienDetails);
            return new ResponseEntity<>(updatedNhanVien, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNhanVien(@PathVariable int id) {
        try {
            nhanVienService.deleteNhanVien(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}