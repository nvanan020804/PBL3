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
public class SanPhamRequest {
    
    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 100, message = "Tên sản phẩm không được vượt quá 100 ký tự")
    private String tenSanPham;
    
    @NotNull(message = "ID danh mục không được để trống")
    private Integer idDanhMuc;
    
    @Size(max = 50, message = "Đơn vị đếm không được vượt quá 50 ký tự")
    private String donViDem;
    
    @NotNull(message = "Giá không được để trống")
    @Digits(integer = 10, fraction = 2, message = "Giá không hợp lệ")
    @Min(value = 0, message = "Giá không được nhỏ hơn 0")
    private BigDecimal gia;
    
    private String congDung;
    
    @Min(value = 0, message = "Số lượng không được nhỏ hơn 0")
    private Integer soLuong;
}