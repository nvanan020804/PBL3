package com.example.gym.controller;

import com.example.gym.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestConnectionController {

    @Autowired
    private KhachHangRepository khachHangRepository;

    @GetMapping("/connection")
    public ResponseEntity<?> testConnection() {
        try {
            long count = khachHangRepository.count();
            return ResponseEntity.ok("✅ Kết nối thành công! Số lượng khách hàng: " + count);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Kết nối thất bại: " + e.getMessage());
        }
    }
}
