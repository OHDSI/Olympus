package org.ohdsi.olympus;

import java.io.File;
import java.io.InputStream;

import javax.servlet.ServletContext;

import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eclipse.jetty.runner.Runner;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.webapp.WebAppContext;
import org.ohdsi.olympus.controller.validator.WebApiPropertiesValidator;
import org.ohdsi.olympus.model.WebApiPropertiesRepository;
import org.ohdsi.olympus.model.WebApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.EmbeddedWebApplicationContext;
import org.springframework.boot.context.embedded.jetty.JettyEmbeddedServletContainer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.util.Assert;
import org.springframework.validation.Validator;

/**
 *
 */
@Configuration
@Order(3)
public class WebApiConfig {
    
    private static final Log log = LogFactory.getLog(WebApiConfig.class);
    
    @Autowired
    private EmbeddedWebApplicationContext server;
    
    @Autowired
    private ServletContext sc;
    
    @Autowired
    private ContextHandlerCollection contextHandlerCollection;
    
    @Bean
    public Validator webApiPropertiesValidator(Validator validator){
        WebApiPropertiesValidator v = new WebApiPropertiesValidator(validator);
        return v;
    }
    
    @Bean
    public WebAppContext webApiContext(final File baseDir) throws Exception {
        Assert.state((this.server != null)
                && (this.server.getEmbeddedServletContainer() instanceof JettyEmbeddedServletContainer),
            "Olympus assumes use of its embedded jetty server");
        
        final JettyEmbeddedServletContainer jetty = (JettyEmbeddedServletContainer) this.server
                .getEmbeddedServletContainer();
        final String contextPath = "/WebAPI";
        log.info("Copying WAR to absolute path: " + baseDir);
        baseDir.mkdirs();
        final File destDir = baseDir;
        final File destFile = new File(destDir, "WebAPI.war");
        final InputStream is = this.sc.getResourceAsStream("/WEB-INF/applications/WebAPI.war");
        Assert.notNull(is, "InputStream for WebAPI.war resource must not be null");
        log.debug("InputStream for WebAPI.war: " + is.available());
        FileUtils.copyInputStreamToFile(is, destFile);

        final WebAppContext ctx = new WebAppContext();
        //The following is to work-around a problem with WebAPI inheriting the Olympus classloader.
        //Cannot load configuration class: org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
        ctx.setServerClasses(new String[]{"org.springframework.security."});
        ctx.setServer(jetty.getServer());
        ctx.setContextPath(contextPath);
        ctx.setWar(destFile.getAbsolutePath());
        ctx.setPersistTempDirectory(true);
        ctx.setThrowUnavailableOnStartupException(true);
        ctx.setConfigurationClasses(Runner.__plusConfigurationClasses);
        ctx.setAttribute("org.eclipse.jetty.server.webapp.ContainerIncludeJarPattern", Runner.__containerIncludeJarPattern);
        ctx.setAllowDuplicateFragmentNames(true);//needed to attempt re-attempt start after failure
        this.contextHandlerCollection.addHandler(ctx);
        return ctx;
    }
    
    @Bean
    public WebApiService webApi(@Value("${olympus.webapi.launch.enabled}") final boolean isWebApiLaunchEnabled,
                                final WebAppContext ctx, final WebApiPropertiesRepository repo) {
        return new WebApiService(isWebApiLaunchEnabled, ctx, repo);
    }
    
    /*if (container instanceof TomcatEmbeddedServletContainer) {
    try {
      final TomcatEmbeddedServletContainer tomcatContainer = (TomcatEmbeddedServletContainer) this.server
              .getEmbeddedServletContainer();
      final Tomcat tomcat = tomcatContainer.getTomcat();
      final StandardContext context = (StandardContext) tomcat.getHost().findChild("");
      //                context.set.setAntiResourceLocking(false);
      //when packaged, couldn't find ServletContainerInitializer
      final ClassLoader cl = this.getClass().getClassLoader();
      final ClassLoader c2 = context.getParentClassLoader();
      
      //tomcat.getEngine().setParentClassLoader(ServletContainerInitializer.class.getClassLoader());//this.getClass().getClassLoader());
      final String baseDir = tomcat.getServer().getCatalinaBase().getPath();
      log.info("DocBase:" + context.getDocBase());
      log.info("BaseDir(Path):" + baseDir);
      log.info("BaseDir(AbsolutePath):" + tomcat.getServer().getCatalinaBase().getAbsolutePath());
      final File tmpDir = new File(System.getProperty("java.io.tmpdir"), "tomcat");
      log.info("Tmp Dir: " + tmpDir.getAbsolutePath());
      final String contextPath = "/WebAPI";
      final File appBaseFile = tomcat.getHost().getAppBaseFile();
      appBaseFile.mkdirs();//TODO embedded tomcat does not seem to create the webapps dir and fails with 'unable to create'
      final File destDir = new File(baseDir);
      final File destFile = new File(destDir, "WebAPI.war");
      final InputStream is = this.sc.getResourceAsStream("/WEB-INF/applications/WebAPI.war");
      log.info(("IS: " + is) == null ? null : is.available());
      FileUtils.copyInputStreamToFile(is, destFile);
      final Context c = tomcat.addWebapp(contextPath, destFile.getAbsolutePath());
    } catch (final ServletException e) {
      throw new RuntimeException(e);
    }
    }*/
}
