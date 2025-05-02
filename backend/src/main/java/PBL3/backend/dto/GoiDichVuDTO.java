package PBL3.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class GoiDichVuDTO {
    
   
    private String tenGoi;

    private BigDecimal gia;

    private String moTa;

    private Integer thoiGian;
} 