package PBL3.backend.controller;

import PBL3.backend.model.SanPham;
import PBL3.backend.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sanpham")
@CrossOrigin(origins = "*")
public class SanPhamController {

    private final SanPhamService sanPhamService;

    @Autowired
    public SanPhamController(SanPhamService sanPhamService) {
        this.sanPhamService = sanPhamService;
    }

    @GetMapping
    public ResponseEntity<List<SanPham>> getAllSanPham() {
        List<SanPham> sanPhamList = sanPhamService.getAllSanPham();
        return new ResponseEntity<>(sanPhamList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SanPham> getSanPhamById(@PathVariable int id) {
        return sanPhamService.getSanPhamById(id)
                .map(sanPham -> new ResponseEntity<>(sanPham, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/danhmuc/{idDanhMuc}")
    public ResponseEntity<List<SanPham>> getSanPhamByDanhMuc(@PathVariable int idDanhMuc) {
        try {
            List<SanPham> sanPhamList = sanPhamService.getSanPhamByDanhMuc(idDanhMuc);
            return new ResponseEntity<>(sanPhamList, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/name/{tenSanPham}")
    public ResponseEntity<SanPham> getSanPhamByTen(@PathVariable String tenSanPham) {
        SanPham sanPham = sanPhamService.getSanPhamByTen(tenSanPham);
        if (sanPham != null) {
            return new ResponseEntity<>(sanPham, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createSanPham(@RequestBody SanPham sanPham) {
        try {
            SanPham newSanPham = sanPhamService.createSanPham(sanPham);
            return new ResponseEntity<>(newSanPham, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSanPham(@PathVariable int id, @RequestBody SanPham sanPhamDetails) {
        try {
            SanPham updatedSanPham = sanPhamService.updateSanPham(id, sanPhamDetails);
            return new ResponseEntity<>(updatedSanPham, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSanPham(@PathVariable int id) {
        try {
            sanPhamService.deleteSanPham(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/soluong")
    public ResponseEntity<?> updateSoLuong(@PathVariable int id, @RequestBody Map<String, Integer> soLuongMap) {
        try {
            Integer soLuongMoi = soLuongMap.get("soLuong");
            if (soLuongMoi == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Số lượng không được để trống");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            
            SanPham updatedSanPham = sanPhamService.updateSanPhamSoLuong(id, soLuongMoi);
            return new ResponseEntity<>(updatedSanPham, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/nhaphang")
    public ResponseEntity<?> nhapHang(@PathVariable int id, @RequestBody Map<String, Integer> soLuongMap) {
        try {
            Integer soLuongThem = soLuongMap.get("soLuongThem");
            if (soLuongThem == null || soLuongThem <= 0) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Số lượng thêm phải lớn hơn 0");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            
            SanPham updatedSanPham = sanPhamService.addSanPhamSoLuong(id, soLuongThem);
            return new ResponseEntity<>(updatedSanPham, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}