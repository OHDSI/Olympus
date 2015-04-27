### [UNDER DEVELOPMENT - TESTING PURPOSES ONLY] 
### HERACLES

##### Introduction

Health Enterprise Resource and Care Learning Exploration System (HERACLES) provides descriptive statistics / visualizations for cohorts in an OMOP CDM v4 or V5 database.   It comprises two components, a Runner and a Viewer.  HERACLES Runner allows selection and running of analysis jobs.  HERACLES viewer provides a series of visual reports from these analyses.

HERACLES is a project as part of the Observational Health Data Sciences and Informatics (OHDSI, http://ohdsi.org) collaboration.

##### Features
* Select from existing COHORTs in CDM and choose a set of analyses to run
* Focus on a particular concept group such as medications, conditions, or procedures
* Visualize results through a series of reports

##### System Requirements
* Java 1.7 or higher

##### Dependencies
* None, if using the [OLYMPUS platform](https://github.com/OHDSI/OLYMPUS)
* Otherwise (for custom implementations), the latest version of the [OHDSI WebAPI](https://github.com/OHDSI/WebAPI)

##### Installation
*  Typical Installation
	*  Install the [OLYMPUS platform](https://github.com/OHDSI/OLYMPUS) 
*  For advanced users
	*  Configure and build the OHDSI WebAPI for your environment
	*  Download the Heracles repo
	*  Edit the file build/js/Heracles.config.js to include the URL for your local WebAPI
	*  Place Heracles files in a directory on a web server (such as Apache)


##### Usage

* See [Heracles documentation](http://www.ohdsi.org/web/wiki/doku.php?id=documentation:software:heracles) on the OHDSI Wiki

##### License
Apache 2.0

##### Getting involved
*  Join the Heracles WG calls.  Find more info on the [OHDSI Forums](http://forums.ohdsi.org/t/heracles-cohort-summarization-wg/307).


##### For Developers Only


**Technology**
* HTML5 / JS / jQuery
* Bootstrap
* AngularJS
* Grunt

**Using Grunt**

If you wish to add/modify configuration using Grunt, you can install the following.
* Install [Node.js](http://nodejs.org/) if not yet installed
* Install [Grunt](http://gruntjs.com/getting-started) if not yet installed
<br/>`npm install -g grunt-cli`
* Install grunt dependencies (under the root directory)
<br/>`sh installGruntDependencies.sh`
* Run grunt to kick off the default tasks
<br/>`grunt`
* (optional) Run watch to keep minified files up to date
<br/>`grunt watch`


