-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pbl3
-- ------------------------------------------------------
-- Server version	8.0.41

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
  `idACC` int NOT NULL AUTO_INCREMENT,
  `userACC` varchar(50) DEFAULT NULL,
  `passACC` varchar(100) DEFAULT NULL,
  `roleACC` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idACC`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'admin','newpass123','admin'),(2,'user','user123','user'),(3,'guest','guest123','guest');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dangky`
--

DROP TABLE IF EXISTS `dangky`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dangky` (
  `idDK` int NOT NULL AUTO_INCREMENT,
  `idGOI` int DEFAULT NULL,
  `idKH` int DEFAULT NULL,
  `dayDK` date DEFAULT NULL,
  `statusGOI` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idDK`),
  KEY `idGOI` (`idGOI`),
  KEY `idKH` (`idKH`),
  CONSTRAINT `dangky_ibfk_1` FOREIGN KEY (`idGOI`) REFERENCES `goidichvu` (`idGOI`),
  CONSTRAINT `dangky_ibfk_2` FOREIGN KEY (`idKH`) REFERENCES `khachhang` (`idKH`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dangky`
--

LOCK TABLES `dangky` WRITE;
/*!40000 ALTER TABLE `dangky` DISABLE KEYS */;
/*!40000 ALTER TABLE `dangky` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doanhthu`
--

DROP TABLE IF EXISTS `doanhthu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doanhthu` (
  `idDT` int NOT NULL AUTO_INCREMENT,
  `timeDT` date DEFAULT NULL,
  `chiphi` decimal(10,2) DEFAULT NULL,
  `doanhthu` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`idDT`)
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
  `nameGOI` varchar(100) DEFAULT NULL,
  `priceGOI` decimal(10,2) DEFAULT NULL,
  `aboutGOI` text,
  `timeGOI` time DEFAULT NULL,
  PRIMARY KEY (`idGOI`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goidichvu`
--

LOCK TABLES `goidichvu` WRITE;
/*!40000 ALTER TABLE `goidichvu` DISABLE KEYS */;
/*!40000 ALTER TABLE `goidichvu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoadon`
--

DROP TABLE IF EXISTS `hoadon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoadon` (
  `idHD` int NOT NULL AUTO_INCREMENT,
  `idNV` int DEFAULT NULL,
  `timeHD` datetime DEFAULT NULL,
  `statusHD` varchar(50) DEFAULT NULL,
  `idDK` int DEFAULT NULL,
  PRIMARY KEY (`idHD`),
  KEY `idNV` (`idNV`),
  KEY `idDK` (`idDK`),
  CONSTRAINT `hoadon_ibfk_1` FOREIGN KEY (`idNV`) REFERENCES `nhanvien` (`idNV`),
  CONSTRAINT `hoadon_ibfk_2` FOREIGN KEY (`idDK`) REFERENCES `dangky` (`idDK`)
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
  `idCT` int NOT NULL AUTO_INCREMENT,
  `idHD` int DEFAULT NULL,
  `idSP` int DEFAULT NULL,
  `idDK` int DEFAULT NULL,
  `soluongCT` int DEFAULT NULL,
  `priceCT` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`idCT`),
  KEY `idHD` (`idHD`),
  KEY `idSP` (`idSP`),
  KEY `idDK` (`idDK`),
  CONSTRAINT `hoadonchitiet_ibfk_1` FOREIGN KEY (`idHD`) REFERENCES `hoadon` (`idHD`),
  CONSTRAINT `hoadonchitiet_ibfk_2` FOREIGN KEY (`idSP`) REFERENCES `sanpham` (`idSP`),
  CONSTRAINT `hoadonchitiet_ibfk_3` FOREIGN KEY (`idDK`) REFERENCES `dangky` (`idDK`)
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
  `idKH` int NOT NULL AUTO_INCREMENT,
  `nameKH` varchar(100) DEFAULT NULL,
  `bdKH` date DEFAULT NULL,
  `sdtKH` varchar(15) DEFAULT NULL,
  `cccdKH` varchar(20) DEFAULT NULL,
  `emailKH` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idKH`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khachhang`
--

LOCK TABLES `khachhang` WRITE;
/*!40000 ALTER TABLE `khachhang` DISABLE KEYS */;
/*!40000 ALTER TABLE `khachhang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhanvien`
--

DROP TABLE IF EXISTS `nhanvien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhanvien` (
  `idNV` int NOT NULL AUTO_INCREMENT,
  `nameNV` varchar(100) DEFAULT NULL,
  `ageNV` int DEFAULT NULL,
  `sdtNV` varchar(15) DEFAULT NULL,
  `cccdNV` varchar(20) DEFAULT NULL,
  `emailNV` varchar(100) DEFAULT NULL,
  `vitriNV` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idNV`)
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
  `idDM` int NOT NULL AUTO_INCREMENT,
  `nameDM` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idDM`)
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
  `idSP` int NOT NULL AUTO_INCREMENT,
  `idDM` int DEFAULT NULL,
  `nameSP` varchar(100) DEFAULT NULL,
  `donviSP` varchar(50) DEFAULT NULL,
  `priceSP` decimal(10,2) DEFAULT NULL,
  `aboutSP` text,
  `soluongSP` int DEFAULT NULL,
  PRIMARY KEY (`idSP`),
  KEY `idDM` (`idDM`),
  CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`idDM`) REFERENCES `phanloaisanpham` (`idDM`)
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
  `idTB` int NOT NULL AUTO_INCREMENT,
  `nameTB` varchar(100) DEFAULT NULL,
  `aboutTB` text,
  `importTB` date DEFAULT NULL,
  `priceTB` decimal(10,2) DEFAULT NULL,
  `statusTB` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idTB`)
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

-- Dump completed on 2025-04-17  8:27:14
