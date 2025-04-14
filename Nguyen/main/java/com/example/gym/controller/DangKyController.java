package com.example.gym.controller;

import com.example.gym.entity.DangKy;
import com.example.gym.repository.DangKyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dangky")
public class DangKyController {

    @Autowired
    private DangKyRepository dangKyRepository;

    @GetMapping
    public List<DangKy> getAll() {
        return dangKyRepository.findAll();
    }

    @PostMapping
    public DangKy create(@RequestBody DangKy dangKy) {
        return dangKyRepository.save(dangKy);
    }

    @PutMapping("/{id}")
    public DangKy update(@PathVariable int id, @RequestBody DangKy dangKy) {
        dangKy.setIdDangKy(id);
        return dangKyRepository.save(dangKy);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        dangKyRepository.deleteById(id);
    }
}
