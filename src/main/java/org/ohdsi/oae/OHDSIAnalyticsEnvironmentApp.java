package org.ohdsi.oae;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;

@SpringBootApplication
public class OHDSIAnalyticsEnvironmentApp extends SpringBootServletInitializer {
    
    @Override
    protected SpringApplicationBuilder configure(final SpringApplicationBuilder application) {
        return application.sources(OHDSIAnalyticsEnvironmentApp.class);
    }
    
    public static void main(final String[] args) throws Exception {
        new SpringApplicationBuilder(OHDSIAnalyticsEnvironmentApp.class).run(args);
    }
}