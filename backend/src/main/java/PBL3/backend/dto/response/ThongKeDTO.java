package PBL3.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ThongKeDTO {
    private String period; // Thời gian (ngày/tháng/năm)
    private BigDecimal revenue; // Doanh thu
    private int invoiceCount; // Số lượng hóa đơn
    private BigDecimal averageRevenue; // Doanh thu trung bình

    // Constructors
    public ThongKeDTO() {
    }

    public ThongKeDTO(String period, BigDecimal revenue, int invoiceCount) {
        this.period = period;
        this.revenue = revenue;
        this.invoiceCount = invoiceCount;
        this.averageRevenue = invoiceCount > 0 
            ? revenue.divide(BigDecimal.valueOf(invoiceCount), 2, BigDecimal.ROUND_HALF_UP) 
            : BigDecimal.ZERO;
    }

    // Getters and Setters
    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public int getInvoiceCount() {
        return invoiceCount;
    }

    public void setInvoiceCount(int invoiceCount) {
        this.invoiceCount = invoiceCount;
        // Recalculate average
        this.averageRevenue = invoiceCount > 0 && revenue != null
            ? revenue.divide(BigDecimal.valueOf(invoiceCount), 2, BigDecimal.ROUND_HALF_UP)
            : BigDecimal.ZERO;
    }

    public BigDecimal getAverageRevenue() {
        return averageRevenue;
    }

    @Override
    public String toString() {
        return "ThongKeDTO{" +
                "period='" + period + '\'' +
                ", revenue=" + revenue +
                ", invoiceCount=" + invoiceCount +
                ", averageRevenue=" + averageRevenue +
                '}';
    }
}
