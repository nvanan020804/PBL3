package PBL3.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DangKyResponse {
    private int idDangKy;
    private int idKhachHang;
    private String tenKhachHang;
    private int idGOI;
    private String tenGoi;
    private LocalDate ngayBatDau;
    private String trangThai;
    private Integer gioTap;
}