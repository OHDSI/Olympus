package org.ohdsi.olympus.model;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PreDestroy;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.webapp.Configuration;
import org.eclipse.jetty.webapp.WebAppContext;
import org.ohdsi.olympus.model.WebApiProperties.DIALECT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.EmbeddedServletContainerInitializedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.util.Assert;

import com.google.common.collect.Lists;

/**
 *
 */
public class WebApiService implements ApplicationListener<EmbeddedServletContainerInitializedEvent> {
    
    private static final Log log = LogFactory.getLog(WebApiService.class);
    
    private final WebAppContext context;
    
    private final WebApiPropertiesRepository repo;
    
    private final WebApiRemoteRepository remotesRepo;
    
    private final boolean isWebApiLaunchEnabled;
    
    @Autowired
    private ContextHandlerCollection contextHandlerCollection;
    
    /**
     * @param ctx
     */
    public WebApiService(final boolean isWebApiLaunchEnabled, final WebAppContext ctx,
        final WebApiPropertiesRepository repo, final WebApiRemoteRepository remotesRepo) {
        this.context = ctx;
        this.repo = repo;
        this.isWebApiLaunchEnabled = isWebApiLaunchEnabled;
        this.remotesRepo = remotesRepo;
    }
    
    public boolean hasRemotes() {
        return Lists.newArrayList(this.remotesRepo.findAll()).size() > 0;
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
        DIALECT dialect = props.getCdmDialect();
        String flywayLocations;
        String driverClassName;
        String jdbcUrl;
        String flywayJdbcUrl;
        String jdbcPort;
        String flywayJdbcPort;
        
        if (DIALECT.ORACLE.equals(dialect)) {
            driverClassName = "oracle.jdbc.OracleDriver";
            flywayLocations = "classpath:db/migration/oracle";
            jdbcUrl = String.format("jdbc:oracle:thin:@%s:%s:%s", props.getJdbcIpAddress(), props.getJdbcPort(),
                props.getCdmDataSourceSid());
            flywayJdbcUrl = StringUtils.isEmpty(props.getFlywayDataSourceSid()) ? jdbcUrl : String.format(
                "jdbc:oracle:thin:@%s:%s:%s", props.getJdbcIpAddress(), props.getJdbcPort(), props.getFlywayDataSourceSid());
        } else if (DIALECT.POSTGRESQL.equals(dialect)) {
            driverClassName = "org.postgresql.Driver";
            flywayLocations = "classpath:db/migration/postgresql";
            jdbcUrl = String.format("jdbc:postgresql://%s:%s/%s", props.getJdbcIpAddress(), props.getJdbcPort(),
                props.getCdmDataSourceSid());
            flywayJdbcUrl = StringUtils.isEmpty(props.getFlywayDataSourceSid()) ? jdbcUrl : String.format(
                "jdbc:postgresql://%s:%s/%s", props.getJdbcIpAddress(), props.getJdbcPort(), props.getFlywayDataSourceSid());
        } else {
            //sql server
            boolean isIntegratedSecurityOption = false;
            if (DIALECT.SQLSERVERINTSECURITY.equals(dialect)) {
                isIntegratedSecurityOption = true;
            }
            jdbcPort = StringUtils.isEmpty(props.getJdbcPort()) ? "1433" : props.getJdbcPort();
            
            driverClassName = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
            flywayLocations = "classpath:db/migration/sqlserver";
            jdbcUrl = String.format("jdbc:sqlserver://%s:%s;databaseName=%s", props.getJdbcIpAddress(), jdbcPort,
                props.getCdmSchema());
            flywayJdbcUrl = StringUtils.isEmpty(props.getFlywayDataSourceSid()) ? jdbcUrl : String.format(
                "jdbc:sqlserver://%s:%s;databaseName=%s", props.getJdbcIpAddress(), jdbcPort,
                props.getCdmSchema());
/* Based on meeting Tuesday, I believe databaseName is used even with integrated security
            if (isIntegratedSecurityOption) {
                jdbcUrl = String.format("jdbc:sqlserver://%s", props.getJdbcIpAddress());
                flywayJdbcUrl = StringUtils.isEmpty(props.getFlywayJdbcUser()) ? jdbcUrl : String.format(
                    "jdbc:sqlserver://%s", props.getJdbcIpAddress());
            }*/
        }
        String flywayUser = StringUtils.isEmpty(props.getFlywayJdbcUser()) ? props.getJdbcUser() : props.getFlywayJdbcUser();
        String flywayPass = StringUtils.isEmpty(props.getFlywayJdbcPass()) ? props.getJdbcPass() : props.getFlywayJdbcPass();
        String flywaySchemas = StringUtils.isEmpty(props.getFlywaySchemas()) ? props.getOhdsiSchema() : props
                .getFlywaySchemas();
        
        setProperty(WebApiProperties.PROP_DATASOURCE_DRIVERCLASSNAME, driverClassName);
        setProperty(WebApiProperties.PROP_DATASOURCE_URL, jdbcUrl);
        setProperty(WebApiProperties.PROP_DATASOURCE_USERNAME, props.getJdbcUser());
        setProperty(WebApiProperties.PROP_DATASOURCE_PASSWORD, props.getJdbcPass());
        setProperty(WebApiProperties.PROP_FLYWAY_DATASOURCE_DRIVERCLASSNAME, driverClassName);
        setProperty(WebApiProperties.PROP_FLYWAY_DATASOURCE_URL, flywayJdbcUrl);
        setProperty(WebApiProperties.PROP_FLYWAY_DATASOURCE_USERNAME, flywayUser);
        setProperty(WebApiProperties.PROP_FLYWAY_DATASOURCE_PASSWORD, flywayPass);
        setProperty(WebApiProperties.PROP_FLYWAY_SCHEMAS, flywaySchemas);
        setProperty(WebApiProperties.PROP_FLYWAY_LOCATIONS, flywayLocations);
        setProperty(WebApiProperties.PROP_DATASOURCE_DIALECT, props.getCdmDialect().getValue());
        setProperty(WebApiProperties.PROP_DATASOURCE_CDM_SCHEMA, props.getCdmSchema());
        setProperty(WebApiProperties.PROP_DATASOURCE_OHDSI_SCHEMA, props.getOhdsiSchema());
        setProperty(WebApiProperties.PROP_DATASOURCE_COHORT_SCHEMA, props.getCohortSchema());
        
        //application-specific
        setProperty(WebApiProperties.PROP_ACHILLES_DATA_DIR, props.getAchillesDataDir());
    }
    
    private static void setProperty(String key, String value) {
        log.debug(String.format("Property [%s,%s]", key, key.toLowerCase().contains("pass") ? "***" : value));
        System.setProperty(key, value);
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
    
    /**
     * Returns a list of Remote WebAPIs and Local (if configured), with Local first.
     * 
     * @return
     */
    public List<WebApiRemote> getWebApis() {
        List<WebApiRemote> webApis = new ArrayList<WebApiRemote>();
        if(isRunning()){
            webApis.add(new WebApiRemote("Local", WebApiProperties.LOCAL_WEBAPI));
        }
        webApis.addAll(Lists.newArrayList(this.remotesRepo.findAll()));
        return webApis;
    }
    
    /**
     * Return all Remote WebApis.
     */
    public List<WebApiRemote> getRemotes() {
        return Lists.newArrayList(this.remotesRepo.findAll());
    }
    
}
