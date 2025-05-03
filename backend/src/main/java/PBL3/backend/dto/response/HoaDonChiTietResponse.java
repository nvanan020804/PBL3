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
public class HoaDonChiTietResponse {
    private int idHoaDonChiTiet;
    private int idHoaDon;
    private int idSanPham;
    private String tenSanPham;
    private int soLuong;
    private BigDecimal gia;
    private BigDecimal thanhTien;
}