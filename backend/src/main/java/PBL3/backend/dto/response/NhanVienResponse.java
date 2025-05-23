package PBL3.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NhanVienResponse {
    private int idNhanVien;
    private String tenNhanVien;
    private Integer tuoi;
    private String soDienThoai1;
    private String cccd;
    private String email;
    private String viTri;
}