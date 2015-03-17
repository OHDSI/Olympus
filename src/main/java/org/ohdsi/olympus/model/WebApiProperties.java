package org.ohdsi.olympus.model;

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
    
    @Id
    private int id = 1;
    
    @NotNull
    @Size(max = 100, min = 1)
    private String jdbcUrl;
    
    @NotNull
    @Size(max = 25, min = 1)
    private String jdbcUser;
    
    @NotNull
    @Size(max = 25, min = 1)
    private String jdbcPass;
    
//    @NotNull
//    @Size(max = 100, min = 1)
    @Transient
    private String flywayJdbcUrl;
    
//    @NotNull
//    @Size(max = 25, min = 1)
    @Transient
    private String flywayJdbcUser;
    
//    @NotNull
//    @Size(max = 25, min = 1)
    @Transient
    private String flywayJdbcPass;
    
//    @NotNull
//    @Size(max = 50, min = 1)
    @Transient
    private String flywaySchemas;
    
//    @NotNull
//    @Size(max = 25, min = 1)
    @Transient
    private String cdmSchema;
    
//    @NotNull
//    @Size(max = 25, min = 1)
    @Transient
    private String ohdsiSchema;
    
//    @NotNull
//    @Size(max = 25, min = 1)
    @Transient
    private String cdmDialect;
    
    /**
     * @return the jdbcUrl
     */
    public String getJdbcUrl() {
        return this.jdbcUrl;
    }
    
    /**
     * @param jdbcUrl the jdbcUrl to set
     */
    public void setJdbcUrl(final String jdbcUrl) {
        this.jdbcUrl = jdbcUrl;
    }
    
    /**
     * @return the jdbcUser
     */
    public String getJdbcUser() {
        return this.jdbcUser;
    }
    
    /**
     * @param jdbcUser the jdbcUser to set
     */
    public void setJdbcUser(final String jdbcUser) {
        this.jdbcUser = jdbcUser;
    }
    
    /**
     * @return the jdbcPass
     */
    public String getJdbcPass() {
        return this.jdbcPass;
    }
    
    /**
     * @param jdbcPass the jdbcPass to set
     */
    public void setJdbcPass(final String jdbcPass) {
        this.jdbcPass = jdbcPass;
    }
    
    /**
     * @return the flywayJdbcUrl
     */
    public String getFlywayJdbcUrl() {
        return this.flywayJdbcUrl;
    }
    
    /**
     * @param flywayJdbcUrl the flywayJdbcUrl to set
     */
    public void setFlywayJdbcUrl(final String flywayJdbcUrl) {
        this.flywayJdbcUrl = flywayJdbcUrl;
    }
    
    /**
     * @return the flywayJdbcUser
     */
    public String getFlywayJdbcUser() {
        return this.flywayJdbcUser;
    }
    
    /**
     * @param flywayJdbcUser the flywayJdbcUser to set
     */
    public void setFlywayJdbcUser(final String flywayJdbcUser) {
        this.flywayJdbcUser = flywayJdbcUser;
    }
    
    /**
     * @return the flywayJdbcPass
     */
    public String getFlywayJdbcPass() {
        return this.flywayJdbcPass;
    }
    
    /**
     * @param flywayJdbcPass the flywayJdbcPass to set
     */
    public void setFlywayJdbcPass(final String flywayJdbcPass) {
        this.flywayJdbcPass = flywayJdbcPass;
    }
    
    /**
     * @return the flywaySchemas
     */
    public String getFlywaySchemas() {
        return this.flywaySchemas;
    }
    
    /**
     * @param flywaySchemas the flywaySchemas to set
     */
    public void setFlywaySchemas(final String flywaySchemas) {
        this.flywaySchemas = flywaySchemas;
    }
    
    /**
     * @return the cdmSchema
     */
    public String getCdmSchema() {
        return this.cdmSchema;
    }
    
    /**
     * @param cdmSchema the cdmSchema to set
     */
    public void setCdmSchema(final String cdmSchema) {
        this.cdmSchema = cdmSchema;
    }
    
    /**
     * @return the ohdsiSchema
     */
    public String getOhdsiSchema() {
        return this.ohdsiSchema;
    }
    
    /**
     * @param ohdsiSchema the ohdsiSchema to set
     */
    public void setOhdsiSchema(final String ohdsiSchema) {
        this.ohdsiSchema = ohdsiSchema;
    }
    
    /**
     * @return the cdmDialect
     */
    public String getCdmDialect() {
        return this.cdmDialect;
    }
    
    /**
     * @param cdmDialect the cdmDialect to set
     */
    public void setCdmDialect(final String cdmDialect) {
        this.cdmDialect = cdmDialect;
    }
    
}
