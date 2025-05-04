package PBL3.backend.controller;

import PBL3.backend.dto.request.DangKyRequest;
import PBL3.backend.dto.response.ApiResponse;
import PBL3.backend.model.DangKy;
import PBL3.backend.service.DangKyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dang-ky")
@CrossOrigin(origins = {"*"})
public class DangKyController {

    @Autowired
    private DangKyService dangKyService;

    @PostMapping
    public ResponseEntity<ApiResponse<DangKy>> taoDangKy(@Valid @RequestBody DangKyRequest dangKyRequest) {
        DangKy dangKy = dangKyService.taoDangKy(dangKyRequest);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công", dangKy));
    }

    @GetMapping("/hien-tai/{idKhachHang}")
    public ResponseEntity<?> layGoiHienTai(@PathVariable int idKhachHang) {
        return dangKyService.layGoiHienTaiCuaKhach(idKhachHang)
                .map(dangKy -> ResponseEntity.ok(ApiResponse.success("Tìm thấy gói đăng ký hiện tại", dangKy)))
                .orElse(ResponseEntity.ok(ApiResponse.error("Không tìm thấy gói đăng ký hiện tại")));
    }
}