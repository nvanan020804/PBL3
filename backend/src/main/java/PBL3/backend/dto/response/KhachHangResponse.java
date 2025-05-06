package PBL3.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangResponse {
    private int idKhachHang;
    private String tenKhachHang;
    private Integer namSinh;
    private String soDienThoai;
    private String cccd;
    private String email;
    private String trangThai;
}