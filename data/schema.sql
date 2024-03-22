CREATE SCHEMA `recetas_db`;

CREATE TABLE `recetas_db`.`recetas` (
	`id` int NOT NULL AUTO_INCREMENT,
	`nombre` varchar(255) NOT NULL,
	`ingredientes` varchar(1000) NOT NULL,
	`instrucciones` text(5000) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;