-- MySQL dump 10.13  Distrib 5.7.21, for osx10.13 (x86_64)
--
-- Host: localhost    Database: test_db
-- ------------------------------------------------------
-- Server version	5.7.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `usersroles`
--

DROP TABLE IF EXISTS `usersroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usersroles` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`roleId`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `usersroles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usersroles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersroles`
--

LOCK TABLES `usersroles` WRITE;
/*!40000 ALTER TABLE `usersroles` DISABLE KEYS */;
INSERT INTO `usersroles` VALUES ('2019-04-05 11:10:00','2019-04-05 11:10:00',1,1),('2019-04-05 12:10:30','2019-04-05 12:10:30',1,2),('2019-04-05 12:10:36','2019-04-05 12:10:36',1,3),('2019-04-05 14:14:59','2019-04-05 14:14:59',2,1);
/*!40000 ALTER TABLE `usersroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `type` smallint(5) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'name1','Blue',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,1),(2,'name2','Blue',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,1),(3,'name3','Blue',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,1),(4,'name4','Blue',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,1),(5,'name5','Blue',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,1),(6,'name6','Blue',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,1),(7,'name7','Blue',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,1),(8,'name8','Blue',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,1),(9,'name9','Blue',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,1),(10,'name10','Blue',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,1),(11,'name11','Blue',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,0),(12,'name12','Blue',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,0),(13,'name13','Blue',2,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,0),(14,'name14','Blue',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',1,0),(15,'name15','Blue',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,0),(16,'name16','Blue',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,0),(17,'name17','Blue',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(18,'name18','Blue',2,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(19,'name19','Blue',2,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(20,'name20','Red',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(21,'name21','Red',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(22,'name22','Red',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(23,'name23','Red',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(24,'name24','Red',2,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(25,'name25','Red',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(26,'name26','Red',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(27,'name27','Red',2,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(28,'name28','Red',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(29,'name29','Red',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(30,'name30','Red',3,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(31,'name31','Red',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(32,'name32','Red',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(33,'name33','Yellow',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,1),(34,'name34','Red',1,'2019-04-05 13:52:02','2019-04-05 13:52:02',2,0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'aunthenticated','2019-04-05 11:09:42','2019-04-05 11:09:42'),(2,'member','2019-04-05 12:10:12','2019-04-05 12:10:12'),(3,'admin','2019-04-05 12:10:21','2019-04-05 12:10:21');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'jwebcoder@mymail.com','João Moura',NULL,'2019-04-05 11:10:00','2019-04-05 11:10:00'),(2,'joaogsleite@mymail.com','João Leite','$2a$10$kqh09pVk6oJoeo98h8qpAOZ962XSIfWkMxItlpxWxApUKkklMzfG6','2019-04-05 14:14:59','2019-04-05 14:16:14');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-14  0:37:00
