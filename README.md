### OLYMPUS - An OHDSI Launcher and Configurator 
### [UNDER DEVELOPMENT - TESTING PURPOSES ONLY] 

##### Introduction

OLYMPUS (OHDSI Loaded on Your Computers to Perform Ultimate Science) is a package designed to simplify the configuration of CDM-based research environments and the usage of OHDSI tools.  

**Non-developers should download builds directly at http://www.ohdsi.org/analytic-tools/olympus-a-unified-platform-for-ohdsi-web-applications**

##### Features
* Unified installation of the WebAPI server and a set of OHDSI applications
* A dashboard for app launching
* A configuration page for setting up WebAPI
* A job viewer 
* Security

##### Technology
* Java
* Spring
* Jetty
* HTML5 / JS

##### System Requirements
* JRE >= 1.7 (Java 8 recommended due to a known issue with Java 7 when connected to VPNs & perm gen exhaustion)

##### Dependencies
* OMOP V5 CDM running an OHDSI supported dialect

##### Getting Started

##### Building & Packaging
Olympus : By default, all vendor jdbc drivers are dependencies.  If you wish to package with a single or subset, consider the vendor-specific db profiles `mvn clean package -Polympus-oracle` or package will all drivers `mvn clean package` . The default requires all dependencies to be accessible in an artifact repository.

Olympus packages the following applications.  If you wish to build Olympus and change the applications, consider the following.

WebAPI (package using defaults `mvn clean package`)
- Add WebAPI.war to Olympus/src/main/webapp/WEB-INF/applications/

Hermes, Circe, Heracles, Calypso, JobViewer
- clone github repos
- copy each application to Olympus/src/main/webapp/ (e.g. webapp/Hermes, webapp/Heracles, etc.)
- edit js config files that specify WebAPI location. (GET 'http://localhost:20000/webapi' endpoint to return array of available WebApis)
- See the history/log of changes made to an application after cloning/copying `git log --stat -- src/main/webapp/Achilles` .  Check out changes in a commit `git show 360b14`.

Summary of changes:
* Heracles: 1) Heracles.config.js - set ohdsi_services to array returned by Olympus. 2.) Add jquery.js import into index.html
* Achilles (Web) - `git show 360b14` - 1.) Change ajax calls from referencing local 'data/X.json' to call Olympus endpoint that returns the json, read from a file location defined in Olympus (default /var/achilles/data).

##### Running Olympus
`java -XX:MaxPermSize=128m -jar Olympus-XXX-exec.war`
-XX:MaxPermSize only needed prior to jre 8

##### Olympus Working Directory
Olympus will create an 'olympus' directory within the ${java.io.tmpdir} environment variable location.
Look for a log statement like this (Windows example) ...  

```
2015-05-07 15:48:54.443 INFO main org.ohdsi.olympus.DataSourceConfig -  - Using jdbcurl: jdbc:h2:file:C:\Users\afranken\AppData\Local\Temp\olympus\dbfile
```
Mac Example:
Mac java.io.tmdir = /var/folders/56/dfxv12_d6wb8dd4blw46j43h0000gn/T
Olympus dir = /var/folders/56/dfxv12_d6wb8dd4blw46j43h0000gn/T/olympus


##### Olympus Database
Olympus uses an h2 file database.  You can access the h2 console after starting Olympus and authenticating with a user that has the 'ADMIN' authority.
  
`http://localhost:20000/console`

##### TODO
Consider maven war plugin web resources to contain modified application files (e.g. Hermes config.js, etc. and src/main/webapp/Hermes would contain unmodified source.  Likely easier to do upgrades/diffs.
	
##### License
Apache
