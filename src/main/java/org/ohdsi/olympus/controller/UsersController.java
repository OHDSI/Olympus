package org.ohdsi.olympus.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.ohdsi.olympus.model.UserRepository;
import org.ohdsi.olympus.view.factory.CommonTemplateFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

//@Controller
public class UsersController {

    private static final Log log = LogFactory.getLog(UsersController.class);

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CommonTemplateFactory templateFactory;




}
