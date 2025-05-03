package PBL3.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "dangky")
@NoArgsConstructor
@AllArgsConstructor
public class DangKy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDangKy")
    private int idDangKy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idGOI", nullable = false)
    private GoiDichVu goiDichVu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idKhachHang", nullable = false)
    private KhachHang khachHang;

    @Column(name = "ngayBatDau", nullable = false)
    private LocalDate ngayBatDau;

    @Column(name = "trangThai", nullable = false, length = 50)
    private String trangThai;

    @Column(name = "gioTap")
    private Integer gioTap;
    
    @OneToMany(mappedBy = "dangKy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HoaDon> hoaDons = new ArrayList<>();
}