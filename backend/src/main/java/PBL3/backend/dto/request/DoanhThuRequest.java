package PBL3.backend.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoanhThuRequest {
    
    @NotBlank(message = "Thời gian không được để trống")
    @Pattern(regexp = "^\\d{2}/\\d{4}$", message = "Thời gian phải có định dạng MM/YYYY")
    private String thoiGian;
    
    @Min(value = 0, message = "Tổng chi không được nhỏ hơn 0")
    @Digits(integer = 15, fraction = 2, message = "Tổng chi không hợp lệ")
    private BigDecimal tongChi;
    
    @Min(value = 0, message = "Tổng thu không được nhỏ hơn 0")
    @Digits(integer = 15, fraction = 2, message = "Tổng thu không hợp lệ")
    private BigDecimal tongThu;
}