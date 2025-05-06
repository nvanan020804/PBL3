package PBL3.backend.model;

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
@Table(name = "goidichvu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoiDichVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idGOI")
    private int id;

    @Column(name = "nameGOI", nullable = false, length = 100)
    private String tenGoi;

    @Column(name = "priceGOI", nullable = false, precision = 10, scale = 2)
    private BigDecimal gia;

    @Column(name = "aboutGOI", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "timeGOI", nullable = false)
    private int thoiGian;
    
    @OneToMany(mappedBy = "goiDichVu", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "goidichvu-dangky")
    private List<DangKy> dangKyList = new ArrayList<>();
}