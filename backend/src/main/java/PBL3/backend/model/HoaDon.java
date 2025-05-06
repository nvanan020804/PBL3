package PBL3.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hoadon")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idHoaDon")
    private int idHoaDon;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idDangKy", nullable = false)
    @JsonBackReference(value = "dangky-hoadon")
    private DangKy dangKy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idNhanVien", nullable = false)
    @JsonBackReference(value = "nhanvien-hoadon")
    private NhanVien nhanVien;
    
    @Column(name = "thoiGianTao", nullable = false)
    private LocalDateTime thoiGianTao;
    
    @Column(name = "trangThai", nullable = false, length = 50)
    private String trangThai;
    
    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "hoadon-chitiet")
    private List<HoaDonChiTiet> chiTietList = new ArrayList<>();
}