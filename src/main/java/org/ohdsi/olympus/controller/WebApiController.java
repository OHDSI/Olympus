package org.ohdsi.olympus.controller;

import javax.servlet.ServletContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.webapp.WebAppContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.EmbeddedWebApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 */
@Controller
@RequestMapping("webapi")
public class WebApiController {
    
    private static final Log log = LogFactory.getLog(WebApiController.class);
    
    @Autowired
    private EmbeddedWebApplicationContext server;
    
    @Autowired
    private ServletContext sc;
    
    @Autowired
    private ContextHandlerCollection contextHandlerCollection;
    
    @Autowired
    private WebAppContext webApi;
    
    @RequestMapping(value = "/stop", method = RequestMethod.POST)
    public ResponseEntity stop() throws Exception {
        Assert.state(this.webApi.isRunning(), "WebApi is not running.");
        this.webApi.stop();
        return new ResponseEntity<String>("WebApi stopped", HttpStatus.OK);
    }
    
    @RequestMapping(value = "/start", method = RequestMethod.POST)
    public ResponseEntity start() throws Exception {
        Assert.state(!this.webApi.isRunning(), "WebApi is already running");
        this.webApi.start();
        return new ResponseEntity<String>("WebApi started", HttpStatus.OK);
    }
    /*    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleWebApiException() {
        return "meters/notfound";
    }*/
}
