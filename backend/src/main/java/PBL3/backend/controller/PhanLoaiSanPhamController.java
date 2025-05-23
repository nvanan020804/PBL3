package PBL3.backend.controller;

import PBL3.backend.model.PhanLoaiSanPham;
import PBL3.backend.service.PhanLoaiSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/danhmuc")
@CrossOrigin(origins = "*")
public class PhanLoaiSanPhamController {

    private final PhanLoaiSanPhamService phanLoaiSanPhamService;

    @Autowired
    public PhanLoaiSanPhamController(PhanLoaiSanPhamService phanLoaiSanPhamService) {
        this.phanLoaiSanPhamService = phanLoaiSanPhamService;
    }

    @GetMapping
    public ResponseEntity<List<PhanLoaiSanPham>> getAllPhanLoaiSanPham() {
        List<PhanLoaiSanPham> danhMucList = phanLoaiSanPhamService.getAllPhanLoaiSanPham();
        return new ResponseEntity<>(danhMucList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhanLoaiSanPham> getPhanLoaiSanPhamById(@PathVariable int id) {
        return phanLoaiSanPhamService.getPhanLoaiSanPhamById(id)
                .map(danhMuc -> new ResponseEntity<>(danhMuc, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/name/{tenDanhMuc}")
    public ResponseEntity<PhanLoaiSanPham> getPhanLoaiSanPhamByName(@PathVariable String tenDanhMuc) {
        PhanLoaiSanPham danhMuc = phanLoaiSanPhamService.getPhanLoaiSanPhamByTen(tenDanhMuc);
        if (danhMuc != null) {
            return new ResponseEntity<>(danhMuc, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createPhanLoaiSanPham(@RequestBody PhanLoaiSanPham phanLoaiSanPham) {
        try {
            PhanLoaiSanPham newDanhMuc = phanLoaiSanPhamService.createPhanLoaiSanPham(phanLoaiSanPham);
            return new ResponseEntity<>(newDanhMuc, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePhanLoaiSanPham(@PathVariable int id, @RequestBody PhanLoaiSanPham phanLoaiSanPhamDetails) {
        try {
            PhanLoaiSanPham updatedDanhMuc = phanLoaiSanPhamService.updatePhanLoaiSanPham(id, phanLoaiSanPhamDetails);
            return new ResponseEntity<>(updatedDanhMuc, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhanLoaiSanPham(@PathVariable int id) {
        try {
            phanLoaiSanPhamService.deletePhanLoaiSanPham(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}