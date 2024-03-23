CREATE SCHEMA `usuarios_db`;

CREATE TABLE `usuarios_db`.`usuarios` (
	`id` int NOT NULL AUTO_INCREMENT,
	`email` varchar(255) UNIQUE NOT NULL,
	`nombre` varchar(255) NOT NULL,
    `password` varchar(45) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

COMMIT;