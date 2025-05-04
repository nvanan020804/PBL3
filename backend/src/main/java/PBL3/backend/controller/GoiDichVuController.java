package PBL3.backend.controller;

import PBL3.backend.dto.request.GoiDichVuRequest;
import PBL3.backend.dto.response.ApiResponse;
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
@CrossOrigin(origins = {"*"})
public class GoiDichVuController {

    @Autowired
    private GoiDichVuService service;

    /**
     * Lấy danh sách tất cả gói dịch vụ
     * @return Danh sách gói dịch vụ
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<GoiDichVu>>> layTatCaGoiDichVu() {
        List<GoiDichVu> danhSachGoi = service.layTatCaGoiDichVu();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách gói dịch vụ thành công", danhSachGoi));
    }

    /**
     * Lấy thông tin gói dịch vụ theo ID
     * @param id ID của gói dịch vụ
     * @return Thông tin gói dịch vụ nếu tìm thấy, 404 nếu không tìm thấy
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> layGoiDichVuTheoId(@PathVariable int id) {
        return service.layGoiDichVuTheoId(id)
                .map(goiDichVu -> ResponseEntity.ok(ApiResponse.success("Tìm thấy gói dịch vụ", goiDichVu)))
                .orElse(ResponseEntity.ok(ApiResponse.error("Không tìm thấy gói dịch vụ với id: " + id)));
    }

    /**
     * Tạo mới một gói dịch vụ
     * @param goiDichVuRequest Thông tin gói dịch vụ mới
     * @return Gói dịch vụ đã được tạo
     */
    @PostMapping
    public ResponseEntity<ApiResponse<GoiDichVu>> taoMoiGoiDichVu(@Valid @RequestBody GoiDichVuRequest goiDichVuRequest) {
        GoiDichVu goiDichVu = service.taoGoiDichVu(goiDichVuRequest);
        return ResponseEntity.ok(ApiResponse.success("Tạo gói dịch vụ thành công", goiDichVu));
    }

    /**
     * Cập nhật thông tin gói dịch vụ
     * @param id ID của gói dịch vụ cần cập nhật
     * @param goiDichVuRequest Thông tin cập nhật
     * @return Gói dịch vụ đã được cập nhật
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GoiDichVu>> capNhatGoiDichVu(@PathVariable int id, @Valid @RequestBody GoiDichVuRequest goiDichVuRequest) {
        GoiDichVu goiDichVu = service.capNhatGoiDichVu(id, goiDichVuRequest);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật gói dịch vụ thành công", goiDichVu));
    }

    /**
     * Xóa gói dịch vụ
     * @param id ID của gói dịch vụ cần xóa
     * @return Thông báo xóa thành công
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> xoaGoiDichVu(@PathVariable int id) {
        service.xoaGoiDichVu(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa gói dịch vụ thành công", null));
    }
}