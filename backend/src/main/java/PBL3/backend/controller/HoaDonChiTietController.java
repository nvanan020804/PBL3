package PBL3.backend.controller;

import PBL3.backend.model.HoaDonChiTiet;
import PBL3.backend.service.HoaDonChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hoa-don-chi-tiet")
@CrossOrigin(origins = {"*"})
public class HoaDonChiTietController {

    @Autowired
    private HoaDonChiTietService hoaDonChiTietService;

    @GetMapping("/hoa-don/{idHoaDon}")
    public List<HoaDonChiTiet> layChiTietTheoHoaDon(@PathVariable int idHoaDon) {
        return hoaDonChiTietService.layChiTietTheoHoaDon(idHoaDon);
    }

    @PostMapping
    public ResponseEntity<?> themSanPhamVaoHoaDon(@RequestBody Map<String, Integer> request) {
        Integer idHoaDon = request.get("idHoaDon");
        Integer idSanPham = request.get("idSanPham");
        Integer soLuong = request.get("soLuong");
        
        if (idHoaDon == null || idSanPham == null || soLuong == null) {
            return ResponseEntity.badRequest().body("Thiếu thông tin: idHoaDon, idSanPham hoặc soLuong");
        }
        
        try {
            HoaDonChiTiet chiTiet = hoaDonChiTietService.themSanPhamVaoHoaDon(idHoaDon, idSanPham, soLuong);
            return ResponseEntity.ok(chiTiet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoaChiTietHoaDon(@PathVariable int id) {
        hoaDonChiTietService.xoaChiTietHoaDon(id);
        return ResponseEntity.ok().build();
    }
}