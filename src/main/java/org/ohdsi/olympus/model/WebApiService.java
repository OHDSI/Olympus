package org.ohdsi.olympus.model;

import javax.annotation.PreDestroy;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.webapp.Configuration;
import org.eclipse.jetty.webapp.WebAppContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.EmbeddedServletContainerInitializedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.util.Assert;

/**
 *
 */
public class WebApiService implements ApplicationListener<EmbeddedServletContainerInitializedEvent> {
    
    private static final Log log = LogFactory.getLog(WebApiService.class);
    
    private final WebAppContext context;
    
    private final WebApiPropertiesRepository repo;
    
    private final boolean isWebApiLaunchEnabled;
    
    @Autowired
    private ContextHandlerCollection contextHandlerCollection;
    
    /**
     * @param ctx
     */
    public WebApiService(final boolean isWebApiLaunchEnabled, final WebAppContext ctx, final WebApiPropertiesRepository repo) {
        this.context = ctx;
        this.repo = repo;
        this.isWebApiLaunchEnabled = isWebApiLaunchEnabled;
    }
    
    /**
     * <properties>
     * <datasource.driverClassName>oracle.jdbc.OracleDriver</datasource.driverClassName>
     * <datasource.dialect>oracle</datasource.dialect> <datasource.dialect.source>sql
     * server</datasource.dialect.source> <datasource.cdm.schema>omopv5_de</datasource.cdm.schema>
     * <datasource.ohdsi.schema>OHDSI</datasource.ohdsi.schema>
     * <datasource.cohort.schema>OHDSI</datasource.cohort.schema>
     * <datasource.url>jdbc:oracle:thin:@172.31.80.28:1521:i2b2idp</datasource.url>
     * <datasource.username>OHDSI</datasource.username> <datasource.password></datasource.password>
     * <flyway.datasource.driverClassName></flyway.datasource.driverClassName>
     * <flyway.datasource.url>jdbc:oracle:thin:@172.31.80.28:1521:i2b2idp</flyway.datasource.url>
     * <flyway.datasource.username>OHDSI</flyway.datasource.username>
     * <flyway.datasource.password></flyway.datasource.password>
     * <flyway.locations>classpath:db/migration/oracle</flyway.locations> <!-- Note: Schema name is
     * case-sensitive. --> <flyway.schemas>${datasource.ohdsi.schema}</flyway.schemas>.
     * </properties>
     * 
     * @param props
     */
    public static void setSystemProperties(final WebApiProperties props) {
        System.setProperty("datasource.driverClassName", props.getJdbcDriverClassName());
        System.setProperty("datasource.url", props.getJdbcUrl());
        System.setProperty("datasource.username", props.getJdbcUser());
        System.setProperty("datasource.password", props.getJdbcPass());
        System.setProperty("flyway.datasource.driverClassName", props.getFlywayJdbcDriverClassName());
        System.setProperty("flyway.datasource.url", props.getFlywayJdbcUrl());
        System.setProperty("flyway.datasource.username", props.getFlywayJdbcUser());
        System.setProperty("flyway.datasource.password", props.getFlywayJdbcPass());
        System.setProperty("flyway.schemas", props.getFlywaySchemas());
        System.setProperty("flyway.locations", props.getFlywayLocations());
        System.setProperty("datasource.dialect", props.getCdmDialect());
        System.setProperty("datasource.cdm.schema", props.getCdmSchema());
        System.setProperty("datasource.ohdsi.schema", props.getOhdsiSchema());
        System.setProperty("datasource.cohort.schema", props.getCohortSchema());
    }
    
    /**
     * Auto generated method comment
     * 
     * @return
     */
    public boolean isRunning() {
        synchronized (this.context) {
            return this.context.isRunning();
        }
    }
    
    public boolean isConfigured() {
        if (this.repo.findOne(WebApiProperties.ID) == null) {
            return false;
        }
        return true;
    }
    
    public void start() throws Exception {
        synchronized (this.context) {
            Assert.state(!isRunning(), "WebApi is already running");
            Assert.state(isConfigured(), "WebApi has not yet been configured.");
            log.info("Starting WebAppContext: " + this.context);
            this.context.start();
        }
    }
    
    /**
     * Auto generated method comment
     */
    public void stop() throws Exception {
        synchronized (this.context) {
            Assert.state(isRunning(), "WebApi is not running.");
            log.info("Stopping WebAppContext: " + this.context);
            this.context.stop();
        }
    }
    
    public void init() throws Exception {
        if (isConfigured()) {
            setSystemProperties(getProperties());
            if (this.isWebApiLaunchEnabled) {
                start();
            } else {
                log.warn("WebApi launch disabled.");
            }
        }
    }
    
    @PreDestroy
    public void cleanup() {
        if (isRunning()) {
            try {
                stop();
                removeHandler();
            } catch (final Exception e) {
                throw new RuntimeException(e);
            }
        }
    }
    
    /**
     * Returns persisted properties or a new instance. Never null.
     * 
     * @return WebApiProperties never null
     */
    public WebApiProperties getProperties() {
        final WebApiProperties props = this.repo.findOne(WebApiProperties.ID);
        return props == null ? new WebApiProperties() : props;
    }
    
    /* (non-Jsdoc)
     * @see org.springframework.context.ApplicationListener#onApplicationEvent(org.springframework.context.ApplicationEvent)
     */
    @Override
    public void onApplicationEvent(final EmbeddedServletContainerInitializedEvent event) {
        if (event instanceof EmbeddedServletContainerInitializedEvent) {
            try {
                init();
            } catch (final Exception e) {
                log.error("<<<ERROR>>> WebAPI was not able to start up successfully, please check your configuration.", e);
                //intentionally not throwing exception
                try {
                    for (final Configuration config : this.context.getConfigurations()) {
                        log.info("Deconfigure: " + config);
                        config.deconfigure(this.context);
                        config.destroy(this.context);
                    }
                } catch (final Exception ex) {
                    log.error("Error attempting to deconfigure and destroy", ex);
                }
                removeHandler();
            }
        }
    }
    
    private void removeHandler() {
        log.info("Removing handler");
        this.contextHandlerCollection.removeHandler(this.context);
    }
    
}
