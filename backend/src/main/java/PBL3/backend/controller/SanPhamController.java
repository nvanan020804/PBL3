package PBL3.backend.controller;

import PBL3.backend.model.SanPham;
import PBL3.backend.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/san-pham")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5503", "http://localhost:5503"})
public class SanPhamController {

    @Autowired
    private SanPhamService sanPhamService;

    @GetMapping
    public List<SanPham> layTatCaSanPham() {
        return sanPhamService.layTatCaSanPham();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> laySanPhamTheoId(@PathVariable int id) {
        return sanPhamService.laySanPhamTheoId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/danh-muc/{idDanhMuc}")
    public List<SanPham> laySanPhamTheoDanhMuc(@PathVariable int idDanhMuc) {
        return sanPhamService.laySanPhamTheoDanhMuc(idDanhMuc);
    }

    @PostMapping
    public ResponseEntity<?> taoSanPham(@RequestBody Map<String, Object> request) {
        try {
            String tenSanPham = (String) request.get("tenSanPham");
            Integer idDanhMuc = (Integer) request.get("idDanhMuc");
            String donViDem = (String) request.get("donViDem");
            BigDecimal gia = new BigDecimal(request.get("gia").toString());
            String congDung = (String) request.get("congDung");
            Integer soLuong = (Integer) request.get("soLuong");
            
            if (tenSanPham == null || idDanhMuc == null || gia == null) {
                return ResponseEntity.badRequest().body("Thiếu thông tin bắt buộc: tên sản phẩm, danh mục hoặc giá");
            }
            
            SanPham sanPham = sanPhamService.taoSanPham(tenSanPham, idDanhMuc, donViDem, gia, congDung, soLuong);
            return ResponseEntity.ok(sanPham);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> capNhatSanPham(@PathVariable int id, @RequestBody Map<String, Object> request) {
        try {
            String tenSanPham = (String) request.get("tenSanPham");
            Integer idDanhMuc = request.get("idDanhMuc") != null ? (Integer) request.get("idDanhMuc") : null;
            String donViDem = (String) request.get("donViDem");
            BigDecimal gia = request.get("gia") != null ? new BigDecimal(request.get("gia").toString()) : null;
            String congDung = (String) request.get("congDung");
            Integer soLuong = request.get("soLuong") != null ? (Integer) request.get("soLuong") : null;
            
            SanPham sanPham = sanPhamService.capNhatSanPham(id, tenSanPham, idDanhMuc, donViDem, gia, congDung, soLuong);
            return ResponseEntity.ok(sanPham);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/so-luong")
    public ResponseEntity<?> capNhatSoLuong(@PathVariable int id, @RequestBody Map<String, Integer> request) {
        Integer soLuongMoi = request.get("soLuong");
        
        if (soLuongMoi == null) {
            return ResponseEntity.badRequest().body("Thiếu thông tin số lượng");
        }
        
        SanPham sanPham = sanPhamService.capNhatSoLuongSanPham(id, soLuongMoi);
        return ResponseEntity.ok(sanPham);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoaSanPham(@PathVariable int id) {
        sanPhamService.xoaSanPham(id);
        return ResponseEntity.ok().build();
    }
}