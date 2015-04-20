-- ref. Appendix A of Spring Sec 3.1 manual

create table users(
    username varchar(256) not null,
    password varchar(256) not null,
    enabled boolean not null,
    primary key (username)
);

create table authorities (
    username varchar(256) not null,
    authority varchar(256) not null,
    constraint fk_authorities_users foreign key(username) references users(username)
);
create unique index ix_auth_username on authorities (username,authority);

CREATE TABLE persistent_logins (
    username VARCHAR(64) NOT NULL,
    series VARCHAR(64) NOT NULL,
    token VARCHAR(64) NOT NULL,
    last_used TIMESTAMP NOT NULL,
    PRIMARY KEY (series)
);

CREATE TABLE IF NOT EXISTS WEBAPI_REMOTE
(id INTEGER AUTO_INCREMENT NOT NULL,
name VARCHAR(100) NOT NULL UNIQUE,
url VARCHAR(250) NOT NULL,
PRIMARY KEY (id)
);

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
achilles_data_dir VARCHAR(250),
created DATE default CURRENT_TIMESTAMP(),
PRIMARY KEY (id));
--PUBLIC.