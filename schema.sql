DROP TABLE IF EXISTS `sections`;
CREATE TABLE `sections` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`course_code` varchar(300) NOT NULL,
	`sem` enum('summer','s1,s2') NOT NULL,
	`enr_max` int(11) NOT NULL,
	`enr_count` int(11) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`email` varchar(300) not null,
	`mobile` varchar(15) not null,
	UNIQUE(`email`),
	UNIQUE(`mobile`),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;