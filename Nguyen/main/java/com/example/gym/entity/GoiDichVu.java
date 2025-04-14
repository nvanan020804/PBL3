package com.example.gym.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "GOIDICHVU")
public class GoiDichVu {

    @Id
    @Column(name = "idGOI")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idGOI;

    @Column(name = "nameGOI", nullable = false)
    private String nameGOI;

    @Column(name = "priceGOI", nullable = false)
    private int priceGOI;

    @Column(name = "aboutGOI", nullable = false)
    private String aboutGOI;

    @Column(name = "timeGOI", nullable = false)
    private int timeGOI;

    @OneToMany(mappedBy = "goiDichVu", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<KhachHang> khachHangs;

    // Getters and Setters

    public int getIdGOI() {
        return idGOI;
    }

    public void setIdGOI(int idGOI) {
        this.idGOI = idGOI;
    }

    public String getNameGOI() {
        return nameGOI;
    }

    public void setNameGOI(String nameGOI) {
        this.nameGOI = nameGOI;
    }

    public int getPriceGOI() {
        return priceGOI;
    }

    public void setPriceGOI(int priceGOI) {
        this.priceGOI = priceGOI;
    }

    public String getAboutGOI() {
        return aboutGOI;
    }

    public void setAboutGOI(String aboutGOI) {
        this.aboutGOI = aboutGOI;
    }

    public int getTimeGOI() {
        return timeGOI;
    }

    public void setTimeGOI(int timeGOI) {
        this.timeGOI = timeGOI;
    }

    public List<KhachHang> getKhachHangs() {
        return khachHangs;
    }

    public void setKhachHangs(List<KhachHang> khachHangs) {
        this.khachHangs = khachHangs;
    }
}
