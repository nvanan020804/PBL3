-- MySQL dump 10.13  Distrib 8.0.41, for macos15 (arm64)
--
-- Host: localhost    Database: pbl3
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `mat_khau` varchar(255) DEFAULT NULL,
  `phan_quyen` varchar(255) DEFAULT NULL,
  `ten_dang_nhap` varchar(255) NOT NULL,
  `id_lien_ket` int DEFAULT NULL,
  PRIMARY KEY (`ten_dang_nhap`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('123','khachhang','an',1),('123','admin','bao',0),('123','nhanvien','nguyen',1);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dangky`
--

DROP TABLE IF EXISTS `dangky`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dangky` (
  `idDangKy` int NOT NULL AUTO_INCREMENT,
  `idGOI` int NOT NULL,
  `idKhachHang` int NOT NULL,
  `ngayBatDau` date NOT NULL,
  `trangThai` varchar(50) NOT NULL,
  PRIMARY KEY (`idDangKy`),
  KEY `idGOI` (`idGOI`),
  KEY `idKhachHang` (`idKhachHang`),
  CONSTRAINT `dangky_ibfk_1` FOREIGN KEY (`idGOI`) REFERENCES `goidichvu` (`idGOI`),
  CONSTRAINT `dangky_ibfk_2` FOREIGN KEY (`idKhachHang`) REFERENCES `khachhang` (`idKhachHang`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dangky`
--

LOCK TABLES `dangky` WRITE;
/*!40000 ALTER TABLE `dangky` DISABLE KEYS */;
INSERT INTO `dangky` VALUES (13,1,1,'2025-05-02','Đang hoạt động');
/*!40000 ALTER TABLE `dangky` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doanhthu`
--

DROP TABLE IF EXISTS `doanhthu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doanhthu` (
  `idDanhThu` int NOT NULL AUTO_INCREMENT,
  `thoiGian` varchar(20) NOT NULL,
  `tongChi` decimal(15,2) DEFAULT '0.00',
  `tongThu` decimal(15,2) DEFAULT '0.00',
  PRIMARY KEY (`idDanhThu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doanhthu`
--

LOCK TABLES `doanhthu` WRITE;
/*!40000 ALTER TABLE `doanhthu` DISABLE KEYS */;
/*!40000 ALTER TABLE `doanhthu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goidichvu`
--

DROP TABLE IF EXISTS `goidichvu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goidichvu` (
  `idGOI` int NOT NULL AUTO_INCREMENT,
  `nameGOI` varchar(100) NOT NULL,
  `priceGOI` decimal(10,2) NOT NULL,
  `aboutGOI` text,
  `timeGOI` int NOT NULL,
  PRIMARY KEY (`idGOI`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goidichvu`
--

LOCK TABLES `goidichvu` WRITE;
/*!40000 ALTER TABLE `goidichvu` DISABLE KEYS */;
INSERT INTO `goidichvu` VALUES (1,'goi 2',10000.00,'phai tren10kytu\n',1),(2,'goi 1',100000.00,'123456789123',1);
/*!40000 ALTER TABLE `goidichvu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoadon`
--

DROP TABLE IF EXISTS `hoadon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoadon` (
  `idHoaDon` int NOT NULL AUTO_INCREMENT,
  `idDangKy` int NOT NULL,
  `idNhanVien` int NOT NULL,
  `thoiGianTao` datetime NOT NULL,
  `trangThai` varchar(50) NOT NULL,
  PRIMARY KEY (`idHoaDon`),
  KEY `idDangKy` (`idDangKy`),
  KEY `idNhanVien` (`idNhanVien`),
  CONSTRAINT `hoadon_ibfk_1` FOREIGN KEY (`idDangKy`) REFERENCES `dangky` (`idDangKy`),
  CONSTRAINT `hoadon_ibfk_2` FOREIGN KEY (`idNhanVien`) REFERENCES `nhanvien` (`idNhanVien`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoadon`
--

LOCK TABLES `hoadon` WRITE;
/*!40000 ALTER TABLE `hoadon` DISABLE KEYS */;
/*!40000 ALTER TABLE `hoadon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoadonchitiet`
--

DROP TABLE IF EXISTS `hoadonchitiet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoadonchitiet` (
  `idHoaDonChiTiet` int NOT NULL AUTO_INCREMENT,
  `idHoaDon` int NOT NULL,
  `idSanPham` int NOT NULL,
  `soLuong` int NOT NULL,
  `gia` decimal(10,2) NOT NULL,
  PRIMARY KEY (`idHoaDonChiTiet`),
  KEY `idHoaDon` (`idHoaDon`),
  KEY `idSanPham` (`idSanPham`),
  CONSTRAINT `hoadonchitiet_ibfk_1` FOREIGN KEY (`idHoaDon`) REFERENCES `hoadon` (`idHoaDon`),
  CONSTRAINT `hoadonchitiet_ibfk_2` FOREIGN KEY (`idSanPham`) REFERENCES `sanpham` (`idSanPham`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoadonchitiet`
--

LOCK TABLES `hoadonchitiet` WRITE;
/*!40000 ALTER TABLE `hoadonchitiet` DISABLE KEYS */;
/*!40000 ALTER TABLE `hoadonchitiet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khachhang`
--

DROP TABLE IF EXISTS `khachhang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khachhang` (
  `idKhachHang` int NOT NULL AUTO_INCREMENT,
  `tenKhachHang` varchar(100) NOT NULL,
  `namSinh` year DEFAULT NULL,
  `soDienThoai` varchar(20) DEFAULT NULL,
  `cccd` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `gioTap` varchar(100) DEFAULT NULL,
  `trangThai` varchar(50) DEFAULT 'Chưa đăng ký',
  PRIMARY KEY (`idKhachHang`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khachhang`
--

LOCK TABLES `khachhang` WRITE;
/*!40000 ALTER TABLE `khachhang` DISABLE KEYS */;
INSERT INTO `khachhang` VALUES (1,'Nguyễn Văn An',2005,'123456789','123456789012','9102003@gmail.com','2','Đang sử dụng');
/*!40000 ALTER TABLE `khachhang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhanvien`
--

DROP TABLE IF EXISTS `nhanvien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhanvien` (
  `idNhanVien` int NOT NULL AUTO_INCREMENT,
  `tenNhanVien` varchar(100) NOT NULL,
  `tuoi` int DEFAULT NULL,
  `soDienThoai1` varchar(20) DEFAULT NULL,
  `cccd` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `viTri` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idNhanVien`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhanvien`
--

LOCK TABLES `nhanvien` WRITE;
/*!40000 ALTER TABLE `nhanvien` DISABLE KEYS */;
/*!40000 ALTER TABLE `nhanvien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phanloaisanpham`
--

DROP TABLE IF EXISTS `phanloaisanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phanloaisanpham` (
  `idDanhMuc` int NOT NULL AUTO_INCREMENT,
  `tenDanhMuc` varchar(100) NOT NULL,
  PRIMARY KEY (`idDanhMuc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phanloaisanpham`
--

LOCK TABLES `phanloaisanpham` WRITE;
/*!40000 ALTER TABLE `phanloaisanpham` DISABLE KEYS */;
/*!40000 ALTER TABLE `phanloaisanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sanpham`
--

DROP TABLE IF EXISTS `sanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sanpham` (
  `idSanPham` int NOT NULL AUTO_INCREMENT,
  `idDanhMuc` int NOT NULL,
  `tenSanPham` varchar(100) NOT NULL,
  `donViDem` varchar(50) DEFAULT NULL,
  `gia` decimal(10,2) NOT NULL,
  `congDung` text,
  `soLuong` int DEFAULT '0',
  PRIMARY KEY (`idSanPham`),
  KEY `idDanhMuc` (`idDanhMuc`),
  CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`idDanhMuc`) REFERENCES `phanloaisanpham` (`idDanhMuc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sanpham`
--

LOCK TABLES `sanpham` WRITE;
/*!40000 ALTER TABLE `sanpham` DISABLE KEYS */;
/*!40000 ALTER TABLE `sanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thietbi`
--

DROP TABLE IF EXISTS `thietbi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thietbi` (
  `idThietBi` int NOT NULL AUTO_INCREMENT,
  `tenThietBi` varchar(100) NOT NULL,
  `congDung` text,
  `ngayNhap` date DEFAULT NULL,
  `giaTien` decimal(10,2) DEFAULT NULL,
  `trangThai` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idThietBi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thietbi`
--

LOCK TABLES `thietbi` WRITE;
/*!40000 ALTER TABLE `thietbi` DISABLE KEYS */;
/*!40000 ALTER TABLE `thietbi` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-02 23:08:57
