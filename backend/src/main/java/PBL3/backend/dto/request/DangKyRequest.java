package PBL3.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DangKyRequest {
    
    @NotNull(message = "ID khách hàng không được để trống")
    private Integer idKhachHang;
    
    @NotNull(message = "ID gói dịch vụ không được để trống")
    private Integer idGOI;
    
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate ngayBatDau;
    
    @Pattern(regexp = "^(Đang hoạt động|Hết hạn|Chưa kích hoạt)$", message = "Trạng thái phải là một trong: Đang hoạt động, Hết hạn, Chưa kích hoạt")
    private String trangThai;
    
    private String gioTap;
}