package com.example.gym.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "KHACHHANG")
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idKHACHHANG;

    private String nameKHACHHANG;
    private LocalDate bdKHACHHANG;
    private String sdtKHACHHANG;
    private String cccdKHACHHANG;
    private String emailKHACHHANG;

    @ManyToOne
    @JoinColumn(name = "idGOI") // FK trỏ tới bảng GOIDICHVU
    @JsonBackReference
    private GoiDichVu goiDichVu;

    public KhachHang() {
    }

    // Getters và Setters

    public int getIdKHACHHANG() {
        return idKHACHHANG;
    }

    public void setIdKHACHHANG(int idKHACHHANG) {
        this.idKHACHHANG = idKHACHHANG;
    }

    public String getNameKHACHHANG() {
        return nameKHACHHANG;
    }

    public void setNameKHACHHANG(String nameKHACHHANG) {
        this.nameKHACHHANG = nameKHACHHANG;
    }

    public LocalDate getBdKHACHHANG() {
        return bdKHACHHANG;
    }

    public void setBdKHACHHANG(LocalDate bdKHACHHANG) {
        this.bdKHACHHANG = bdKHACHHANG;
    }

    public String getSdtKHACHHANG() {
        return sdtKHACHHANG;
    }

    public void setSdtKHACHHANG(String sdtKHACHHANG) {
        this.sdtKHACHHANG = sdtKHACHHANG;
    }

    public String getCccdKHACHHANG() {
        return cccdKHACHHANG;
    }

    public void setCccdKHACHHANG(String cccdKHACHHANG) {
        this.cccdKHACHHANG = cccdKHACHHANG;
    }

    public String getEmailKHACHHANG() {
        return emailKHACHHANG;
    }

    public void setEmailKHACHHANG(String emailKHACHHANG) {
        this.emailKHACHHANG = emailKHACHHANG;
    }

    public GoiDichVu getGoiDichVu() {
        return goiDichVu;
    }

    public void setGoiDichVu(GoiDichVu goiDichVu) {
        this.goiDichVu = goiDichVu;
    }
}
