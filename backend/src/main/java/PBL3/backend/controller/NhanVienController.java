package PBL3.backend.controller;

import PBL3.backend.model.NhanVien;
import PBL3.backend.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nhan-vien")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5503", "http://localhost:5503"})
public class NhanVienController {

    @Autowired
    private NhanVienService nhanVienService;

    @GetMapping
    public List<NhanVien> layTatCaNhanVien() {
        return nhanVienService.layTatCaNhanVien();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> layNhanVienTheoId(@PathVariable int id) {
        return nhanVienService.layNhanVienTheoId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> taoNhanVien(@RequestBody Map<String, Object> request) {
        try {
            String tenNhanVien = (String) request.get("tenNhanVien");
            Integer tuoi = request.get("tuoi") != null ? (Integer) request.get("tuoi") : null;
            String soDienThoai = (String) request.get("soDienThoai");
            String cccd = (String) request.get("cccd");
            String email = (String) request.get("email");
            String viTri = (String) request.get("viTri");
            
            if (tenNhanVien == null) {
                return ResponseEntity.badRequest().body("Tên nhân viên không được để trống");
            }
            
            NhanVien nhanVien = nhanVienService.taoNhanVien(tenNhanVien, tuoi, soDienThoai, cccd, email, viTri);
            return ResponseEntity.ok(nhanVien);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/tai-khoan")
    public ResponseEntity<?> taoNhanVienVaTaiKhoan(@RequestBody Map<String, Object> request) {
        try {
            String tenNhanVien = (String) request.get("tenNhanVien");
            Integer tuoi = request.get("tuoi") != null ? (Integer) request.get("tuoi") : null;
            String soDienThoai = (String) request.get("soDienThoai");
            String cccd = (String) request.get("cccd");
            String email = (String) request.get("email");
            String viTri = (String) request.get("viTri");
            String tenDangNhap = (String) request.get("tenDangNhap");
            String matKhau = (String) request.get("matKhau");
            String phanQuyen = (String) request.get("phanQuyen");
            
            if (tenNhanVien == null || tenDangNhap == null || matKhau == null || phanQuyen == null) {
                return ResponseEntity.badRequest().body("Thiếu thông tin bắt buộc");
            }
            
            NhanVien nhanVien = nhanVienService.taoNhanVienVaTaiKhoan(
                tenNhanVien, tuoi, soDienThoai, cccd, email, viTri, tenDangNhap, matKhau, phanQuyen
            );
            return ResponseEntity.ok(nhanVien);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> capNhatNhanVien(@PathVariable int id, @RequestBody Map<String, Object> request) {
        try {
            String tenNhanVien = (String) request.get("tenNhanVien");
            Integer tuoi = request.get("tuoi") != null ? (Integer) request.get("tuoi") : null;
            String soDienThoai = (String) request.get("soDienThoai");
            String cccd = (String) request.get("cccd");
            String email = (String) request.get("email");
            String viTri = (String) request.get("viTri");
            
            NhanVien nhanVien = nhanVienService.capNhatNhanVien(id, tenNhanVien, tuoi, soDienThoai, cccd, email, viTri);
            return ResponseEntity.ok(nhanVien);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoaNhanVien(@PathVariable int id) {
        try {
            nhanVienService.xoaNhanVien(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}