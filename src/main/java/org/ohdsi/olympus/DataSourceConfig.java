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
package org.ohdsi.olympus;

import java.io.File;

import javax.sql.DataSource;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.h2.server.web.WebServlet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

/**
 *
 */
@Configuration
@Order(2)
public class DataSourceConfig {
    private static final Log log = LogFactory.getLog(DataSourceConfig.class);
    
    @Autowired
    private Environment env;
    
    @Bean
    public ServletRegistrationBean h2servletRegistration() {
        ServletRegistrationBean registration = new ServletRegistrationBean(new WebServlet());
        registration.addInitParameter("webAllowOthers", "true");
        registration.addUrlMappings("/console/*");
        return registration;
    }
    
    @Bean
    @Primary
    public DataSource primaryDataSource(File baseDir) {
        
        String driver = this.env.getRequiredProperty("datasource.driverClassName");
        String url = "jdbc:h2:file:";
        String dbFile = this.env.getRequiredProperty("datasource.db.file");
        if(StringUtils.trimToNull(dbFile) == null){
            dbFile = baseDir.getAbsolutePath() + File.separator + "dbfile";
        }
        url = url + dbFile;
        log.info("Using jdbcurl: " + url);
        String user = this.env.getRequiredProperty("datasource.username");
        String pass = this.env.getRequiredProperty("datasource.password");
       
        //non-pooling
        DriverManagerDataSource ds = new DriverManagerDataSource(url, user, pass);
        ds.setDriverClassName(driver);
        //note autocommit defaults vary across vendors. use provided @Autowired TransactionTemplate
        
        return ds;        
    }
}
