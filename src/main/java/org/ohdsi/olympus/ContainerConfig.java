package org.ohdsi.olympus;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.jetty.JettyEmbeddedServletContainerFactory;
import org.springframework.boot.context.embedded.jetty.JettyServerCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 *
 */
@Configuration
public class ContainerConfig {
    
    private static final Log log = LogFactory.getLog(ContainerConfig.class);
    
    @Bean
    public ContextHandlerCollection contextHandlerCollection() {
        return new ContextHandlerCollection();
    }
    
    @Bean
    public EmbeddedServletContainerCustomizer containerCustomizer() {
        return new EmbeddedServletContainerCustomizer() {
            
            @Override
            public void customize(ConfigurableEmbeddedServletContainer container) {
                if (container instanceof JettyEmbeddedServletContainerFactory) {
                    JettyEmbeddedServletContainerFactory jetty = (JettyEmbeddedServletContainerFactory) container;
                    jetty.addServerCustomizers(new JettyServerCustomizer() {
                        
                        @Override
                        public void customize(Server server) {
                            ContextHandlerCollection col = contextHandlerCollection();
                            col.addHandler(server.getHandler());
                            server.setHandler(col);
                        }
                    });
                } else {
                    throw new UnsupportedOperationException("Jetty is the only supported container for Olympus");
                }
                /*                if (container instanceof TomcatEmbeddedServletContainerFactory) {
                                    ((TomcatEmbeddedServletContainerFactory) container).setBaseDirectory(new File("C:\\olympus"));
                                    
                                    try {
                                        
                                        TomcatEmbeddedServletContainer tomcatContainer = (TomcatEmbeddedServletContainer) container;
                                        Tomcat tomcat = tomcatContainer.getTomcat();
                                        StandardContext context = (StandardContext) tomcat.getHost().findChild("");
                                        String path = context.getDocBase() + File.separator + "applications/WebAPI.war";
                                        //            String path = .getHost().get.getAppBaseFile().getAbsolutePath() + "/bogus";
                                        log.info("path:" + path);
                                        tomcat.addWebapp("/WebAPI", path);
                                        //                    tomcat.addWebapp("/webapi", path + File.separator + "/bogus");
                                         * 
                                      
                                    } catch (ServletException e) {
                                        throw new RuntimeException(e);
                                    }
                                }*/
            }
        };
    }
   
 }
