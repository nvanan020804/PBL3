package PBL3.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoanhThuResponse {
    private int idDoanhThu;
    private String thoiGian;
    private BigDecimal tongChi;
    private BigDecimal tongThu;
    private BigDecimal loiNhuan;
}