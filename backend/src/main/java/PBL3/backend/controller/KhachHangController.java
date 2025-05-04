package PBL3.backend.controller;

import PBL3.backend.dto.response.ApiResponse;
import PBL3.backend.model.KhachHang;
import PBL3.backend.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"api/khachhang", "api/khach-hang"})
@CrossOrigin(origins = {"*"})
public class KhachHangController {
    @Autowired
    private KhachHangService khachHangService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KhachHang>> layKhachHangTheoId(@PathVariable int id) {
        return khachHangService.layKhachHangTheoId(id)
                .map(khachHang -> ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin khách hàng thành công", khachHang)))
                .orElse(ResponseEntity.ok(new ApiResponse<>(false, "Không tìm thấy thông tin khách hàng", null)));
    }
    
    // Endpoint hỗ trợ khi gọi không có ID
    @GetMapping
    public ResponseEntity<ApiResponse<String>> layTatCaKhachHang() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Chức năng đang được phát triển", null));
    }
}