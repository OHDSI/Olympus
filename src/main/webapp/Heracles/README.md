### [UNDER DEVELOPMENT - TESTING PURPOSES ONLY] 
### HERACLES

##### Introduction

Health Enterprise Resource and Care Learning Exploration System (HERACLES) provides descriptive statistics / visualizations for cohorts in an OMOP CDM v4 or V5 database.   It comprises two components, a Runner and a Viewer.  HERACLES Runner allows selection and running of analysis jobs.  HERACLES viewer provides a series of visual reports from these analyses.

HERACLES is a project as part of the Observational Health Data Sciences and Informatics (OHDSI, http://ohdsi.org) collaboration.

##### Features
* Select from existing COHORTs in CDM and choose a set of analyses to run
* Focus on a particular concept group such as medications, conditions, or procedures
* Visualize results through a series of reports similar to [ACHILLES](http://www.ohdsi.org/web/achilles/index.html#/SAMPLE/dashboard)


##### Technology
* HTML5
* Javascript
* jQuery
* Bootstrap
* AngularJS

##### System Requirements
* 

##### Dependencies
* Have a version of the [OHDSI WebAPI](https://github.com/OHDSI/WebAPI) running.

##### Running Heracles
*  Will be updated when released

###### For Developers

If you wish to add/modify configuration using Grunt, you can install the following.
* Install [Node.js](http://nodejs.org/) if not yet installed
* Install [Grunt](http://gruntjs.com/getting-started) if not yet installed
<br/>`npm install -g grunt-cli`
* Install grunt dependencies (under the root directory)
<br/>`sh installGruntDependencies.sh`
* (optional) If you're pointing to a different WebAPI than the default (localhost:8080/WebAPI), do the following
<br/>update the `web_api_url` property in package.json
* Run grunt to kick off the default tasks
<br/>`grunt`
* (optional) Run watch to keep minified files up to date
<br/>`grunt watch`

##### Other Notes
*

##### Getting involved
* 
	
##### License
Apache
