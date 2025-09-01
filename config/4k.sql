-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 30, 2025 at 08:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `4k`
--

-- --------------------------------------------------------

--
-- Table structure for table `4k_values`
--

CREATE TABLE `4k_values` (
  `image` varchar(200) NOT NULL,
  `description` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `4k_values`
--

INSERT INTO `4k_values` (`image`, `description`, `created_at`, `id`) VALUES
('1755593270444-WhatsApp Image 2025-08-18 at 17.27.05_48c65e64.jpg', 'balcas', '2025-08-19 08:47:50', 20);

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `access_code` int(7) NOT NULL,
  `is_locked` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `fname`, `lname`, `email`, `password`, `access_code`, `is_locked`) VALUES
(1, 'beastbit918@gmail.com', 'Honore', 'beastbit918@gmail.com', '$2b$10$4gHvbOPPwwXE7F.quKEiuOHf4Ki5ZM6qite7CfgxZ42gzjsIcHM3i', 11111, 0);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `cat` varchar(100) NOT NULL,
  `cat_id` int(11) NOT NULL,
  `id` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`cat`, `cat_id`, `id`) VALUES
('', 18, 'laptop'),
('', 20, 'network'),
('', 22, 'Software Developer'),
('', 24, 'UPS'),
('', 27, 'Go');

-- --------------------------------------------------------

--
-- Table structure for table `home`
--

CREATE TABLE `home` (
  `id` int(10) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `image` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `home`
--

INSERT INTO `home` (`id`, `title`, `description`, `image`, `created_at`) VALUES
(1, 'Kaspersky Internet Security - 5 GerÃ¤te _ 1 Jahr _ Only UK', 'antivirus', 'https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755761485/4k_vision/1755761483717-Kaspersky_Internet_Security_-_5_Ger%C3%A4te___1_Jahr___Only_UK.jpg', '2025-08-21 07:31:27'),
(2, 'Kaspersky Standard 1 User 1 Year', 'antivirus', 'https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755761486/4k_vision/1755761483718-Kaspersky_Standard_1_User_1_Year.jpg', '2025-08-21 07:31:27'),
(3, 'Softwares', 'antivirus', 'https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755761486/4k_vision/1755761483721-Softwares.jpg', '2025-08-21 07:31:27'),
(5, 'Kaspersky Standard 1 User 1 Year', 'antivirus', 'https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755761506/4k_vision/1755761504391-Kaspersky_Standard_1_User_1_Year.jpg', '2025-08-21 07:31:47'),
(6, 'Softwares', 'antivirus', 'https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755761506/4k_vision/1755761504393-Softwares.jpg', '2025-08-21 07:31:47'),
(7, 'Ezviz H8C 2MP CCTV Pan & Tilt Wifi IP Camera', 'go', 'https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755773611/4k_vision/1755773610265-Ezviz_H8C_2MP_CCTV_Pan_Tilt_Wifi_IP_Camera.jpg', '2025-08-21 10:53:33');

-- --------------------------------------------------------

--
-- Table structure for table `internship`
--

CREATE TABLE `internship` (
  `id` int(11) NOT NULL,
  `icon` varchar(200) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` varchar(200) NOT NULL,
  `requirement` varchar(240) NOT NULL,
  `duration` varchar(240) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `internship`
--

INSERT INTO `internship` (`id`, `icon`, `title`, `description`, `requirement`, `duration`, `created_at`) VALUES
(12, '1754587036653-1754586862506-1754586498355-com (4).jpeg', 'Software development', 'handleInternship', 'Tablet', '3', '2025-08-09 13:15:54');

-- --------------------------------------------------------

--
-- Table structure for table `mission`
--

CREATE TABLE `mission` (
  `image` varchar(200) NOT NULL,
  `description` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(11) NOT NULL,
  `title_of_section` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mission`
--

INSERT INTO `mission` (`image`, `description`, `created_at`, `id`, `title_of_section`) VALUES
('https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755700290/4k_vision/1755700290480-Handbag.jpg', 'Try', '2025-08-20 14:31:31', 30, 'Handbag'),
('https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755700721/4k_vision/1755700703518-Home_Smart_Wifi_Camera.jpg', 'Mission', '2025-08-20 14:38:42', 31, 'Home Smart Wifi Camera'),
('https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755700730/4k_vision/1755700727884-Handbag.jpg', 'hahha', '2025-08-20 14:38:50', 33, 'Handbag');

-- --------------------------------------------------------

--
-- Table structure for table `partner`
--

CREATE TABLE `partner` (
  `id` int(11) NOT NULL,
  `image` varchar(200) NOT NULL,
  `title_name` varchar(200) NOT NULL,
  `description` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `partner`
--

INSERT INTO `partner` (`id`, `image`, `title_name`, `description`) VALUES
(18, 'Kaspersky Standard 1 User 1 Year', 'go', 'https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755773643/4k_vision/1755773642678-Kaspersky_Standard_1_User_1_Year.jpg'),
(19, 'Softwares', 'go', 'https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755773845/4k_vision/1755773844254-Softwares.jpg'),
(20, 'Softwares', 'go', 'https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755773846/4k_vision/1755773845674-Softwares.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `ID` int(11) NOT NULL,
  `image` varchar(200) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(200) NOT NULL,
  `price` int(200) NOT NULL,
  `features` varchar(200) NOT NULL,
  `style` varchar(200) NOT NULL,
  `quantity` int(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_related`
--

CREATE TABLE `product_related` (
  `ID` int(11) NOT NULL,
  `image` varchar(200) NOT NULL,
  `p_name` varchar(200) NOT NULL,
  `p_price` varchar(200) NOT NULL,
  `category` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `showcase`
--

CREATE TABLE `showcase` (
  `date` varchar(200) NOT NULL,
  `image` varchar(200) NOT NULL,
  `description` varchar(200) NOT NULL,
  `title` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `showcase`
--

INSERT INTO `showcase` (`date`, `image`, `description`, `title`, `created_at`, `id`) VALUES
('', 'Handbag', 'https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755762416/4k_vision/1755762413308-Handbag.jpg', 'handbag', '2025-08-21 07:46:57', 5),
('', 'Handbag', 'https://res.cloudinary.com/dzdnjq2nx/image/upload/v1755762418/4k_vision/1755762414769-Handbag.jpg', 'handbag', '2025-08-21 07:46:58', 6);

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `id` int(11) NOT NULL,
  `image` varchar(200) NOT NULL,
  `team_member` varchar(200) NOT NULL,
  `role` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`id`, `image`, `team_member`, `role`) VALUES
(3, '1754885442227-1754624991326-com (6).jpeg', '1754624991326-com (6)', 'UI/UX Designers'),
(4, '1754885442228-1754624991326-com (7).jpeg', '1754624991326-com (7)', 'UI/UX Designer'),
(5, '1754885442233-1754625060676-1754624086214-1754587036742-1754586862573-cam (2).jpeg', '1754625060676-1754624086214-1754587036742-1754586862573-cam (2)', 'UI/UX Designer'),
(6, '1754885442234-1754625060676-1754624086215-1754587217454-1754584287902-com (8).jpeg', '1754625060676-1754624086215-1754587217454-1754584287902-com (8)', 'UI/UX Designer'),
(7, '1754885442250-1754625060676-1754624086215-1754587217457-1754585967230-com (21).jpeg', '1754625060676-1754624086215-1754587217457-1754585967230-com (21)', 'UI/UX Designer'),
(8, '1754890343631-1754587217454-1754584287902-com (8).jpeg', '1754587217454-1754584287902-com (8)', 'Technicians');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `4k_values`
--
ALTER TABLE `4k_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`cat_id`);

--
-- Indexes for table `home`
--
ALTER TABLE `home`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `internship`
--
ALTER TABLE `internship`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mission`
--
ALTER TABLE `mission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `partner`
--
ALTER TABLE `partner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `product_related`
--
ALTER TABLE `product_related`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `showcase`
--
ALTER TABLE `showcase`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `4k_values`
--
ALTER TABLE `4k_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `home`
--
ALTER TABLE `home`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `internship`
--
ALTER TABLE `internship`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `mission`
--
ALTER TABLE `mission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `partner`
--
ALTER TABLE `partner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_related`
--
ALTER TABLE `product_related`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `showcase`
--
ALTER TABLE `showcase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
