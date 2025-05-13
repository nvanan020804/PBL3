package PBL3.backend.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "phanloaisanpham")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhanLoaiSanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDanhMuc")
    private int idDanhMuc;
    
    @Column(name = "tenDanhMuc", nullable = false, length = 100)
    private String tenDanhMuc;
    
    @OneToMany(mappedBy = "danhMuc", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // Prevents circular reference
    private List<SanPham> sanPhamList = new ArrayList<>();
}