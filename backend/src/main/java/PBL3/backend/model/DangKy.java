package PBL3.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "DANGKY")
public class DangKy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDANGKY")
    private int idDangKy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idGOI", referencedColumnName = "idGOI")
    private GoiDichVu goiDichVu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idKHACHHANG", referencedColumnName = "idKHACHHANG")
    private KhachHang khachHang;

    @Column(name = "dayDANGKY")
    private LocalDate dayDangKy;

    @Column(name = "statusGOI")
    private byte statusGoi;

    // Constructors
    public DangKy() {}

    public DangKy(GoiDichVu goiDichVu, KhachHang khachHang, LocalDate dayDangKy, byte statusGoi) {
        this.goiDichVu = goiDichVu;
        this.khachHang = khachHang;
        this.dayDangKy = dayDangKy;
        this.statusGoi = statusGoi;
    }

    // Getters và Setters
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
