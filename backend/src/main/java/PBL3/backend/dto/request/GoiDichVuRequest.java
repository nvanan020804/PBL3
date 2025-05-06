package PBL3.backend.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoiDichVuRequest {
    
    @NotBlank(message = "Tên gói không được để trống")
    @Size(max = 100, message = "Tên gói không được vượt quá 100 ký tự")
    private String tenGoi;
    
    @NotNull(message = "Giá không được để trống")
    @Min(value = 0, message = "Giá không được nhỏ hơn 0")
    @Digits(integer = 10, fraction = 2, message = "Giá không hợp lệ")
    private BigDecimal gia;
    
    private String moTa;
    
    @NotNull(message = "Thời gian không được để trống")
    @Min(value = 1, message = "Thời gian phải lớn hơn 0")
    private Integer thoiGian;
}