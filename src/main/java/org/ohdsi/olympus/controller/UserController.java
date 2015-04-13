package org.ohdsi.olympus.controller;

import java.util.HashSet;
import java.util.Set;

import javax.validation.Valid;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.ohdsi.olympus.model.Role;
import org.ohdsi.olympus.model.User;
import org.ohdsi.olympus.model.UserCreateForm;
import org.ohdsi.olympus.model.UserRepository;
import org.ohdsi.olympus.view.factory.CommonTemplateFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/user")
public class UserController {
    
    private static final Log log = LogFactory.getLog(UserController.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CommonTemplateFactory templateFactory;
    
    @RequestMapping(value = "/create/test", method = RequestMethod.GET)
    public ModelAndView testInsert(@RequestParam("username") String username) {
        log.debug("Getting user create form");
        User u = new User();
        u.setUsername(username);
        u.setPassword("test");
        u.setEnabled(true);
        Set<Role> roles = new HashSet<Role>();
        roles.add(Role.CALYPSO);
        roles.add(Role.CIRCE);
        roles.add(Role.WEBAPI);
        roles.add(Role.HERACLES);
        u.setRoles(roles);
        this.userRepository.save(u);
        log.info("saved");
        return new ModelAndView("user_create");//, "form", new UserCreateForm());
    }
    
    /*
    private final UserCreateFormValidator userCreateFormValidator;
    */
    
    //    @InitBinder("form")
    //    public void initBinder(WebDataBinder binder) {
    //        binder.addValidators(userCreateFormValidator);
    //    }
    
    //    @PreAuthorize("@currentUserServiceImpl.canAccessUser(principal, #id)")
    //    @RequestMapping("/user/{id}")
    //    public ModelAndView getUserPage(@PathVariable Long id) {
    //        LOGGER.debug("Getting user page for user={}", id);
    //        return new ModelAndView("user", "user", userService.getUserById(id)
    //                .orElseThrow(() -> new NoSuchElementException(String.format("User=%s not found", id))));
    //    }
    
    @RequestMapping
    public ModelAndView getUsersPage() {
        log.debug("Getting users page");
        ModelAndView modelAndView = templateFactory.createMasterView("user/users", "Users");
        modelAndView.addObject("users", userRepository.findAll());
        return modelAndView;
    }
    
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/create", method = RequestMethod.GET)
    public ModelAndView getUserCreatePage() {
        log.debug("Getting user create form");
        ModelAndView modelAndView = templateFactory.createMasterView("user/user_create", "Create User");
        modelAndView.addObject("form", new UserCreateForm());
        return modelAndView;
    }
    
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ModelAndView handleUserCreateForm(@Valid @ModelAttribute("form") UserCreateForm form, BindingResult bindingResult) {
        log.debug(String.format("Processing user create form={%s}, bindingResult={%s}", form, bindingResult));
        ModelAndView view = templateFactory.createMasterView("user/user_create", "Create User");
        if (bindingResult.hasErrors()) {
            log.info("Has Errors: " + bindingResult);
            view.addObject("form", form);
            view.addObject("errors", bindingResult);
            return view;
        }
        try {
            User user = new User();
            user.setUsername(form.getUsername());
            user.setPassword(new BCryptPasswordEncoder().encode(form.getPassword()));
            user.setRoles(form.getRoles());
            user = userRepository.save(user);
        } catch (Exception e) {
            log.error("Exception occurred when trying to save the user", e);
            bindingResult.reject("user.save.error", e.getMessage());
            return view;
        }
        // ok, redirect
        return new ModelAndView("redirect:/user");
    }
    
}
