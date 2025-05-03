package PBL3.backend.controller;

import PBL3.backend.dto.request.NhanVienRequest;
import PBL3.backend.dto.request.NhanVienWithAccountRequest;
import PBL3.backend.dto.response.ApiResponse;
import PBL3.backend.dto.response.NhanVienResponse;
import PBL3.backend.service.NhanVienMapper;
import PBL3.backend.service.NhanVienService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nhan-vien")
@CrossOrigin(origins = {"*"})
public class NhanVienController {

    @Autowired
    private NhanVienService nhanVienService;
    
    @Autowired
    private NhanVienMapper nhanVienMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NhanVienResponse>>> layTatCaNhanVien() {
        return ResponseEntity.ok(
            ApiResponse.success(nhanVienMapper.toResponseList(nhanVienService.layTatCaNhanVien()))
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NhanVienResponse>> layNhanVienTheoId(@PathVariable int id) {
        return nhanVienService.layNhanVienTheoId(id)
                .map(nhanVien -> ResponseEntity.ok(ApiResponse.success(nhanVienMapper.toResponse(nhanVien))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Không tìm thấy nhân viên với ID: " + id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NhanVienResponse>> taoNhanVien(@Valid @RequestBody NhanVienRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(
                "Tạo nhân viên thành công",
                nhanVienMapper.toResponse(
                    nhanVienService.taoNhanVien(request.getTenNhanVien(), 
                                             request.getTuoi(),
                                             request.getSoDienThoai1(),
                                             request.getCccd(),
                                             request.getEmail(),
                                             request.getViTri())
                )
            )
        );
    }

    @PostMapping("/tai-khoan")
    public ResponseEntity<ApiResponse<NhanVienResponse>> taoNhanVienVaTaiKhoan(
            @Valid @RequestBody NhanVienWithAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(
                "Tạo nhân viên và tài khoản thành công",
                nhanVienMapper.toResponse(
                    nhanVienService.taoNhanVienVaTaiKhoan(
                        request.getTenNhanVien(), 
                        request.getTuoi(), 
                        request.getSoDienThoai1(), 
                        request.getCccd(), 
                        request.getEmail(), 
                        request.getViTri(), 
                        request.getTenDangNhap(), 
                        request.getMatKhau(), 
                        request.getPhanQuyen()
                    )
                )
            )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NhanVienResponse>> capNhatNhanVien(
            @PathVariable int id, 
            @Valid @RequestBody NhanVienRequest request) {
        return ResponseEntity.ok(
            ApiResponse.success(
                "Cập nhật nhân viên thành công",
                nhanVienMapper.toResponse(
                    nhanVienService.capNhatNhanVien(
                        id, request.getTenNhanVien(), request.getTuoi(),
                        request.getSoDienThoai1(), request.getCccd(),
                        request.getEmail(), request.getViTri()
                    )
                )
            )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> xoaNhanVien(@PathVariable int id) {
        nhanVienService.xoaNhanVien(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa nhân viên thành công", null));
    }
}