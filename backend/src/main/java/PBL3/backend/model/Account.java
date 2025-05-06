package PBL3.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "accounts")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @Column(name = "ten_dang_nhap")
    private String tenDangNhap;
    
    @Column(name = "mat_khau")
    private String matKhau;
    
    @Column(name = "phan_quyen")
    private String phanQuyen;
    
    @Column(name = "id_lien_ket")
    private Integer idLienKet;
    
    // OneToOne relationship with KhachHang when phanQuyen is "khachhang"
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_lien_ket", referencedColumnName = "idKhachHang", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "account", "dangKyList"})
    private KhachHang khachHang;
    
    // OneToOne relationship with NhanVien when phanQuyen is "nhanvien" or "admin"
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_lien_ket", referencedColumnName = "idNhanVien", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "account"})
    private NhanVien nhanVien;
}

