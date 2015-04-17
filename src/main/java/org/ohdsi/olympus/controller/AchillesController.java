package org.ohdsi.olympus.controller;

import java.io.File;
import java.io.FileReader;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.ohdsi.olympus.model.WebApiProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/achilles/")
public class AchillesController {
    
    private static final Log log = LogFactory.getLog(AchillesController.class);
    
    @Autowired
    private Environment env;
    
    @RequestMapping(value = "datasources", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public HttpEntity<JSONObject> datasource() {
        final String fileLocation = this.env.getProperty(WebApiProperties.PROP_ACHILLES_DATA_DIR) + File.separator
                + "datasources.json";
        return new ResponseEntity<JSONObject>(toJson(fileLocation), HttpStatus.OK);
    }
    
    @RequestMapping(value = "data", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public HttpEntity<JSONObject> datasource(@RequestParam("dataSourceFolder") final String dataSourceFolder,
                                             @RequestParam("file") final String file) {
        final JSONParser parser = new JSONParser();
        JSONObject jsonObject = null;
        try {
            final String fileLocation = this.env.getProperty(WebApiProperties.PROP_ACHILLES_DATA_DIR) + File.separator
                    + dataSourceFolder + File.separator + file;
            log.debug("Attempting to parse datasources.json from : " + fileLocation);
            final FileReader fr = new FileReader(fileLocation);
            final Object obj = parser.parse(fr);
            jsonObject = (JSONObject) obj;
            fr.close();
        } catch (final Exception e) {
            log.error("Error returning datasources.json", e);
            throw new RuntimeException(e);
        }
        return new ResponseEntity<JSONObject>(jsonObject, HttpStatus.OK);
    }
    
    private JSONObject toJson(final String fileLocation) {
        JSONObject jsonObject = null;
        try {
            final JSONParser parser = new JSONParser();
            log.debug("Attempting to parse datasources.json from : " + fileLocation);
            final FileReader fr = new FileReader(fileLocation);
            final Object obj = parser.parse(fr);
            jsonObject = (JSONObject) obj;
            fr.close();
        } catch (final Exception e) {
            log.error("Error returning datasources.json", e);
            throw new RuntimeException(e);
        }
        return jsonObject;
    }
}
