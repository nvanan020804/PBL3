package PBL3;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.sql.DataSource;

import java.sql.Connection;
import java.sql.SQLException;

@SpringBootApplication
public class Application implements CommandLineRunner {

    @Autowired
    private DataSource dataSource;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        testDatabaseConnection();
    }

    private void testDatabaseConnection() {
        try (Connection connection = dataSource.getConnection()) {
            System.out.println("Kết nối đến cơ sở dữ liệu thành công!");
        } catch (SQLException e) {
            System.out.println("Lỗi kết nối cơ sở dữ liệu: " + e.getMessage());
        }
    }
}
