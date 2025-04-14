package com.example.gym.controller;

import com.example.gym.entity.KhachHang;
import com.example.gym.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/khachhang")
@CrossOrigin(origins = "*")
public class KhachHangController {

    @Autowired
    private KhachHangRepository repository;

    @GetMapping("/all")
    public List<KhachHang> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public KhachHang create(@RequestBody KhachHang kh) {
        return repository.save(kh);
    }

    @PutMapping("/{id}")
    public KhachHang update(@PathVariable int id, @RequestBody KhachHang kh) {
        kh.setIdKHACHHANG(id);
        return repository.save(kh);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        repository.deleteById(id);
    }
}