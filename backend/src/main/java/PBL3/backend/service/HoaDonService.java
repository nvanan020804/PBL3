package PBL3.backend.service;

import PBL3.backend.model.DangKy;
import PBL3.backend.model.HoaDon;
import PBL3.backend.model.HoaDonChiTiet;
import PBL3.backend.model.KhachHang;
import PBL3.backend.repository.DangKyRepository;
import PBL3.backend.repository.HoaDonChiTietRepository;
import PBL3.backend.repository.HoaDonRepository;
import PBL3.backend.repository.KhachHangRepository;
import PBL3.backend.dto.response.ThongKeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Optional;

@Service
public class HoaDonService {

    private final HoaDonRepository hoaDonRepository;
    private final DangKyRepository dangKyRepository;
    private final HoaDonChiTietRepository hoaDonChiTietRepository;
    private final KhachHangRepository khachHangRepository;


    @Autowired
    public HoaDonService(HoaDonRepository hoaDonRepository, 
                         DangKyRepository dangKyRepository,
                         HoaDonChiTietRepository hoaDonChiTietRepository,
                         KhachHangRepository khachHangRepository) {
        this.hoaDonRepository = hoaDonRepository;
        this.dangKyRepository = dangKyRepository;
        this.hoaDonChiTietRepository = hoaDonChiTietRepository;
        this.khachHangRepository = khachHangRepository;
    }

    public List<HoaDon> getAllHoaDon() {
        return hoaDonRepository.findAll();
    }

    public Optional<HoaDon> getHoaDonById(int id) {
        return hoaDonRepository.findById(id);
    }

    public List<HoaDon> getHoaDonByDangKy(int idDangKy) {
        DangKy dangKy = dangKyRepository.findById(idDangKy)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + idDangKy));
        return hoaDonRepository.findByDangKy(dangKy);
    }
    
    public List<HoaDon> getAllHoaDonWithDangKy() {
        // Trả về danh sách hóa đơn có liên kết với đăng ký (dangKy không null)
        return hoaDonRepository.findByDangKyIsNotNull();
    }
    
    // Phương thức tìm hóa đơn theo ID nhân viên đã bị loại bỏ

   
   

    public List<HoaDon> getHoaDonByKhachHang(int idKhachHang) {
        return hoaDonRepository.findByDangKyKhachHangId(idKhachHang);
    }

    @Transactional(readOnly = false)
    public HoaDon createHoaDon(HoaDon hoaDon) {
        if (hoaDon.getDangKy() != null && hoaDon.getDangKy().getIdDangKy() > 0) {
            DangKy dangKy = dangKyRepository.findById(hoaDon.getDangKy().getIdDangKy())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký với ID: " + hoaDon.getDangKy().getIdDangKy()));
            hoaDon.setDangKy(dangKy);
            
            // Tự động đặt tổng tiền từ giá gói dịch vụ
            if (dangKy.getGoiDichVu() != null && (hoaDon.getTongTien() == null || hoaDon.getTongTien().compareTo(BigDecimal.ZERO) == 0)) {
                BigDecimal giaGoi = dangKy.getGoiDichVu().getGia();
                hoaDon.setTongTien(giaGoi);
                
                // Nếu giảm giá là null hoặc 0, đặt thành 0
                if (hoaDon.getGiamGia() == null || hoaDon.getGiamGia().compareTo(BigDecimal.ZERO) == 0) {
                    hoaDon.setGiamGia(BigDecimal.ZERO);
                }
                
                // Tính thành tiền = tổng tiền - giảm giá
                BigDecimal thanhToan = giaGoi.subtract(hoaDon.getGiamGia());
                hoaDon.setThanhToan(thanhToan.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : thanhToan);
            }
        } else {
            // Nếu không có đăng ký, đặt thành null (hóa đơn mua sản phẩm)
            hoaDon.setDangKy(null);
        }
        
        // Thiết lập thông tin mặc định
        if (hoaDon.getThoiGianTao() == null) {
            hoaDon.setThoiGianTao(LocalDateTime.now());
        }
        
        if (hoaDon.getTrangThai() == null) {
            hoaDon.setTrangThai("Chờ xử lý");
        }
        
        // Thiết lập trạng thái thanh toán mặc định
        if (hoaDon.getTrangThaiThanhToan() == null) {
            hoaDon.setTrangThaiThanhToan("Chưa thanh toán");
        }
        
        // Thiết lập các giá trị tài chính mặc định nếu chưa có
        if (hoaDon.getTongTien() == null) {
            hoaDon.setTongTien(BigDecimal.ZERO);
        }
        
        if (hoaDon.getGiamGia() == null) {
            hoaDon.setGiamGia(BigDecimal.ZERO);
        }
        
        if (hoaDon.getThanhToan() == null) {
            hoaDon.setThanhToan(BigDecimal.ZERO);
        }
        
        if (hoaDon.getPhuongThuc() == null) {
            hoaDon.setPhuongThuc("tienmat");
        }
        
        // Chuẩn hóa phương thức thanh toán
        if ("Tiền mặt".equals(hoaDon.getPhuongThuc())) {
            hoaDon.setPhuongThuc("tienmat");
        } else if ("Chuyển khoản".equals(hoaDon.getPhuongThuc())) {
            hoaDon.setPhuongThuc("chuyenkhoan");
        } else if ("Thẻ tín dụng".equals(hoaDon.getPhuongThuc())) {
            hoaDon.setPhuongThuc("thetindung");
        }
        
        return hoaDonRepository.save(hoaDon);
    }

    @Transactional(readOnly = false)
    public HoaDon updateHoaDon(int id, HoaDon hoaDonDetails) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
        
        // Cập nhật thông tin
        if (hoaDonDetails.getTrangThai() != null) {
            hoaDon.setTrangThai(hoaDonDetails.getTrangThai());
        }
        
        // Cập nhật thông tin tài chính
        if (hoaDonDetails.getTongTien() != null) {
            hoaDon.setTongTien(hoaDonDetails.getTongTien());
        }
        
        if (hoaDonDetails.getGiamGia() != null) {
            hoaDon.setGiamGia(hoaDonDetails.getGiamGia());
        }
        
        if (hoaDonDetails.getThanhToan() != null) {
            hoaDon.setThanhToan(hoaDonDetails.getThanhToan());
        }
        
        if (hoaDonDetails.getPhuongThuc() != null) {
            hoaDon.setPhuongThuc(hoaDonDetails.getPhuongThuc());
        }
        
        // Cập nhật trạng thái thanh toán
        if (hoaDonDetails.getTrangThaiThanhToan() != null) {
            hoaDon.setTrangThaiThanhToan(hoaDonDetails.getTrangThaiThanhToan());
        }
        
        return hoaDonRepository.save(hoaDon);
    }

    // Phương thức xoá hoá đơn đã được loại bỏ vì yêu cầu hệ thống
    @Transactional(readOnly = false)
    public void deleteHoaDon(int id) {
        throw new RuntimeException("Chức năng xóa hoá đơn đã bị vô hiệu hoá");
    }
    
    @Transactional(readOnly = false)
    public HoaDon hoanThanhHoaDon(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        hoaDon.setTrangThai("Hoàn thành");
        
        // Khi hóa đơn hoàn thành, cập nhật trạng thái đăng ký liên quan (nếu có)
        if (hoaDon.getDangKy() != null) {
            DangKy dangKy = hoaDon.getDangKy();
            
            // Chỉ cập nhật nếu đăng ký đang ở trạng thái "Chờ xử lý"
            if ("Chờ xử lý".equals(dangKy.getTrangThai())) {
                dangKy.setTrangThai("Đang hoạt động");
                dangKyRepository.save(dangKy);
                
                // Cập nhật trạng thái khách hàng
                KhachHang khachHang = dangKy.getKhachHang();
                if (khachHang != null) {
                    khachHang.setTrangThai("Đang hoạt động");
                    khachHangRepository.save(khachHang);
                    System.out.println("Đã kích hoạt đăng ký ID " + dangKy.getIdDangKy() + 
                                      " và cập nhật trạng thái khách hàng ID " + 
                                      khachHang.getIdKhachHang() + " thành 'Đang hoạt động'");
                }
            }
        }
        
        return hoaDonRepository.save(hoaDon);
    }
    
    @Transactional(readOnly = false)
    public HoaDon huyHoaDon(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        hoaDon.setTrangThai("Hủy");
        return hoaDonRepository.save(hoaDon);
    }
    
    @Transactional(readOnly = false)
    public HoaDon calculateTotals(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        List<HoaDonChiTiet> chiTietList = hoaDonChiTietRepository.findByHoaDon(hoaDon);
        
        BigDecimal tongTien = BigDecimal.ZERO;
        for (HoaDonChiTiet chiTiet : chiTietList) {
            tongTien = tongTien.add(chiTiet.getThanhTien() != null ? chiTiet.getThanhTien() : BigDecimal.ZERO);
        }
        
        hoaDon.setTongTien(tongTien);
        
        BigDecimal giamGia = hoaDon.getGiamGia() != null ? hoaDon.getGiamGia() : BigDecimal.ZERO;
        BigDecimal thanhToan = tongTien.subtract(giamGia);
        hoaDon.setThanhToan(thanhToan.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : thanhToan);
        
        return hoaDonRepository.save(hoaDon);
    }
    
    @Transactional(readOnly = false)
    public HoaDon daThanhToan(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        hoaDon.setTrangThaiThanhToan("Đã thanh toán");
        return hoaDonRepository.save(hoaDon);
    }
    
    @Transactional(readOnly = false)
    public HoaDon chuaThanhToan(int id) {
        HoaDon hoaDon = hoaDonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với ID: " + id));
            
        hoaDon.setTrangThaiThanhToan("Chưa thanh toán");
        return hoaDonRepository.save(hoaDon);
    }
    
    /**
     * Lấy danh sách hóa đơn đã hoàn thành trong khoảng thời gian
     * @param startDate Ngày bắt đầu
     * @param endDate Ngày kết thúc
     * @return Danh sách hóa đơn đã hoàn thành
     */
    public List<HoaDon> getCompletedInvoices(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();
        
        return hoaDonRepository.findByTrangThaiAndThoiGianTaoBetween(
            "Hoàn thành", startDateTime, endDateTime);
    }
    
    /**
     * Tính doanh thu theo ngày
     * @param startDate Ngày bắt đầu
     * @param endDate Ngày kết thúc
     * @return Danh sách doanh thu theo ngày
     */
    public List<ThongKeDTO> getRevenueByDay(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();
        
        // Lấy tất cả hóa đơn đã hoàn thành trong khoảng thời gian
        List<HoaDon> completedInvoices = hoaDonRepository.findByTrangThaiAndThoiGianTaoBetween(
            "Hoàn thành", startDateTime, endDateTime);
            
        Map<LocalDate, List<HoaDon>> invoicesByDay = completedInvoices.stream()
            .collect(Collectors.groupingBy(hd -> hd.getThoiGianTao().toLocalDate()));
            
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        List<ThongKeDTO> result = new ArrayList<>();
        
        // Tạo danh sách các ngày từ startDate đến endDate
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            List<HoaDon> dailyInvoices = invoicesByDay.getOrDefault(date, Collections.emptyList());
            
            // Tính tổng doanh thu trong ngày
            BigDecimal dailyRevenue = dailyInvoices.stream()
                .map(HoaDon::getThanhToan)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            ThongKeDTO dayRevenue = new ThongKeDTO(
                date.format(dateFormatter),
                dailyRevenue,
                dailyInvoices.size()
            );
            
            result.add(dayRevenue);
        }
        
        return result;
    }
    
    /**
     * Tính doanh thu theo tháng
     * @param startMonth Tháng bắt đầu
     * @param endMonth Tháng kết thúc
     * @return Danh sách doanh thu theo tháng
     */
    public List<ThongKeDTO> getRevenueByMonth(YearMonth startMonth, YearMonth endMonth) {
        LocalDate startDate = startMonth.atDay(1);
        LocalDate endDate = endMonth.atEndOfMonth();
        
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();
        
        // Lấy tất cả hóa đơn đã hoàn thành trong khoảng thời gian
        List<HoaDon> completedInvoices = hoaDonRepository.findByTrangThaiAndThoiGianTaoBetween(
            "Hoàn thành", startDateTime, endDateTime);
            
        Map<YearMonth, List<HoaDon>> invoicesByMonth = completedInvoices.stream()
            .collect(Collectors.groupingBy(hd -> YearMonth.from(hd.getThoiGianTao())));
            
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MM/yyyy");
        List<ThongKeDTO> result = new ArrayList<>();
        
        // Tạo danh sách các tháng từ startMonth đến endMonth
        for (YearMonth month = startMonth; !month.isAfter(endMonth); month = month.plusMonths(1)) {
            List<HoaDon> monthlyInvoices = invoicesByMonth.getOrDefault(month, Collections.emptyList());
            
            // Tính tổng doanh thu trong tháng
            BigDecimal monthlyRevenue = monthlyInvoices.stream()
                .map(HoaDon::getThanhToan)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            ThongKeDTO monthRevenue = new ThongKeDTO(
                month.format(monthFormatter),
                monthlyRevenue,
                monthlyInvoices.size()
            );
            
            result.add(monthRevenue);
        }
        
        return result;
    }
    
    /**
     * Tính doanh thu theo năm
     * @param startYear Năm bắt đầu
     * @param endYear Năm kết thúc
     * @return Danh sách doanh thu theo năm
     */
    public List<ThongKeDTO> getRevenueByYear(int startYear, int endYear) {
        LocalDate startDate = LocalDate.of(startYear, 1, 1);
        LocalDate endDate = LocalDate.of(endYear, 12, 31);
        
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();
        
        // Lấy tất cả hóa đơn đã hoàn thành trong khoảng thời gian
        List<HoaDon> completedInvoices = hoaDonRepository.findByTrangThaiAndThoiGianTaoBetween(
            "Hoàn thành", startDateTime, endDateTime);
            
        Map<Integer, List<HoaDon>> invoicesByYear = completedInvoices.stream()
            .collect(Collectors.groupingBy(hd -> hd.getThoiGianTao().getYear()));
            
        List<ThongKeDTO> result = new ArrayList<>();
        
        // Tạo danh sách các năm từ startYear đến endYear
        for (int year = startYear; year <= endYear; year++) {
            List<HoaDon> yearlyInvoices = invoicesByYear.getOrDefault(year, Collections.emptyList());
            
            // Tính tổng doanh thu trong năm
            BigDecimal yearlyRevenue = yearlyInvoices.stream()
                .map(HoaDon::getThanhToan)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            ThongKeDTO yearRevenue = new ThongKeDTO(
                String.valueOf(year),
                yearlyRevenue,
                yearlyInvoices.size()
            );
            
            result.add(yearRevenue);
        }
        
        return result;
    }
}