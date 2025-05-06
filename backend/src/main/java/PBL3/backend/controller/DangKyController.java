package PBL3.backend.controller;

import PBL3.backend.model.DangKy;
import PBL3.backend.service.DangKyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dangky")
@CrossOrigin(origins = "*")
public class DangKyController {

    private final DangKyService dangKyService;

    @Autowired
    public DangKyController(DangKyService dangKyService) {
        this.dangKyService = dangKyService;
    }

    @GetMapping
    public ResponseEntity<List<DangKy>> getAllDangKy() {
        List<DangKy> dangKyList = dangKyService.getAllDangKy();
        return new ResponseEntity<>(dangKyList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DangKy> getDangKyById(@PathVariable int id) {
        return dangKyService.getDangKyById(id)
                .map(dangKy -> new ResponseEntity<>(dangKy, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/khachhang/{idKhachHang}")
    public ResponseEntity<List<DangKy>> getDangKyByKhachHang(@PathVariable int idKhachHang) {
        try {
            List<DangKy> dangKyList = dangKyService.getDangKyByKhachHang(idKhachHang);
            return new ResponseEntity<>(dangKyList, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/active/khachhang/{idKhachHang}")
    public ResponseEntity<List<DangKy>> getActiveDangKyByKhachHang(@PathVariable int idKhachHang) {
        List<DangKy> dangKyList = dangKyService.getActiveDangKyByKhachHang(idKhachHang);
        return new ResponseEntity<>(dangKyList, HttpStatus.OK);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<DangKy>> getDangKyByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DangKy> dangKyList = dangKyService.getDangKyByDateRange(startDate, endDate);
        return new ResponseEntity<>(dangKyList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createDangKy(@RequestBody DangKy dangKy) {
        try {
            DangKy newDangKy = dangKyService.createDangKy(dangKy);
            return new ResponseEntity<>(newDangKy, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDangKy(@PathVariable int id, @RequestBody DangKy dangKyDetails) {
        try {
            DangKy updatedDangKy = dangKyService.updateDangKy(id, dangKyDetails);
            return new ResponseEntity<>(updatedDangKy, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDangKy(@PathVariable int id) {
        try {
            dangKyService.deleteDangKy(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateDangKy(@PathVariable int id) {
        try {
            DangKy updatedDangKy = dangKyService.activateDangKy(id);
            return new ResponseEntity<>(updatedDangKy, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelDangKy(@PathVariable int id) {
        try {
            DangKy updatedDangKy = dangKyService.cancelDangKy(id);
            return new ResponseEntity<>(updatedDangKy, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}