package PBL3.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "hoadonchitiet")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonChiTiet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idHoaDonChiTiet")
    private int idHoaDonChiTiet;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idHoaDon", nullable = false)
    @JsonBackReference(value = "hoadon-chitiet")
    private HoaDon hoaDon;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idSanPham", nullable = false)
    @JsonBackReference(value = "sanpham-chitiet")
    private SanPham sanPham;
    
    @Column(name = "soLuong", nullable = false)
    private int soLuong;
    
    @Column(name = "gia", nullable = false, precision = 10, scale = 2)
    private BigDecimal gia;
    
    @Column(name = "thanhTien", precision = 10, scale = 2)
    private BigDecimal thanhTien;
}