package PBL3.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    private String tenDangNhap;
    private String phanQuyen;
    private Integer idLienKet;
    // Don't return the password in response objects for security
}