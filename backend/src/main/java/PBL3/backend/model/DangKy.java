package PBL3.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "dangky")
public class DangKy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idDangKy;

    @Column(nullable = false)
    private int idGOI;

    @Column(nullable = false)
    private int idKhachHang;

    @Column(nullable = false)
    private LocalDate ngayBatDau;

    @Column(nullable = false, length = 50)
    private String trangThai;

    @Column
    private Integer gioTap;
}