package PBL3.backend.controller;

import PBL3.backend.dto.request.SanPhamRequest;
import PBL3.backend.dto.response.ApiResponse;
import PBL3.backend.dto.response.SanPhamResponse;
import PBL3.backend.service.SanPhamService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/san-pham")
@CrossOrigin(origins = {"*"})
public class SanPhamController {

    @Autowired
    private SanPhamService sanPhamService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SanPhamResponse>>> layTatCaSanPham() {
        return ResponseEntity.ok(
            ApiResponse.success(sanPhamService.layTatCaSanPhamResponse())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SanPhamResponse>> laySanPhamTheoId(@PathVariable int id) {
        return sanPhamService.laySanPhamTheoIdResponse(id)
                .map(response -> ResponseEntity.ok(ApiResponse.success(response)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Không tìm thấy sản phẩm với ID: " + id)));
    }

    @GetMapping("/danh-muc/{idDanhMuc}")
    public ResponseEntity<ApiResponse<List<SanPhamResponse>>> laySanPhamTheoDanhMuc(@PathVariable int idDanhMuc) {
        return ResponseEntity.ok(
            ApiResponse.success(sanPhamService.laySanPhamTheoDanhMucResponse(idDanhMuc))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SanPhamResponse>> taoSanPham(@Valid @RequestBody SanPhamRequest request) {
        SanPhamResponse response = sanPhamService.taoSanPhamResponse(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Tạo sản phẩm thành công", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SanPhamResponse>> capNhatSanPham(
            @PathVariable int id, 
            @Valid @RequestBody SanPhamRequest request) {
        SanPhamResponse response = sanPhamService.capNhatSanPhamResponse(id, request);
        return ResponseEntity.ok(
            ApiResponse.success("Cập nhật sản phẩm thành công", response)
        );
    }

    @PutMapping("/{id}/so-luong")
    public ResponseEntity<ApiResponse<SanPhamResponse>> capNhatSoLuong(
            @PathVariable int id, 
            @RequestBody SanPhamRequest request) {
        if (request.getSoLuong() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Thiếu thông tin số lượng"));
        }
        
        SanPhamResponse response = sanPhamService.capNhatSoLuongSanPhamResponse(id, request.getSoLuong());
        return ResponseEntity.ok(
            ApiResponse.success("Cập nhật số lượng thành công", response)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> xoaSanPham(@PathVariable int id) {
        sanPhamService.xoaSanPham(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa sản phẩm thành công", null));
    }
}