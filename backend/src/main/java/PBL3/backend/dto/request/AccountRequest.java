package PBL3.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequest {
    
    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(min = 3, max = 50, message = "Tên đăng nhập phải từ 3 đến 50 ký tự")
    private String tenDangNhap;
    
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String matKhau;
    
    @NotBlank(message = "Phân quyền không được để trống")
    @Pattern(regexp = "^(admin|nhanvien|khachhang)$", message = "Phân quyền phải là một trong: admin, nhanvien, khachhang")
    private String phanQuyen;
    
    private Integer idLienKet;
}