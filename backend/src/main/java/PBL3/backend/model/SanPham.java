package PBL3.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sanpham")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idSanPham")
    private int idSanPham;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idDanhMuc", nullable = false)
    @JsonBackReference(value = "danhmuc-sanpham")
    private PhanLoaiSanPham danhMuc;
    
    @Column(name = "tenSanPham", nullable = false, length = 100)
    private String tenSanPham;
    
    @Column(name = "donViDem", length = 50)
    private String donViDem;
    
    @Column(name = "gia", nullable = false, precision = 10, scale = 2)
    private BigDecimal gia;
    
    @Column(name = "congDung", columnDefinition = "TEXT")
    private String congDung;
    
    @Column(name = "soLuong")
    private Integer soLuong = 0;
    
    @OneToMany(mappedBy = "sanPham", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "sanpham-chitiet")
    private List<HoaDonChiTiet> hoaDonChiTietList = new ArrayList<>();
}