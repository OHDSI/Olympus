package org.ohdsi.olympus;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;

@SpringBootApplication
public class Olympus extends SpringBootServletInitializer {
    
    @Override
    protected SpringApplicationBuilder configure(final SpringApplicationBuilder application) {
        return application.sources(Olympus.class);
    }
    
    public static void main(final String[] args) throws Exception {
        new SpringApplicationBuilder(Olympus.class).run(args);
    }
}