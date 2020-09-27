USE EMPLOYEE;

CREATE TABLE `department` (
  `ID` INT(11) AUTO_INCREMENT,
  `DEPARTMENT_NAME` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

CREATE TABLE `role` (
  `ID` INT(11) AUTO_INCREMENT,
  `ROLE_TITLE` VARCHAR(45) NOT NULL,
  `ROLE_SALARY` DECIMAL,
  `DEPARTMENT_ID` INT,
  PRIMARY KEY (`ID`),
  KEY `department_id_idx` (`DEPARTMENT_ID`),
  CONSTRAINT `department_id` FOREIGN KEY (`DEPARTMENT_ID`) REFERENCES `department` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

CREATE TABLE `employee` (
  `ID` INT AUTO_INCREMENT,
  `FIRST_NAME` VARCHAR(45),
  `LAST_NAME` VARCHAR(45),
  `MANAGER_ID`  INT,
  `ROLE_ID` INT,
  PRIMARY KEY (`ID`),
  KEY `role_id_idx` (`ROLE_ID`),
  KEY `manager_id_idx` (`MANAGER_ID`),
  CONSTRAINT `manager_id` FOREIGN KEY (`MANAGER_ID`) REFERENCES `employee` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `role_id` FOREIGN KEY (`ROLE_ID`) REFERENCES `role` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;


Error Code: 1452. Cannot add or update a child row: a foreign key constraint fails (`employee`.`role`, CONSTRAINT `department_id` FOREIGN KEY (`DEPARTMENT_ID`) REFERENCES `department` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION)
