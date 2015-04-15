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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.ohdsi.olympus.model.WebApiProperties;
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
        if(clazz.equals(WebApiProperties.class)){
            return true;
        }
        return false;
    }

    /* (non-Jsdoc)
     * @see org.springframework.validation.Validator#validate(java.lang.Object, org.springframework.validation.Errors)
     */
    @Override
    public void validate(Object target, Errors errors) {
        if(this.validator != null){
            this.validator.validate(target, errors);
        }
        log.debug("custom validation");
    }
    
}
