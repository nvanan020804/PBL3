INSERT INTO account (ten_dang_nhap, mat_khau, vai_tro) VALUES ('admin', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE ten_dang_nhap = ten_dang_nhap;