package PBL3.backend.controller;

import PBL3.backend.dto.GoiDichVuDTO;
import PBL3.backend.model.GoiDichVu;
import PBL3.backend.service.GoiDichVuService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller xử lý các request liên quan đến gói dịch vụ
 */
@RestController
@RequestMapping("/api/goi-dich-vu")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5503", "http://localhost:5503"})
public class GoiDichVuController {

    @Autowired
    private GoiDichVuService service;

    /**
     * Lấy danh sách tất cả gói dịch vụ
     * @return Danh sách gói dịch vụ
     */
    @GetMapping
    public List<GoiDichVu> layTatCaGoiDichVu() {
        return service.layTatCaGoiDichVu();
    }

    /**
     * Lấy thông tin gói dịch vụ theo ID
     * @param id ID của gói dịch vụ
     * @return Thông tin gói dịch vụ nếu tìm thấy, 404 nếu không tìm thấy
     */
    @GetMapping("/{id}")
    public ResponseEntity<GoiDichVu> layGoiDichVuTheoId(@PathVariable int id) {
        return service.layGoiDichVuTheoId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Tạo mới một gói dịch vụ
     * @param goiDichVuDTO Thông tin gói dịch vụ mới
     * @return Gói dịch vụ đã được tạo
     */
    @PostMapping
    public ResponseEntity<?> taoMoiGoiDichVu(@Valid @RequestBody GoiDichVuDTO goiDichVuDTO) {
        GoiDichVu goiDichVu = service.taoGoiDichVu(goiDichVuDTO);
        return ResponseEntity.ok(goiDichVu);
    }

    /**
     * Cập nhật thông tin gói dịch vụ
     * @param id ID của gói dịch vụ cần cập nhật
     * @param goiDichVuDTO Thông tin cập nhật
     * @return Gói dịch vụ đã được cập nhật
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> capNhatGoiDichVu(@PathVariable int id, @Valid @RequestBody GoiDichVuDTO goiDichVuDTO) {
        GoiDichVu goiDichVu = service.capNhatGoiDichVu(id, goiDichVuDTO);
        return ResponseEntity.ok(goiDichVu);
    }

    /**
     * Xóa gói dịch vụ
     * @param id ID của gói dịch vụ cần xóa
     * @return Thông báo xóa thành công
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoaGoiDichVu(@PathVariable int id) {
        service.xoaGoiDichVu(id);
        return ResponseEntity.ok().build();
    }
}