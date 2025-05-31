package PBL3.backend.service;

import PBL3.backend.model.DangKy;
import PBL3.backend.model.GoiDichVu;
import PBL3.backend.model.KhachHang;
import PBL3.backend.repository.DangKyRepository;
import PBL3.backend.repository.GoiDichVuRepository;
import PBL3.backend.repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DangKyService {

    private final DangKyRepository dangKyRepository;
    private final KhachHangRepository khachHangRepository;
    private final GoiDichVuRepository goiDichVuRepository;

    @Autowired
    public DangKyService(DangKyRepository dangKyRepository,
                         KhachHangRepository khachHangRepository,
                         GoiDichVuRepository goiDichVuRepository) {
        this.dangKyRepository = dangKyRepository;
        this.khachHangRepository = khachHangRepository;
        this.goiDichVuRepository = goiDichVuRepository;
    }

    public List<DangKy> getAllDangKy() {
        return dangKyRepository.findAll();
    }

    public Optional<DangKy> getDangKyById(int id) {
        return dangKyRepository.findById(id);
    }

    public List<DangKy> getDangKyByKhachHang(int idKhachHang) {
        KhachHang khachHang = khachHangRepository.findById(idKhachHang)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + idKhachHang));
        return dangKyRepository.findByKhachHang(khachHang);
    }

    public List<DangKy> getActiveDangKyByKhachHang(int idKhachHang) {
        return dangKyRepository.findActiveByKhachHangId(idKhachHang);
    }

    public List<DangKy> getDangKyByDateRange(LocalDate startDate, LocalDate endDate) {
        return dangKyRepository.findByNgayBatDauBetween(startDate, endDate);
    }

    @Transactional
    public DangKy createDangKy(DangKy dangKy) {
        // Kiểm tra tồn tại của gói dịch vụ và khách hàng
        if (dangKy.getGoiDichVu() == null || dangKy.getGoiDichVu().getId() == 0) {
            throw new RuntimeException("Gói dịch vụ không hợp lệ");
        }
        
        if (dangKy.getKhachHang() == null || dangKy.getKhachHang().getIdKhachHang() == 0) {
            throw new RuntimeException("Khách hàng không hợp lệ");
        }
        
        // Lấy thông tin đầy đủ
        GoiDichVu goiDichVu = goiDichVuRepository.findById(dangKy.getGoiDichVu().getId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy gói dịch vụ với ID: " + dangKy.getGoiDichVu().getId()));
            
        KhachHang khachHang = khachHangRepository.findById(dangKy.getKhachHang().getIdKhachHang())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + dangKy.getKhachHang().getIdKhachHang()));
        
        // Kiểm tra xem khách hàng đã có đăng ký đang hoạt động chưa
        List<DangKy> activeRegistrations = dangKyRepository.findActiveByKhachHangId(khachHang.getIdKhachHang());
        if (!activeRegistrations.isEmpty()) {
            throw new RuntimeException("Khách hàng đã có đăng ký đang hoạt động");
        }
        
        // Thiết lập thông tin mặc định
        if (dangKy.getNgayBatDau() == null) {
            dangKy.setNgayBatDau(LocalDate.now());
        }
        
        if (dangKy.getTrangThai() == null) {
            dangKy.setTrangThai("Chờ xử lý");
        }
        
        // Tính toán ngày kết thúc dựa trên thời hạn gói dịch vụ (thoiGian là số tháng)
        if (goiDichVu.getThoiGian() > 0) {
            LocalDate ngayKetThuc = dangKy.getNgayBatDau().plusMonths(goiDichVu.getThoiGian());
            dangKy.setNgayKetThuc(ngayKetThuc);
            System.out.println("Đặt ngày kết thúc cho đăng ký: " + ngayKetThuc);
        }
        
        // Lưu đăng ký
        dangKy.setGoiDichVu(goiDichVu);
        dangKy.setKhachHang(khachHang); 
        
        // Không cập nhật trạng thái khách hàng tại đây
        // Trạng thái khách hàng sẽ được cập nhật khi hóa đơn được hoàn thành
        
        return dangKyRepository.save(dangKy);
    }

    @Transactional
    public DangKy updateDangKy(int id, DangKy dangKyDetails) {
        DangKy dangKy = dangKyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + id));
        
        // Cập nhật thông tin
        boolean ngayBatDauUpdated = false;
        if (dangKyDetails.getNgayBatDau() != null && !dangKyDetails.getNgayBatDau().equals(dangKy.getNgayBatDau())) {
            dangKy.setNgayBatDau(dangKyDetails.getNgayBatDau());
            ngayBatDauUpdated = true;
        }
        
        if (dangKyDetails.getTrangThai() != null) {
            dangKy.setTrangThai(dangKyDetails.getTrangThai());
        }
        
        if (dangKyDetails.getGioTap() != null) {
            dangKy.setGioTap(dangKyDetails.getGioTap());
        }
        
        // Nếu ngày bắt đầu đã thay đổi, cập nhật lại ngày kết thúc
        if (ngayBatDauUpdated && dangKy.getGoiDichVu() != null) {
            LocalDate ngayKetThuc = dangKy.getNgayBatDau().plusMonths(dangKy.getGoiDichVu().getThoiGian());
            dangKy.setNgayKetThuc(ngayKetThuc);
            System.out.println("Cập nhật ngày kết thúc cho đăng ký: " + ngayKetThuc);
        }
        
        // Nếu trạng thái được cập nhật thành "Đang hoạt động", cập nhật trạng thái khách hàng
        if ("Đang hoạt động".equals(dangKyDetails.getTrangThai())) {
            KhachHang khachHang = dangKy.getKhachHang();
            if (khachHang != null) {
                khachHang.setTrangThai("Đang hoạt động");
                khachHangRepository.save(khachHang);
            }
        }
        
        return dangKyRepository.save(dangKy);
    }

    // Phương thức xoá đăng ký đã được loại bỏ vì yêu cầu hệ thống
    @Transactional
    public void deleteDangKy(int id) {
        throw new RuntimeException("Chức năng xoá đăng ký đã bị vô hiệu hoá");
    }
    
    @Transactional
    public DangKy activateDangKy(int id) {
        DangKy dangKy = dangKyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + id));
            
        dangKy.setTrangThai("Đang hoạt động");
        
        // Cập nhật trạng thái khách hàng thành đang hoạt động
        KhachHang khachHang = dangKy.getKhachHang();
        if (khachHang != null) {
            khachHang.setTrangThai("Đang hoạt động");
            khachHangRepository.save(khachHang);
        }
        
        return dangKyRepository.save(dangKy);
    }
    
    @Transactional
    public DangKy cancelDangKy(int id) {
        DangKy dangKy = dangKyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + id));
            
        // Chỉ hủy được đăng ký đang hoạt động
        if (!"Đang hoạt động".equals(dangKy.getTrangThai())) {
            throw new RuntimeException("Chỉ có thể hủy đăng ký đang hoạt động");
        }
            
        dangKy.setTrangThai("Hết hạn");
        
        // Cập nhật ngày kết thúc thành ngày hiện tại
        dangKy.setNgayKetThuc(LocalDate.now());
        
        // Lấy khách hàng từ đăng ký
        KhachHang khachHang = dangKy.getKhachHang();
        
        // Lưu đăng ký trước
        DangKy savedDangKy = dangKyRepository.save(dangKy);
        System.out.println("Đã cập nhật trạng thái đăng ký ID " + id + " thành 'Hết hạn' và ngày kết thúc thành ngày hiện tại");
        
        // Kiểm tra xem khách hàng còn đăng ký đang hoạt động nào không
        List<DangKy> activeRegistrations = dangKyRepository.findActiveByKhachHangId(khachHang.getIdKhachHang());
        
        // Nếu không còn đăng ký đang hoạt động nào, đặt trạng thái khách hàng thành "Chưa hoạt động"
        if (activeRegistrations.isEmpty()) {
            System.out.println("Khách hàng ID " + khachHang.getIdKhachHang() + " không còn đăng ký nào đang hoạt động. Cập nhật trạng thái thành 'Chưa hoạt động'");
            khachHang.setTrangThai("Chưa hoạt động");
            khachHangRepository.save(khachHang);
        } else {
            System.out.println("Khách hàng ID " + khachHang.getIdKhachHang() + " vẫn còn " + activeRegistrations.size() + " đăng ký đang hoạt động");
        }
        
        return savedDangKy;
    }
}