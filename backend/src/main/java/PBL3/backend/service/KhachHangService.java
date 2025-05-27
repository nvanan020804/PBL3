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
        if (khachHangRepository.findBySoDienThoai(khachHang.getSoDienThoai()) != null) {
            throw new RuntimeException("Số điện thoại đã được đăng ký");
        }
        if (khachHang.getEmail() != null && khachHangRepository.findByEmail(khachHang.getEmail()) != null) {
            throw new RuntimeException("Email đã được đăng ký");
        }
        if (khachHang.getCccd() != null && khachHangRepository.findByCccd(khachHang.getCccd()) != null) {
            throw new RuntimeException("CCCD đã được đăng ký");
        }
        if (khachHang.getTrangThai() == null) {
            khachHang.setTrangThai("Chưa hoạt động");
        }
        KhachHang savedKhachHang = khachHangRepository.save(khachHang);
        try {
            String username = khachHang.getCustomUsername();
            String password = khachHang.getCustomPassword();
            if (username == null || username.trim().isEmpty()) {
                username = "khachhang" + savedKhachHang.getIdKhachHang();
                password = "123456";
                Account existingAccount = accountRepository.findByTenDangNhap(username);
                if (existingAccount != null) {
                    int randomSuffix = (int)(Math.random() * 1000);
                    username = "khachhang" + savedKhachHang.getIdKhachHang() + randomSuffix;
                    existingAccount = accountRepository.findByTenDangNhap(username);
                    if (existingAccount != null) {
                        throw new RuntimeException("Không thể tạo tên đăng nhập duy nhất");
                    }
                }
                System.out.println("Sử dụng tên đăng nhập mặc định: " + username);
            } else {
                Account existingAccount = accountRepository.findByTenDangNhap(username);
                if (existingAccount != null) {
                    throw new RuntimeException("Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác");
                }
                System.out.println("Sử dụng tên đăng nhập từ form: " + username);
            }
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
        String trangThai = khachHang.getTrangThai();
        boolean isActive = "Đang hoạt động".equalsIgnoreCase(trangThai);
        if (isActive) {
            throw new RuntimeException("Không thể xóa khách hàng đang hoạt động. Vui lòng thay đổi trạng thái thành không hoạt động trước khi xóa.");
        }
        try {
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=0");
            String deleteAccountSql = "DELETE FROM accounts WHERE id_lien_ket = ? AND phan_quyen = 'khachhang'";
            jdbcTemplate.update(deleteAccountSql, id);
            String deleteDangKySql = "DELETE FROM dangky WHERE id_khach_hang = ?";
            jdbcTemplate.update(deleteDangKySql, id);
            String deleteKhachHangSql = "DELETE FROM khachhang WHERE id_khach_hang = ?";
            jdbcTemplate.update(deleteKhachHangSql, id);
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=1");
        } catch (Exception e) {
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=1");
            throw new RuntimeException("Không thể xóa khách hàng: " + e.getMessage(), e);
        }
    }

    public List<KhachHangResponse> searchKhachHangByUsername(String username) {
        String sql = "SELECT k.id_khach_hang, k.ten_khach_hang, k.nam_sinh, k.so_dien_thoai, " +
                    "k.cccd, k.email, k.trang_thai " +
                    "FROM khachhang k " +
                    "JOIN accounts a ON k.id_khach_hang = a.id_lien_ket " +
                    "WHERE a.ten_dang_nhap LIKE ? AND a.phan_quyen = 'khachhang'";
        
        return jdbcTemplate.query(sql, new Object[]{"%" + username + "%"}, (rs, rowNum) -> {
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

    public KhachHangResponse getKhachHangByUsername(String username) {
        KhachHang khachHang = khachHangRepository.findByUsername(username);
        if (khachHang == null) {
            return null;
        }
        KhachHangResponse response = new KhachHangResponse();
        response.setIdKhachHang(khachHang.getIdKhachHang());
        response.setTenKhachHang(khachHang.getTenKhachHang());
        response.setNamSinh(khachHang.getNamSinh());
        response.setSoDienThoai(khachHang.getSoDienThoai());
        response.setCccd(khachHang.getCccd());
        response.setEmail(khachHang.getEmail());
        response.setTrangThai(khachHang.getTrangThai());
        return response;
    }
}