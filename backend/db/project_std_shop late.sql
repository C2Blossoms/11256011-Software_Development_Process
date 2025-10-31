-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 19, 2025 at 09:47 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Table structure for table `pma__bookmark`
--

DROP TABLE IF EXISTS `pma__bookmark`;
CREATE TABLE `pma__bookmark` (
  `id` int(11) NOT NULL,
  `dbase` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `user` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `query` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bookmarks';
-- --------------------------------------------------------

--
-- Table structure for table `pma__central_columns`
--

DROP TABLE IF EXISTS `pma__central_columns`;
CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `col_name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `col_type` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `col_length` text COLLATE utf8mb4_bin,
  `col_collation` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) COLLATE utf8mb4_bin DEFAULT '',
  `col_default` text COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Central list of columns';
-- --------------------------------------------------------

--
-- Table structure for table `pma__column_info`
--

DROP TABLE IF EXISTS `pma__column_info`;
CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `table_name` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `column_name` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
  `transformation` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `transformation_options` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `input_transformation` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Column information for phpMyAdmin';
-- --------------------------------------------------------

--
-- Table structure for table `pma__designer_settings`
--

DROP TABLE IF EXISTS `pma__designer_settings`;
CREATE TABLE `pma__designer_settings` (
  `username` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `settings_data` text COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Settings related to Designer';

-- --------------------------------------------------------

--
-- Table structure for table `pma__export_templates`
--

DROP TABLE IF EXISTS `pma__export_templates`;
CREATE TABLE `pma__export_templates` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `export_type` varchar(10) COLLATE utf8mb4_bin NOT NULL,
  `template_name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `template_data` text COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Saved export templates';
-- --------------------------------------------------------

--
-- Table structure for table `pma__favorite`
--

DROP TABLE IF EXISTS `pma__favorite`;
CREATE TABLE `pma__favorite` (
  `username` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `tables` text COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Favorite tables';

--
-- Table structure for table `pma__history`
--

DROP TABLE IF EXISTS `pma__history`;
CREATE TABLE `pma__history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `db` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `table` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `timevalue` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sqlquery` text COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `username` (`username`,`db`,`table`,`timevalue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='SQL history for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__navigationhiding`
--

DROP TABLE IF EXISTS `pma__navigationhiding`;
CREATE TABLE `pma__navigationhiding` (
  `username` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `item_name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `item_type` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `db_name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `table_name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Hidden items of navigation tree';

--
-- Dumping data for table `pma__navigationhiding`
--

INSERT INTO `pma__navigationhiding` (`username`, `item_name`, `item_type`, `db_name`, `table_name`) VALUES
('root', 'tbl_type', 'table', 'project_std_shop', '');

-- --------------------------------------------------------

--
-- Table structure for table `pma__pdf_pages`
--

DROP TABLE IF EXISTS `pma__pdf_pages`;
CREATE TABLE `pma__pdf_pages` (
  `db_name` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `page_descr` varchar(50) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
  PRIMARY KEY (`page_nr`),
  KEY `db_name` (`db_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='PDF relation pages for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__recent`
--

DROP TABLE IF EXISTS `pma__recent`;
CREATE TABLE `pma__recent` (
  `username` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `tables` text COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Recently accessed tables';
--
-- Dumping data for table `pma__recent`
--

INSERT INTO `pma__recent` (`username`, `tables`) VALUES
('root', '[{\"db\":\"project_std_shop\",\"table\":\"tbl_product\"},{\"db\":\"project_std_shop\",\"table\":\"tbl_order_detail\"},{\"db\":\"project_std_shop\",\"table\":\"tbl_order\"},{\"db\":\"project_std_shop\",\"table\":\"tbl_member\"},{\"db\":\"project_std_shop\",\"table\":\"tbl_news\"},{\"db\":\"project_std_shop\",\"table\":\"tbl_bank\"},{\"db\":\"project_std_shop\",\"table\":\"tbl_admin\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `pma__relation`
--

DROP TABLE IF EXISTS `pma__relation`;
CREATE TABLE `pma__relation` (
  `master_db` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `master_table` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `master_field` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `foreign_db` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `foreign_table` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `foreign_field` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  KEY `foreign_field` (`foreign_db`,`foreign_table`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Relation table';
-- --------------------------------------------------------

--
-- Table structure for table `pma__savedsearches`
--

DROP TABLE IF EXISTS `pma__savedsearches`;
CREATE TABLE `pma__savedsearches` (
  `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `db_name` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `search_name` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `search_data` text COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Saved searches';
-- --------------------------------------------------------

--
-- Table structure for table `pma__table_coords`
--

DROP TABLE IF EXISTS `pma__table_coords`;
CREATE TABLE `pma__table_coords` (
  `db_name` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `table_name` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `pdf_page_number` int(11) NOT NULL DEFAULT '0',
  `x` float UNSIGNED NOT NULL DEFAULT '0',
  `y` float UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Table coordinates for phpMyAdmin PDF output';

--
-- Table structure for table `pma__table_info`
--

DROP TABLE IF EXISTS `pma__table_info`;
CREATE TABLE `pma__table_info` (
  `db_name` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `table_name` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `display_field` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`db_name`,`table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Table information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_uiprefs`
--

DROP TABLE IF EXISTS `pma__table_uiprefs`;
CREATE TABLE `pma__table_uiprefs` (
  `username` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `db_name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `table_name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `prefs` text COLLATE utf8mb4_bin NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`,`db_name`,`table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Tables'' UI preferences';

-- --------------------------------------------------------

--
-- Table structure for table `pma__tracking`
--

DROP TABLE IF EXISTS `pma__tracking`;
CREATE TABLE `pma__tracking` (
  `db_name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `table_name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `version` int(10) UNSIGNED NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `schema_snapshot` text COLLATE utf8mb4_bin NOT NULL,
  `schema_sql` text COLLATE utf8mb4_bin,
  `data_sql` longtext COLLATE utf8mb4_bin,
  `tracking` set('UPDATE','REPLACE','INSERT','DELETE','TRUNCATE','CREATE DATABASE','ALTER DATABASE','DROP DATABASE','CREATE TABLE','ALTER TABLE','RENAME TABLE','DROP TABLE','CREATE INDEX','DROP INDEX','CREATE VIEW','ALTER VIEW','DROP VIEW') COLLATE utf8mb4_bin DEFAULT NULL,
  `tracking_active` int(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`db_name`,`table_name`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='Database changes tracking for phpMyAdmin';
-- --------------------------------------------------------

--
-- Table structure for table `pma__userconfig`
--

DROP TABLE IF EXISTS `pma__userconfig`;
CREATE TABLE `pma__userconfig` (
  `username` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `timevalue` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `config_data` text COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='User preferences storage for phpMyAdmin';

--
-- Dumping data for table `pma__userconfig`
--

INSERT INTO `pma__userconfig` (`username`, `timevalue`, `config_data`) VALUES
('root', '2025-09-19 07:46:45', '{\"Console\\/Mode\":\"collapse\",\"ThemeDefault\":\"pmahomme\"}');

-- --------------------------------------------------------

--
-- Table structure for table `pma__usergroups`
--

DROP TABLE IF EXISTS `pma__usergroups`;
CREATE TABLE `pma__usergroups` (
  `usergroup` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `tab` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `allowed` enum('Y','N') COLLATE utf8mb4_bin NOT NULL DEFAULT 'N',
  PRIMARY KEY (`usergroup`,`tab`,`allowed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='User groups with configured menu items';
-- --------------------------------------------------------

--
-- Table structure for table `pma__users`
--

CREATE TABLE `pma__users` (
  `username` varchar(64) COLLATE utf8_bin NOT NULL,
  `usergroup` varchar(64) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and their assignments to user groups';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pma__central_columns`
--
ALTER TABLE `pma__central_columns`
  ADD PRIMARY KEY (`db_name`,`col_name`);

--
-- Indexes for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`);

--
-- Indexes for table `pma__designer_settings`
--
ALTER TABLE `pma__designer_settings`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`);

--
-- Indexes for table `pma__favorite`
--
ALTER TABLE `pma__favorite`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__history`
--
ALTER TABLE `pma__history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`,`db`,`table`,`timevalue`);

--
-- Indexes for table `pma__navigationhiding`
--
ALTER TABLE `pma__navigationhiding`
  ADD PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`);

--
-- Indexes for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  ADD PRIMARY KEY (`page_nr`),
  ADD KEY `db_name` (`db_name`);

--
-- Indexes for table `pma__recent`
--
ALTER TABLE `pma__recent`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__relation`
--
ALTER TABLE `pma__relation`
  ADD PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  ADD KEY `foreign_field` (`foreign_db`,`foreign_table`);

--
-- Indexes for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`);

--
-- Indexes for table `pma__table_coords`
--
ALTER TABLE `pma__table_coords`
  ADD PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`);

--
-- Indexes for table `pma__table_info`
--
ALTER TABLE `pma__table_info`
  ADD PRIMARY KEY (`db_name`,`table_name`);

--
-- Indexes for table `pma__table_uiprefs`
--
ALTER TABLE `pma__table_uiprefs`
  ADD PRIMARY KEY (`username`,`db_name`,`table_name`);

--
-- Indexes for table `pma__tracking`
--
ALTER TABLE `pma__tracking`
  ADD PRIMARY KEY (`db_name`,`table_name`,`version`);

--
-- Indexes for table `pma__userconfig`
--
ALTER TABLE `pma__userconfig`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__usergroups`
--
ALTER TABLE `pma__usergroups`
  ADD PRIMARY KEY (`usergroup`,`tab`,`allowed`);

--
-- Indexes for table `pma__users`
--
ALTER TABLE `pma__users`
  ADD PRIMARY KEY (`username`,`usergroup`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__history`
--
ALTER TABLE `pma__history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  MODIFY `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Database: `project_std_shop`
--
CREATE DATABASE IF NOT EXISTS `project_std_shop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `project_std_shop`;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_admin`
--

CREATE TABLE `tbl_admin` (
  `admin_id` int(11) NOT NULL,
  `admin_user` varchar(20) NOT NULL,
  `admin_pass` varchar(20) NOT NULL,
  `admin_name` varchar(100) NOT NULL,
  `date_save` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_admin`
--

INSERT INTO `tbl_admin` (`admin_id`, `admin_user`, `admin_pass`, `admin_name`, `date_save`) VALUES
(1, '1', '1', 'admin', '2017-08-30 01:57:41'),
(3, 'shadow', '0918206741', 'kittaphat', '2025-09-05 09:16:39'),
(4, 'james', '11111', 'alalal', '2025-09-09 06:27:36');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_bank`
--

CREATE TABLE `tbl_bank` (
  `b_id` int(11) NOT NULL,
  `b_name` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `b_type` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `b_number` varchar(20) NOT NULL,
  `b_owner` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `b_logo` varchar(100) NOT NULL,
  `bn_name` varchar(100) CHARACTER SET utf8mb4 NOT NULL COMMENT 'ชื่อสาขา',
  `b_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='bank';

--
-- Dumping data for table `tbl_bank`
--

INSERT INTO `tbl_bank` (`b_id`, `b_name`, `b_type`, `b_number`, `b_owner`, `b_logo`, `bn_name`, `b_date`) VALUES
(3, 'KBANK', 'ออมทรัพย์', '1618445441', 'นายกฤตพัฒน์ ยืดยาว', 'imgb48550331320250909_163406.jpg', 'Bangkok', '2017-08-30 11:53:59'),
(5, 'KBANK', 'ออมทรัพย์', '43213422342', 'สุดหล่อ2', 'imgb158414898420180125_111725.jpg', 'สุดหล่อ2', '2018-01-25 04:17:25'),
(4, 'SCB', 'ออมทรัพย์', '1581223265', 'สุดหล่อ', 'imgb89969485620180125_105814.jpg', 'สุดหล่อ', '2017-08-30 11:54:06');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_member`
--

CREATE TABLE `tbl_member` (
  `mem_id` int(8) NOT NULL,
  `mem_name` varchar(50) NOT NULL,
  `mem_address` varchar(255) NOT NULL,
  `mem_tel` varchar(10) NOT NULL,
  `mem_username` varchar(20) NOT NULL,
  `mem_password` varchar(20) NOT NULL,
  `mem_email` varchar(20) NOT NULL,
  `dateinsert` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_member`
--

INSERT INTO `tbl_member` (`mem_id`, `mem_name`, `mem_address`, `mem_tel`, `mem_username`, `mem_password`, `mem_email`, `dateinsert`) VALUES
(1, 'testssss', 'bangkok', '345325423', '2', '2', 'a@g', '2017-08-30 03:21:43'),
(2, 'mr 999 555', 'thailand  555', '0948616709', '99', '99', 'devbanban@gmail.com', '2018-01-25 04:07:34'),
(3, 'mr 777', 'thailand ', '0948616709', '77', '77', 'devbanban2@gmail.com', '2018-01-25 04:13:45'),
(4, 'กฤตพัฒน์  ยืดยาว', '112/555  ดวงจันทร์', '0918206741', 'gadow', '0918206741', 'gadow25979@gmail.com', '2025-09-05 09:23:11'),
(5, 'กฤตพัฒน์  ยืดยาว', '112/25 ต.มะขามเตี้ย อ.เมืองสุราษฎร์ธานี จ.สุราษฎร์ธานี 84000', '0918206741', 'shadow', '0918206741', 'gadow25979@gmail.com', '2025-09-09 08:53:23');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_news`
--

CREATE TABLE `tbl_news` (
  `n_id` int(11) NOT NULL,
  `n_title` varchar(200) NOT NULL,
  `n_detail` text NOT NULL,
  `n_img` varchar(100) NOT NULL,
  `date_save` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--
-- Dumping data for table `tbl_news`
--

INSERT INTO `tbl_news` (`n_id`, `n_title`, `n_detail`, `n_img`, `date_save`) VALUES
(1, '  //Set ว/ด/ป เวลา ให้เป็นของประเทศไทย ', '<p>111</p>\r\n\r\n<p>error_reporting( error_reporting() &amp; ~E_NOTICE );<br />\r\n&nbsp;<br />\r\n&nbsp;//Set ว/ด/ป เวลา ให้เป็นของประเทศไทย<br />\r\n&nbsp; &nbsp; date_default_timezone_set(&#39;Asia/Bangkok&#39;);<br />\r\n&nbsp;&nbsp; &nbsp;//สร้างตัวแปรวันที่เพื่อเอาไปตั้งชื่อไฟล์ที่อัพโหลด<br />\r\n&nbsp;&nbsp; &nbsp;$date1 = date(&quot;Ymd_His&quot;);<br />\r\n&nbsp;&nbsp; &nbsp;//สร้างตัวแปรสุ่มตัวเลขเพื่อเอาไปตั้งชื่อไฟล์ที่อัพโหลดไม่ให้ชื่อไฟล์ซ้ำกัน<br />\r\n&nbsp;&nbsp; &nbsp;$numrand = (mt_rand());</p>\r\n', 'imgn171694429820170830_101819.jpg', '2017-08-30 03:08:43'),
(2, 'asfdsadfsa', '<p>fsadfsadfasfdsafdsa</p>\r\n', 'imgn25458224820170830_101829.jpg', '2017-08-30 03:18:29');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_order`
--

CREATE TABLE `tbl_order` (
  `order_id` int(10) UNSIGNED ZEROFILL NOT NULL,
  `mem_id` int(11) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `address` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  `order_status` int(1) NOT NULL,
  `pay_slip` varchar(200) CHARACTER SET utf8mb4 DEFAULT NULL,
  `b_name` varchar(100) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT 'ชื่อธนาคาร',
  `b_number` varchar(20) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT 'เลข บัญชี',
  `pay_date` date DEFAULT NULL,
  `pay_amount` float(10,2) DEFAULT NULL,
  `postcode` varchar(30) CHARACTER SET utf8mb4 DEFAULT NULL,
  `order_date` datetime NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--
-- Dumping data for table `tbl_order`
--

INSERT INTO `tbl_order` (`order_id`, `mem_id`, `name`, `address`, `email`, `phone`, `order_status`, `pay_slip`, `b_name`, `b_number`, `pay_date`, `pay_amount`, `postcode`, `order_date`) VALUES
(0000000001, 1, 'eee', '523523', 'a@g', '345325423', 3, '181871346620170831_092437.jpg', '666666666666666666', '66666666666666666666', '2017-08-31', 6666.00, '444444444444', '2017-08-30 19:40:52'),
(0000000002, 1, 'eee', '523523', 'a@g', '345325423', 3, '179007879420170831_090051.jpg', 'asfasf', '213141243', '2017-08-31', 333.00, '333fsfasfas', '2017-08-31 08:20:27'),
(0000000003, 1, 'eee', '523523', 'a@g', '345325423', 3, '154597276020170831_090123.jpg', '666666666666666666', '66666666666666666666', '2017-08-31', 5555.00, 'sa4321123431', '2017-08-31 09:01:14'),
(0000000004, 1, 'eee', '523523', 'a@g', '345325423', 1, '', '', '', '0000-00-00', 0.00, '', '2017-08-31 09:55:28'),
(0000000005, 1, 'eee', '523523', 'a@g', '345325423', 1, '', '', '', '0000-00-00', 0.00, '', '2017-12-06 22:46:47'),
(0000000006, 1, 'eee', '523523', 'a@g', '345325423', 2, '61523041620171206_224837.jpg', '666666666666666666', '66666666666666666666', '2017-12-06', 16666.00, '', '2017-12-06 22:48:14'),
(0000000007, 1, 'test', 'bangkok', 'a@g', '345325423', 1, '', '', '', '0000-00-00', 0.00, '', '2017-12-20 11:33:25'),
(0000000008, 1, 'test', 'bangkok', 'a@g', '345325423', 2, '200645685120180125_105300.jpg', 'KTB', '9999999999', '2018-01-25', 333.00, '', '2018-01-25 10:51:49'),
(0000000009, 1, 'test', 'bangkok', 'a@g', '345325423', 3, '104661032820180125_105642.jpg', 'KTB', '9999999999', '2018-01-25', 223.00, 'TH 23421412421', '2018-01-25 10:55:22'),
(0000000010, 2, 'mr 999', 'thailand', 'devbanban@gmail.com', '0948616709', 3, '116435885920180125_110903.jpg', 'KTB', '9999999999', '2018-01-30', 1356.00, 'TH 44444 44444', '2018-01-25 11:08:09'),
(0000000011, 2, 'mr 999 555', 'thailand  555', 'devbanban@gmail.com', '0948616709', 1, '', '', '', '0000-00-00', 0.00, '', '2018-01-25 11:10:08'),
(0000000012, 1, 'testssss', 'bangkok', 'a@g', '345325423', 2, '31829218920180618_131241.jpg', 'KTB', '9999999999', '2018-06-18', 11111.00, '', '2018-06-18 13:12:27'),
(0000000013, 1, 'testssss', 'bangkok', 'a@g', '345325423', 2, '143753997120180618_131334.jpg', 'KTB', '9999999999', '2018-06-18', 111.00, '', '2018-06-18 13:13:26'),
(0000000014, 0, 'fsf', 'sfsf', '66200166@gmail.com', 'sfs', 1, '', '', '', '0000-00-00', 0.00, '', '2025-09-09 15:09:02'),
(0000000015, 0, 'asda', 'sdas', 'gadow25979@gmail.com', 'adad', 2, '15654739620250909_155225.jpg', 'KTB', '9999999999', '2025-09-09', 5555.00, '', '2025-09-09 15:51:55'),
(0000000016, 5, 'กฤตพัฒน์  ยืดยาว', '112', 'gadow25979@gmail.com', '0918206741', 2, '135037992620250909_155359.jpg', 'KTB', '9999999999', '2025-09-09', 1746.00, '', '2025-09-09 15:53:32'),
(0000000017, 5, 'กฤตพัฒน์  ยืดยาว', '112', 'gadow25979@gmail.com', '0918206741', 1, '', '', '', '0000-00-00', 0.00, '', '2025-09-09 16:34:19'),
(0000000018, 5, 'กฤตพัฒน์  ยืดยาว', '112', 'gadow25979@gmail.com', '0918206741', 1, '', '', '', '0000-00-00', 0.00, '', '2025-09-11 11:52:16'),
(0000000019, 5, 'กฤตพัฒน์  ยืดยาว', '112', 'gadow25979@gmail.com', '0918206741', 2, '110354401920250911_133903.jpg', 'KBANK', '1618445441', '2025-09-11', 1000.00, '', '2025-09-11 13:38:48'),
(0000000020, 6, '55555', '5555555555', '66200033@kmitl.ac.th', '5555555555', 2, '149723140320250911_171416.jpg', 'KBANK', '1618445441', '2025-09-11', 2588.00, '', '2025-09-11 17:13:45'),
(0000000021, 5, 'กฤตพัฒน์  ยืดยาว', '112/25 ต.มะขามเตี้ย อ.เมืองสุราษฎร์ธานี จ.สุราษฎร์ธานี 84000', 'gadow25979@gmail.com', '0918206741', 3, '191769019320250917_003352.jpg', 'KBANK', '1618445441', '2025-09-17', 2000.00, '951145424fgjk', '2025-09-17 00:32:57'),
(0000000022, 5, 'กฤตพัฒน์  ยืดยาว', '112/25 ต.มะขามเตี้ย อ.เมืองสุราษฎร์ธานี จ.สุราษฎร์ธานี 84000', 'gadow25979@gmail.com', '0918206741', 3, '1281357620250917_105104.jpg', 'KBANK', '1618445441', '2025-09-17', 2071.00, '951145424fgjk', '2025-09-17 10:50:36'),
(0000000023, 5, 'กฤตพัฒน์  ยืดยาว', '112/25 ต.มะขามเตี้ย อ.เมืองสุราษฎร์ธานี จ.สุราษฎร์ธานี 84000', 'gadow25979@gmail.com', '0918206741', 1, '', '', '', '0000-00-00', 0.00, '', '2025-09-17 11:44:34'),
(0000000024, 5, 'กฤตพัฒน์  ยืดยาว', '112/25 ต.มะขามเตี้ย อ.เมืองสุราษฎร์ธานี จ.สุราษฎร์ธานี 84000', 'gadow25979@gmail.com', '0918206741', 1, '', '', '', '0000-00-00', 0.00, '', '2025-09-17 14:06:25');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_order_detail`
--

CREATE TABLE `tbl_order_detail` (
  `d_id` int(10) NOT NULL,
  `order_id` int(11) NOT NULL,
  `p_id` int(11) NOT NULL,
  `p_name` varchar(200) CHARACTER SET utf8mb4 DEFAULT NULL,
  `p_c_qty` int(11) NOT NULL,
  `total` float NOT NULL,
  PRIMARY KEY (`d_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_order_detail`
--

INSERT INTO `tbl_order_detail` (`d_id`, `order_id`, `p_id`, `p_name`, `p_c_qty`, `total`) VALUES
(1, 1, 1, 'REAL WHEY PROTEIN 5 lb Rich Chocolate', 1, 223),
(2, 1, 5, 'WHEY PROTEIN Thai Tea  ', 1, 333),
(3, 1, 2, 'ISO - PRO 5 lb Rich Chocolate', 1, 1111),
(4, 1, 4, 'MY WHEY MAX 5 lb (Baki) Rich Chocolate ', 1, 22),
(5, 2, 2, 'ISO - PRO 5 lb Rich Chocolate', 1, 1111),
(6, 3, 1, 'REAL WHEY PROTEIN 5 lb Rich Chocolate', 1, 223),
(7, 3, 5, 'WHEY PROTEIN Thai Tea  ', 1, 333),
(8, 4, 4, 'MY WHEY MAX 5 lb (Baki) Rich Chocolate ', 3, 66),
(9, 5, 1, 'REAL WHEY PROTEIN 5 lb Rich Chocolate', 1, 223),
(10, 5, 4, 'MY WHEY MAX 5 lb (Baki) Rich Chocolate ', 1, 22),
(11, 6, 1, 'REAL WHEY PROTEIN 5 lb Rich Chocolate', 1, 223),
(12, 6, 2, 'ISO - PRO 5 lb Rich Chocolate', 1, 1111),
(13, 6, 5, 'WHEY PROTEIN Thai Tea  ', 1, 333),
(14, 7, 2, 'ISO - PRO 5 lb Rich Chocolate', 1, 1111),
(15, 7, 4, 'MY WHEY MAX 5 lb (Baki) Rich Chocolate ', 1, 22),
(16, 8, 5, 'WHEY PROTEIN Thai Tea  ', 1, 333),
(17, 9, 1, 'REAL WHEY PROTEIN 5 lb Rich Chocolate', 1, 223),
(19, 10, 2, 'ISO - PRO 5 lb Rich Chocolate', 1, 1111),
(18, 10, 1, 'REAL WHEY PROTEIN 5 lb Rich Chocolate', 1, 223),
(20, 10, 4, 'MY WHEY MAX 5 lb (Baki) Rich Chocolate ', 1, 22),
(21, 11, 5, 'WHEY PROTEIN Thai Tea  ', 5, 1665),
(22, 12, 15, 'OMA Fitness รุ่น OMA-7746EA ', 1, 500000),
(23, 12, 1, 'REAL WHEY PROTEIN 5 lb Rich Chocolate', 1, 223),
(24, 12, 5, 'WHEY PROTEIN Thai Tea  ', 1, 333),
(25, 12, 6, 'ISO ABSOLUTE ZERO Chocolate', 1, 223),
(26, 13, 4, 'MY WHEY MAX 5 lb (Baki) Rich Chocolate ', 1, 22),
(27, 14, 1, 'REAL WHEY PROTEIN 5 lb Rich Chocolate', 2, 4142),
(30, 15, 2, 'ISO - PRO 5 lb Rich Chocolate', 1, 2588),
(28, 14, 2, 'ISO - PRO 5 lb Rich Chocolate', 1, 2588),
(29, 15, 4, 'MY WHEY MAX 5 lb (Baki) Rich Chocolate ', 1, 1746),
(31, 15, 1, 'REAL WHEY PROTEIN 5 lb Rich Chocolate', 1, 2071),
(32, 16, 4, 'MY WHEY MAX 5 lb (Baki) Rich Chocolate ', 1, 1746),
(33, 17, 6, 'ISO ABSOLUTE ZERO Chocolate', 1, 2588),
(34, 17, 2, 'ISO - PRO 5 lb Rich Chocolate', 1, 2588),
(35, 18, 1, 'REAL WHEY PROTEIN 5 lb Rich Chocolate', 1, 2071),
(36, 19, 6, 'ISO ABSOLUTE ZERO Chocolate', 1, 2588),
(37, 20, 6, 'ISO ABSOLUTE ZERO Chocolate', 1, 2588),
(38, 21, 7, 'HYDRO WHEY 4 lb Green Apple', 1, 2000),
(39, 22, 1, 'REAL WHEY PROTEIN 5 lb Rich Chocolate', 1, 2071),
(40, 23, 4, 'MY WHEY MAX 5 lb (Baki) Rich Chocolate ', 1, 1746),
(41, 24, 15, 'OMA Fitness รุ่น OMA-7746EA ', 1, 39000);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_product`
--

CREATE TABLE `tbl_product` (
  `p_id` int(11) NOT NULL,
  `t_id` int(11) NOT NULL,
  `p_name` varchar(200) NOT NULL,
  `p_detial` text NOT NULL,
  `p_price` float(10,2) NOT NULL,
  `p_unit` varchar(20) NOT NULL,
  `p_img1` varchar(200) NOT NULL,
  `p_img2` varchar(100) DEFAULT NULL,
  `p_view` int(11) NOT NULL,
  `date_save` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`p_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbl_product`
--

INSERT INTO `tbl_product` (`p_id`, `t_id`, `p_name`, `p_detial`, `p_price`, `p_unit`, `p_img1`, `p_img2`, `p_view`, `date_save`) VALUES
(1, 1, 'REAL WHEY PROTEIN 5 lb Rich Chocolate', '<p>VITAXTRONG REAL WHEY PROTEIN&nbsp; &nbsp;&nbsp;&quot;เวย์โปรตีนคุณภาพมาตรฐานสากล&quot;เวย์โปรตีนสูตรคุ้มค่า ที่เลือกใช้ Whey Protein Concentrate เป็นหลัก ให้โปรตีนแน่น ๆ ในราคาที่เข้าถึงง่าย เหมาะสำหรับทุกคนที่อยากเสริมโปรตีนให้เพียงพอในแต่ละวัน หรือมองหาทางเลือกที่เบากว่าเครื่องดื่มพลังงานสูงทั่วไป เช่น โกโก้เย็น ชานม ชาเย็น ฯลฯใช้ได้ทั้งผู้หญิง ผู้ชาย หรือใครก็ตามที่อยากดูแลตัวเอง แต่&nbsp;ไม่อยากจ่ายในราคาที่เกินจำเป็น&nbsp;ราคาที่ดี</p>\r\n\r\n<p>✓&nbsp; โปรตีน 26 g.*</p>\r\n\r\n<p>✓&nbsp; พลังงาน 130 Kcal. น้ำตาล น้อยกว่า 1 กรัม* (ไขมัน 2 g. , คาร์โบไฮเดรท 3 g.)*</p>\r\n\r\n<p>✓&nbsp; ให้ BCAA ~5 g. , Glutamine ~4 g.*</p>\r\n\r\n<p>✓&nbsp; ไม่มีการใส่น้ำตาล (ใช้สารให้ความหวานทดแทน)</p>\r\n\r\n<p>✓&nbsp; No Amino Spiking ส่งตรวจแลปสม่ำเสมอ</p>\r\n\r\n<p>✓&nbsp; ใช้เวย์โปรตีนที่นำเข้าจาก USA เป็นวัตถุดิบหลักของส่วนผสม</p>\r\n\r\n<p>✓&nbsp; มีผล LAB GUARANTEE* สารอาหารต่อ 1 ช้อน (Rich Chocolate)</p>\r\n', 2071.00, 'รายการ', 'img1210308193620250909_133728.png', 'img2210308193620250909_133728.png', 559, '2017-08-30 02:14:40'),
(2, 1, 'ISO - PRO 5 lb Rich Chocolate', '<p>VITAXTRONG ISO - PRO&nbsp; &nbsp; &nbsp;&quot;เวย์โปรตีนของมืออาชีพ&quot;&nbsp; &nbsp; &nbsp;เวย์โปรตีนไอโซเลต สำหรับผู้ที่ต้องการดูแลโภชนาการอย่างเข้มข้น ผ่านกระบวนการกรองพิเศษ เพื่อลดไขมัน น้ำตาล และคาร์โบไฮเดรตให้เหลือในระดับต่ำสุด โปรตีน 27 กรัม ไม่มีตกฉลาก ใช้ได้แม้ในผู้ที่มีอาการแพ้แลคโตส สูตรนี้พัฒนาเพื่อผู้ที่ออกกำลังกายหรือผู้ที่ดูแลสุขภาพ และมองหาเวย์โปรตีนคุณภาพระดับสูง ในราคา&nbsp;ที่คุ้มค่าคำเตือน:&nbsp;ไม่มีไขมัน ไม่มีน้ำตาล = ไม่มีข้ออ้าง</p>\r\n\r\n<p>✓&nbsp; โปรตีน 27 g.*</p>\r\n\r\n<p>✓&nbsp; พลังงานเพียง 130 Kcal.*</p>\r\n\r\n<p>✓&nbsp; น้ำตาล 0, ไขมัน 0,&nbsp;คาร์โบไฮเดรต 0, คอเลสเตอรอล 0*</p>\r\n\r\n<p>✓&nbsp;&nbsp;ให้ BCAA ประมาณ 6 g. , Glutamine ประมาณ 5 g.*</p>\r\n\r\n<p>✓&nbsp; ไม่มีการใส่น้ำตาล (ใช้สารให้ความหวานทดแทน)</p>\r\n\r\n<p>✓&nbsp; No Amino Spiking ส่งตรวจแลปสม่ำเสมอ</p>\r\n\r\n<p>✓&nbsp; ใช้เวย์โปรตีนที่นำเข้าจาก USA เป็นวัตถุดิบหลักของส่วนผสม</p>\r\n\r\n<p>✓&nbsp; มีผล LAB GUARANTEE</p>\r\n', 2588.00, 'รายการ', 'img185426914620250909_134317.png', 'img285426914620250909_134317.png', 557, '2017-08-30 02:46:53'),
(4, 2, 'MY WHEY MAX 5 lb (Baki) Rich Chocolate ', '<p>BAAM!!&nbsp;MY WHEY MAX X BAKI&nbsp;&quot;เวย์ถุงแรกที่ใครก็เริ่มได้แบบไม่ต้องคิดเยอะ&quot;เวย์โปรตีนสูตรคุ้มค่า ที่เลือกใช้ Whey Protein Concentrate เป็นหลัก ให้โปรตีนแน่น ๆ ในราคาที่เข้าถึงง่าย เหมาะสำหรับทุกคนที่อยากเสริมโปรตีนให้เพียงพอในแต่ละวัน หรือมองหาทางเลือกที่เบากว่าเครื่องดื่มพลังงานสูงทั่วไป เช่น โกโก้เย็น ชานม ชาเย็น ฯลฯใช้ได้ทั้งผู้หญิง ผู้ชาย หรือใครก็ตามที่อยากดูแลตัวเอง แต่&nbsp;ไม่อยากจ่ายในราคาที่เกินจำเป็น&nbsp;มาพร้อมลุคใหม่ สูตรใหม่&nbsp;Special Collaboration X BAKI&nbsp;MAX รสชาติ MAX คุณภาพ&nbsp;ในราคาที่ดีในตลาด&nbsp;การันตี!</p>\r\n\r\n<p>✓&nbsp; โปรตีน 25 g.*</p>\r\n\r\n<p>✓&nbsp; พลังงาน 130 Kcal. น้ำตาล น้อยกว่า 1 กรัม* (ไขมัน 2 g. , คาร์โบไฮเดรท 3 g.)*</p>\r\n\r\n<p>✓&nbsp; ให้ BCAA ~5 g. , Glutamine ~4 g.*</p>\r\n\r\n<p>✓&nbsp; ไม่มีการใส่น้ำตาล (ใช้สารให้ความหวานทดแทน)</p>\r\n\r\n<p>✓&nbsp; No Amino Spiking ส่งตรวจแลปสม่ำเสมอ</p>\r\n\r\n<p>✓&nbsp; ใช้เวย์โปรตีนที่นำเข้าจาก USA เป็นวัตถุดิบหลักของส่วนผสม</p>\r\n\r\n<p>✓&nbsp; มีผล LAB GUARANTEE</p>\r\n', 1746.00, 'รายการ', 'img125896202420250909_134807.png', 'img225896202420250909_134807.png', 557, '2017-08-30 02:49:38'),
(5, 2, 'WHEY PROTEIN Thai Tea  ', '<p>BAAM!! MY WHEY&nbsp; THAI SERIES&quot;เวย์ไทยของคนไทย แบบไทย&nbsp; ๆ&quot;&nbsp; &nbsp; &nbsp;เวย์โปรตีนสูตรคุ้มค่า ที่เลือกใช้ Whey Protein Concentrate เป็นหลัก ให้โปรตีนแน่น ๆ ในราคาที่เข้าถึงง่าย เหมาะสำหรับทุกคนที่อยากเสริมโปรตีนให้เพียงพอในแต่ละวัน หรือมองหาทางเลือกที่เบากว่าเครื่องดื่มพลังงานสูงทั่วไป เช่น โกโก้เย็น ชานม ชาเย็น ฯลฯใช้ได้ทั้งผู้หญิง ผู้ชาย หรือใครก็ตามที่อยากดูแลตัวเอง แต่&nbsp;ไม่อยากจ่ายในราคาที่เกินจำเป็น&nbsp;เพราะนี่คือเวย์ที่ราคาที่ดีที่สุดในตลาด&nbsp;การันตี!รสพิเศษ!&nbsp;ที่ทำด้วยฝีมือคนไทย ดึงรสชาติจริงๆ จากรสที่คนไทยคุ้นเคย อร่อย ไม่มีเบื่อ อยากให้ลอง</p>\r\n\r\n<p>✓&nbsp; โปรตีน 25 g.*</p>\r\n\r\n<p>✓&nbsp; พลังงาน 130 Kcal. น้ำตาล น้อยกว่า 1 กรัม* (ไขมัน 2 g. , คาร์โบไฮเดรท 3 g.)*</p>\r\n\r\n<p>✓&nbsp; ให้ BCAA ~5 g. , Glutamine ~4 g.*</p>\r\n\r\n<p>✓&nbsp; ไม่มีการใส่น้ำตาล (ใช้สารให้ความหวานทดแทน)</p>\r\n\r\n<p>✓&nbsp; No Amino Spiking ส่งตรวจแลปสม่ำเสมอ</p>\r\n\r\n<p>✓&nbsp; ใช้เวย์โปรตีนที่นำเข้าจาก USA เป็นวัตถุดิบหลักของส่วนผสม</p>\r\n\r\n<p>✓&nbsp; มีผล LAB GUARANTEE</p>\r\n', 1746.00, 'รายการ', 'img1212510320020250909_135150.png', 'img2212510320020250909_135150.png', 557, '2017-08-30 02:50:45'),
(6, 2, 'ISO ABSOLUTE ZERO Chocolate', '<p>BAAM!!&nbsp;&nbsp;ISO ABSOLUTE ZERO X YUCHIRO&quot;เวย์โปรตีนที่ไม่ได้สร้างคนธรรมดา&quot;&nbsp; &nbsp; &nbsp;เวย์โปรตีนไอโซเลต สำหรับผู้ที่ต้องการดูแลโภชนาการอย่างเข้มข้น ผ่านกระบวนการกรองพิเศษ เพื่อลดไขมัน น้ำตาล และคาร์โบไฮเดรตให้เหลือในระดับต่ำสุด โปรตีนเต็มแม็กซ์ 30 กรัม ไม่มีตกฉลาก ใช้ได้แม้ในผู้ที่มีอาการแพ้แลคโตส สูตรนี้พัฒนาเพื่อผู้ที่ออกกำลังกายหรือผู้ที่ดูแลสุขภาพ และมองหาเวย์โปรตีนคุณภาพระดับสูง ในราคา&nbsp;ที่คุ้มค่าที่สุดคำเตือน:&nbsp;ไม่มีไขมัน ไม่มีน้ำตาล = ไม่มีข้ออ้าง</p>\r\n\r\n<p>✓&nbsp; โปรตีน&nbsp;30 g.*</p>\r\n\r\n<p>✓&nbsp; พลังงานเพียง 130 Kcal.*</p>\r\n\r\n<p>✓&nbsp; น้ำตาล 0, ไขมัน 0,&nbsp;คาร์โบไฮเดรต 0, คอเลสเตอรอล 0*</p>\r\n\r\n<p>✓&nbsp;&nbsp;ให้ BCAA ประมาณ 6 g. , Glutamine ประมาณ 5 g.*</p>\r\n\r\n<p>✓&nbsp; ไม่มีการใส่น้ำตาล (ใช้สารให้ความหวานทดแทน)</p>\r\n\r\n<p>✓&nbsp; No Amino Spiking ส่งตรวจแลปสม่ำเสมอ</p>\r\n\r\n<p>✓&nbsp; ใช้เวย์โปรตีนที่นำเข้าจาก USA เป็นวัตถุดิบหลักของส่วนผสม</p>\r\n\r\n<p>✓&nbsp; มีผล LAB GUARANTEE</p>\r\n', 2588.00, 'รายการ', 'img1199503857020250909_135427.png', 'img2199503857020250909_135427.png', 556, '2017-08-29 19:14:40'),
(7, 2, 'HYDRO WHEY 4 lb Green Apple', '<p>BAAM!!&nbsp;HYDRO WHEY&quot;เวย์โปรตีนที่ย่อยง่าย และดูดซึมไว ท้องไม่อืด&quot;&nbsp; &nbsp; &nbsp;เวย์โปรตีนไอโซเลท ที่เอาไปผ่านกระบวนการพิเศษ เพื่อย่อยโปรตีนให้เล็กลงไปอีก เพื่อการดูดซึมได้ไวกว่าเวย์โปรตีนไอโซเลททั่วไป หมดปัญหาท้องอืด คนแพ้แลคโตสสามารถดื่มได้</p>\r\n\r\n<p>✓&nbsp; โปรตีน 30 g.*</p>\r\n\r\n<p>✓&nbsp; พลังงานประมาณ 140 Kcal.(ไขมัน 0.5 กรัม, คาร์โบไฮเดรท 4 กรัม)*</p>\r\n\r\n<p>✓&nbsp; ให้ BCAA สูงกว่า 6 g.</p>\r\n\r\n<p>✓&nbsp; ไม่มีการใส่น้ำตาล (ใช้สารให้ความหวานทดแทน)</p>\r\n\r\n<p>✓&nbsp; No Amino Spiking ส่งตรวจแลปสม่ำเสมอ</p>\r\n\r\n<p>✓&nbsp; ใช้เวย์โปรตีนที่นำเข้าจาก USA เป็นวัตถุดิบหลักของส่วนผสม</p>\r\n\r\n<p>✓&nbsp; มีผล LAB GUARANTEE* สารอาหารต่อ 1 ช้อน (Green Apple)</p>\r\n', 2000.00, 'รายการ', 'img177099863420250909_135650.png', 'img277099863420250909_135650.png', 557, '2017-08-29 19:46:53'),
(8, 2, 'CASEIN 4 lb Chocolate', '<p>BAAM!! CASEIN&nbsp; &nbsp; &nbsp;Micellar Casein โปรตีนจากนมวัวธรรมชาติ ย่อยช้า เหมาะกับช่วงที่ร่างกายเว้นระยะมื้ออาหารนานเคซีน เป็นโปรตีนชนิดหนึ่งในนมวัวธรรมชาติที่มีคุณสมบัติดูดซึมช้ากว่าเวย์โปรตีน โดยใช้เวลาย่อยนานกว่า จึงได้รับความนิยมในช่วงก่อนนอนหรือระหว่างมื้อ รวมถึงในกลุ่มที่ต้องการใช้ในเมนูโปรตีน เช่น เบเกอรี่ หรือของหวานทางเลือก เพราะมีความคงตัวและทนความร้อนได้ดีกว่าเวย์โปรตีน</p>\r\n\r\n<p>✓&nbsp; Miceallar Casein โปรตีนดูดซึมช้า 25 g.*</p>\r\n\r\n<p>✓&nbsp; พลังงานประมาณ 120 Kcal.(ไขมัน 1 กรัม, คาร์โบไฮเดรท 2 กรัม)*</p>\r\n\r\n<p>✓&nbsp; BCAA ~6 g. , Glutamine ~5 g.*</p>\r\n\r\n<p>✓&nbsp; ไม่มีการใส่น้ำตาล (ใช้สารให้ความหวานทดแทน)</p>\r\n\r\n<p>✓&nbsp; No Amino Spiking ส่งตรวจแลปสม่ำเสมอ</p>\r\n\r\n<p>✓&nbsp; ใช้เวย์โปรตีนที่นำเข้าจาก USA เป็นวัตถุดิบหลักของส่วนผสม</p>\r\n\r\n<p>✓&nbsp; มีผล LAB GUARANTEE* สารอาหารต่อ 1 ช้อน ในรส Chocolate&nbsp;</p>\r\n', 1840.00, 'รายการ', 'img129429642420250909_135900.png', 'img229429642420250909_135900.png', 558, '2017-08-29 19:49:38'),
(9, 2, 'KOD POR KOD MAE โปรตีนต้มยำ', '<p>BAAM!!&nbsp;series&quot;นวัตกรรมใหม่ ของวงการโปรตีน&quot;&nbsp; &nbsp; &nbsp;เพราะเวย์จะไม่ใช่แค่อาหารเสริมอีกต่อไป กับโปรตีนที่สามารถกินเป็นอาหารหลัก ได้รสชาติเต็มที่ โปรตีนสูง กับ BAAM!! SERIES ที่จะทำให้คุณประหลาดใจ กับรสชาติใหม่ ที่คาดไม่ถึง !!มาลุ้นกันว่าแต่ละเวอร์ชั่น จะเป็นรสอะไร??<br />\r\nเหมาะกับใคร?คนที่อยากเพิ่มโปรตีนในมื้ออาหารให้สูงขึ้น, ผู้ที่อยู่ในช่วงคุมอาหาร แต่ไม่อยากอดอาหาร, อยากหาอาหารทางเลือกที่ดีกับสุขภาพมากขึ้น<br />\r\nNO. 1&nbsp;โปรตีน&nbsp;ต้มยำ !&nbsp; &nbsp; &nbsp;โปรตีนจาก เคซีน และ เวย์โปรตีน ที่ฉีกทุกกฎเกณฑ์ความจำเจ กับรสชาติที่แซ่บจี๊ด สะใจ ได้รสต้มยำน้ำข้นแบบเต็ม ๆ จะกินกับเส้นบะหมี่กึ่งสำเร็จรูปง่าย ๆ หรือ จะรังสรรค์เมนูต้มยำนักกล้าม ก็ได้ทุกเมนู ตามใจ เพราะเป็นโปรตีนที่ออกแบบมาให้โดนความร้อนได้ โปรตีนไม่หาย</p>\r\n\r\n<p>✓&nbsp; โปรตีนเน้น ๆ 16 กรัม</p>\r\n\r\n<p>✓&nbsp; พลังงาน 100 Kcal. ต่อช้อน(ไขมัน 0 กรัม , คาร์โบไฮเดรท 6 กรัม)</p>\r\n\r\n<p>✓&nbsp; ใช้เวย์โปรตีนที่นำเข้าจาก USA เป็นวัตถุดิบหลักของส่วนผสม</p>\r\n\r\n<p>✓&nbsp; มีผล LAB GUARANTEE</p>\r\n\r\n<p>วิธีการกินง่าย ๆ ด้วยไมโครเวฟ</p>\r\n\r\n<ol>\r\n	<li>ผสมน้ำ (อุณหภูมิห้อง) กับ ผงโปรตีนต้มยำ คนให้เข้ากันดี</li>\r\n	<li>เข้า ไมโครเวฟ 2 - 3 นาที ให้น้ำเดือด&nbsp;</li>\r\n	<li>คนเล็กน้อย แล้ว ใส่เส้นได้เลย รอ 2 - 3 นาที ให้เส้นสุกได้ที่</li>\r\n	<li>โซ้ยได้ !!</li>\r\n</ol>\r\n\r\n<p>วิธีการกินง่าย ๆ ในถ้วยบะหมี่กึ่ง</p>\r\n\r\n<ol>\r\n	<li>ใส่น้ำร้อนลงเส้นเปล่า ๆ รอ 2 - 3 นาที จนเส้นสุก</li>\r\n	<li>&nbsp;ใส่ ผงโปรตีนต้มยำ และคนให้เข้ากัน (จะใส่ผงปรุงเพิ่ม หรือไม่ อยู่ที่ใจ และสุขภาพไต)</li>\r\n	<li>โซ้ยได้ !!</li>\r\n</ol>\r\n', 425.00, 'รายการ', 'img140091712620250909_140314.png', 'img240091712620250909_140314.png', 555, '2017-08-29 19:50:45'),
(10, 3, 'LEAN WHEY  White Chocolate', '<p>FIT ANGEL LEAN WHEY HERS<br />\r\nเวย์โปรตีนสูตรเฉพาะ สำหรับสาว ๆ ที่ใส่ใจรูปร่างและการดูแลตัวเองในทุกวัน<br />\r\n&nbsp; &nbsp; &nbsp; โปรตีนเข้มข้นจากนมวัวที่ผ่านกระบวนการสกัดเพื่อลดปริมาณไขมันและแลคโตส ให้ได้เวย์โปรตีนที่ย่อยง่าย ใช้สะดวก เหมาะสำหรับผู้ที่ต้องการเสริมโปรตีนในมื้ออาหาร พร้อมผสมผสานสารสกัดจากผักและผลไม้ 13 ชนิดที่ให้สารต้านอนุมูลอิสระหลากหลายจากธรรมชาติ<br />\r\n✓&nbsp; โปรตีน 17 g.*</p>\r\n\r\n<p>✓&nbsp; พลังงานประมาณเพียง 90 Kcal. (ไขมัน 1.5 กรัม, คาร์โบไฮเดรท 3 กรัม)*✓&nbsp; ให้ BCAA ~4 g. , Glutamine 3 g.*</p>\r\n\r\n<p>✓&nbsp;13 ผักและผลไม้สกัดเกรดพรีเมี่ยม</p>\r\n\r\n<p>✓&nbsp; ไม่มีการใส่น้ำตาล (ใช้สารให้ความหวานทดแทน)</p>\r\n\r\n<p>✓&nbsp; No Amino Spiking ส่งตรวจแลปสม่ำเสมอ</p>\r\n\r\n<p>✓&nbsp; ใช้เวย์โปรตีนที่นำเข้าจาก USA เป็นวัตถุดิบหลักของส่วนผสม</p>\r\n\r\n<p>✓&nbsp; มีผล LAB GUARANTEE* สารอาหารต่อ 1 ช้อน ในรส Choco Brownie</p>\r\n', 2071.00, 'รายการ', 'img1188903043920250909_140718.png', 'img2188903043920250909_140718.png', 556, '2017-08-29 19:14:40'),
(11, 3, 'SOY PROTEIN ISOLATE  Chocolate', '<p>FIT ANGEL SOY ISOALTEโปรตีนถั่วเหลือง ทางเลือกของคนที่ต้องการเสริมโปรตีนจากพืช (Plant Protein) ที่มีคุณภาพดีเพราะเป็นโปรตีนที่มี BCAA สูง ใกล้เคียงกับโปรตีนจากเนื้อสัตว์ และเวย์โปรตีน ย่อยง่าย พลังงานต่ำ คนแพ้นมสามารถทานได้มีค่า DIAAS สูงงง (ค่าที่ร่างกายนำไปใช้ได้จริง) ใกล้เคียงกับ เวย์ และ เนื้อสัตว์มากที่สุด ในตระกูลโปรตีนจากพืช</p>\r\n\r\n<p>✓&nbsp; โปรตีนจากถั่วเหลือง เป็นโปรตีนจากพืช (Plant Protein) คนแพ้นมทานได้✓&nbsp; โปรตีน 25 g.*</p>\r\n\r\n<p>✓&nbsp; ให้ BCAA ~4.5 g. , Glutamine ~4.5 g.*</p>\r\n\r\n<p>✓&nbsp; โปรตีนจากพืช (Plant Protein) ไม่มี คลอเรสเตอรอล และ มีธาตุเหล็กสูง</p>\r\n\r\n<p>✓&nbsp; อยู่ท้องนานกว่าจาก Fiber ในธรรมชาติของโปรตีนพืช</p>\r\n\r\n<p>✓&nbsp; ไม่มีการใส่น้ำตาล (ใช้สารให้ความหวานทดแทน)</p>\r\n\r\n<p>✓&nbsp; No Amino Spiking ส่งตรวจแลปสม่ำเสมอ</p>\r\n\r\n<p>✓&nbsp; โปรตีนถั่วเหลือง นำเข้า และ ตรวจคุณภาพ โดย FITWHEY</p>\r\n\r\n<p>* สารอาหารต่อ 1 ช้อน (Unflavored)</p>\r\n', 630.00, 'รายการ', 'img1108611386320250909_140915.png', 'img2108611386320250909_140915.png', 555, '2017-08-29 19:46:53'),
(12, 3, 'ANGEL PLANT 7 Chocolate Hazelnut', '<p>FIT ANGELโปรตีนจากพืช&nbsp;ANGEL PLANT 7&nbsp; &nbsp; &nbsp;<br />\r\n&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;สายวีแกนที่เลือกรับประทานอาหารจากพืช หรือผู้ที่มีปัญหาในการบริโภคเวย์โปรตีนจากนม เช่น อาการไม่สบายท้องหรือมีปัญหาผิวพรรณหลังรับประทานเวย์ ANGEL PLANT 7 อาจเป็นอีกหนึ่งทางเลือกที่ตอบโจทย์ ด้วยโปรตีนจากพืช 7 ชนิด ให้กรดอะมิโนจำเป็นครบถ้วน (Complete Protein) พร้อมรสชาติกลมกล่อม ทานง่าย เหมาะกับผู้ที่ต้องการดูแลรูปร่าง หรือมองหาเครื่องดื่มทางเลือกแทนขนมหวานในชีวิตประจำวัน&nbsp;</p>\r\n\r\n<ul>\r\n	<li>โปรตีน 30 กรัม ต่อหนึ่งหน่วยบริโภค* (จากพืช 7 ชนิด)</li>\r\n	<li>มี BCAA และ Glutamine</li>\r\n	<li>ให้พลังงานประมาณ 150 Kcal ต่อหนึ่งหน่วยบริโภค*</li>\r\n	<li>ใยอาหาร 4 กรัม*</li>\r\n	<li>ไม่มีน้ำตาล และไม่มีคอเลสเตอรอล*</li>\r\n	<li>ไม่ใส่แลคโตส (Lactose-Free)</li>\r\n	<li>ไม่มีการเติมน้ำตาล (ใช้หญ้าหวานเป็นวัตถุให้ความหวาน)</li>\r\n	<li>มีผล Lab Test รับรอง</li>\r\n</ul>\r\n\r\n<p>* สารอาหารต่อ 1 Serving (Golden Chocolate Hazaelnut)<br />\r\nโปรตีนจากพืช ANGEL PLANT 7&nbsp;เหมาะกับใคร ?</p>\r\n\r\n<ul>\r\n	<li>ผู้ที่ต้องการดูแลสุขภาพ</li>\r\n	<li>ผู้ที่รับประทานอาหารแบบ Plant-Based หรือ Vegan</li>\r\n	<li>ผู้ที่ต้องการเสริมโปรตีนจากแหล่งที่ไม่ใช่สัตว์</li>\r\n	<li>ผู้ที่มีข้อจำกัดในการบริโภคนมวัวหรือผลิตภัณฑ์จากสัตว์</li>\r\n	<li>ผู้สูงอายุที่ต้องการเพิ่มโปรตีนในชีวิตประจำวัน</li>\r\n	<li>ผู้ที่มองหาโปรตีนจากพืชที่รสชาติดี ทานง่าย</li>\r\n</ul>\r\n', 466.00, 'รายการ', 'img1195622578420250909_141428.png', 'img2195622578420250909_141428.png', 555, '2017-08-29 19:49:38'),
(13, 4, 'OMA Fitness รุ่น OMA-5332CAI ', '<p>OMA Fitness รุ่น OMA-5332CAI ลู่วิ่งไฟฟ้า 3.75 แรงม้า Motorised Treadmill 3.75HP<br />\r\n- มอเตอร์ DC 2.5 แรงม้า(2.5HP) Peak สูงสุด 3.75 แรงม้า<br />\r\n- ปรับความเร็ว 1-22 กม./ชม.<br />\r\n- ปรับความชัน ระบบไฟฟ้า 1-15 ระดับ<br />\r\n- ขนาดสายพาน 50 x 145 cm<br />\r\n- รับน้ำหนักผู้ใช้ได้ถึง 130 กก.<br />\r\n- หน้าจอ 7 นิ้ว LCD Blue Screen (1)ระทาง (2)เวลา (3)แคลอรี่ (4)ความเร็ว (5)ชีพจร (6)Body Fat ลำโพง Bluetooth / USB ชาร์จ&nbsp;<br />\r\n- ฟังก์ชั่นการใช้งาน 36 โปรแกรม อัตโนมัติ 1โปรแกรมปกติ 3โปรแกรมสำหรับผู้ใช้สร้างเอง&nbsp;<br />\r\n- ฟังก์ชั่นเสริม สั่งงานผ่าน AnyRun : รองรับ Zwift&nbsp;<br />\r\n- สายพานหนา 1.8 mm&nbsp;<br />\r\n- กระดานรองสายพานหนา 18 mm<br />\r\n- ขนาดเครื่อง กว้าง87x ยาว177x สูง164 cm<br />\r\n- น้ำหนักเครื่อง 83.7 kg<br />\r\n- รับประกันมอเตอร์ 10 ปี<br />\r\n- รับประกันโครงสร้าง 3 ปี<br />\r\n- รับประกันอะไหล่ สิ้นเปลือง 1 ปี<br />\r\nรายละเอียดการจัดส่งและติดตั้ง Grandlite สินค้าจัดส่งโดยร้านค้าที่จัดจำหน่ายโดยตรง1. กรุงเทพฯ และปริมณฑล จัดส่งพร้อมติดตั้ง 3-5 วัน (ไม่รวม เสาร์-อาทิตย์)2. ต่างจังหวัด2.1 อำเภอเมือง มีบริการจัดส่งในตัวเมือง พร้อมติดตั้ง 7-14 วัน *** เฉพาะจังหวัด2.2 นอกอำเภอเมือง ส่งสินค้าเป็นกล่องลูกค้าประกอบเอง</p>\r\n', 29000.00, 'รายการ', 'img1181665746220250909_141907.png', 'img2181665746220250909_141907.png', 556, '2017-08-29 19:50:45'),
(14, 4, 'OMA Fitness รุ่น OMA-5116CAI ', '<p>OMA Fitness รุ่น OMA-5116CAI ลู่วิ่งไฟฟ้า 3 แรงม้า Motorised Treadmill 3 HP<br />\r\n- มอเตอร์ขับเคลื่อน 2 แรงม้า สูงสุด 3 แรงม้า<br />\r\n- ปรับความเร็ว 1-16 km/hr<br />\r\n- ปรับความชัน 1-12 ระดับ<br />\r\n- ขนาดพื้นที่วิ่ง 42x133 ซม.<br />\r\n- รับน้ำหนักผู้เล่นได้สูงสุด 120 kg<br />\r\n- หน้าจอ 5&quot; LCD Blue Screen (1)ระทาง (2)เวลา (3)แคลอรี่ (4)ความเร็ว (5)ชีพจร (6)Body Fat<br />\r\n- ลำโพง Bluetooth / ช่อง USB สำหรับชาร์จ<br />\r\n- ฟังก์ชั่นการใช้งาน 36 โปรแกรม อัตโนมัติ 1 โปรแกรมปกติ 3 โปรแกรมสำหรับผู้ใช้สร้างเอง<br />\r\n- ฟังก์ชั่นเสริม สั่งงานผ่าน AnyRun : รองรับ Zwift<br />\r\n- สายพานหนา 1.8 มม.<br />\r\n- กระดานรองสายพานหนา 20 มม.<br />\r\n- ขนาดเครื่อง กว้าง81.5 x ยาว171 x สูง 143 cm<br />\r\n- น้ำหนักเครื่อง 65.7 kg<br />\r\n- รับประกันโครงสร้าง 3 ปี<br />\r\n- รับประกันมอเตอร์ 10 ปี<br />\r\n- รับประกันอะไหล่สิ้นเปลือง 1 ปี<br />\r\nรายละเอียดการจัดส่งและติดตั้ง Grandlite สินค้าจัดส่งโดยร้านค้าที่จัดจำหน่ายโดยตรง</p>\r\n\r\n<p>1. กรุงเทพฯ และปริมณฑล จัดส่งพร้อมติดตั้ง 3-5 วัน (ไม่รวม เสาร์-อาทิตย์)</p>\r\n\r\n<p>2. ต่างจังหวัด</p>\r\n\r\n<p>2.1 อำเภอเมือง มีบริการจัดส่งในตัวเมือง พร้อมติดตั้ง 7-14 วัน *** เฉพาะจังหวัด</p>\r\n\r\n<p>2.2 นอกอำเภอเมือง ส่งสินค้าเป็นกล่องลูกค้าประกอบเอง</p>\r\n', 18000.00, 'รายการ', 'img195119694320250909_142502.png', 'img295119694320250909_142502.png', 1, '2018-01-25 04:15:23'),
(15, 4, 'OMA Fitness รุ่น OMA-7746EA ', '<p>OMA Fitness รุ่น OMA-7746EA ลู่วิ่งไฟฟ้า มอเตอร์ 6 แรงม้า Motorised Treadmill AC 6 HP<br />\r\n- มอเตอร์ AC 6 แรงม้า<br />\r\n- ปรับความเร็ว 1-22 กม/ชม.<br />\r\n- ปรับความชัน 1 - 15 ระดับ<br />\r\n- ขนาดสายพาน 55 x 145 ซม<br />\r\n- รับน้ำหนักผู้เล่นได้ 130 กก<br />\r\n- หน้าจอ LED&nbsp; (1) ระยะทาง (2) เวลา (3) แคลอรี่ (4) ความเร็ว (5) ชีพจร (6) ความชัน (7) BMI ดัชนีมวลกาย<br />\r\n- ฟังก์ชั่นการใช้งาน 36 โปรแกรม อัตโนมัติ 1โปรแกรมปกติ 3 โปรแกรมสำหรับผู้ใช้สร้างเอง<br />\r\n- ฟังก์ชั่นเสริม สั่งงานผ่าน AnyRun, Kinomap, Zwift, มีลำโพงสำหรับBluetooth, Wireless Charger, ช่องวาง Tablet Smartphone<br />\r\n- สายพาน หนา 1.8 mm<br />\r\n- กระดานรองสายพาน หนา 18 mm<br />\r\n- ยางรับแรงกระแทก 6 จุด<br />\r\n- ขนาดเครื่อง 88.6x182x158.2 cm.<br />\r\n- นํ้าหนักเครื่อง 120 kg<br />\r\n- รับประกันมอเตอร์ 10 ปี - รับประกันโครงสร้าง 3 ปี - รับประกันอะไหล่สิ้นเปลือง 1 ปี<br />\r\nรายละเอียดการจัดส่งและติดตั้ง Grandlite สินค้าจัดส่งโดยร้านค้าที่จัดจำหน่ายโดยตรง</p>\r\n\r\n<p>1. กรุงเทพฯ และปริมณฑล จัดส่งพร้อมติดตั้ง 3-5 วัน (ไม่รวม เสาร์-อาทิตย์)</p>\r\n\r\n<p>2. ต่างจังหวัด</p>\r\n\r\n<p>2.1 อำเภอเมือง มีบริการจัดส่งในตัวเมือง พร้อมติดตั้ง 7-14 วัน *** เฉพาะจังหวัด</p>\r\n\r\n<p>2.2 นอกอำเภอเมือง ส่งสินค้าเป็นกล่องลูกค้าประกอบเอง</p>\r\n', 39000.00, 'รายการ', 'img165609440520250909_142658.png', 'img265609440520250909_142658.png', 3, '2018-01-25 04:16:49'),
(16, 4, 'OMA Fitness รุ่น OMA-7418EA ', '<p>OMA Fitness รุ่น OMA-7418EA ลู่วิ่งไฟฟ้า มอเตอร์ DC 4 HP&nbsp;MOTORIZED TREADMILL 4.0HP<br />\r\n- มอเตอร์DC 4.0 HP<br />\r\n- ปรับความเร็ว 1-18 km/hr<br />\r\n- ปรับความชันไฟฟ้า 1 - 12 ระดับ<br />\r\n- ขนาดสายพาน 45 x 125 cm<br />\r\n- รับน้ำหนักผู้เล่นได้ 100 kg<br />\r\n- หน้าจอ LCD 5&quot; (1) ระยะทาง (2) เวลา (3) แคลอรีหน้าจอ (4) ความเร็ว (5) ชีพจร (6) ความชัน (7) BMI ดัชนีมวลกาย<br />\r\n- ฟังก์ชั่นการใช้งาน 36 โปรแกรม อัดโนมัติ 1 โปรแกรมปกติ 3 โปรแกรมสำหรับผู้ใช้สร้างเอง<br />\r\n- ฟังก์ชั่นเสริม ใช้งานผ่าน AnyRun, Kinomap, Zwift, มีลำโพงสำหรับ Bluetooth, Wireless charger, ช่องวาง Tablet - Smatphone<br />\r\n- สายพาน หนา 1.6 mm<br />\r\n- กระดานรองสายพาน หนา 18 mm<br />\r\n- ยางรับแรงกระแทก 6 จุด<br />\r\n- ขนาดเครื่อง 77x151.5x136 cm<br />\r\n- น้ำหนักเครื่อง 60 kg<br />\r\n- รับประกันมอเตอร์ 10 ปี<br />\r\n- รับประกันโครงสร้าง 3 ปี<br />\r\n- รับประกันอะไหล่สิ้นเปลือง 1 ปี<br />\r\nรายละเอียดการจัดส่งและติดตั้ง Grandlite สินค้าจัดส่งโดยร้านค้าที่จัดจำหน่ายโดยตรง</p>\r\n\r\n<p>1. กรุงเทพฯ และปริมณฑล จัดส่งพร้อมติดตั้ง 3-5 วัน (ไม่รวม เสาร์-อาทิตย์)</p>\r\n\r\n<p>2. ต่างจังหวัด</p>\r\n\r\n<p>2.1 อำเภอเมือง มีบริการจัดส่งในตัวเมือง พร้อมติดตั้ง 7-14 วัน *** เฉพาะจังหวัด</p>\r\n\r\n<p>2.2 นอกอำเภอเมือง ส่งสินค้าเป็นกล่องลูกค้าประกอบเอง</p>\r\n', 36900.00, 'รายการ', 'img1104111734020250909_144522.png', 'img2104111734020250909_144522.png', 0, '2025-09-09 07:45:22'),
(17, 4, 'GYMOST รุ่น GM-6750EA ', '<p>Gymost รุ่น GM-6750EA ลู่วิ่งไฟฟ้า 7.5 แรงม้า AC&nbsp;Motorised Treadmill 7.5HP Commercial<br />\r\n- มอเตอร์ AC 5.0 HP (PEAK 7.5 HP)<br />\r\n- ปรับความเร็วได้ 1-22 km/hr<br />\r\n- ปรับความชันได้ 1-15%<br />\r\n- ขนาดพื้นที่การวิ่ง 58 x 150 ซม<br />\r\n- รับน้ำหนักผู้เล่นสูงสุด 150 กก.<br />\r\n- หน้าจอ LED 7 นิ้ว (1)ระยะทาง (2)เวลา (3)แคลอรี่ (4)ความเร็ว (5)ชีพจร (6)Body Fat ช่องต่อ MP3 / USB ชาร์จ มีลำโพงในตัว<br />\r\n- วัดชีพจรด้วยระบบมือสัมผัส พร้อมโปรแกรมวัดปริมาณไขมัน&nbsp;<br />\r\n- ฟังก์ชั่นการใช้งาน 36 โปรแกรม อัตโนมัติ 1 โปรแกรมปกติ 3 โปรแกรมสำหรับผู้ใช้สร้างเอง<br />\r\n- ฟังก์ชั่นเสริม Step Counting, โปรงแกรมปิดเครื่องอัตโนมัติ<br />\r\n- สายพานหนา 1.8 mm<br />\r\n- กระดานรองสายพานหนา 21 mm<br />\r\n- มีล้อเคลื่อนย้ายสะดวก<br />\r\n- ขนาดเครื่อง กว้าง 91.5 x ยาว 201 x สูง 159.5 cm<br />\r\n- น้ำหนักเครื่อง 205 kg<br />\r\n- รับประกันมอเตอร์ 10 ปี<br />\r\n- รับประกันโครงสร้าง 3 ปี<br />\r\n- รับประกันอะไหล่สิ้นเปลือง 1 ปี<br />\r\nรายละเอียดการจัดส่งและติดตั้ง Grandlite สินค้าจัดส่งโดยร้านค้าที่จัดจำหน่ายโดยตรง</p>\r\n\r\n<p>1. กรุงเทพฯ และปริมณฑล จัดส่งพร้อมติดตั้ง 3-5 วัน (ไม่รวม เสาร์-อาทิตย์)</p>\r\n\r\n<p>2. ต่างจังหวัด</p>\r\n\r\n<p>2.1 อำเภอเมือง มีบริการจัดส่งในตัวเมือง พร้อมติดตั้ง 7-14 วัน *** เฉพาะจังหวัด</p>\r\n\r\n<p>2.2 นอกอำเภอเมือง ส่งสินค้าเป็นกล่องลูกค้าประกอบเอง</p>\r\n', 65900.00, 'รายการ', 'img1168828352320250909_144833.png', 'img2168828352320250909_144833.png', 0, '2025-09-09 07:48:33'),
(18, 5, 'treadmill mini walking pad 3.5HP ', '<p>⭐ร้าน Keep Going Max ยินดีต้อนรับทุกท่าน<br />\r\n????ติดตามร้านค้า Keep Going Max เพื่อรับสิทธิพิเศษก่อนใคร<br />\r\n????เพื่อไม่ให้พลาดสินค้าใหม่ หรือโปรโมชั่นลดราคา ฝากกดติดตามร้านค้าด้วยนะคะ<br />\r\n????️สินค้าในร้านเรารับประกันว่าเป็นของแท้ และมีการควบคุมคุณภาพของสินค้าอย่างเข้มงวด เพื่อให้ลูกค้าสามารถสั่งซื้อได้อย่างมั่นใจ<br />\r\n????ขอความกรุณา อ่านก่อนทำการกดสั่งซื้อ เพื่อความมั่นใจในบริการของคุณ<br />\r\nแนะนำผลิตภัณฑ์:<br />\r\nNew Plus-SP16508<br />\r\nอัพเกรดความเร็ว 1-12KM/H<br />\r\nกำลังมอเตอร์ 3.5HP<br />\r\nไม่มีที่วางแขน-SPZKYC3<br />\r\nมีราวจับ-SPTLA66<br />\r\nรายละเอียดสินค้า อุปกรณ์ออกกําลังกาย ลู่วิ่งไฟฟ้าแบบเรียบแบน<br />\r\n&bull; รุ่นเฟืองเหล็กแข็งแรงกว่าท้องตลาดที่เป็นเฟืองพลาสติก<br />\r\n&bull; จอ LCD แสดงผล<br />\r\n&bull; ขนาดสินค้า รุ่น （black/White ไม่มีที่วางแขน）/ (Black มีราวจับ) ขนาดสินค้า รุ่น:122*55*17cm/130*60*17cm 20KG/21KG<br />\r\n&bull; ควบคุมด้วยรีโมทไร้สาย<br />\r\nรายละเอียดสินค้า อุปกรณ์ออกกําลังกาย ได้ทุกที่ ลู่วิ่งไฟฟ้าแบบเรียบแบน<br />\r\n&bull; รุ่นเฟืองเหล็กแข็งแรงกว่าท้องตลาดที่เป็นเฟืองพลาสติก<br />\r\n&bull; จอ LCD แสดงผล<br />\r\nไฮไลท์: การควบคุมระยะไกลไร้สายอัจฉริยะเริ่มต้นมินิง่ายต่อการจัดเก็บเสียงเล็ก<br />\r\nน้ำหนักสุทธิ: 20 กิโลกรัม<br />\r\nน้ำหนักเครื่องจักรสุทธิ : 20 kg<br />\r\nความยาว : 132cm<br />\r\nความยาวลู่ : 100 cm<br />\r\nความเร็วสูงสุด : 6 km/h<br />\r\nความกว้าง 560 CM<br />\r\nความสูง 190 CM<br />\r\nมอเตอร์สูงสุด: 3.5HP<br />\r\nแรงม้าเอาท์พุทอย่างต่อเนื่อง: 0.6HP<br />\r\nโหลดสูงสุด: 350 กิโลกรัม</p>\r\n', 2500.00, 'รายการ', 'img1157937504120250909_145657.png', 'img2157937504120250909_145657.png', 0, '2025-09-09 07:56:57'),
(23, 9, 'XtivePRO ชุดดัมเบล 20-40 kg ', '<p>XtivePRO ศูนย์รวมอุปกรณ์กีฬา เครื่องออกกำลังกาย และผลิตภัณฑ์ส่งเสริมสุขภาพหลากหลายชนิด รวมทั้งอุปกรณ์เดินป่าและการตั้งแคมป์ปิ้ง ตอบโจทย์ทุกไลฟ์สไตล์ ลุยไปกับคุณทุกแอคทิวิตี้ ทั้งกิจกรรมกลางแจ้ง กิจกรรมในร่ม หรือกิจกรรมที่มีพื้นที่จำกัด พร้อมจัดจำหน่ายตลอด 24 ชั่วโมง มีทีมงาน Support Care ดูแลคุณลูกค้าตั้งแต่ก่อนซื้อและหลังการขาย สินค้าของแท้จะมีประกันจากผู้ขาย 14 วัน ลูกค้าจึงมั่นใจในคุณภาพ 100 % เลือกสินค้าเพื่อสุขภาพ เลือก XtivePRO<br />\r\nชื่อสินค้า : XtivePRO ชุดดัมเบล ปรับน้ำหนักได้ 20 - 40 kg พร้อมแกนบาร์เบล ยกน้ำหนัก สร้างกล้ามเนื้อ Adjustable dumbbell barbell<br />\r\nแบรนด์ : XtivePRO<br />\r\nขนาดสินค้า :<br />\r\nชุด 20 kg ประกอบไปด้วย :<br />\r\n- แกนด้ามจับดัมเบล x 2 ด้าม ยาว 40 cm<br />\r\n- แกนด้ามจับบาร์เบล x 1 ด้าม ยาว 105 cm<br />\r\n- แผ่นน้ำหนัก 1.25 kg x 4 แผ่น<br />\r\n- แผ่นน้ำหนัก 1.5 kg x 4 แผ่น<br />\r\n- แผ่นน้ำหนัก 2 kg x 4 แผ่น<br />\r\n- ตัวล็อค 4 ชิ้น<br />\r\nน้ำหนักสินค้า : 20 kg<br />\r\nเส้นผ่านศูนย์กลางแผ่นน้ำหนัก 2.6 cm<br />\r\nขนาดสินค้า :<br />\r\nชุด 30 kg ประกอบไปด้วย :<br />\r\n- แกนด้ามจับดัมเบล x 2 ด้าม ยาว 40 cm<br />\r\n- แกนด้ามจับบาร์เบล x 1 ด้าม ยาว 105 cm<br />\r\n- แผ่นน้ำหนัก 2.5 kg x 4 แผ่น<br />\r\n- แผ่นน้ำหนัก 2 kg x 4 แผ่น<br />\r\n- แผ่นน้ำหนัก 1.5 kg x 4 แผ่น<br />\r\n- แผ่นน้ำหนัก 1.25 kg x 4 แผ่น<br />\r\n- ตัวล็อค 4 ชิ้น<br />\r\nน้ำหนักสินค้า : 30 kg<br />\r\nเส้นผ่านศูนย์กลางแผ่นน้ำหนัก 2.6 cm<br />\r\nขนาดสินค้า :<br />\r\nชุด 40 kg ประกอบไปด้วย :<br />\r\n- แกนด้ามจับดัมเบล x 2 ด้าม ยาว 40 cm<br />\r\n- แกนด้ามจับบาร์เบล x 1 ด้าม ยาว 105 cm<br />\r\n- แผ่นน้ำหนัก 3 kg x 8 แผ่น<br />\r\n- แผ่นน้ำหนัก 2.5 kg x 4 แผ่น<br />\r\n- แผ่นน้ำหนัก 1.25 kg x 4 แผ่น<br />\r\n- ตัวล็อค 4 ชิ้น<br />\r\nน้ำหนักสินค้า : 40 kg<br />\r\nเส้นผ่านศูนย์กลางแผ่นน้ำหนัก 2.6 cm<br />\r\nรายละเอียด :<br />\r\nการฝึกกีฬา : ฝึกความแข็งแรงของกล้ามเนื้อ / เพาะกาย / เวทเทรนนิ่ง<br />\r\nสัดส่วนที่ได้ : แขน / ไหล่ / หน้าอก /หลัง<br />\r\nวัสดุ : PE , PP , ซีเมนต์ , เหล็ก , โฟม<br />\r\nสี : ดำ &ndash; แดง (มีล็อค 2 ชั้น)<br />\r\nคุณสมบัติ :<br />\r\n1.XtivePRO ชุดดัมเบลปรับน้ำหนักได้ พร้อมแกนบาร์เบล<br />\r\n2.ด้ามดัมเบลทำจาก ABS เพิ่มแรงเสียดทานในการจับ ทำให้ใช้งานง่ายไม่ลื่น เพิ่มความสะดวกสบายในการใช้งาน<br />\r\n3.ด้ามบาร์เบลหุ้มด้วยโฟม รองรับการจับและกระแทก ลดการบาดเจ็บ ด้ามรับน้ำหนักได้ถึง 150 kg<br />\r\n4. แข็งแรง ปลอดภัย ไม่ทำให้พื้นเสียหาย และลดเสียงดัง<br />\r\n5. สามารถใช้กับแกนบาร์เบล ดัมเบล ได้อย่างสะดวก ใช้งานง่าย<br />\r\n6.ทำให้กล้ามเนื้อแขนแข็งแรงขึ้น แขนของเราประกอบด้วยกล้ามเนื้อสองส่วนคือ ไบเซ็ปส์ และไตรเซ็ปส์ ซึ่งทำหน้าที่หดตัวละคลายตัวสลับกันไป การยกดัมเบลเป็นประจำ จะช่วยเพิ่มความแข็งแรงแก่กล้ามเนื้อทั้งสองส่วน<br />\r\n7.กล้ามเนื้อแขนยืดหยุ่นขึ้น จะไม่มีอาการปวด ตึง บาดเจ็บง่าย หรือฟกช้ำง่ายอีกต่อไป<br />\r\n8.สร้างความแข็งแรงแก่ข้อมือและ ปลายแขน เพิ่มแรงบีบของฝ่ามือทั้งสองข้าง รวมถึงช่วยกระชับกล้ามเนื้อลำตัวส่วนบน ทั้งกล้ามเนื้ออก กล้ามเนื้อสะบัก และกล้ามเนื้อด้านข้างลำตัวได้ด้วย<br />\r\n9.ช่วยบริหารเสริมสร้างความแข็งแรงให้กล้ามเนื้อแขน ไหล่ หน้าอก และหลัง<br />\r\n10.ใช้งานง่ายโดยไม่จำกัดเวลาและสถานที่ สามารถฝึกฝนตนเองที่บ้านและโรงยิม<br />\r\n11.น็อตขันแน่นไม่หลวม ผลิตจากวัสดุคุณภาพ<br />\r\n12.มีให้เลือกถึง 3 ขนาด คือ 20 kg, 30 kg และ40 kg<br />\r\nวิธีการใช้งาน :<br />\r\n- สำหรับประกอบการออกกำลังกาย หรือ ใช้คู่กับบาร์เบล และดัมเบล<br />\r\n- ใช้ออกกำลังกายแนวเวทเทรนนิ่ง สร้างกล้ามเนื้อ สามารถประยุกต์ใช้คู่กับม้านั่งได้<br />\r\nคำแนะนำ / ข้อควรระวัง :<br />\r\n- ใช้ผ้าแห้ง เช็ดทำความสะอาด เพื่อป้องกันคราบเหงื่อ หลีกเลี่ยงการเก็บในที่ชื้นหรือกลางแจ้งเพื่อป้องกันการเกิดสนิม<br />\r\n- หลีกเลี่ยงการจัดเก็บบนที่สูง และควรเก็บให้พ้นมือเด็กเล็ก<br />\r\nหมายเหตุ :<br />\r\n- ภาพสินค้าเป็นเพียงภาพโฆษณา สีสินค้าจริงอาจแตกต่างกัน ขึ้นอยู่กับแสงและจอแสดงผล</p>\r\n', 1027.00, 'รายการ', 'img1156252869520250910_155843.png', 'img2156252869520250910_155843.png', 0, '2025-09-10 08:58:43'),
(19, 5, 'Keep Going Max SP79', '<p>⭐ร้าน Keep Going Max ยินดีต้อนรับทุกท่าน<br />\r\n????ติดตามร้านค้า Keep Going Max เพื่อรับสิทธิพิเศษก่อนใคร<br />\r\n????เพื่อไม่ให้พลาดสินค้าใหม่ หรือโปรโมชั่นลดราคา ฝากกดติดตามร้านค้าด้วยนะคะ<br />\r\n????️สินค้าในร้านเรารับประกันว่าเป็นของแท้ และมีการควบคุมคุณภาพของสินค้าอย่างเข้มงวด เพื่อให้ลูกค้าสามารถสั่งซื้อได้อย่างมั่นใจ<br />\r\n????ขอความกรุณา อ่านก่อนทำการกดสั่งซื้อ เพื่อความมั่นใจในบริการของคุณ<br />\r\nแนะนำผลิตภัณฑ์:<br />\r\nลู่วิ่งระบบสายพาน<br />\r\nไม่ใช้ไฟฟ้า<br />\r\nพับเก็บง่าย มีล้อ เคลื่อนย้ายสะดวก<br />\r\nรับน้ำหนักถึง 300 กิโลกรัม<br />\r\nสีดำ<br />\r\nขนาด: 110*45*105 CM<br />\r\nน้ำหนักสุทธิ: 19 กิโลกรัม<br />\r\nหมายเหตุ: ฟรีเครื่องบิดสีน้ำเงินและเชือก</p>\r\n', 3900.00, 'รายการ', 'img1125189389620250909_150102.png', 'img2125189389620250909_150102.png', 0, '2025-09-09 08:01:02'),
(20, 5, 'KEEP treadmill ลู่วิ่งไฟฟ้าในครัวเรือน ', '<p>⭐ร้าน Keep Going Max ยินดีต้อนรับทุกท่าน<br />\r\n????ติดตามร้านค้า Keep Going Max เพื่อรับสิทธิพิเศษก่อนใคร<br />\r\n????เพื่อไม่ให้พลาดสินค้าใหม่ หรือโปรโมชั่นลดราคา ฝากกดติดตามร้านค้าด้วยนะคะ<br />\r\n????️สินค้าในร้านเรารับประกันว่าเป็นของแท้ และมีการควบคุมคุณภาพของสินค้าอย่างเข้มงวด เพื่อให้ลูกค้าสามารถสั่งซื้อได้อย่างมั่นใจ<br />\r\n????ขอความกรุณา อ่านก่อนทำการกดสั่งซื้อ เพื่อความมั่นใจในบริการของคุณ<br />\r\nแนะนำผลิตภัณฑ์:<br />\r\nไม่มีที่วางแขน-SPZKYC3<br />\r\nมีราวจับ-SPTLA66<br />\r\nรายละเอียดสินค้า อุปกรณ์ออกกําลังกาย ลู่วิ่งไฟฟ้าแบบเรียบแบน<br />\r\n&bull; รุ่นเฟืองเหล็กแข็งแรงกว่าท้องตลาดที่เป็นเฟืองพลาสติก<br />\r\n&bull; จอ LCD แสดงผล<br />\r\n&bull; ขนาดสินค้า รุ่น （black/White ไม่มีที่วางแขน）/ (Black มีราวจับ) ขนาดสินค้า รุ่น:122*55*17cm/130*60*17cm 20KG/21KG<br />\r\n&bull; ควบคุมด้วยรีโมทไร้สาย<br />\r\nรายละเอียดสินค้า อุปกรณ์ออกกําลังกาย ได้ทุกที่ ลู่วิ่งไฟฟ้าแบบเรียบแบน<br />\r\n&bull; รุ่นเฟืองเหล็กแข็งแรงกว่าท้องตลาดที่เป็นเฟืองพลาสติก<br />\r\n&bull; จอ LCD แสดงผล<br />\r\nไฮไลท์: การควบคุมระยะไกลไร้สายอัจฉริยะเริ่มต้นมินิง่ายต่อการจัดเก็บเสียงเล็ก<br />\r\nน้ำหนักสุทธิ: 20 กิโลกรัม<br />\r\nน้ำหนักเครื่องจักรสุทธิ : 20 kg<br />\r\nความยาว : 132cm<br />\r\nความยาวลู่ : 100 cm<br />\r\nความเร็วสูงสุด : 6 km/h<br />\r\nความกว้าง 560 CM<br />\r\nความสูง 190 CM<br />\r\nมอเตอร์สูงสุด: 3.5 HP<br />\r\nแรงม้าเอาท์พุทอย่างต่อเนื่อง: 0.6HP<br />\r\nโหลดสูงสุด: 350 กิโลกรัม</p>\r\n', 2899.00, 'รายการ', 'img144183696420250909_150235.png', 'img244183696420250909_150235.png', 0, '2025-09-09 08:02:35'),
(21, 5, 'keepgoingmax ลู่วิ่งไฟฟ้า มอเตอร์ 3แรงม้า ', '<p>⭐ร้าน Keep Going Max ยินดีต้อนรับทุกท่าน<br />\r\n????ติดตามร้านค้า Keep Going Max เพื่อรับสิทธิพิเศษก่อนใคร<br />\r\n????เพื่อไม่ให้พลาดสินค้าใหม่ หรือโปรโมชั่นลดราคา ฝากกดติดตามร้านค้าด้วยนะคะ<br />\r\n????️สินค้าในร้านเรารับประกันว่าเป็นของแท้ และมีการควบคุมคุณภาพของสินค้าอย่างเข้มงวด เพื่อให้ลูกค้าสามารถสั่งซื้อได้อย่างมั่นใจ<br />\r\n????ขอความกรุณา อ่านก่อนทำการกดสั่งซื้อ เพื่อความมั่นใจในบริการของคุณ<br />\r\nเป็นอุปกรณ์ออกกำลังกายในบ้านที่ยอดเยี่ยมพร้อมชุดคุณสมบัติเต็มเปี่ยม ให้คุณได้ออกกำลังกาย (Cardio) เหมือนอยู่ในฟิตเนส โปรแกรมการออกกำลังกายหลากหลายและท้าทาย 12 โปรแกรมที่แตกต่างกัน เพื่อให้แน่ใจว่าคุณสามารถปรับการออกกำลังกายของคุณได้ทุกครั้งที่คุณก้าวเข้าสู่ลานวิ่งขนาดกว้าง 45มม. พร้อมกับระดับความชันไฟฟ้า 18 ระดับและความเร็วสูงสุดที่ 16 กม./ชม. ขับเคลื่อนด้วยมอเตอร์ประหยัดพลังงานที่มีประสิทธิภาพ 3 แรงม้า(HP) คุณสามารถท้าทายตัวเองในหลาย ๆ วิธีเพื่อเพิ่มประสิทธิภาพการทำงานของร่างกาย และเหมาะกับคนที่ต้องการวิ่งลดน้ำหนัก<br />\r\n&bull; รับประกัน 1 ปี มอเตอร์ประกัน<br />\r\n&bull; ลู่วิ่งไฟฟ้า มอเตอร์ 3แรงม้า<br />\r\n&bull; ความเร็ว 1 - 16 กม./ชม.<br />\r\n&bull; ปรับความชันไฟฟ้า 0-15 ระดับ<br />\r\n&bull; ขนาดสายพาน 450 x 1350 มม.<br />\r\n&bull; ระบบ โช๊คตัวใหญ่พิเศษ พร้อมด้วย 4-Point Commercial Grade Damping System เปลี่ยนแรงกระแทกจากแนวตั้งให้เป็นแนวนอน ลดแรงกระแทกตามข้อของผู้วิ่งได้มากถึง 70%<br />\r\n&bull; พร้อมคัชชั่นยาง 4 จุด รองรับแรงกระแทกเพิ่มขึ้น<br />\r\n&bull; หน้าจอ LCD ( ดูหนัง ฟังเพลง แสดงหน้าจอ ความเร็ว ระยะทาง เวลา แคลลอรี่ และระดับชีพจร)<br />\r\n&bull; รองรับน้ำหนักสูงสุด 130 กิโลกรัม<br />\r\n&bull; Safety Key กุญแจนิรภัยป้องการอันตรายจากการใช้ลู่วิ่ง<br />\r\n&bull; เชื่อมต่อกับมือถือ ด้วย App เทรนเนอร์ส่วนตัว บันทึกข้อมูลการวิ่ง/ระยะทาง/เวลา/ชีพจร<br />\r\n&bull; พับเก็บได้ ประหยัดพื้นที่จัดเก็บ พร้อมป้องกันแรงกระแทกด้วยระบบไฮดรอลิก HSS (Hydraulic Soft Drop System)<br />\r\n&bull; มีล้อ เคลื่อนย้ายง่าย สะดวก<br />\r\n&bull; มีที่วางมือถือ กระบอกน้ำ และแทบเลต<br />\r\n&bull; ขนาดตัวเครื่องก่อนพับ 1635 x 700 x 1230มม.<br />\r\n&bull; ขนาดกล่อง 1560 x 760 x 320มม.<br />\r\n&bull; น้ำหนัก 57.5 กิโลกรัม (Gross Weight 64.5 กิโลกรัม)<br />\r\n&bull; ผลิตภายใต้มาตราฐานจากหลายหน่วยงานทั่วโลก เช่น CE, RoHS, Germany TUV, GS, SGS Certification/<br />\r\nสินค้าจัดส่งเป็นกล่อง ประกอบมาแล้ว 98% เพียงกางลู่วิ่งแล้วใส่น๊อตก่อนใช้งาน</p>\r\n', 4290.00, 'รายการ', 'img1153893374920250909_150356.png', 'img2153893374920250909_150356.png', 0, '2025-09-09 08:03:56'),
(22, 5, 'KEEP ลู่วิ่งพับได้ ', '<p>⭐ร้าน Keep Going Max ยินดีต้อนรับทุกท่าน<br />\r\n????ติดตามร้านค้า Keep Going Max เพื่อรับสิทธิพิเศษก่อนใคร<br />\r\n????เพื่อไม่ให้พลาดสินค้าใหม่ หรือโปรโมชั่นลดราคา ฝากกดติดตามร้านค้าด้วยนะคะ<br />\r\n????️สินค้าในร้านเรารับประกันว่าเป็นของแท้ และมีการควบคุมคุณภาพของสินค้าอย่างเข้มงวด เพื่อให้ลูกค้าสามารถสั่งซื้อได้อย่างมั่นใจ<br />\r\n????ขอความกรุณา อ่านก่อนทำการกดสั่งซื้อ เพื่อความมั่นใจในบริการของคุณ<br />\r\nแนะนำผลิตภัณฑ์:<br />\r\n- ยี่ห้อ: Keep Going Max<br />\r\n✅ ราวจับ Pro 3.5HP<br />\r\nไฮไลท์: การออกแบบบ้านพับสมดุลการหายใจการดูดซึมช็อก<br />\r\nแรงม้าสูงสุด: 3.5 hp<br />\r\nพื้นที่เข็มขัดวิ่ง: 40 * 100 ซม<br />\r\nความกว้างของป้อม: 56 ซม<br />\r\nขนาดที่ขยาย: 110 * 60 * 112 ซม<br />\r\nขนาดพับได้: 110 * 60 * 19 ซม<br />\r\nขนาดบรรจุ: 123 * 60 * 21 ซม<br />\r\nโหลดสูงสุด: 350 กิโลกรัม<br />\r\nช่วงความเร็ว: 1.0-10km / h<br />\r\nใช้วัสดุกระดาน: ความหนาแน่นสูงดูดซับแรงกระแทกที่อ่อนนุ่มวิ่งบอร์ด<br />\r\nน้ำหนักรวม: 24 กิโลกรัม<br />\r\n✅heart rate 3.5HP:<br />\r\nชื่อสินค้า ลู่วิ่งมินิ<br />\r\nความแรง 3.5HP (แรงม้าคงที่ 0.6 HP)<br />\r\nระดับ 3ระดับ<br />\r\nระดับเสียง 600b<br />\r\nชนิดสินค้า ลู่วิ่งไฟฟ้า<br />\r\nน้ำหนักรับได้ 380kg<br />\r\nการพับ พับได้ทันที ไม่ต้องติดตั้ง<br />\r\nสี ดำ<br />\r\nสายพานวิ่ง 1000*400 mm<br />\r\nขนาดพับ 62.5*38*118 cm<br />\r\nขนาดทั้งเครื่อง 127*62*118cm<br />\r\nแรงม้าคงที่ 3.5 HP<br />\r\nNEW!!! การตรวจสอบอัตราการเต้นของหัวใจ<br />\r\nลู่วิ่งไฟฟ้า 3.5 แรงม้า พร้อมระบบรับแรงกระแทก<br />\r\nสามารถพับเก็บได้ประหยัดเนื้อที่<br />\r\nระบบสปริง ลดแรงกระแทกของหัวเข่าและสะโพกของคุณ<br />\r\nสายพานกว้างรวมขอบข้าง 520MM<br />\r\nพับเก็บได้ คุณผู้หญิงก็สามารถเคลื่อนย้ายได้<br />\r\nมี Safety Key หยุดฉุกเฉิน ป้องกันการเกิดอุบัติเหตุ<br />\r\nมีล้อเลื่อนเพื่อความสะดวกในการเคลื่อนย้าย</p>\r\n', 2489.00, 'รายการ', 'img1155564643720250909_151244.png', 'img2155564643720250909_151244.png', 0, '2025-09-09 08:12:44'),
(35, 11, 'GSports ดัมเบลพลาสติก 5 kg ', '<p>Gsports&nbsp;Dumbbell&nbsp;Vinyl&nbsp;น้ำหนัก&nbsp;5&nbsp;kg&nbsp;จำนวน&nbsp;1&nbsp;ชิ้น&nbsp;(เลือกสี)<br />\r\n-&nbsp;มีสีตามที่ระบุไว้เท่านั้น<br />\r\n-&nbsp;สำหรับสร้างและบริหารกล้ามเนื้อแขน&nbsp;ไหล่&nbsp;หลัง<br />\r\n-&nbsp;ใช้ประกอบการบริหารกายหลายท่า<br />\r\n-&nbsp;ออกกำลังได้หลายรูปแบบ&nbsp;มีให้เลือกหลายขนาดตามที่ต้องการ<br />\r\n-&nbsp;วัสดุพลาสติกหุ้มเกรดพรีเมี่ยม&nbsp;ทนทาน<br />\r\n-&nbsp;จุดศูนย์ถ่วงดี&nbsp;สินค้าคุณภาพ&nbsp;ของแท้จาก&nbsp;Gsports<br />\r\n-&nbsp;เป็นแบบชนิดเหลี่ยมไม่กลิ้งไหลเวลาวาง</p>\r\n', 279.00, 'รายการ', 'img127756456620250910_162303.png', 'img227756456620250910_162303.png', 0, '2025-09-10 09:23:03'),
(24, 9, 'XtivePRO Hex Dumbbell 2in1 20 kg', '<p>XtivePRO ศูนย์รวมอุปกรณ์กีฬา เครื่องออกกำลังกาย และผลิตภัณฑ์ส่งเสริมสุขภาพหลากหลายชนิด รวมทั้งอุปกรณ์เดินป่าและการตั้งแคมป์ปิ้ง &quot;ตอบโจทย์ทุกไลฟ์สไตล์ ลุยไปกับคุณทุกแอคทิวิตี้&quot; ทั้งกิจกรรมกลางแจ้ง กิจกรรมในร่ม หรือกิจกรรมที่มีพื้นที่จำกัด พร้อมจัดจำหน่ายตลอด 24 ชั่วโมง มีทีมงาน Support Care ดูแลคุณลูกค้าตั้งแต่ก่อนซื้อและหลังการขาย สินค้าของแท้จะมีประกันจากผู้ขาย 14 วัน ลูกค้าจึงมั่นใจในคุณภาพ 100 % เลือกสินค้าเพื่อสุขภาพ เลือก XtivePRO<br />\r\nชื่อสินค้า : XtivePRO Hex Dumbbell 2in1 20 kg ดัมเบลแปดเหลี่ยม ปรับน้ำหนักได้ ยกน้ำหนัก สร้างกล้ามเนื้อ<br />\r\nแบรนด์ : XtivePRO<br />\r\nขนาดสินค้า :<br />\r\n- แกนด้ามจับดัมเบล x 2 ด้าม ยาว 48 cm เส้นผ่านศูนย์กลาง 2 cm<br />\r\n- แกนด้ามจับบาร์เบล x 1 ด้าม ยาว 106 cm เส้นผ่านศูนย์กลาง 3 cm<br />\r\n- แผ่นน้ำหนัก 1.25 kg x 4 แผ่น<br />\r\n- แผ่นน้ำหนัก 1.5 kg x 4 แผ่น<br />\r\n- แผ่นน้ำหนัก 2 kg x 4 แผ่น<br />\r\n- เส้นผ่าศูนย์กลางของรูแผ่นน้ำหนัก 2.7 cm<br />\r\nน้ำหนักสินค้า : 20 kg<br />\r\nรายละเอียด :<br />\r\nการฝึกกีฬา : ฝึกความแข็งแรงของกล้ามเนื้อ / เพาะกาย / เวทเทรนนิ่ง<br />\r\nสัดส่วนที่ได้ : แขน / ไหล่ / หน้าอก /หลัง<br />\r\nวัสดุ : PVC , ยาง ,ซีเมนต์<br />\r\nสี : ดำ &ndash; แดง | ดำ &ndash; เหลือง (มีล็อค 2 ชั้น)<br />\r\nคุณสมบัติ :<br />\r\n1. ดัมเบลหุ้มพลาสติก PVC ปลอดภัยต่อสุขภาพและสิ่งแวดล้อม<br />\r\n2. การออกแบบแปดเหลี่ยมป้องกันการกลิ้ง ถนอมพื้น เพิ่มความสะดวกสบายในการใช้งาน<br />\r\n3. สามารถใช้กับแกนบาร์เบล ดัมเบล ได้อย่างสะดวก ใช้งานง่าย<br />\r\n4. ทำให้กล้ามเนื้อแขนแข็งแรงขึ้น แขนของเราประกอบด้วยกล้ามเนื้อสองส่วนคือ ไบเซ็ปส์ และไตรเซ็ปส์ ซึ่งทำหน้าที่หดตัวละคลายตัวสลับกันไป การยกดัมเบลเป็นประจำ จะช่วยเพิ่มความแข็งแรงแก่กล้ามเนื้อทั้งสองส่วน<br />\r\n5. กล้ามเนื้อแขนยืดหยุ่นขึ้น จะไม่มีอาการปวด ตึง บาดเจ็บง่าย หรือฟกช้ำง่ายอีกต่อไป<br />\r\n6.สร้างความแข็งแรงแก่ข้อมือและ ปลายแขน เพิ่มแรงบีบของฝ่ามือทั้งสองข้าง รวมถึงช่วยกระชับกล้ามเนื้อลำตัวส่วนบน ทั้งกล้ามเนื้ออก กล้ามเนื้อสะบัก และกล้ามเนื้อด้านข้างลำตัวได้ด้วย<br />\r\n7. ช่วยบริหารเสริมสร้างความแข็งแรงให้กล้ามเนื้อแขน ไหล่ หน้าอก และหลัง<br />\r\n8. ใช้งานง่ายโดยไม่จำกัดเวลาและสถานที่ สามารถฝึกฝนตนเองที่บ้านและโรงยิม<br />\r\n9. แข็งแรง มั่นคง ปลอดภัย รับน้ำหนักได้ถึง 150 kg<br />\r\n10. น็อตขันแน่นไม่หลวม ผลิตจากวัสดุคุณภาพ</p>\r\n', 1280.00, 'รายการ', 'img1192414034220250910_160110.png', 'img2192414034220250910_160110.png', 0, '2025-09-10 09:01:10'),
(25, 9, 'XtivePRO ดัมเบล 1 ชิ้น ขนาด 1.5 - 3 kg', '<p>การฝึกกีฬา : ฝึกความแข็งแรงของกล้ามเนื้อ / บริหารกล้ามเนื้อ / เวทเทรนนิ่ง<br />\r\nวัสดุ : PVCทรายเหล็ก (Iron sand)เหล็กเส้น<br />\r\nสี : ม่วง Purple / ชมพู Pink / เขียว Green / โอลด์โรส Old Rose<br />\r\nคุณสมบัติ :<br />\r\n1. XtivePRO ดัมเบลฟิสเนต ดัมเบลสำหรับผู้หญิง รุ่น PVC Dumbbell<br />\r\n2. มีน้ำหนักให้เลือก 4 ขนาด คือ 1.5, 2, 2.5, และ 3 kg ตามระดับความท้าทายที่ต้องการ<br />\r\n3. ช่วยเสริมสร้างความแข็งแรงให้กล้ามเนื้อแขน, ไหล่, และหลัง ให้เฟิร์มกระชับสวยได้รูปทรง พร้อมลดไขมันสะสมและเซลล์ลูไลท์ที่เกาะอยู่ในต้นแขน<br />\r\n4. เหมาะสำหรับผู้หญิงและผู้เริ่มต้นฝึกโดยเฉพาะ เนื่องจากมีน้ำหนักเบา ขนาดกระทัดรัด ถนัดมือ<br />\r\n5. ดีไซน์สวย ทันสมัย หัวดัมเบลรูปทรงเหลี่ยม สามารถวางพื้นได้ ไม่ล้มกลิ้งไป-มา ป้องกันพื้นจากแรงกระแทกและรอยขีดข่วน<br />\r\n6. โครงภายในเป็นเหล็กเส้นหุ้มด้วยทรายเหล็ก (Iron sand) คุณภาพดี แข็งแรง ทนทาน<br />\r\n7. ด้านนอกหุ้มพลาสติก PVC ปลอดภัย ทำความสะอาดง่าย ไม่ต้องกังวลเรื่องเหงื่อออกระหว่างออกกำลังกาย<br />\r\n8. จับสบายกันลื่น ไม่เจ็บมือและทนการสึกหรอ พร้อมปกป้องพื้นบ้านของคุณให้ปลอดภัย ไม่เป็นรอย<br />\r\n9. ขนาดกะทัดรัด ใช้งานง่ายโดยไม่จำกัดเวลาและสถานที่ สามารถฝึกฝนตนเองที่บ้านและโรงยิม<br />\r\n10. ประยุกต์ใช้เป็นอุปกรณ์ประกอบการบริหารกายได้หลากหลายท่า และยังสามารถใช้งานคู่กับม้านั่งยกน้ำหนักได้อีกด้วย<br />\r\nวิธีการใช้งาน :<br />\r\n- ใช้สำหรับบริหารเสริมสร้างกล้ามเนื้อส่วนแขน ไหล่ และหลัง<br />\r\n- ประยุกต์ใช้เป็นอุปกรณ์ประกอบการบริหารกายได้หลายท่า<br />\r\nคำแนะนำ / ข้อควรระวัง :<br />\r\n- การใช้ผ้าสะอาดชุบน้ำบิดหมาด เช็ดทำความสะอาด เพื่อป้องกันคราบเหงื่อ<br />\r\n- หลีกเลี่ยงการจัดเก็บบนที่สูง และควรเก็บให้พ้นมือเด็กเล็ก</p>\r\n', 599.00, 'รายการ', 'img1141085246320250910_160202.png', 'img2141085246320250910_160202.png', 0, '2025-09-10 09:02:02'),
(26, 9, 'XtivePRO เคตเทิลเบล ดัมเบล 6-10 kg', '<p>XtivePRO ศูนย์รวมอุปกรณ์กีฬา เครื่องออกกำลังกาย และผลิตภัณฑ์ส่งเสริมสุขภาพหลากหลายชนิด รวมทั้งอุปกรณ์เดินป่าและการตั้งแคมป์ปิ้ง &quot;ตอบโจทย์ทุกไลฟ์สไตล์ ลุยไปกับคุณทุกแอคทิวิตี้&quot; ทั้งกิจกรรมกลางแจ้ง กิจกรรมในร่ม หรือกิจกรรมที่มีพื้นที่จำกัด พร้อมจัดจำหน่ายตลอด 24 ชั่วโมง มีทีมงาน Support Care ดูแลคุณลูกค้าตั้งแต่ก่อนซื้อและหลังการขาย สินค้าของแท้จะมีประกันจากผู้ขาย 14 วัน ลูกค้าจึงมั่นใจในคุณภาพ 100 % เลือกสินค้าเพื่อสุขภาพ เลือก XtivePRO<br />\r\nชื่อสินค้า : XtivePRO เคตเทิลเบล ดัมเบล 6-10 kg ดัมเบลหูหิ้ว ลูกยกน้ำหนัก ดัมเบลลูกตุ้ม Kettlebell Dumbbell<br />\r\nแบรนด์: XtivePRO<br />\r\nขนาดสินค้า :<br />\r\n6 kg : กว้าง 17.5 cm x ยาว 18.5 cm x สูง 24.5 cm<br />\r\n8 kg : กว้าง 18.5 cm x ยาว 23.5 cm x สูง 26 cm<br />\r\n10 kg : กว้าง 21.2 cm x ยาว 26.5 cm x สูง 30.5 cm<br />\r\nน้ำหนักสินค้า : 6 kg, 8 kg, 10 kg<br />\r\nรายละเอียด :<br />\r\nการฝึกกีฬา : ฝึกความแข็งแรงของกล้ามเนื้อ / บริหารกล้ามเนื้อ / เวทเทรนนิ่ง<br />\r\nวัสดุ : พลาสติก PE, ซีเมนต์ผสมทรายเหล็ก<br />\r\nสี : ดำ, ชมพู, เทา<br />\r\nคุณสมบัติ<br />\r\n1. วัสดุภายนอกทำจากพลาสติก PE คุณภาพอย่างดีเยี่ยม แข็งแรง ทนทาน อีกทั้งยังเก็บเสียงในขณะใช้งาน<br />\r\n2. ภายในดัมเบลเป็นซีเมนต์ผสมทรายเหล็ก ทำให้จุดศูนย์ถ่วงน้ำหนัก ได้มาตรฐาน แข็งแรง<br />\r\n3. ฐานแบบแบนเพื่อป้องกันรอย การแตก และการกลิ้ง บนพื้น<br />\r\n4. หูหิ้วออกแบบกระชับมือ ปลอดภัยต่อการใช้งาน ป้องกันการลื่น ขณะออกกำลังกาย<br />\r\n5. มั่นคง ปลอดภัย รับแรงกระแทกได้ถึง 150 kg<br />\r\n6. รูปทรงเฉพาะของเคตเทิลเบล ทำให้สามารถที่จะยกแบบแกว่งได้สะดวกและปลอดภัยกว่าดัมเบล เนื่องจากศูนย์ถ่วงและหูหิ้วถูกออกแบบมาเพื่อการยกในลักษณะแกว่งโดยเฉพาะ<br />\r\n7. เพิ่มความแข็งแรงให้กล้ามเนื้อส่วนล่างจะช่วยเพิ่มประสิทธิภาพในการวิ่งและป้องกันอาการบาดเจ็บได้ นอกจากนี้การฝึกโดยใช้ Kettlebell ยังจะช่วยฝึกกล้ามเนื้อขาและเพิ่มพละกำลังในแบบที่การวิ่ง<br />\r\n8. ช่วยเสริมสร้างความแข็งแรงของกล้ามเนื้อ เอ็นยืด และข้อต่อ เพิ่มความหนาแน่นของกระดูก ลดอาการปวดหลัง บ่า ไหล่ ช่วยให้รูปร่างกระชับได้สัดส่วน ลดความเสี่ยงในการเกิดโรคต่างๆ เช่น ให้ระบบโลหิตไหลเวียนได้ดีขึ้น และเสริมสร้างการทำงานของสมอง สามารถเล่นได้ทั้งผู้หญิงและผู้ชาย<br />\r\n9. การยกเคตเทิลเบลเป็นเวลาติดต่อกันนาน 20 นาที จะสามารถเผาผลาญแคลอรีได้มากถึง 400 แคลอรี เมื่อกล้ามเนื้อถูกใช้งานมากขึ้น ร่างกายก็จะเผาผลาญพลังงานมากขึ้น ไขมันก็ถูกกำจัดออกไปด้วย<br />\r\n10. ช่วยบริหารเสริมสร้างความแข็งแรงให้กล้ามเนื้อแขน ไหล่ หน้าท้อง ต้นขา สะโพกและก้น<br />\r\n11. ใช้งานง่ายโดยไม่จำกัดเวลาและสถานที่ สามารถฝึกฝนตนเองที่บ้านและโรงยิม<br />\r\nวิธีการใช้งาน<br />\r\nใช้ออกกำลังกายแนวเวทเทรนนิ่ง เช่น Single, Swing, Squat, Lunge, Lift<br />\r\nตัวอย่างท่าพื้นฐานสำหรับการใช้งาน<br />\r\n- Single ยืนแยกเท้าให้ห่างเท่ากับความกว้างของช่วงไหล่ ใช้มือข้างหนึ่งยกเคตเทิลเบลขึ้นมาแบบงอศอกให้เคตเทิลเบลอยู่ด้านหลังหัวไหล่ แล้วจึงยกเคตเทิลเบลที่อยู่ระดับไหลขึ้นไปสุดแขน ทำแบบนี้ทั้ง 2 ข้างสลับกัน<br />\r\n- Swing ยืนแยกเท้าให้ห่างเท่ากับความกว้างของช่วงไหล่ ใช้มือ 2 ข้างยกเคตเทิลเบลขึ้นมาถือไว้อยู่ด้านหน้าลำตัว ออกแรงเหวี่ยงเบาๆ ขึ้นมาด้านหน้าให้สูงประมาณระดับหัวไหล่แล้วเหวี่ยงลงแบบผ่อนแรงพร้อมย่อขาเล็กน้อยให้เคตเทิลเบลอยู่ตรงกลางระหว่างขา<br />\r\nคำแนะนำ / ข้อควรระวัง :<br />\r\n- ระมัดระวังการเหวี่ยงเคตเทิลเบลในผู้ที่เคยมีอาการบาดเจ็บที่หลังหรือไหล่มาก่อน เพราะอาจจะส่งผลให้มีอาการบาดเจ็บมากขึ้น ใช้งานในท่าทางที่เหมาะสมและถูกต้อง และควรเลือกยกเคตเทิลเบลที่มีน้ำหนักไม่มากจนเกินกำลัง ถ้ารู้สึกเหนื่อยล้าเกินไปควรพักร่างกายก่อน<br />\r\n- ใช้ผ้าแห้ง เช็ดทำความสะอาด เพื่อป้องกันคราบเหงื่อ หลีกเลี่ยงการเก็บในที่ชื้นหรือกลางแจ้งเพื่อป้องกันการเกิดสนิม<br />\r\n- หลีกเลี่ยงการจัดเก็บบนที่สูง และควรเก็บให้พ้นมือเด็กเล็ก</p>\r\n', 680.00, 'รายการ', 'img159896285320250910_160300.png', 'img259896285320250910_160300.png', 0, '2025-09-10 09:03:00'),
(27, 9, 'XtivePRO ดัมเบล 4 in 1 ', '<p>XtivePRO ศูนย์รวมอุปกรณ์กีฬา เครื่องออกกำลังกาย และผลิตภัณฑ์ส่งเสริมสุขภาพหลากหลายชนิด รวมทั้งอุปกรณ์เดินป่าและการตั้งแคมป์ปิ้ง ตอบโจทย์ทุกไลฟ์สไตล์ ลุยไปกับคุณทุกแอคทิวิตี้&quot; ทั้งกิจกรรมกลางแจ้ง กิจกรรมในร่ม หรือกิจกรรมที่มีพื้นที่จำกัด พร้อมจัดจำหน่ายตลอด 24 ชั่วโมง มีทีมงาน Support Care ดูแลคุณลูกค้าตั้งแต่ก่อนซื้อและหลังการขาย สินค้าของแท้จะมีประกันจากผู้ขาย 14 วัน ลูกค้าจึงมั่นใจในคุณภาพ 100 % เลือกสินค้าเพื่อสุขภาพ เลือก XtivePRO<br />\r\nชื่อสินค้า :<br />\r\nXtivePRO ดัมเบล 4 in 1 ชุดออกกำลังอเนกประสงค์ ดัมเบล บาร์เบล เคตเทิลเบล Push-Up ยกน้ำหนัก วิดพื้น ดัมเบลหูหิ้ว แผ่นยกน้ำหนัก ปรับน้ำหนักได้<br />\r\nแบรนด์ : XtivePRO<br />\r\nขนาดสินค้า :<br />\r\nขนาดสินค้า : 20 kg<br />\r\n- แผ่นน้ำหนัก 2 กิโลกรัม x 4 แผ่น เส้นผ่านศูนย์กลาง 18 cm<br />\r\n- แผ่นน้ำหนัก 1.5 กิโลกรัม x 4 แผ่น เส้นผ่านศูนย์กลาง 17 cm<br />\r\n- แผ่นน้ำหนัก 1.25 กิโลกรัม x 4 แผ่น เส้นผ่านศูนย์กลาง 15.5 cm<br />\r\n- ก้านบาร์เบล x 1 ด้าม ความยาว 38 cm เส้นผ่านศูนย์กลาง 7.2 cm<br />\r\n- ก้านดัมเบล x 2 ด้าม ความยาว 40.5 cm<br />\r\n- ก้านแคทเทิลเบล x 1 ชิ้น ความยาว 8 cm<br />\r\n- Push-up grip x 2 ชิ้น ความยาว 13.5 cm<br />\r\n- ตัวล็อก x 4 ชิ้น เส้นผ่านศูนย์กลาง 2.8 cm<br />\r\nขนาดสินค้า : 30 kg<br />\r\n- แผ่นน้ำหนัก 2.5 กิโลกรัม x 4 แผ่น เส้นผ่านศูนย์กลาง 20 cm<br />\r\n- แผ่นน้ำหนัก 2 กิโลกรัม x 4 แผ่น เส้นผ่านศูนย์กลาง 18 cm<br />\r\n- แผ่นน้ำหนัก 1.5 กิโลกรัม x 4 แผ่น เส้นผ่านศูนย์กลาง 17 cm<br />\r\n- แผ่นน้ำหนัก 1.25 กิโลกรัม x 4 แผ่น เส้นผ่านศูนย์กลาง 15.5 cm<br />\r\n- ก้านบาร์เบล x 1 ด้าม ความยาว 38 cm เส้นผ่านศูนย์กลาง 7.2 cm<br />\r\n- ก้านดัมเบล x 2 ด้าม ความยาว 50.5 cm<br />\r\n- ก้านแคทเทิลเบล x 1 ชิ้น ความยาว 8 cm<br />\r\n- Push-up grip x 2 ชิ้น ความยาว 13.5 cm<br />\r\n- ตัวล็อก x 4 ชิ้น เส้นผ่านศูนย์กลาง 2.8 cm<br />\r\nขนาดสินค้า : 40 kg<br />\r\n- แผ่นน้ำหนัก 3 กิโลกรัม x 8 แผ่น เส้นผ่านศูนย์กลาง 22.5 cm<br />\r\n- แผ่นน้ำหนัก 2.5 กิโลกรัม x 4 แผ่น เส้นผ่านศูนย์กลาง 20 cm<br />\r\n- แผ่นน้ำหนัก 1.25 กิโลกรัม x 4 แผ่น เส้นผ่านศูนย์กลาง 15.5 cm<br />\r\n- ก้านบาร์เบล x 1 ด้าม ความยาว 38 cm เส้นผ่านศูนย์กลาง 7.2 cm<br />\r\n- ก้านดัมเบล x 2 ด้าม ความยาว 50.5 cm<br />\r\n- ก้านแคทเทิลเบล x 1 ชิ้น ความยาว 8 cm<br />\r\n- Push-up grip x 2 ชิ้น ความยาว 13.5 cm<br />\r\n- ตัวล็อก x 4 ชิ้น เส้นผ่านศูนย์กลาง 2.8 cm<br />\r\nน้ำหนักสินค้า :<br />\r\n20 kg, 30 kg, 40 kg<br />\r\nรายละเอียด :<br />\r\nการฝึกกีฬา : ฝึกความแข็งแรงของกล้ามเนื้อ / บริหารกล้ามเนื้อ / เวทเทรนนิ่ง<br />\r\nวัสดุ : ABSNBSซีเมนต์ทรายเหล็ก<br />\r\nสี : ดำแดง<br />\r\nจำนวนแพ็กเกจ : 2 กล่อง<br />\r\nกล่อง 1 ขนาด : W32xL62xH16.5 cm น้ำหนักแพ็กเกจ: 19.185 kg<br />\r\nกล่อง 2 ขนาด : W25.5xL45xH16.5 cm น้ำหนักแพ็กเกจ: 24.935 kg<br />\r\nคุณสมบัติ :<br />\r\n1. ก้านบาร์เบล แกนกลางหุ้มโฟมหนา รองรับแรงกระแทก ช่วยลดแรงกดที่บริเวณคอกระดูกสันหลัง<br />\r\n2. ด้ามจับดัมเบล ออกแบบกระชับมือ ป้องกันการลื่น ขณะออกกำลังกาย<br />\r\n3. Push-up grip ขนาดพอดีมือ ไม่ลื่นมือ ช่วยวิดพื้นอย่างมีประสิทธิภาพ<br />\r\n4. ขนาดกะทัดรัด สะดวกต่อการใช้งาน ปรับเปลี่ยนได้ถึง 4 รูปแบบ ช่วยประหยัดพื้นที่ใช้สอย<br />\r\n5. สามารถออกกำลังกายได้ทั้งแบบพื้นฐาน ไปจนถึงระดับมืออาชีพ<br />\r\n6. อเนกประสงค์สามารถออกกำลังกายได้หลายรูปแบบ ครบทั่วทั้งร่างกาย<br />\r\n7. แข็งแรง มั่นคง ปลอดภัย ผลิตจากวัสดุคุณภาพ ได้มาตราฐาน<br />\r\n8. ช่วยกระชับต้นแขน ลดหุ่น ลดไขมัน สร้างกล้ามเนื้อ เสริมความแข็งแรงของร่างกาย<br />\r\nวิธีการใช้งาน :<br />\r\n1. ดัมเบล : แกนจับ 2 ด้าม สามารถประกอบเป็นดัมเบลได้ 2 ข้าง และปรับน้ำหนักเองได้<br />\r\n2. บาร์เบล : ต่อแกนจับ 2 ด้ามเข้ากับแกนกลางหุ้มโฟมหนา สามารถรองรับบ่า ไหล่ ไม่ทำให้บาดเจ็บ<br />\r\n3. เคตเทิลเบล : ต่อที่จับกับเข้าแกนดัมเบล แล้วเพิ่มแผ่นน้ำหนักตามต้องการ<br />\r\n4. Push-Up : ถอดแผ่นน้ำหนักออกจากที่จับทั้งหมด สามารถปรับเปลี่ยนเป็นที่วิดพื้นได้<br />\r\nคำแนะนำ / ข้อควรระวัง :<br />\r\n- การใช้ผ้าสะอาดชุบน้ำบิดหมาด เช็ดทำความสะอาด เพื่อป้องกันคราบเหงื่อ<br />\r\n- ตรวจสอบตัวยึดแผ่นน้ำหนักทุกครั้งก่อนใช้งาน เพื่อความปลอดภัยของผู้ใช้งาน</p>\r\n', 4820.00, 'รายการ', 'img1114431117420250910_160350.png', 'img2114431117420250910_160350.png', 0, '2025-09-10 09:03:50'),
(41, 13, 'ลู่วิ่ง', '<p>5</p>\r\n', 1000.00, 'กล่อง', 'img1213660472420250917_140913.png', '', 0, '2025-09-17 07:09:13'),
(29, 10, 'SC-RHD225', '<p>S SPORTS SC-RHD225 ดัมเบล S SPORTS รูปทรง 6 เหลี่ยม ขนาด 22.5 กก. ผลิตจากยางคุณภาพมีความทนทานสูง มาพร้อมแกนด้ามดัมเบลที่ได้รับการออกแบบมาตามหลักสรีรศาสตร์ให้จับกระชับพอดีมือ สามารถนำไปประยุกต์ใช้ในท่าการออกกำลังกายได้หลากหลายรูปแบบ เหมาะสำหรับใช้ออกกำลังกายเพื่อเสริมสร้างกล้ามเนื้อและเพิ่มรายละเอียดให้กับกล้ามเนื้อให้ดูเป็นทรงตัดกันสวยงาม<br />\r\n<br />\r\n1.ดีไซน์รูปทรง 6 เหลี่ยม<br />\r\n2.ขนาดน้ำหนัก 22.5 กิโลกรัม<br />\r\n3.ผลิตจากยางคุณภาพมีความทนทานสูง<br />\r\n4.แกนด้ามดัมเบลได้รับการออกแบบมาตามหลักสรีรศาสตร์ให้จับกระชับพอดีมือ<br />\r\n5.สามารถใช้บริหารร่างกายได้ทุกส่วน อาทิเช่น แขน ขา ไหล่ หลัง ฯลฯ<br />\r\n6.เหมาะสำหรับใช้ออกกำลังกายเพื่อเสริมสร้างและเพิ่มความกระชับให้กับกล้ามเนื้อ<br />\r\n7.ดัมเบล S SPORTS</p>\r\n', 2590.00, 'รายการ', 'img1203154343020250910_160839.png', 'img2203154343020250910_160839.png', 0, '2025-09-10 09:08:39'),
(30, 10, 'DB05HS 5 กก.', '<p>S SPORTS DB05HS ดัมเบล S SPORTS รูปทรง 6 เหลี่ยม ผลิตจากวัสดุคุณภาพมีความทนทานสูง มาพร้อมแกนด้ามดัมเบลที่ได้รับการออกแบบมาตามหลักสรีรศาสตร์ให้จับกระชับพอดีมือ สามารถนำไปประยุกต์ใช้ในท่าการออกกำลังกายได้หลากหลายรูปแบบ เหมาะสำหรับใช้ออกกำลังกายเพื่อเสริมสร้างกล้ามเนื้อและเพิ่มรายละเอียดให้กับกล้ามเนื้อให้ดูเป็นทรงตัดกันสวยงาม</p>\r\n', 590.00, 'รายการ', 'img1185975295420250910_161932.png', 'img2185975295420250910_161932.png', 1, '2025-09-10 09:13:24'),
(31, 10, 'S SPORTS SC-RHD075 Rubber ', '<p>ดัมเบล S SPORTS SC-RHD075 Rubber รูปทรง 6 เหลี่ยม ผลิตจากวัสดุคุณภาพมีความทนทานสูง มาพร้อมแกนด้ามดัมเบลที่ได้รับการออกแบบมาตามหลักสรีรศาสตร์ให้จับกระชับพอดีมือ สามารถนำไปประยุกต์ใช้ในท่าการออกกำลังกายได้หลากหลายรูปแบบ เหมาะสำหรับใช้ออกกำลังกายเพื่อเสริมสร้างกล้ามเนื้อและเพิ่มรายละเอียดให้กับกล้ามเนื้อให้ดูเป็นทรงตัดกันสวยงาม</p>\r\n', 890.00, 'รายการ', 'img1166691736420250910_161634.png', 'img2166691736420250910_161634.png', 0, '2025-09-10 09:16:34'),
(32, 10, 'S SPORTS Shiny 08 3 กก. ดัมเบล', '<p>S SPORTS Shiny 08 ดัมเบล S SPORTS ขนาด 3 กก. ผลิตจากวัสดุมีความทนทานสูง มาพร้อมแกนดัมเบลที่ได้รับการออกแบบมาตามหลักสรีรศาสตร์ช่วยให้จับกระชับพอดีมือ สามารถนำไปประยุกต์ใช้ในท่าการออกกำลังกายได้หลากหลายรูปแบบ เหมาะสำหรับใช้ออกกำลังกายเพื่อเสริมสร้างและเพิ่มความกระชับให้กับกล้ามเนื้อ</p>\r\n', 290.00, 'รายการ', 'img19212119220250910_161732.png', 'img29212119220250910_161732.png', 0, '2025-09-10 09:17:32'),
(33, 10, 'S SPORTS DM02 Shiny 2 กก. ', '<p>S SPORTS DM02 Shiny ดัมเบล S SPORTS รูปทรง 6 เหลี่ยม ขนาด 2 กิโลกรัม ผลิตจากวัสดุคุณภาพมีความทนทานสูง มาพร้อมแกนด้ามดัมเบลที่ได้รับการออกแบบมาตามหลักสรีรศาสตร์ให้จับกระชับพอดีมือ สามารถนำไปประยุกต์ใช้ในท่าการออกกำลังกายได้หลากหลายรูปแบบ เหมาะสำหรับใช้ออกกำลังกายเพื่อเสริมสร้างกล้ามเนื้อและเพิ่มรายละเอียดให้กับกล้ามเนื้อให้ดูเป็นทรงตัดกันสวยงาม<br />\r\n<br />\r\n1.ดัมเบล S SPORTS<br />\r\n2.ขนาด 2 กิโลกรัม<br />\r\n3.ดีไซน์รูปทรง 6 เหลี่ยม<br />\r\n4.ผลิตจากวัสดุคุณภาพมีความทนทานสูง<br />\r\n5.แกนด้ามดัมเบลได้รับการออกแบบมาตามหลักสรีรศาสตร์ให้จับกระชับพอดีมือ<br />\r\n6.สามารถใช้บริหารร่างกายได้ทุกส่วน อาทิเช่น แขน ขา ไหล่ หลัง ฯลฯ<br />\r\n7.เหมาะสำหรับใช้ออกกำลังกายเพื่อเสริมสร้างและเพิ่มความกระชับให้กับกล้ามเนื้อ</p>\r\n', 250.00, 'รายการ', 'img1212845379120250910_161821.png', 'img2212845379120250910_161821.png', 0, '2025-09-10 09:18:21'),
(34, 10, 'S SPORTS SC-DB01HS 1KG ', '<p>S SPORTS SC-DB01HS 1KG ดัมเบล 6 เหลี่ยม ผลิตจากยางคุณภาพมีความทนทานสูง แกนด้ามดัมเบลได้รับการออกแบบมาตามหลักสรีรศาสตร์ให้จับกระชับพอดีมือ สามารถใช้บริหารร่างกายได้ทุกส่วนเหมาะสำหรับใช้ออกกำลังกายเพื่อเสริมสร้างและเพิ่มความกระชับให้กับกล้ามเนื้อ<br />\r\n<br />\r\n1.ผลิตจากวัสดุที่ทนทาน<br />\r\n2.การออกแบบตามหลักสรีรศาสตร์<br />\r\n3.น้ำหนัก: 1 กิโลกรัม<br />\r\n4.กันลื่น<br />\r\n5.ดัมเบล S SPORTS</p>\r\n', 150.00, 'รายการ', 'img184198447920250910_162101.png', 'img284198447920250910_162101.png', 0, '2025-09-10 09:21:01'),
(36, 11, 'Dumbbell Black 2 kg x 2 รุ่น DB2-B x 2', '<p>Gsports Dumbbell 2KG x2 ดัมเบล พลาสติก 2กก. *แพ็คคู่ สีดำ<br />\r\n- น้ำหนักชิ้นละ 2 กิโลกรัม 2 ชิ้นน้ำหนักรวม 4 กิโลกรัม<br />\r\n- สำหรับสร้างและบริหารกล้ามเนื้อแขน ไหล่ หลัง<br />\r\n- ใช้ประกอบการบริหารกายหลายท่า<br />\r\n- ออกกำลังได้หลายรูปแบบ มีให้เลือกหลายขนาดตามที่ต้องการ<br />\r\n- วัสดุพลาสติกหุ้มเกรดพรีเมี่ยม ทนทาน<br />\r\n- จุดศูนย์ถ่วงดี สินค้าคุณภาพ ของแท้จาก Gsports<br />\r\n- เป็นแบบชนิดเหลี่ยมไม่กลิ้งไหลขณะวาง</p>\r\n', 259.00, 'รายการ', 'img159311873920250910_162343.png', 'img259311873920250910_162343.png', 0, '2025-09-10 09:23:43');
INSERT INTO `tbl_product` (`p_id`, `t_id`, `p_name`, `p_detial`, `p_price`, `p_unit`, `p_img1`, `p_img2`, `p_view`, `date_save`) VALUES
(37, 11, 'Kettlebell Black 5 kg x 2 รุ่น KB05-B x 2', '<p>Gsports Kettlebell 5KG x 2 Black เคตเทิลเบล ดัมเบลหูหิ้ว 5 กก. สีดำ *แพ็คคู่<br />\r\n- สร้างและบริหารกล้ามเนื้อแขน ไหล่ หลัง และ ขา<br />\r\n- เหมาะกับคนทุกเพศทุกวัย<br />\r\n- ใช้ประกอบการบริหารกายหลายท่าเช่น Squat, Lunge, Lift, Swing<br />\r\n- ออกกำลังได้หลายรูปแบบ<br />\r\n- มีให้เลือกหลายขนาดตามที่ต้องการ<br />\r\n- วัสดุพลาสติกหุ้มเกรดพรีเมี่ยม ทนทาน<br />\r\n- จุดศูนย์ถ่วงดี สินค้าคุณภาพ<br />\r\n- หูหิ้วออกแบบเพื่อกระชับมือ</p>\r\n', 539.00, 'รายการ', 'img17838806320250910_162423.png', 'img27838806320250910_162423.png', 0, '2025-09-10 09:24:23'),
(38, 11, 'Dumbbell Black 8 kg x 2 รุ่น DB8-B x 2', '<p>GSports Dumbbell Black 8KG x 2 ดัมเบล พลาสติกสีดำ น้ำหนัก 8 กก. *แพ็คคู่<br />\r\n- น้ำหนักชิ้นละ 8 kg 2 ชิ้น น้ำหนักรวม 16 kg<br />\r\n- สำหรับสร้างและบริหารกล้ามเนื้อแขน ไหล่ หลัง<br />\r\n- ใช้ประกอบการบริหารกายหลายท่วงท่า<br />\r\n- ออกกำลังได้หลายรูปแบบ มีให้เลือกหลายขนาดตามที่ต้องการ<br />\r\n- วัสดุพลาสติกหุ้มเกรดพรีเมี่ยม ทนทาน<br />\r\n- จุดศูนย์ถ่วงดี สินค้าคุณภาพ ของแท้จาก GSports<br />\r\n- เป็นแบบชนิดเหลี่ยมไม่กลิ้งไหลขณะวางลง</p>\r\n', 839.00, 'รายการ', 'img198622570120250910_162505.png', 'img298622570120250910_162505.png', 0, '2025-09-10 09:25:05'),
(39, 11, 'Dumbbell 3 kg x 2 รุ่น AD62521A x 2', '<p>Gsports Dumbbell 3KG x2 ดัมเบล พลาสติก 3กก. *แพ็คคู่<br />\r\n- น้ำหนักตัวละ 3 kg 2ตัวน้ำหนักรวม 6 kg<br />\r\n- สำหรับสร้างและบริหารกล้ามเนื้อแขน ไหล่ หลัง<br />\r\n- ใช้ประกอบการบริหารกายหลายท่า<br />\r\n- ออกกำลังได้หลายรูปแบบ มีให้เลือกหลายขนาดตามที่ต้องการ</p>\r\n', 337.00, 'รายการ', 'img1173812703120250910_162538.png', 'img2173812703120250910_162538.png', 0, '2025-09-10 09:25:38');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_type`
--

CREATE TABLE `tbl_type` (
  `t_id` int(11) NOT NULL,
  `t_name` varchar(100) NOT NULL,
  PRIMARY KEY (`t_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--
-- Dumping data for table `tbl_type`
--

INSERT INTO `tbl_type` (`t_id`, `t_name`) VALUES
(1, 'VITA XTRONG'),
(2, 'BAAM!!'),
(3, 'Fit Angel'),
(4, 'OMA'),
(5, 'Keep Going Max'),
(9, 'XtivePRO'),
(10, 'SUPERSPORTS'),
(11, 'GSports'),
(13, 'komkrit');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `tbl_bank`
--
ALTER TABLE `tbl_bank`
  ADD PRIMARY KEY (`b_id`);

--
-- Indexes for table `tbl_member`
--
ALTER TABLE `tbl_member`
  ADD PRIMARY KEY (`mem_id`);

--
-- Indexes for table `tbl_news`
--
ALTER TABLE `tbl_news`
  ADD PRIMARY KEY (`n_id`);

--
-- Indexes for table `tbl_order`
--
ALTER TABLE `tbl_order`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `tbl_order_detail`
--
ALTER TABLE `tbl_order_detail`
  ADD PRIMARY KEY (`d_id`);

--
-- Indexes for table `tbl_product`
--
ALTER TABLE `tbl_product`
  ADD PRIMARY KEY (`p_id`);

--
-- Indexes for table `tbl_type`
--
ALTER TABLE `tbl_type`
  ADD PRIMARY KEY (`t_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_bank`
--
ALTER TABLE `tbl_bank`
  MODIFY `b_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_member`
--
ALTER TABLE `tbl_member`
  MODIFY `mem_id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_news`
--
ALTER TABLE `tbl_news`
  MODIFY `n_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_order`
--
ALTER TABLE `tbl_order`
  MODIFY `order_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `tbl_order_detail`
--
ALTER TABLE `tbl_order_detail`
  MODIFY `d_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `tbl_product`
--
ALTER TABLE `tbl_product`
  MODIFY `p_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `tbl_type`
--
ALTER TABLE `tbl_type`
  MODIFY `t_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- Database: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

