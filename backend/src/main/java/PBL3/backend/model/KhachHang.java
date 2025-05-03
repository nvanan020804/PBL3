package PBL3.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "khachhang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhachHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idKhachHang")
    private int idKhachHang;

    @Column(name = "tenKhachHang", nullable = false, length = 100)
    private String tenKhachHang;
    
    @Column(name = "namSinh")
    private Integer namSinh;
    
    @Column(name = "soDienThoai", length = 20)
    private String soDienThoai;
    
    @Column(name = "cccd", length = 20)
    private String cccd;
    
    @Column(name = "email", length = 100)
    private String email;
    
    @Column(name = "gioTap", length = 100)
    private String gioTap;
    
    @Column(name = "trangThai", length = 50)
    private String trangThai;

    @OneToOne(mappedBy = "khachHang")
    private Account account;
    
    @OneToMany(mappedBy = "khachHang", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DangKy> dangKyList = new ArrayList<>();
}