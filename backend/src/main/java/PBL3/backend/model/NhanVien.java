package PBL3.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "nhanvien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NhanVien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idNhanVien")
    private int idNhanVien;

    @Column(name = "tenNhanVien", nullable = false, length = 100)
    private String tenNhanVien;
    
    @Column(name = "tuoi")
    private Integer tuoi;
    
    @Column(name = "soDienThoai1", length = 20)
    private String soDienThoai1;
    
    @Column(name = "cccd", length = 20)
    private String cccd;
    
    @Column(name = "email", length = 100)
    private String email;
    
    @Column(name = "viTri", length = 50)
    private String viTri;
    
    @OneToOne(mappedBy = "nhanVien")
    private Account account;
    
    @OneToMany(mappedBy = "nhanVien")
    @JsonManagedReference(value = "nhanvien-hoadon")
    private List<HoaDon> hoaDons;
}