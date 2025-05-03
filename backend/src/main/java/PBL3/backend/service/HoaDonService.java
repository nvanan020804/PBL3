package PBL3.backend.service;

import PBL3.backend.model.HoaDon;
import PBL3.backend.model.DangKy;
import PBL3.backend.model.NhanVien;
import PBL3.backend.model.HoaDonChiTiet;
import PBL3.backend.repository.HoaDonRepository;
import PBL3.backend.repository.DangKyRepository;
import PBL3.backend.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private DangKyRepository dangKyRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    public List<HoaDon> layTatCaHoaDon() {
        return hoaDonRepository.findAll();
    }

    public Optional<HoaDon> layHoaDonTheoId(int id) {
        return hoaDonRepository.findById(id);
    }

    @Transactional
    public HoaDon taoHoaDon(int idDangKy, int idNhanVien) {
        // Get related entities
        DangKy dangKy = dangKyRepository.findById(idDangKy)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + idDangKy));

        NhanVien nhanVien = nhanVienRepository.findById(idNhanVien)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + idNhanVien));

        // Create and save new invoice
        HoaDon hoaDon = new HoaDon();
        hoaDon.setDangKy(dangKy);
        hoaDon.setNhanVien(nhanVien);
        hoaDon.setThoiGianTao(LocalDateTime.now());
        hoaDon.setTrangThai("Chưa thanh toán");

        return hoaDonRepository.save(hoaDon);
    }

    @Transactional
    public HoaDon capNhatTrangThaiHoaDon(int id, String trangThai) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
        
        hoaDon.setTrangThai(trangThai);
        return hoaDonRepository.save(hoaDon);
    }

    @Transactional
    public void xoaHoaDon(int id) {
        hoaDonRepository.deleteById(id);
    }
}