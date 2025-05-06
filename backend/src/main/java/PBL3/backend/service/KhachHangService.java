package PBL3.backend.service;

import PBL3.backend.dto.response.KhachHangResponse;
import PBL3.backend.model.KhachHang;
import PBL3.backend.repository.KhachHangRepository;
import PBL3.backend.repository.AccountRepository;
import PBL3.backend.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class KhachHangService {

    private final KhachHangRepository khachHangRepository;
    private final AccountRepository accountRepository;
    private final JdbcTemplate jdbcTemplate;
    private final AccountService accountService;

    @Autowired
    public KhachHangService(KhachHangRepository khachHangRepository, AccountRepository accountRepository, JdbcTemplate jdbcTemplate, AccountService accountService) {
        this.khachHangRepository = khachHangRepository;
        this.accountRepository = accountRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.accountService = accountService;
    }

    public List<KhachHangResponse> getAllKhachHang() {
        // Sử dụng JdbcTemplate để truy vấn SQL trực tiếp
        String sql = "SELECT id_khach_hang, ten_khach_hang, nam_sinh, so_dien_thoai, cccd, email, trang_thai FROM khachhang";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            KhachHangResponse khachHang = new KhachHangResponse();
            khachHang.setIdKhachHang(rs.getInt("id_khach_hang"));
            khachHang.setTenKhachHang(rs.getString("ten_khach_hang"));
            khachHang.setNamSinh(rs.getObject("nam_sinh") != null ? rs.getInt("nam_sinh") : null);
            khachHang.setSoDienThoai(rs.getString("so_dien_thoai"));
            khachHang.setCccd(rs.getString("cccd"));
            khachHang.setEmail(rs.getString("email"));
            khachHang.setTrangThai(rs.getString("trang_thai"));
            return khachHang;
        });
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

    public KhachHang getKhachHangByCccd(String cccd) {
        return khachHangRepository.findByCccd(cccd);
    }

    @Transactional
    public KhachHang createKhachHang(KhachHang khachHang) {
        // Kiểm tra khách hàng đã tồn tại chưa (theo số điện thoại, email hoặc CCCD)
        if (khachHangRepository.findBySoDienThoai(khachHang.getSoDienThoai()) != null) {
            throw new RuntimeException("Số điện thoại đã được đăng ký");
        }
        
        if (khachHang.getEmail() != null && khachHangRepository.findByEmail(khachHang.getEmail()) != null) {
            throw new RuntimeException("Email đã được đăng ký");
        }
        
        if (khachHang.getCccd() != null && khachHangRepository.findByCccd(khachHang.getCccd()) != null) {
            throw new RuntimeException("CCCD đã được đăng ký");
        }
        
        // Mặc định trạng thái cho khách hàng mới
        if (khachHang.getTrangThai() == null) {
            khachHang.setTrangThai("active");
        }
        
        // Lưu khách hàng để lấy ID
        KhachHang savedKhachHang = khachHangRepository.save(khachHang);
        
        // Tạo tài khoản tự động cho khách hàng bằng cách tạo một Account trực tiếp
        try {
            String username = "khachhang" + savedKhachHang.getIdKhachHang();
            String password = "123456";
            
            // Kiểm tra xem tên đăng nhập đã tồn tại chưa
            Account existingAccount = accountRepository.findByTenDangNhap(username);
            if (existingAccount != null) {
                // Nếu username đã tồn tại, tạo username mới với số ngẫu nhiên
                int randomSuffix = (int)(Math.random() * 1000);
                username = "khachhang" + savedKhachHang.getIdKhachHang() + randomSuffix;
                
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
            account.setPhanQuyen("khachhang");
            account.setIdLienKet(savedKhachHang.getIdKhachHang());
            
            accountRepository.save(account);
            System.out.println("Đã tạo tài khoản tự động cho khách hàng: " + username);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Không thể tạo tài khoản tự động cho khách hàng: " + e.getMessage());
        }
        
        return savedKhachHang;
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
        khachHang.setTrangThai(khachHangDetails.getTrangThai());
        
        return khachHangRepository.save(khachHang);
    }

    @Transactional
    public void deleteKhachHang(int id) {
        KhachHang khachHang = khachHangRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + id));
            
        try {
            // Vô hiệu hóa ràng buộc khóa ngoại tạm thời
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=0");
            
            // Xóa tài khoản liên kết
            String deleteAccountSql = "DELETE FROM accounts WHERE id_lien_ket = ? AND phan_quyen = 'khachhang'";
            jdbcTemplate.update(deleteAccountSql, id);
            
            // Xóa đăng ký của khách hàng
            String deleteDangKySql = "DELETE FROM dangky WHERE id_khach_hang = ?";
            jdbcTemplate.update(deleteDangKySql, id);
            
            // Xóa khách hàng
            String deleteKhachHangSql = "DELETE FROM khachhang WHERE id_khach_hang = ?";
            jdbcTemplate.update(deleteKhachHangSql, id);
            
            // Kích hoạt lại ràng buộc khóa ngoại
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=1");
            
        } catch (Exception e) {
            // Đảm bảo kích hoạt lại ràng buộc khóa ngoại ngay cả khi có lỗi
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=1");
            throw new RuntimeException("Không thể xóa khách hàng: " + e.getMessage(), e);
        }
    }
}