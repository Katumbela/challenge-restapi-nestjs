-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 24-Jul-2024 às 13:40
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `restapi-bulir`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `service`
--

CREATE TABLE `service` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `providerId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `service`
--

INSERT INTO `service` (`id`, `title`, `description`, `price`, `providerId`) VALUES
(1, 'Desenvolvimento Web', 'Updated cleaning service description', 120.00, 1),
(2, 'Desenvolvimento Web 2', 'Criação de sites e aplicações web.', 82550.00, 3);

-- --------------------------------------------------------

--
-- Estrutura da tabela `transaction`
--

CREATE TABLE `transaction` (
  `id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` datetime NOT NULL,
  `clientId` int(11) DEFAULT NULL,
  `providerId` int(11) DEFAULT NULL,
  `serviceId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `transaction`
--

INSERT INTO `transaction` (`id`, `amount`, `date`, `clientId`, `providerId`, `serviceId`) VALUES
(1, 82550.00, '2024-07-24 11:51:55', 1, 1, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `nif` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userType` varchar(255) NOT NULL,
  `balance` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `user`
--

INSERT INTO `user` (`id`, `fullName`, `nif`, `email`, `password`, `userType`, `balance`) VALUES
(1, 'João Katombela', '123456789', 'joao.silva@example.com', '$2a$10$7aDmzXVrHMjYetjrhBlEOu7uhoNvwppnz52LTzH6S0MHJK1mjdw7u', 'client', 400000),
(3, 'Afonso Katombela', '1234567819', 'joao.katombela@example.com', '$2a$10$EpMizh0dB50mVqNhCFPWpej8hm0fwiKoLe9.hIoKSLr9PidKa6z6K', 'provider', 600025);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_b05f15e928a4b35bd4b3426aa5c` (`providerId`);

--
-- Índices para tabela `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_b01db6b3e203945a6bd5fc5797b` (`clientId`),
  ADD KEY `FK_e2fa3946721d92813dee94c8f5f` (`providerId`),
  ADD KEY `FK_1dfc78e97a27c758a5696343719` (`serviceId`);

--
-- Índices para tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e4d0cd2667617487ca40efb8c1` (`nif`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `service`
--
ALTER TABLE `service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `service`
--
ALTER TABLE `service`
  ADD CONSTRAINT `FK_b05f15e928a4b35bd4b3426aa5c` FOREIGN KEY (`providerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `FK_1dfc78e97a27c758a5696343719` FOREIGN KEY (`serviceId`) REFERENCES `service` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_b01db6b3e203945a6bd5fc5797b` FOREIGN KEY (`clientId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_e2fa3946721d92813dee94c8f5f` FOREIGN KEY (`providerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
