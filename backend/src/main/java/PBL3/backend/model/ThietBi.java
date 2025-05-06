package PBL3.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "thietbi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThietBi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idThietBi")
    private int idThietBi;
    
    @Column(name = "tenThietBi", nullable = false, length = 100)
    private String tenThietBi;
    
    @Column(name = "congDung", columnDefinition = "TEXT")
    private String congDung;
    
    @Column(name = "ngayNhap")
    private LocalDate ngayNhap;
    
    @Column(name = "giaTien", precision = 10, scale = 2)
    private BigDecimal giaTien;
    
    @Column(name = "trangThai", length = 50)
    private String trangThai;
}