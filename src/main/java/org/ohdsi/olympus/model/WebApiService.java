package org.ohdsi.olympus.model;

import org.eclipse.jetty.webapp.WebAppContext;
import org.springframework.util.Assert;

/**
 *
 */
public class WebApiService {
    
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
        this.context.start();
    }
    
    /**
     * Auto generated method comment
     */
    public void stop() throws Exception {
        Assert.state(isRunning(), "WebApi is not running.");
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
