package PBL3.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonRequest {
    
    @NotNull(message = "ID đăng ký không được để trống")
    private Integer idDangKy;
    
    @NotNull(message = "ID nhân viên không được để trống")
    private Integer idNhanVien;
    
    @Pattern(regexp = "^(Đã thanh toán|Chưa thanh toán|Hủy)$", message = "Trạng thái phải là một trong: Đã thanh toán, Chưa thanh toán, Hủy")
    private String trangThai;
}