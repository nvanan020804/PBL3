package PBL3.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "idDangKy")
public class DangKy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDangKy")
    private int idDangKy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idGOI", nullable = false)
    @JsonBackReference(value = "goidichvu-dangky")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private GoiDichVu goiDichVu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idKhachHang", nullable = false)
    @JsonBackReference(value = "khachhang-dangky")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private KhachHang khachHang;

    @Column(name = "ngayBatDau", nullable = false)
    private LocalDate ngayBatDau;

    @Column(name = "trangThai", nullable = false, length = 50)
    private String trangThai;

    @Column(name = "gio_tap", length = 50)
    private String gioTap;
    
    @OneToMany(mappedBy = "dangKy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "dangky-hoadon")
    private List<HoaDon> hoaDons = new ArrayList<>();
}