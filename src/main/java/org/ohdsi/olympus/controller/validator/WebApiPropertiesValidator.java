/**
 * The contents of this file are subject to the Regenstrief Public License
 * Version 1.0 (the "License"); you may not use this file except in compliance with the License.
 * Please contact Regenstrief Institute if you would like to obtain a copy of the license.
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * Copyright (C) Regenstrief Institute.  All Rights Reserved.
 */
package org.ohdsi.olympus.controller.validator;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.ohdsi.olympus.model.WebApiProperties;
import org.ohdsi.olympus.model.WebApiProperties.DIALECT;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

/**
 *
 */
public class WebApiPropertiesValidator implements Validator {
    
    private static final Log log = LogFactory.getLog(WebApiProperties.class);
    
    private Validator validator;
    
    public WebApiPropertiesValidator(Validator validator) {
        this.validator = validator;
    }
    
    /* (non-Jsdoc)
     * @see org.springframework.validation.Validator#supports(java.lang.Class)
     */
    @Override
    public boolean supports(Class<?> clazz) {
        if (WebApiProperties.class.equals(clazz)) {
            return true;
        }
        return false;
    }
    
    /* (non-Jsdoc)
     * @see org.springframework.validation.Validator#validate(java.lang.Object, org.springframework.validation.Errors)
     */
    @Override
    public void validate(Object target, Errors errors) {
        if (this.validator != null) {
            this.validator.validate(target, errors);
        }
        
        log.debug("custom validation");
        WebApiProperties props = (WebApiProperties) target;
        DIALECT dialect = props.getCdmDialect();
        
        boolean isIntegratedSecurityOption = false;
        if (DIALECT.SQLSERVERINTSECURITY.equals(dialect)||DIALECT.SQLSERVER.equals(dialect)) {
            isIntegratedSecurityOption = true;
        }

        
        if (!isIntegratedSecurityOption) {
            if (StringUtils.isEmpty(props.getJdbcUser())) {
                errors.rejectValue("jdbcUser", "config.jdbcUser", "CDM Username is required");
            } else if (props.getJdbcUser().length() > 25) {
                errors.rejectValue("jdbcUser", "config.jdbcUser", "CDM Username length must be <= 25");
            }
            if (StringUtils.isEmpty(props.getJdbcPass())) {
                errors.rejectValue("jdbcPass", "config.jdbcPass", "CDM Password is required");
            } else if (props.getJdbcPass().length() > 25) {
                errors.rejectValue("jdbcPass", "config.jdbcPass", "CDM Password length must be <= 25");
            }
            if (StringUtils.isEmpty(props.getCdmDataSourceSid())) {
                errors.rejectValue("cdmDataSourceSid", "config.cdmDataSourceSid",
                    "CDM DataSource SID/Service Name is required");
            } else if (props.getCdmDataSourceSid().length() > 25) {
                errors.rejectValue("cdmDataSourceSid", "config.cdmDataSourceSid",
                    "CDM DataSource SID/Service Name length must be <= 25");
            }
            if (StringUtils.isEmpty(props.getJdbcPort())) {
                errors.rejectValue("jdbcPort", "config.jdbcPort", "CDM DataSource Port is required");
            } else if (props.getJdbcPort().length() > 10) {
                errors.rejectValue("jdbcPort", "config.jdbcPort", "CDM DataSource length must be <= 10");
            }
        }
        
        /* schema fields length.  validation not necessary
        if(DIALECT.ORACLE.equals(dialect)){
            //30
        }else if(DIALECT.SQLSERVER.equals(dialect)){
            //128
        }else if (DIALECT.POSTGRESQL.equals(dialect)){
            //63 length limit
        }*/
        
    }
    
}
