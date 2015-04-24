package org.ohdsi.olympus.controller;

import java.util.List;

import javax.servlet.ServletContext;
import javax.validation.Valid;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.ohdsi.olympus.model.WebApiProperties;
import org.ohdsi.olympus.model.WebApiPropertiesRepository;
import org.ohdsi.olympus.model.WebApiRemote;
import org.ohdsi.olympus.model.WebApiRemoteRepository;
import org.ohdsi.olympus.model.WebApiService;
import org.ohdsi.olympus.view.factory.CommonTemplateFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.EmbeddedWebApplicationContext;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.Validator;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 *
 */
@Controller
@RequestMapping("/webapi")
public class WebApiController {
    
    private static final Log log = LogFactory.getLog(WebApiController.class);
    
    private static final String CONFIG_MODEL_ATTR = "config";
    
    private static final String REMOTE_MODEL_ATTR = "remote";
    
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
    private WebApiRemoteRepository remoteRepo;
    
    @Autowired
    private CommonTemplateFactory templateFactory;
    
    @Autowired
    private MainController mainController;
    
    @Autowired
    private Validator webApiPropertiesValidator;
    
    @ModelAttribute(value = "remotes")
    public List<WebApiRemote> getRemotes() {
        return this.webApi.getRemotes();
    }
    
    @ModelAttribute(value = CONFIG_MODEL_ATTR)
    public WebApiProperties getWebApiProperties() {
        return this.webApi.getProperties();
    }
    
    @InitBinder(value = CONFIG_MODEL_ATTR)
    protected void initBinder(WebDataBinder binder) {
        binder.setValidator(this.webApiPropertiesValidator);
    }
    
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public HttpEntity<List<WebApiRemote>> webApis() {
        return new ResponseEntity<List<WebApiRemote>>(this.webApi.getWebApis(), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/" + CONFIG_MODEL_ATTR)
    public ModelAndView handleConfigurationRequest(String errorMsg) throws Exception {
        log.debug("Get config");
        ModelAndView modelAndView = templateFactory.createMasterView(CONFIGURATION_TEMPLATE_NAME, null);
        modelAndView.addObject(REMOTE_MODEL_ATTR, new WebApiRemote());
        if (errorMsg != null) {
            modelAndView.addObject("errorMsg", errorMsg);
        }
        return modelAndView;
    }
    
    @RequestMapping(value = "/" + REMOTE_MODEL_ATTR, method = RequestMethod.POST)
    public ModelAndView handleConfigurationSubmission(@Valid @ModelAttribute(REMOTE_MODEL_ATTR) WebApiRemote remote,
                                                      BindingResult result) throws Exception {
        if (result.hasErrors() || isDuplicate(remote, getRemotes()) || remote.getName().equalsIgnoreCase("local")) {
            ModelAndView view = templateFactory.createMasterView(CONFIGURATION_TEMPLATE_NAME, null);
            view.addObject(CONFIG_MODEL_ATTR, getWebApiProperties());
            view.addObject(REMOTE_MODEL_ATTR, remote);
            if (!result.hasErrors()) {
                //duplicate or "local" reserved name
                if (remote.getName().equalsIgnoreCase("local")) {
                    result.addError(new FieldError("remote", "name", "'Local' is reserved"));
                } else {
                    result.addError(new FieldError("remote", "name", "Name must be unique"));
                }
            }
            log.info("Has Errors: " + result);
            view.addObject("errors", result);
            return view;
        }
        if(!remote.getUrl().endsWith("/")){
            remote.setUrl(remote.getUrl().concat("/"));
        }
        
        log.debug("Saving WebApi Remote");
        remote = this.remoteRepo.save(remote);
        String msg = "Saved WebApi Remote";
        log.info(msg);
        
        ModelAndView modelAndView = templateFactory.createMasterView(CONFIGURATION_TEMPLATE_NAME, null);
        modelAndView.addObject(CONFIG_MODEL_ATTR, getWebApiProperties());
        modelAndView.addObject(REMOTE_MODEL_ATTR, new WebApiRemote());
        modelAndView.addObject("remotes", getRemotes());
        modelAndView.addObject("msg", msg);
        return modelAndView;
    }
    
    @RequestMapping(value = "/" + CONFIG_MODEL_ATTR, method = RequestMethod.POST)
    public ModelAndView handleConfigurationSubmission(@Valid @ModelAttribute(CONFIG_MODEL_ATTR) WebApiProperties props,
                                                      BindingResult result) throws Exception {
        if (result.hasErrors()) {
            log.info("Has Errors: " + result);
            ModelAndView view = templateFactory.createMasterView(CONFIGURATION_TEMPLATE_NAME, null);
            view.addObject(CONFIG_MODEL_ATTR, props);
            view.addObject(REMOTE_MODEL_ATTR, new WebApiRemote());
            view.addObject("errors", result);
            return view;
        }
        
        log.debug("Saving properties");
        props = this.repo.save(props);
        String msg = "Saved properties";
        log.debug(msg);
        
        WebApiService.setSystemProperties(props);
        log.info("Set saved properties on the system");
        
        ModelAndView modelAndView = templateFactory.createMasterView(CONFIGURATION_TEMPLATE_NAME, null);
        modelAndView.addObject(CONFIG_MODEL_ATTR, props);
        modelAndView.addObject(REMOTE_MODEL_ATTR, new WebApiRemote());
        modelAndView.addObject("msg", msg);
        return modelAndView;
    }
    
    @RequestMapping(value = "/request-start", method = RequestMethod.POST)
    public ModelAndView handleStartSubmission() throws Exception {
        String errorMsg = null;
        try {
            start();
        } catch (Exception e) {
            errorMsg = String.format("WebAPI was not able to start up successfully, please check your configuration. (%s)",
                e.getMessage());
            log.error(errorMsg, e);
        }
        if (errorMsg != null) {
            return handleConfigurationRequest(errorMsg);
        } else {
            return mainController.handleIndexRequest();
        }
        
    }
    
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
    
    private boolean isDuplicate(WebApiRemote remote, Iterable<WebApiRemote> remotes) {
        for (WebApiRemote r : remotes) {
            if (remote.getName().equalsIgnoreCase(r.getName())) {
                return true;
            }
        }
        return false;
    }
    /*    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleWebApiException() {
        return "meters/notfound";
    }*/
}
