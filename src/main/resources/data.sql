INSERT INTO users (username, password, enabled)
VALUES ('admin', '$2a$10$t.8GqlSUHCc9BCoAmjDPj.vE1RSdstpMJLZaGser1kiYh.NgviAnu',true);

INSERT INTO authorities (username, authority)
VALUES ('admin', 'ADMIN');
INSERT INTO authorities (username, authority)
VALUES ('admin', 'JOB_VIEWER');
INSERT INTO authorities (username, authority)
VALUES ('admin', 'CIRCE');
INSERT INTO authorities (username, authority)
VALUES ('admin', 'HERMES');
INSERT INTO authorities (username, authority)
VALUES ('admin', 'HERACLES');
INSERT INTO authorities (username, authority)
VALUES ('admin', 'CALYPSO');
INSERT INTO authorities (username, authority)
VALUES ('admin', 'ATHENA');
INSERT INTO authorities (username, authority)
VALUES ('admin', 'ACHILLES');
--INSERT INTO authorities (username, authority)
--VALUES ('admin', 'WEBAPI');

INSERT INTO webapi_remote (id, name, url)
VALUES (1, 'Public WebAPI', 'http://api.ohdsi.org/WebAPI/');
