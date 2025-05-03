package PBL3.backend.model;

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
    private HoaDon hoaDon;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idSanPham", nullable = false)
    private SanPham sanPham;
    
    @Column(name = "soLuong", nullable = false)
    private int soLuong;
    
    @Column(name = "gia", nullable = false, precision = 10, scale = 2)
    private BigDecimal gia;
}