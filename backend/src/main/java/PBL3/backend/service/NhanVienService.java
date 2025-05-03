package PBL3.backend.service;

import PBL3.backend.model.NhanVien;
import PBL3.backend.model.Account;
import PBL3.backend.repository.NhanVienRepository;
import PBL3.backend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NhanVienService {

    @Autowired
    private NhanVienRepository nhanVienRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    public List<NhanVien> layTatCaNhanVien() {
        return nhanVienRepository.findAll();
    }
    
    public Optional<NhanVien> layNhanVienTheoId(int id) {
        return nhanVienRepository.findById(id);
    }
    
    @Transactional
    public NhanVien taoNhanVien(String tenNhanVien, Integer tuoi, String soDienThoai,
                              String cccd, String email, String viTri) {
        NhanVien nhanVien = new NhanVien();
        nhanVien.setTenNhanVien(tenNhanVien);
        nhanVien.setTuoi(tuoi);
        nhanVien.setSoDienThoai1(soDienThoai);
        nhanVien.setCccd(cccd);
        nhanVien.setEmail(email);
        nhanVien.setViTri(viTri);
        
        return nhanVienRepository.save(nhanVien);
    }
    
    @Transactional
    public NhanVien taoNhanVienVaTaiKhoan(String tenNhanVien, Integer tuoi, String soDienThoai,
                                       String cccd, String email, String viTri,
                                       String tenDangNhap, String matKhau, String phanQuyen) {
        // Create and save staff first to get ID
        NhanVien nhanVien = taoNhanVien(tenNhanVien, tuoi, soDienThoai, cccd, email, viTri);
        
        // Create linked account
        Account account = new Account();
        account.setTenDangNhap(tenDangNhap);
        account.setMatKhau(matKhau);
        account.setPhanQuyen(phanQuyen); // "nhanvien" or "admin"
        account.setIdLienKet(nhanVien.getIdNhanVien());
        
        accountRepository.save(account);
        
        return nhanVien;
    }
    
    @Transactional
    public NhanVien capNhatNhanVien(int id, String tenNhanVien, Integer tuoi, String soDienThoai,
                                 String cccd, String email, String viTri) {
        NhanVien nhanVien = nhanVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));
        
        if (tenNhanVien != null) {
            nhanVien.setTenNhanVien(tenNhanVien);
        }
        
        if (tuoi != null) {
            nhanVien.setTuoi(tuoi);
        }
        
        if (soDienThoai != null) {
            nhanVien.setSoDienThoai1(soDienThoai);
        }
        
        if (cccd != null) {
            nhanVien.setCccd(cccd);
        }
        
        if (email != null) {
            nhanVien.setEmail(email);
        }
        
        if (viTri != null) {
            nhanVien.setViTri(viTri);
        }
        
        return nhanVienRepository.save(nhanVien);
    }
    
    @Transactional
    public void xoaNhanVien(int id) {
        NhanVien nhanVien = nhanVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));
        
        // Check if staff has linked account and delete it first
        if (nhanVien.getAccount() != null) {
            accountRepository.delete(nhanVien.getAccount());
        }
        
        nhanVienRepository.deleteById(id);
    }
}