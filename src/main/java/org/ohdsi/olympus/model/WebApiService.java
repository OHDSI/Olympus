package org.ohdsi.olympus.model;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eclipse.jetty.webapp.WebAppContext;
import org.springframework.util.Assert;

/**
 *
 */
public class WebApiService {
    
    private static final Log log = LogFactory.getLog(WebApiService.class);
    
    private WebAppContext context;
    
    private WebApiPropertiesRepository repo;
    
    /**
     * @param ctx
     */
    public WebApiService(WebAppContext ctx, WebApiPropertiesRepository repo) {
        this.context = ctx;
        this.repo = repo;
    }
    
    /**
     * <properties>
     * <datasource.driverClassName>oracle.jdbc.OracleDriver</datasource.driverClassName>
     * <datasource.dialect>oracle</datasource.dialect> <datasource.dialect.source>sql
     * server</datasource.dialect.source> <datasource.cdm.schema>omopv5_de</datasource.cdm.schema>
     * <datasource.ohdsi.schema>OHDSI</datasource.ohdsi.schema>
     * <datasource.cohort.schema>OHDSI</datasource.cohort.schema>
     * <datasource.url>jdbc:oracle:thin:@172.31.80.28:1521:i2b2idp</datasource.url>
     * <datasource.username>OHDSI</datasource.username>
     * <datasource.password></datasource.password>
     * <flyway.datasource.url>jdbc:oracle:thin:@172.31.80.28:1521:i2b2idp</flyway.datasource.url>
     * <flyway.datasource.username>OHDSI</flyway.datasource.username>
     * <flyway.datasource.password></flyway.datasource.password>
     * <flyway.locations>classpath:db/migration/oracle</flyway.locations> <!-- Note: Schema name is
     * case-sensitive. --> <flyway.schemas>${datasource.ohdsi.schema}</flyway.schemas>.
     * </properties>
     * 
     * @param props
     */
    public static void setSystemProperties(WebApiProperties props) {
        System.setProperty("datasource.driverClassName", props.getJdbcDriverClassName());
        System.setProperty("datasource.url", props.getJdbcUrl());
        System.setProperty("datasource.username", props.getJdbcUser());
        System.setProperty("datasource.password", props.getJdbcPass());
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
        return this.context.isRunning();
    }
    
    /**
     * Auto generated method comment
     */
    public void start() throws Exception {
        Assert.state(!isRunning(), "WebApi is already running");
        Assert.state(isConfigured(), "WebApi has not yet been configured.");
        log.info("Starting WebAppContext: " + context);
        this.context.start();
    }
    
    /**
     * Auto generated method comment
     */
    public void stop() throws Exception {
        Assert.state(isRunning(), "WebApi is not running.");
        log.info("Stopping WebAppContext: " + context);
        this.context.stop();
    }
    
    public boolean isConfigured() {
        if (this.repo.findOne(WebApiProperties.ID) == null) {
            return false;
        }
        return true;
    }
    
    /**
     * Returns persisted properties or a new instance. Never null.
     * 
     * @return WebApiProperties never null
     */
    public WebApiProperties getProperties() {
        WebApiProperties props = this.repo.findOne(WebApiProperties.ID);
        return props == null ? new WebApiProperties() : props;
    }
    
}
