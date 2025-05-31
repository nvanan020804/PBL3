package PBL3.backend.controller;

import PBL3.backend.model.HoaDonChiTiet;
import PBL3.backend.service.HoaDonChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hoadonchitiet")
@CrossOrigin(origins = "*")
public class HoaDonChiTietController {

    private final HoaDonChiTietService hoaDonChiTietService;

    @Autowired
    public HoaDonChiTietController(HoaDonChiTietService hoaDonChiTietService) {
        this.hoaDonChiTietService = hoaDonChiTietService;
    }

    @GetMapping
    public ResponseEntity<List<HoaDonChiTiet>> getAllHoaDonChiTiet() {
        List<HoaDonChiTiet> hoaDonChiTietList = hoaDonChiTietService.getAllHoaDonChiTiet();
        return new ResponseEntity<>(hoaDonChiTietList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HoaDonChiTiet> getHoaDonChiTietById(@PathVariable int id) {
        return hoaDonChiTietService.getHoaDonChiTietById(id)
                .map(hoaDonChiTiet -> new ResponseEntity<>(hoaDonChiTiet, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/hoadon/{idHoaDon}")
    public ResponseEntity<?> getChiTietByHoaDon(@PathVariable int idHoaDon) {
        try {
            List<HoaDonChiTiet> hoaDonChiTietList = hoaDonChiTietService.getChiTietByHoaDon(idHoaDon);
            
            // Tạo response DTO thủ công để đảm bảo thông tin sản phẩm được trả về
            List<Map<String, Object>> responseList = new ArrayList<>();
            
            for (HoaDonChiTiet chiTiet : hoaDonChiTietList) {
                Map<String, Object> chiTietMap = new HashMap<>();
                chiTietMap.put("idHoaDonChiTiet", chiTiet.getIdHoaDonChiTiet());
                chiTietMap.put("idHoaDon", chiTiet.getHoaDon().getIdHoaDon());
                chiTietMap.put("soLuong", chiTiet.getSoLuong());
                chiTietMap.put("gia", chiTiet.getGia());
                chiTietMap.put("thanhTien", chiTiet.getThanhTien());
                
                if (chiTiet.getSanPham() != null) {
                    chiTietMap.put("idSanPham", chiTiet.getSanPham().getIdSanPham());
                    chiTietMap.put("tenSanPham", chiTiet.getSanPham().getTenSanPham());
                } else {
                    chiTietMap.put("tenSanPham", "Không xác định");
                }
                
                responseList.add(chiTietMap);
            }
            
            return new ResponseEntity<>(responseList, HttpStatus.OK);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createHoaDonChiTiet(@RequestBody HoaDonChiTiet hoaDonChiTiet) {
        try {
            HoaDonChiTiet newHoaDonChiTiet = hoaDonChiTietService.createHoaDonChiTiet(hoaDonChiTiet);
            return new ResponseEntity<>(newHoaDonChiTiet, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHoaDonChiTiet(@PathVariable int id, @RequestBody HoaDonChiTiet hoaDonChiTietDetails) {
        try {
            HoaDonChiTiet updatedHoaDonChiTiet = hoaDonChiTietService.updateHoaDonChiTiet(id, hoaDonChiTietDetails);
            return new ResponseEntity<>(updatedHoaDonChiTiet, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHoaDonChiTiet(@PathVariable int id) {
        try {
            hoaDonChiTietService.deleteHoaDonChiTiet(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}