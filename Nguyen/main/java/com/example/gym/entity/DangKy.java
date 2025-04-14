package com.example.gym.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "DANGKY")
public class DangKy {

    @Id
    @Column(name = "idDANGKY")
    private int idDangKy;

    @ManyToOne
    @JoinColumn(name = "idGOI", referencedColumnName = "idGOI")
    private GoiDichVu goiDichVu;

    @ManyToOne
    @JoinColumn(name = "idKHACHHANG", referencedColumnName = "idKHACHHANG")
    private KhachHang khachHang;

    @Column(name = "dayDANGKY")
    private LocalDate dayDangKy;

    @Column(name = "statusGOI")
    private byte statusGoi;

    // Getters và setters
    public int getIdDangKy() {
        return idDangKy;
    }

    public void setIdDangKy(int idDangKy) {
        this.idDangKy = idDangKy;
    }

    public GoiDichVu getGoiDichVu() {
        return goiDichVu;
    }

    public void setGoiDichVu(GoiDichVu goiDichVu) {
        this.goiDichVu = goiDichVu;
    }

    public KhachHang getKhachHang() {
        return khachHang;
    }

    public void setKhachHang(KhachHang khachHang) {
        this.khachHang = khachHang;
    }

    public LocalDate getDayDangKy() {
        return dayDangKy;
    }

    public void setDayDangKy(LocalDate dayDangKy) {
        this.dayDangKy = dayDangKy;
    }

    public byte getStatusGoi() {
        return statusGoi;
    }

    public void setStatusGoi(byte statusGoi) {
        this.statusGoi = statusGoi;
    }
}
