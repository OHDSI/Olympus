package org.ohdsi.olympus.controller;

import javax.servlet.ServletContext;
import javax.validation.Valid;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.ohdsi.olympus.model.WebApiProperties;
import org.ohdsi.olympus.model.WebApiPropertiesRepository;
import org.ohdsi.olympus.model.WebApiService;
import org.ohdsi.olympus.view.factory.CommonTemplateFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.EmbeddedWebApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 *
 */
@Controller
@RequestMapping("/webapi")
public class WebApiController {
    
    private static final Log log = LogFactory.getLog(WebApiController.class);
    
    private static final String CONFIG_MODEL_ATTR = "config";
    
    private static final String CONFIGURATION_TEMPLATE_NAME = "home/config";
    
    @Autowired
    private EmbeddedWebApplicationContext server;
    
    @Autowired
    private ServletContext sc;
    
    @Autowired
    private ContextHandlerCollection contextHandlerCollection;
    
    @Autowired
    private WebApiService webApi;
    
    @Autowired
    private WebApiPropertiesRepository repo;
    
    @Autowired
    private CommonTemplateFactory templateFactory;
    
    @RequestMapping(value = "config")
    public ModelAndView handleConfigurationRequest() throws Exception {
        log.info("Get config");
        ModelAndView modelAndView = templateFactory.createMasterView(CONFIGURATION_TEMPLATE_NAME, null);
        modelAndView.addObject(CONFIG_MODEL_ATTR, this.webApi.getProperties());
        if(this.webApi.isConfigured()){
            modelAndView.addObject("webapi", true);
        }
        return modelAndView;
        
    }
    
    @RequestMapping(value = "config", method = RequestMethod.POST)
    public ModelAndView handleConfigurationSubmission(@Valid @ModelAttribute("config") WebApiProperties props,
                                                      BindingResult result) throws Exception {
        if (result.hasErrors()) {
            log.info("Has Errors: " + result);
            ModelAndView view = templateFactory.createMasterView(CONFIGURATION_TEMPLATE_NAME, null);
            view.addObject(CONFIG_MODEL_ATTR, props);
            view.addObject("errors", result);
            return view;
        }
        log.debug("Saving properties");
        props = this.repo.save(props);
        String msg = "Saved properties";
        log.debug(msg);
        
        ModelAndView modelAndView = templateFactory.createMasterView(CONFIGURATION_TEMPLATE_NAME, null);
        modelAndView.addObject(CONFIG_MODEL_ATTR, props);
        modelAndView.addObject("msg", msg);
        if(this.webApi.isConfigured()){
            modelAndView.addObject("webapi", true);
        }
        return modelAndView;
    }
    
    /*    @RequestMapping(value = "/config", method = RequestMethod.POST)
        public ResponseEntity config() throws Exception {
            //load via db
            System.setProperty("datasource.driverClassName", "bogus");
            System.setProperty("flyway.datasource.driverClassName", "bogus");
            log.info("Set WebApi properties");
            return new ResponseEntity<String>("WebApi properties set", HttpStatus.OK);
        }*/
    
    @RequestMapping(value = "/stop", method = RequestMethod.POST)
    public ResponseEntity stop() throws Exception {
        this.webApi.stop();
        return new ResponseEntity<String>("WebApi stopped", HttpStatus.OK);
    }
    
    @RequestMapping(value = "/start", method = RequestMethod.POST)
    public ResponseEntity start() throws Exception {
        this.webApi.start();
        return new ResponseEntity<String>("WebApi started", HttpStatus.OK);
    }
    /*    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleWebApiException() {
        return "meters/notfound";
    }*/
}
