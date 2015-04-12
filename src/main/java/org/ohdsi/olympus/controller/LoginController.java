package org.ohdsi.olympus.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.ohdsi.olympus.view.factory.CommonTemplateFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class LoginController {
    
    private static final Log log = LogFactory.getLog(LoginController.class);
    
    @Value("${login.username}")
    private String defaultUsername;
    
    @Value("${login.password}")
    private String defaultPassword;
    
    @Autowired
    private CommonTemplateFactory templateFactory;
    
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView getLoginPage(@RequestParam(value = "error", required = false) String error,
                                     HttpServletRequest request, Authentication auth) {
        ModelAndView modelAndView = templateFactory.createMasterView("user/login", null);
        if (error != null) {
            Exception exception = (Exception) request.getSession().getAttribute("SPRING_SECURITY_LAST_EXCEPTION");
            if (exception != null) {
                modelAndView.addObject("error", exception);
            }
        }
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            modelAndView.addObject("_csrf", csrfToken);
        }
        if (!StringUtils.isEmpty(defaultUsername)) {
            modelAndView.addObject("defaultUsername", defaultUsername);
        }
        if (!StringUtils.isEmpty(defaultPassword)) {
            modelAndView.addObject("defaultPassword", defaultPassword);
        }
        return modelAndView;
    }
    
}
