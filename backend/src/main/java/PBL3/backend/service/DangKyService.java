package PBL3.backend.service;
import PBL3.backend.dto.DangKyDTO;
import PBL3.backend.model.DangKy;
import PBL3.backend.model.KhachHang;
import PBL3.backend.repository.DangKyRepository;
import PBL3.backend.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DangKyService {

    @Autowired
    private DangKyRepository dangKyRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    public DangKy taoDangKy(DangKyDTO dangKyDTO) {
        DangKy dangKy = new DangKy();
        dangKy.setIdGOI(dangKyDTO.getIdGOI());
        dangKy.setIdKhachHang(dangKyDTO.getIdKhachHang());
        dangKy.setNgayBatDau(dangKyDTO.getNgayBatDau());
        dangKy.setTrangThai("Đang hoạt động");
        DangKy saved = dangKyRepository.save(dangKy);

        // Cập nhật trạng thái khách hàng
        KhachHang khachHang = khachHangRepository.findById(dangKyDTO.getIdKhachHang()).orElse(null);
        if (khachHang != null) {
            khachHang.setTrangThai("Đang sử dụng");
            khachHangRepository.save(khachHang);
        }
        return saved;
    }
    public java.util.Optional<DangKy> layGoiHienTaiCuaKhach(int idKhachHang) {
        return dangKyRepository.findGoiHienTaiByKhachHang(idKhachHang);
    }
}