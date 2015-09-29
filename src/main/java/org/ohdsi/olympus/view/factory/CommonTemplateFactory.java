package org.ohdsi.olympus.view.factory;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.ohdsi.olympus.model.WebApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.google.common.base.Strings;

@Component
public class CommonTemplateFactory {
	
	private static final String COMMON_TEMPLATE = "templates/common/common_template";
	
	@Value("${application.name}")
	private String name;
	
	@Value("${application.message}")
	private String message;
	
	@Value("${html.lang}")
	private String htmlLang;
	
	@Autowired
    private WebApiService webApi;

	/**
	 * Creates a common velocity template with the head, body, script and css includes
	 * 
	 * @param innerTemplateName The path to the template. The first directory should be parallel to templates/common
	 * @param pageTitle The title of the page
	 */
	public ModelAndView createMasterView (String innerTemplateName, String pageTitle) {
	    HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.currentRequestAttributes()).getRequest();
		ModelAndView modelAndView = new ModelAndView(COMMON_TEMPLATE);
		modelAndView.addObject("currentDateTime", new Date());
		modelAndView.addObject("currentDateTimeInMillis", System.currentTimeMillis());
		modelAndView.addObject("appName", name);
		modelAndView.addObject("appMessage", message);
		modelAndView.addObject("pageTitle", Strings.isNullOrEmpty(pageTitle) ?
				name : pageTitle);
		modelAndView.addObject("innerTemplate", String.format("templates/%s.vm", innerTemplateName));
		modelAndView.addObject("homePath", "/home/index.html");
		modelAndView.addObject("htmlLang", htmlLang);
		modelAndView.addObject("req", request);
		modelAndView.addObject("webapi",this.webApi);
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            modelAndView.addObject("_csrf", csrfToken);
        }
		modelAndView.addObject("baseURL", request.getContextPath());
		return modelAndView;
	}
}
