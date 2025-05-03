package PBL3.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "khachhang")
@Getter
@Setter
public class KhachHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idKhachHang")
    private int idKhachHang;

    private String tenKhachHang;
    private Integer namSinh;
    private String soDienThoai;
    private String cccd;
    private String email;
    private Integer gioTap;
    private String trangThai;
}