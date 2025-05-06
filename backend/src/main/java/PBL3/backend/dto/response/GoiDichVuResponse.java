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
public class GoiDichVuResponse {
    private int id;
    private String tenGoi;
    private BigDecimal gia;
    private String moTa;
    private int thoiGian;
}