package PBL3.backend.service;

import PBL3.backend.model.NhanVien;
import PBL3.backend.model.Account;
import PBL3.backend.dto.response.NhanVienResponse;
import PBL3.backend.repository.NhanVienRepository;
import PBL3.backend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NhanVienService {

    private final NhanVienRepository nhanVienRepository;
    private final AccountRepository accountRepository;
    private final JdbcTemplate jdbcTemplate;
    private final KhachHangService khachHangService;

    @Autowired
    public NhanVienService(NhanVienRepository nhanVienRepository, AccountRepository accountRepository, JdbcTemplate jdbcTemplate, @Lazy KhachHangService khachHangService) {
        this.nhanVienRepository = nhanVienRepository;
        this.accountRepository = accountRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.khachHangService = khachHangService;
    }

    public List<NhanVienResponse> getAllNhanVien() {
        // Sử dụng JdbcTemplate để truy vấn SQL trực tiếp
        String sql = "SELECT id_nhan_vien, ten_nhan_vien, tuoi, so_dien_thoai1, cccd, email, vi_tri FROM nhanvien";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            NhanVienResponse nhanVien = new NhanVienResponse();
            nhanVien.setIdNhanVien(rs.getInt("id_nhan_vien"));
            nhanVien.setTenNhanVien(rs.getString("ten_nhan_vien"));
            nhanVien.setTuoi(rs.getObject("tuoi") != null ? rs.getInt("tuoi") : null);
            nhanVien.setSoDienThoai1(rs.getString("so_dien_thoai1"));
            nhanVien.setCccd(rs.getString("cccd"));
            nhanVien.setEmail(rs.getString("email"));
            nhanVien.setViTri(rs.getString("vi_tri"));
            return nhanVien;
        });
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

    public NhanVien getNhanVienByCccd(String cccd) {
        return nhanVienRepository.findByCccd(cccd);
    }

    @Transactional
    public NhanVien createNhanVien(NhanVien nhanVien) {
        // Kiểm tra nhân viên đã tồn tại chưa (theo số điện thoại, email hoặc CCCD)
        if (nhanVienRepository.findBySoDienThoai1(nhanVien.getSoDienThoai1()) != null) {
            throw new RuntimeException("Số điện thoại đã được đăng ký");
        }
        
        if (nhanVien.getEmail() != null && nhanVienRepository.findByEmail(nhanVien.getEmail()) != null) {
            throw new RuntimeException("Email đã được đăng ký");
        }
        
        if (nhanVien.getCccd() != null && nhanVienRepository.findByCccd(nhanVien.getCccd()) != null) {
            throw new RuntimeException("CCCD đã được đăng ký");
        }
        
        // Kiểm tra thông tin trùng lặp với bảng khách hàng
        if (khachHangService.getKhachHangBySoDienThoai(nhanVien.getSoDienThoai1()) != null) {
            throw new RuntimeException("Số điện thoại đã được đăng ký cho khách hàng");
        }
        
        if (nhanVien.getEmail() != null && khachHangService.getKhachHangByEmail(nhanVien.getEmail()) != null) {
            throw new RuntimeException("Email đã được đăng ký cho khách hàng");
        }
        
        if (nhanVien.getCccd() != null && khachHangService.getKhachHangByCccd(nhanVien.getCccd()) != null) {
            throw new RuntimeException("CCCD đã được đăng ký cho khách hàng");
        }
        
        // Lưu nhân viên để lấy ID
        NhanVien savedNhanVien = nhanVienRepository.save(nhanVien);
        
        // Tạo tài khoản tự động cho nhân viên
        try {
            String username = "nhanvien" + savedNhanVien.getIdNhanVien();
            String password = "123456";
            
            // Kiểm tra xem tên đăng nhập đã tồn tại chưa
            Account existingAccount = accountRepository.findByTenDangNhap(username);
            if (existingAccount != null) {
                // Nếu username đã tồn tại, tạo username mới với số ngẫu nhiên
                int randomSuffix = (int)(Math.random() * 1000);
                username = "nhanvien" + savedNhanVien.getIdNhanVien() + randomSuffix;
                
                // Kiểm tra lại một lần nữa để đảm bảo
                existingAccount = accountRepository.findByTenDangNhap(username);
                if (existingAccount != null) {
                    throw new RuntimeException("Không thể tạo tên đăng nhập duy nhất");
                }
            }
            
            // Tạo đối tượng Account và lưu trực tiếp
            Account account = new Account();
            account.setTenDangNhap(username);
            account.setMatKhau(password);
            account.setPhanQuyen("nhanvien"); // Mặc định là nhanvien, có thể thay đổi thành admin sau
            account.setIdLienKet(savedNhanVien.getIdNhanVien());
            
            accountRepository.save(account);
            System.out.println("Đã tạo tài khoản tự động cho nhân viên: " + username);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Không thể tạo tài khoản tự động cho nhân viên: " + e.getMessage());
        }
        
        return savedNhanVien;
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