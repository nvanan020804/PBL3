package PBL3.backend.service;

import PBL3.backend.model.KhachHang;
import PBL3.backend.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class KhachHangService {
    @Autowired
    private KhachHangRepository khachHangRepository;

    public Optional<KhachHang> layKhachHangTheoId(int id) {
        return khachHangRepository.findById(id);
    }
    
} 