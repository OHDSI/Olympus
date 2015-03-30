CREATE TABLE IF NOT EXISTS WEBAPI_PROPERTIES 
(id INTEGER NOT NULL,
jdbc_ip_address VARCHAR(100) NOT NULL,
jdbc_port VARCHAR(10) NOT NULL,
jdbc_user VARCHAR(25) NOT NULL,
jdbc_pass VARCHAR(25) NOT NULL,
cdm_data_source_sid VARCHAR(25) NOT NULL,
flyway_data_source_sid VARCHAR(25) ,
flyway_jdbc_user VARCHAR(25),
flyway_jdbc_pass VARCHAR(25),
flyway_schemas VARCHAR(100) NOT NULL,
cdm_dialect VARCHAR(25) NOT NULL,
cdm_schema VARCHAR(25) NOT NULL,
ohdsi_schema VARCHAR(25) NOT NULL,
cohort_schema VARCHAR(25) NOT NULL,
created DATE default CURRENT_TIMESTAMP(),
PRIMARY KEY (id));
--PUBLIC.