package org.ohdsi.olympus.controller;

import java.net.URL;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.ohdsi.olympus.model.Launchable;
import org.ohdsi.olympus.model.WebApiProperties;
import org.ohdsi.olympus.model.WebApiPropertiesRepository;
import org.ohdsi.olympus.view.factory.CommonTemplateFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Charsets;
import com.google.common.io.Resources;

@Controller
@RequestMapping({ "/home", "/" })
public class MainController {
    
    private static final Log log = LogFactory.getLog(MainController.class);
    
    private static final String HOME_TEMPLATE_NAME = "home/index";
    
    private static final String ERROR_TEMPLATE_NAME = "templates/error";
    
    @Autowired
    private CommonTemplateFactory templateFactory;
    
    @Autowired
    private WebApiPropertiesRepository repo;
    
    @RequestMapping(value = {"index",""})
    public ModelAndView handleIndexRequest() throws Exception {
        
        ModelAndView modelAndView = templateFactory.createMasterView(HOME_TEMPLATE_NAME, null);
        
        // load up launcher links
        URL url = Resources.getResource("launchable-links.json");
        String text = Resources.toString(url, Charsets.UTF_8);
        
        ObjectMapper mapper = new ObjectMapper();
        List<Launchable> myObjects = mapper.readValue(text, new TypeReference<List<Launchable>>() {});
        modelAndView.addObject("launchableLinks", myObjects);
        
        return modelAndView;
        
    }
    
    /**
     * We handle error a little differently because it's expected by SpringBoot to be mapped to
     * /error in the templates section
     * 
     * @param request
     * @param res
     * @param session
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "error")
    public ModelAndView handleErrorRequest(final HttpServletRequest request, final HttpServletResponse res,
                                           final HttpSession session) throws Exception {
        
        ModelAndView modelAndView = new ModelAndView(ERROR_TEMPLATE_NAME);
        return modelAndView;
        
    }
}
