package PBL3.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "goidichvu")
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

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTenGoi() {
        return tenGoi;
    }

    public void setTenGoi(String tenGoi) {
        this.tenGoi = tenGoi;
    }

    public BigDecimal getGia() {
        return gia;
    }

    public void setGia(BigDecimal gia) {
        this.gia = gia;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public int getThoiGian() {
        return thoiGian;
    }

    public void setThoiGian(int thoiGian) {
        this.thoiGian = thoiGian;
    }
}