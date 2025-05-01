package PBL3.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @Column(name = "ten_dang_nhap")
    private String tenDangNhap;
    
    @Column(name = "mat_khau")
    private String matKhau;
    
    @Column(name = "phan_quyen")
    private String phanQuyen;
    
    @Column(name = "id_lien_ket")
    private Integer idLienKet;
}

