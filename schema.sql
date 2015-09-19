DROP TABLE IF EXISTS `sections`;
CREATE TABLE `sections` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`course_code` varchar(300) NOT NULL,
	`course_name` varchar(3000) NOT NULL,
	`sem` varchar(300) NOT NULL,
	`type` varchar(3000),
	`enr_max` int(11) NOT NULL,
	`enr_count` int(11) NOT NULL,
	`status` varchar(300) NOT NULL,
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

DROP TABLE IF EXISTS `user_courses`;
CREATE TABLE `user_courses` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`u_id` int(11) NOT NULL,
	`section_id` int(11) NOT NULL,
	UNIQUE(`u_id`,`section_id`),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
