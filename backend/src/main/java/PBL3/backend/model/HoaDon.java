package PBL3.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
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
    
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "idDangKy", nullable = true)
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
    
    @Column(name = "tongTien", precision = 10, scale = 2)
    private BigDecimal tongTien;
    
    @Column(name = "giamGia", precision = 10, scale = 2)
    private BigDecimal giamGia;
    
    @Column(name = "thanhToan", precision = 10, scale = 2)
    private BigDecimal thanhToan;
    
    @Column(name = "phuongThuc", length = 50)
    private String phuongThuc;
    
    @Column(name = "trangThaiThanhToan", length = 50)
    private String trangThaiThanhToan;
    
    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "hoadon-chitiet")
    private List<HoaDonChiTiet> chiTietList = new ArrayList<>();
}