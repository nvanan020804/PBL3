package PBL3.backend.controller;

import PBL3.backend.dto.request.DangKyRequest;
import PBL3.backend.dto.response.DangKyResponse;
import PBL3.backend.model.DangKy;
import PBL3.backend.model.GoiDichVu;
import PBL3.backend.model.KhachHang;
import PBL3.backend.service.DangKyService;
import PBL3.backend.service.mapper.DangKyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dangky")
@CrossOrigin(origins = "*")
public class DangKyController {

    private final DangKyService dangKyService;
    private final DangKyMapper dangKyMapper;

    @Autowired
    public DangKyController(DangKyService dangKyService, DangKyMapper dangKyMapper) {
        this.dangKyService = dangKyService;
        this.dangKyMapper = dangKyMapper;
    }

    @GetMapping
    public ResponseEntity<List<DangKyResponse>> getAllDangKy() {
        List<DangKy> dangKyList = dangKyService.getAllDangKy();
        List<DangKyResponse> responseList = dangKyList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DangKyResponse> getDangKyById(@PathVariable int id) {
        return dangKyService.getDangKyById(id)
                .map(dangKy -> new ResponseEntity<>(convertToResponse(dangKy), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/khachhang/{idKhachHang}")
    public ResponseEntity<List<DangKyResponse>> getDangKyByKhachHang(@PathVariable int idKhachHang) {
        try {
            List<DangKy> dangKyList = dangKyService.getDangKyByKhachHang(idKhachHang);
            List<DangKyResponse> responseList = dangKyList.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(responseList, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/active/khachhang/{idKhachHang}")
    public ResponseEntity<List<DangKyResponse>> getActiveDangKyByKhachHang(@PathVariable int idKhachHang) {
        List<DangKy> dangKyList = dangKyService.getActiveDangKyByKhachHang(idKhachHang);
        List<DangKyResponse> responseList = dangKyList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<DangKyResponse>> getDangKyByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DangKy> dangKyList = dangKyService.getDangKyByDateRange(startDate, endDate);
        List<DangKyResponse> responseList = dangKyList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createDangKy(@RequestBody DangKyRequest dangKyRequest) {
        try {
            DangKy dangKy = dangKyMapper.toEntity(dangKyRequest);
            DangKy newDangKy = dangKyService.createDangKy(dangKy);
            return new ResponseEntity<>(dangKyMapper.toResponse(newDangKy), HttpStatus.CREATED);
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

    @GetMapping("/ids/{id}")
    public ResponseEntity<?> getDangKyIds(@PathVariable int id) {
        try {
            return dangKyService.getDangKyById(id)
                    .map(dangKy -> {
                        Map<String, Integer> ids = new HashMap<>();
                        
                        KhachHang khachHang = dangKy.getKhachHang();
                        if (khachHang != null) {
                            ids.put("idKhachHang", khachHang.getIdKhachHang());
                        }
                        
                        GoiDichVu goiDichVu = dangKy.getGoiDichVu();
                        if (goiDichVu != null) {
                            ids.put("idGOI", goiDichVu.getId());
                        }
                        
                        return new ResponseEntity<>(ids, HttpStatus.OK);
                    })
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    private DangKyResponse convertToResponse(DangKy dangKy) {
        DangKyResponse response = new DangKyResponse();
        response.setIdDangKy(dangKy.getIdDangKy());
        response.setNgayBatDau(dangKy.getNgayBatDau());
        response.setTrangThai(dangKy.getTrangThai());
        response.setGioTap(dangKy.getGioTap());
        
        KhachHang khachHang = dangKy.getKhachHang();
        if (khachHang != null) {
            response.setIdKhachHang(khachHang.getIdKhachHang());
            response.setTenKhachHang(khachHang.getTenKhachHang());
        }
        
        GoiDichVu goiDichVu = dangKy.getGoiDichVu();
        if (goiDichVu != null) {
            response.setIdGOI(goiDichVu.getId());
            response.setTenGoi(goiDichVu.getTenGoi());
            response.setGia(goiDichVu.getGia().doubleValue());  // Chuyển BigDecimal sang double
            response.setThoiHan(goiDichVu.getThoiGian());  // Sửa tên phương thức
            
            // Tính ngày kết thúc dựa trên ngày bắt đầu và thời hạn
            if (dangKy.getNgayBatDau() != null && goiDichVu.getThoiGian() > 0) {  // Sửa tên phương thức
                // Tính ngày kết thúc bằng cách cộng thời gian (tháng) vào ngày bắt đầu
                // Mỗi tháng là 30 ngày
                LocalDate startDate = dangKy.getNgayBatDau();
                LocalDate endDate = startDate.plusDays(goiDichVu.getThoiGian() * 30L);  // Sửa tên phương thức
                response.setNgayKetThuc(endDate);
            }
        }
        
        return response;
    }
}