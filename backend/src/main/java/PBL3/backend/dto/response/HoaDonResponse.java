package PBL3.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonResponse {
    private int idHoaDon;
    private int idDangKy;
    private String tenKhachHang;
    private int idNhanVien;
    private String tenNhanVien;
    private LocalDateTime thoiGianTao;
    private String trangThai;
    private List<HoaDonChiTietResponse> chiTietList;
}