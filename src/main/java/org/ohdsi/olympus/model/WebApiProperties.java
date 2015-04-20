package org.ohdsi.olympus.model;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 *
 */
@Entity(name = "WEBAPI_PROPERTIES")
public class WebApiProperties {
    
    public static final int ID = 1;
    
    public static final String LOCAL_WEBAPI = "http://localhost:20000/WebAPI";
    
    public static final String PROP_ACHILLES_DATA_DIR = "achilles.data.dir";
    
    public static final String PROP_DATASOURCE_DRIVERCLASSNAME = "datasource.driverClassName";
    
    public static final String PROP_DATASOURCE_URL = "datasource.url";
    
    public static final String PROP_DATASOURCE_USERNAME = "datasource.username";
    
    public static final String PROP_DATASOURCE_PASSWORD = "datasource.password";
    
    public static final String PROP_FLYWAY_DATASOURCE_DRIVERCLASSNAME = "flyway.datasource.driverClassName";
    
    public static final String PROP_FLYWAY_DATASOURCE_URL = "flyway.datasource.url";
    
    public static final String PROP_FLYWAY_DATASOURCE_USERNAME = "flyway.datasource.username";
    
    public static final String PROP_FLYWAY_DATASOURCE_PASSWORD = "flyway.datasource.password";
    
    public static final String PROP_FLYWAY_SCHEMAS = "flyway.schemas";
    
    public static final String PROP_FLYWAY_LOCATIONS = "flyway.locations";
    
    public static final String PROP_DATASOURCE_DIALECT = "datasource.dialect";
    
    public static final String PROP_DATASOURCE_CDM_SCHEMA = "datasource.cdm.schema";
    
    public static final String PROP_DATASOURCE_OHDSI_SCHEMA = "datasource.ohdsi.schema";
    
    public static final String PROP_DATASOURCE_COHORT_SCHEMA = "datasource.cohort.schema";
    
    @Id
    private int id = ID;
    
    public enum DIALECT {
        ORACLE, POSTGRESQL, SQLSERVER, SQLSERVERINTSECURITY
    }
    
    @Transient
    private static Map<String, String> dialectOptions;
    static {
        dialectOptions = new HashMap<String, String>();
        dialectOptions.put(DIALECT.ORACLE.toString(), DIALECT.ORACLE.toString());
        dialectOptions.put(DIALECT.SQLSERVER.toString(), DIALECT.SQLSERVER.toString());
        dialectOptions.put(DIALECT.SQLSERVERINTSECURITY.toString(), DIALECT.SQLSERVERINTSECURITY.toString());
        dialectOptions.put(DIALECT.POSTGRESQL.toString(), DIALECT.POSTGRESQL.toString());
    }
    
    @NotNull
    @Size(max = 25, min = 1)
    private String cdmDialect;
    
    @NotNull
    @Size(max = 25, min = 1)
    private String jdbcIpAddress;
    
    /* sqlserver integrated security
    @NotNull
    @Size(max = 10, min = 1)*/
    private String jdbcPort;
    
    /* sqlserver integrated security
    @NotNull
    @Size(max = 25, min = 1)*/
    private String cdmDataSourceSid;
    
    /* sqlserver integrated security
    @NotNull
    @Size(max = 25, min = 1)*/
    private String jdbcUser;
    
    /* sqlserver integrated security
    @NotNull
    @Size(max = 25, min = 1)*/
    private String jdbcPass;
    
    @NotNull
    @Size(max = 25, min = 1)
    private String cdmSchema;
    
    @NotNull
    @Size(max = 25, min = 1)
    private String ohdsiSchema;
    
    @NotNull
    @Size(max = 25, min = 1)
    private String cohortSchema;
    
    @Size(max = 25, min = 0)
    private String flywayDataSourceSid;
    
    @Size(max = 25, min = 0)
    private String flywayJdbcUser;
    
    @Size(max = 25, min = 0)
    private String flywayJdbcPass;
    
    @Size(max = 100, min = 0)
    private String flywaySchemas;
    
    @Size(max = 250, min = 0)
    private String achillesDataDir;
    
    /**
     * @return the id
     */
    public int getId() {
        return id;
    }
    
    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }
    
    /**
     * @return the dialectOptions
     */
    public static Map<String, String> getDialectOptions() {
        return dialectOptions;
    }
    
    /**
     * @param dialectOptions the dialectOptions to set
     */
    public static void setDialectOptions(Map<String, String> dialectOptions) {
        WebApiProperties.dialectOptions = dialectOptions;
    }
    
    /**
     * @return the cdmDialect
     */
    public String getCdmDialect() {
        return cdmDialect;
    }
    
    /**
     * @param cdmDialect the cdmDialect to set
     */
    public void setCdmDialect(String cdmDialect) {
        this.cdmDialect = cdmDialect;
    }
    
    /**
     * @return the jdbcIpAddress
     */
    public String getJdbcIpAddress() {
        return jdbcIpAddress;
    }
    
    /**
     * @param jdbcIpAddress the jdbcIpAddress to set
     */
    public void setJdbcIpAddress(String jdbcIpAddress) {
        this.jdbcIpAddress = jdbcIpAddress;
    }
    
    /**
     * @return the jdbcPort
     */
    public String getJdbcPort() {
        return jdbcPort;
    }
    
    /**
     * @param jdbcPort the jdbcPort to set
     */
    public void setJdbcPort(String jdbcPort) {
        this.jdbcPort = jdbcPort;
    }
    
    /**
     * @return the cdmDataSourceSid
     */
    public String getCdmDataSourceSid() {
        return cdmDataSourceSid;
    }
    
    /**
     * @param cdmDataSourceSid the cdmDataSourceSid to set
     */
    public void setCdmDataSourceSid(String cdmDataSourceSid) {
        this.cdmDataSourceSid = cdmDataSourceSid;
    }
    
    /**
     * @return the jdbcUser
     */
    public String getJdbcUser() {
        return jdbcUser;
    }
    
    /**
     * @param jdbcUser the jdbcUser to set
     */
    public void setJdbcUser(String jdbcUser) {
        this.jdbcUser = jdbcUser;
    }
    
    /**
     * @return the jdbcPass
     */
    public String getJdbcPass() {
        return jdbcPass;
    }
    
    /**
     * @param jdbcPass the jdbcPass to set
     */
    public void setJdbcPass(String jdbcPass) {
        this.jdbcPass = jdbcPass;
    }
    
    /**
     * @return the cdmSchema
     */
    public String getCdmSchema() {
        return cdmSchema;
    }
    
    /**
     * @param cdmSchema the cdmSchema to set
     */
    public void setCdmSchema(String cdmSchema) {
        this.cdmSchema = cdmSchema;
    }
    
    /**
     * @return the ohdsiSchema
     */
    public String getOhdsiSchema() {
        return ohdsiSchema;
    }
    
    /**
     * @param ohdsiSchema the ohdsiSchema to set
     */
    public void setOhdsiSchema(String ohdsiSchema) {
        this.ohdsiSchema = ohdsiSchema;
    }
    
    /**
     * @return the cohortSchema
     */
    public String getCohortSchema() {
        return cohortSchema;
    }
    
    /**
     * @param cohortSchema the cohortSchema to set
     */
    public void setCohortSchema(String cohortSchema) {
        this.cohortSchema = cohortSchema;
    }
    
    /**
     * @return the flywayDataSourceSid
     */
    public String getFlywayDataSourceSid() {
        return flywayDataSourceSid;
    }
    
    /**
     * @param flywayDataSourceSid the flywayDataSourceSid to set
     */
    public void setFlywayDataSourceSid(String flywayDataSourceSid) {
        this.flywayDataSourceSid = flywayDataSourceSid;
    }
    
    /**
     * @return the flywayJdbcUser
     */
    public String getFlywayJdbcUser() {
        return flywayJdbcUser;
    }
    
    /**
     * @param flywayJdbcUser the flywayJdbcUser to set
     */
    public void setFlywayJdbcUser(String flywayJdbcUser) {
        this.flywayJdbcUser = flywayJdbcUser;
    }
    
    /**
     * @return the flywayJdbcPass
     */
    public String getFlywayJdbcPass() {
        return flywayJdbcPass;
    }
    
    /**
     * @param flywayJdbcPass the flywayJdbcPass to set
     */
    public void setFlywayJdbcPass(String flywayJdbcPass) {
        this.flywayJdbcPass = flywayJdbcPass;
    }
    
    /**
     * @return the flywaySchemas
     */
    public String getFlywaySchemas() {
        return flywaySchemas;
    }
    
    /**
     * @param flywaySchemas the flywaySchemas to set
     */
    public void setFlywaySchemas(String flywaySchemas) {
        this.flywaySchemas = flywaySchemas;
    }
    
    /**
     * @return the achillesDataDir
     */
    public String getAchillesDataDir() {
        return achillesDataDir;
    }
    
    /**
     * @param achillesDataDir the achillesDataDir to set
     */
    public void setAchillesDataDir(String achillesDataDir) {
        this.achillesDataDir = achillesDataDir;
    }
    
}
