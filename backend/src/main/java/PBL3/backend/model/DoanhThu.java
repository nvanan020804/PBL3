package PBL3.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "doanhthu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoanhThu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDanhThu")
    private int idDoanhThu;
    
    @Column(name = "thoiGian", nullable = false, length = 20)
    private String thoiGian;
    
    @Column(name = "tongChi", precision = 15, scale = 2, columnDefinition = "decimal(15,2) default '0.00'")
    private BigDecimal tongChi = BigDecimal.ZERO;
    
    @Column(name = "tongThu", precision = 15, scale = 2, columnDefinition = "decimal(15,2) default '0.00'")
    private BigDecimal tongThu = BigDecimal.ZERO;
}