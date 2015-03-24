### OLYMPUS - An OHDSI Launcher and Configurator 
### [UNDER DEVELOPMENT - TESTING PURPOSES ONLY] 

##### Introduction

OLYMPUS (OHDSI Loaded on Your Computers to Perform Ultimate Science) is a package designed to simplify the configuration of CDM-based research environments and the usage of OHDSI tools.

OLYMPUS is a project as part of the Observational Health Data Sciences and Informatics (OHDSI, http://ohdsi.org) collaboration.

##### Planned Features
* Unified installation of the WebAPI server and a set of OHDSI applications
* A dashboard for app launching
* A configuration page for setting up WebAPI
* A job server for managing long-running jobs
* TBD: Security

##### Technology
* Java
* Spring
* Tomcat
* HTML5 / JS

##### System Requirements
* JRE >= 1.6

##### Dependencies
* OMOP V5 CDM running an OHDSI supported dialect

##### Getting Started
* Pending


##### Building & Packaging

WebAPI (package using defaults `mvn clean package`)
- Add WebAPI.war to Olympus/src/main/webapp/WEB-INF/applications/

Hermes
- clone github repo, edit js/config.js (Local,'http://localhost:20000/WebAPI')
- cp to Olympus/src/main/webapp/Hermes

Circe
- cp to Olympus/src/main/webapp/Circe, edit js/config.js

Heracles
- edit Heracles.config.js

Olympus : package with target db profile `mvn clean package -Polympus-oracle` or package will all drivers `-Polympus-comprehensive`

##### Running Olympus
`java -XX:MaxPermSize=128m -jar Olympus-XXX-exec.war`


##### Getting involved
* Biweekly calls, call-in information on the Wiki
	
##### License
Apache
