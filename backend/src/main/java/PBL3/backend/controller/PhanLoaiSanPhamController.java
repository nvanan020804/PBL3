package PBL3.backend.controller;

import PBL3.backend.model.PhanLoaiSanPham;
import PBL3.backend.service.PhanLoaiSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/danh-muc")
@CrossOrigin(origins = {"*"})
public class PhanLoaiSanPhamController {

    @Autowired
    private PhanLoaiSanPhamService phanLoaiSanPhamService;

    @GetMapping
    public List<PhanLoaiSanPham> layTatCaDanhMuc() {
        return phanLoaiSanPhamService.layTatCaPhanLoai();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> layDanhMucTheoId(@PathVariable int id) {
        return phanLoaiSanPhamService.layPhanLoaiTheoId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> taoDanhMuc(@RequestBody Map<String, String> request) {
        String tenDanhMuc = request.get("tenDanhMuc");
        
        if (tenDanhMuc == null || tenDanhMuc.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên danh mục không được để trống");
        }
        
        PhanLoaiSanPham danhMuc = phanLoaiSanPhamService.taoPhanLoai(tenDanhMuc);
        return ResponseEntity.ok(danhMuc);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> capNhatDanhMuc(@PathVariable int id, @RequestBody Map<String, String> request) {
        String tenDanhMuc = request.get("tenDanhMuc");
        
        if (tenDanhMuc == null || tenDanhMuc.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên danh mục không được để trống");
        }
        
        try {
            PhanLoaiSanPham danhMuc = phanLoaiSanPhamService.capNhatPhanLoai(id, tenDanhMuc);
            return ResponseEntity.ok(danhMuc);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoaDanhMuc(@PathVariable int id) {
        try {
            phanLoaiSanPhamService.xoaPhanLoai(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}