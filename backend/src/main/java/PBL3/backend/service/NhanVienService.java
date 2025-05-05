package PBL3.backend.service;

import PBL3.backend.model.NhanVien;
import PBL3.backend.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NhanVienService {

    private final NhanVienRepository nhanVienRepository;

    @Autowired
    public NhanVienService(NhanVienRepository nhanVienRepository) {
        this.nhanVienRepository = nhanVienRepository;
    }

    public List<NhanVien> getAllNhanVien() {
        return nhanVienRepository.findAll();
    }

    public Optional<NhanVien> getNhanVienById(int id) {
        return nhanVienRepository.findById(id);
    }

    public NhanVien getNhanVienBySoDienThoai(String soDienThoai) {
        return nhanVienRepository.findBySoDienThoai1(soDienThoai);
    }

    public NhanVien getNhanVienByEmail(String email) {
        return nhanVienRepository.findByEmail(email);
    }

    @Transactional
    public NhanVien createNhanVien(NhanVien nhanVien) {
        // Kiểm tra nhân viên đã tồn tại chưa (theo số điện thoại hoặc email)
        if (nhanVienRepository.findBySoDienThoai1(nhanVien.getSoDienThoai1()) != null) {
            throw new RuntimeException("Số điện thoại đã được đăng ký");
        }
        
        if (nhanVien.getEmail() != null && nhanVienRepository.findByEmail(nhanVien.getEmail()) != null) {
            throw new RuntimeException("Email đã được đăng ký");
        }
        
        return nhanVienRepository.save(nhanVien);
    }

    @Transactional
    public NhanVien updateNhanVien(int id, NhanVien nhanVienDetails) {
        NhanVien nhanVien = nhanVienRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));
        
        // Kiểm tra trùng SĐT/email với nhân viên khác
        if (nhanVienDetails.getSoDienThoai1() != null) {
            NhanVien existingNhanVien = nhanVienRepository.findBySoDienThoai1(nhanVienDetails.getSoDienThoai1());
            if (existingNhanVien != null && existingNhanVien.getIdNhanVien() != id) {
                throw new RuntimeException("Số điện thoại đã được đăng ký bởi nhân viên khác");
            }
        }
        
        if (nhanVienDetails.getEmail() != null) {
            NhanVien existingNhanVien = nhanVienRepository.findByEmail(nhanVienDetails.getEmail());
            if (existingNhanVien != null && existingNhanVien.getIdNhanVien() != id) {
                throw new RuntimeException("Email đã được đăng ký bởi nhân viên khác");
            }
        }
        
        // Cập nhật thông tin
        nhanVien.setTenNhanVien(nhanVienDetails.getTenNhanVien());
        nhanVien.setTuoi(nhanVienDetails.getTuoi());
        nhanVien.setSoDienThoai1(nhanVienDetails.getSoDienThoai1());
        nhanVien.setCccd(nhanVienDetails.getCccd());
        nhanVien.setEmail(nhanVienDetails.getEmail());
        nhanVien.setViTri(nhanVienDetails.getViTri());
        
        return nhanVienRepository.save(nhanVien);
    }

    @Transactional
    public void deleteNhanVien(int id) {
        NhanVien nhanVien = nhanVienRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));
            
        // Kiểm tra liên kết với tài khoản và các hóa đơn trước khi xóa
        // (Logic kiểm tra có thể được thêm vào tùy theo yêu cầu nghiệp vụ)
        
        nhanVienRepository.deleteById(id);
    }
}