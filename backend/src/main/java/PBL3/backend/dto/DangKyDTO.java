package PBL3.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class DangKyDTO {
    private int idGOI;
    private int idKhachHang;
    private LocalDate ngayBatDau;
}