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
    private Integer idDangKy; // Đã thay đổi thành Integer để có thể null nếu không có đăng ký
    private int idDangKy;
    private String tenKhachHang;
    private LocalDateTime thoiGianTao;
    private String trangThai;
    private List<HoaDonChiTietResponse> chiTietList;
}