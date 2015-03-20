CREATE TABLE IF NOT EXISTS WEBAPI_PROPERTIES 
(id INTEGER NOT NULL,
jdbc_url VARCHAR(100) NOT NULL,
jdbc_user VARCHAR(25) NOT NULL,
jdbc_pass VARCHAR(25) NOT NULL,
jdbc_driver_class_name VARCHAR(100) NOT NULL,
flyway_jdbc_url VARCHAR(100) NOT NULL,
flyway_jdbc_user VARCHAR(25) NOT NULL,
flyway_jdbc_pass VARCHAR(25) NOT NULL,
flyway_locations VARCHAR(100) NOT NULL,
flyway_schemas VARCHAR(100) NOT NULL,
cdm_dialect VARCHAR(25) NOT NULL,
cdm_schema VARCHAR(25) NOT NULL,
ohdsi_schema VARCHAR(25) NOT NULL,
cohort_schema VARCHAR(25) NOT NULL,
created DATE default CURRENT_TIMESTAMP(),
PRIMARY KEY (id));
--PUBLIC.