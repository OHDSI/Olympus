package org.ohdsi.olympus.controller;

import java.io.File;
import java.io.FileReader;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Value;
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
    
    @Value("${achilles.data.dir}")
    private String dataDir;
    
    @RequestMapping(value = "datasources", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public HttpEntity<JSONObject> datasource() {
        String fileLocation = dataDir + File.separator + "datasources.json";
        return new ResponseEntity<JSONObject>(toJson(fileLocation), HttpStatus.OK);
    }
    
    @RequestMapping(value = "data", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public HttpEntity<JSONObject> datasource(@RequestParam("dataSourceFolder") String dataSourceFolder,
                                             @RequestParam("file") String file) {
        JSONParser parser = new JSONParser();
        JSONObject jsonObject = null;
        try {
            String fileLocation = dataDir + File.separator + dataSourceFolder + File.separator + file;
            log.debug("Attempting to parse datasources.json from : " + fileLocation);
            FileReader fr = new FileReader(fileLocation);
            Object obj = parser.parse(fr);
            jsonObject = (JSONObject) obj;
            fr.close();
        } catch (Exception e) {
            log.error("Error returning datasources.json", e);
            throw new RuntimeException(e);
        }
        return new ResponseEntity<JSONObject>(jsonObject, HttpStatus.OK);
    }
    
    private JSONObject toJson(String fileLocation) {
        JSONObject jsonObject = null;
        try {
            JSONParser parser = new JSONParser();
            log.debug("Attempting to parse datasources.json from : " + fileLocation);
            FileReader fr = new FileReader(fileLocation);
            Object obj = parser.parse(fr);
            jsonObject = (JSONObject) obj;
            fr.close();
        } catch (Exception e) {
            log.error("Error returning datasources.json", e);
            throw new RuntimeException(e);
        }
        return jsonObject;
    }
}
