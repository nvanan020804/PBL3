package PBL3.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "khachhang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhachHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idKhachHang")
    private int idKhachHang;

    @Column(name = "tenKhachHang", nullable = false, length = 100)
    private String tenKhachHang;
    
    @Column(name = "namSinh")
    private Integer namSinh;
    
    @Column(name = "soDienThoai", length = 20)
    private String soDienThoai;
    
    @Column(name = "cccd", length = 20)
    private String cccd;
    
    @Column(name = "email", length = 100)
    private String email;
    
    @Column(name = "trangThai", length = 50)
    private String trangThai;
    
    @OneToOne(mappedBy = "khachHang")
    @JsonIgnore
    private Account account;
    
    @OneToMany(mappedBy = "khachHang", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<DangKy> dangKyList = new ArrayList<>();
    
    @Transient
    @JsonProperty("customUsername")
    private String customUsername;
    
    @Transient
    @JsonProperty("customPassword")
    private String customPassword;
    
    // Additional getters and setters for the transient fields
    public String getCustomUsername() {
        return customUsername;
    }
    
    public void setCustomUsername(String customUsername) {
        this.customUsername = customUsername;
    }
    
    public String getCustomPassword() {
        return customPassword;
    }
    
    public void setCustomPassword(String customPassword) {
        this.customPassword = customPassword;
    }
}