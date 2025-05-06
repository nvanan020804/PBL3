package PBL3.backend.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class ThietBiRequest {
    
    @NotBlank(message = "Tên thiết bị không được để trống")
    @Size(max = 100, message = "Tên thiết bị không được vượt quá 100 ký tự")
    private String tenThietBi;
    
    private String congDung;
    
    private LocalDate ngayNhap;
    
    @Min(value = 0, message = "Giá tiền không được nhỏ hơn 0")
    @Digits(integer = 10, fraction = 2, message = "Giá tiền không hợp lệ")
    private BigDecimal giaTien;
    
    @Size(max = 50, message = "Trạng thái không được vượt quá 50 ký tự")
    private String trangThai;
}