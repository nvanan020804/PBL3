package PBL3.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThietBiResponse {
    private int idThietBi;
    private String tenThietBi;
    private String congDung;
    private LocalDate ngayNhap;
    private BigDecimal giaTien;
    private String trangThai;
}