package PBL3.backend.service;

import PBL3.backend.model.KhachHang;
import PBL3.backend.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class KhachHangService {

    private final KhachHangRepository khachHangRepository;

    @Autowired
    public KhachHangService(KhachHangRepository khachHangRepository) {
        this.khachHangRepository = khachHangRepository;
    }

    public List<KhachHang> getAllKhachHang() {
        return khachHangRepository.findAll();
    }

    public Optional<KhachHang> getKhachHangById(int id) {
        return khachHangRepository.findById(id);
    }

    public KhachHang getKhachHangBySoDienThoai(String soDienThoai) {
        return khachHangRepository.findBySoDienThoai(soDienThoai);
    }

    public KhachHang getKhachHangByEmail(String email) {
        return khachHangRepository.findByEmail(email);
    }

    @Transactional
    public KhachHang createKhachHang(KhachHang khachHang) {
        // Kiểm tra khách hàng đã tồn tại chưa (theo số điện thoại hoặc email)
        if (khachHangRepository.findBySoDienThoai(khachHang.getSoDienThoai()) != null) {
            throw new RuntimeException("Số điện thoại đã được đăng ký");
        }
        
        if (khachHang.getEmail() != null && khachHangRepository.findByEmail(khachHang.getEmail()) != null) {
            throw new RuntimeException("Email đã được đăng ký");
        }
        
        // Mặc định trạng thái cho khách hàng mới
        if (khachHang.getTrangThai() == null) {
            khachHang.setTrangThai("active");
        }
        
        return khachHangRepository.save(khachHang);
    }

    @Transactional
    public KhachHang updateKhachHang(int id, KhachHang khachHangDetails) {
        KhachHang khachHang = khachHangRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + id));
        
        // Kiểm tra trùng SĐT/email với khách hàng khác
        if (khachHangDetails.getSoDienThoai() != null) {
            KhachHang existingKhachHang = khachHangRepository.findBySoDienThoai(khachHangDetails.getSoDienThoai());
            if (existingKhachHang != null && existingKhachHang.getIdKhachHang() != id) {
                throw new RuntimeException("Số điện thoại đã được đăng ký bởi khách hàng khác");
            }
        }
        
        if (khachHangDetails.getEmail() != null) {
            KhachHang existingKhachHang = khachHangRepository.findByEmail(khachHangDetails.getEmail());
            if (existingKhachHang != null && existingKhachHang.getIdKhachHang() != id) {
                throw new RuntimeException("Email đã được đăng ký bởi khách hàng khác");
            }
        }
        
        // Cập nhật thông tin
        khachHang.setTenKhachHang(khachHangDetails.getTenKhachHang());
        khachHang.setNamSinh(khachHangDetails.getNamSinh());
        khachHang.setSoDienThoai(khachHangDetails.getSoDienThoai());
        khachHang.setCccd(khachHangDetails.getCccd());
        khachHang.setEmail(khachHangDetails.getEmail());
        khachHang.setGioTap(khachHangDetails.getGioTap());
        khachHang.setTrangThai(khachHangDetails.getTrangThai());
        
        return khachHangRepository.save(khachHang);
    }

    @Transactional
    public void deleteKhachHang(int id) {
        KhachHang khachHang = khachHangRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + id));
            
        // Kiểm tra nếu khách hàng có đăng ký gói dịch vụ đang hoạt động
        // hoặc kiểm tra liên kết với tài khoản trước khi xóa
        // (Logic kiểm tra có thể được thêm vào tùy theo yêu cầu nghiệp vụ)
        
        khachHangRepository.deleteById(id);
    }
}