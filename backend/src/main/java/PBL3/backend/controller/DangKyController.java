package PBL3.backend.controller;

import PBL3.backend.dto.DangKyDTO;
import PBL3.backend.model.DangKy;
import PBL3.backend.service.DangKyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dang-ky")
@CrossOrigin(origins = {"http://127.0.0.1:5503", "http://localhost:5503"})
public class DangKyController {

    @Autowired
    private DangKyService dangKyService;

    @PostMapping
    public ResponseEntity<?> taoDangKy(@RequestBody DangKyDTO dangKyDTO) {
        DangKy dangKy = dangKyService.taoDangKy(dangKyDTO);
        return ResponseEntity.ok(dangKy);
    }

    @GetMapping("/hien-tai/{idKhachHang}")
    public ResponseEntity<?> layGoiHienTai(@PathVariable int idKhachHang) {
        return dangKyService.layGoiHienTaiCuaKhach(idKhachHang)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}