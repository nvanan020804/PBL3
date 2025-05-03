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
public class SanPhamResponse {
    private int idSanPham;
    private String tenSanPham;
    private Integer idDanhMuc;
    private String tenDanhMuc;
    private String donViDem;
    private BigDecimal gia;
    private String congDung;
    private Integer soLuong;
}