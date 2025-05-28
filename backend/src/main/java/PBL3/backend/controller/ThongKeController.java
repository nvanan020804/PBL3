package PBL3.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import PBL3.backend.service.HoaDonService;
import PBL3.backend.dto.response.ThongKeDTO;
import PBL3.backend.model.HoaDon;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/hoadon")
@CrossOrigin(origins = "*")
public class ThongKeController {

    @Autowired
    private HoaDonService hoaDonService;

    /**
     * Lấy doanh thu theo ngày
     * @param startDate Ngày bắt đầu
     * @param endDate Ngày kết thúc
     * @return Danh sách doanh thu theo ngày
     */
    @GetMapping("/revenue/day")
    public ResponseEntity<List<ThongKeDTO>> getRevenueByDay(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<ThongKeDTO> revenueList = hoaDonService.getRevenueByDay(startDate, endDate);
        return ResponseEntity.ok(revenueList);
    }

    /**
     * Lấy doanh thu theo tháng
     * @param startMonth Tháng bắt đầu (định dạng yyyy-MM)
     * @param endMonth Tháng kết thúc (định dạng yyyy-MM)
     * @return Danh sách doanh thu theo tháng
     */
    @GetMapping("/revenue/month")
    public ResponseEntity<List<ThongKeDTO>> getRevenueByMonth(
        @RequestParam String startMonth,
        @RequestParam String endMonth) {
        
        YearMonth startYearMonth = YearMonth.parse(startMonth);
        YearMonth endYearMonth = YearMonth.parse(endMonth);
        
        List<ThongKeDTO> revenueList = hoaDonService.getRevenueByMonth(startYearMonth, endYearMonth);
        return ResponseEntity.ok(revenueList);
    }

    /**
     * Lấy doanh thu theo năm
     * @param startYear Năm bắt đầu
     * @param endYear Năm kết thúc
     * @return Danh sách doanh thu theo năm
     */
    @GetMapping("/revenue/year")
    public ResponseEntity<List<ThongKeDTO>> getRevenueByYear(
        @RequestParam Integer startYear,
        @RequestParam Integer endYear) {
        
        List<ThongKeDTO> revenueList = hoaDonService.getRevenueByYear(startYear, endYear);
        return ResponseEntity.ok(revenueList);
    }

    /**
     * Lấy danh sách hóa đơn đã hoàn thành trong khoảng thời gian
     * @param startDate Ngày bắt đầu
     * @param endDate Ngày kết thúc
     * @return Danh sách hóa đơn đã hoàn thành
     */
    @GetMapping("/completed")
    public ResponseEntity<List<HoaDon>> getCompletedInvoices(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<HoaDon> invoices = hoaDonService.getCompletedInvoices(startDate, endDate);
        return ResponseEntity.ok(invoices);
    }
}
