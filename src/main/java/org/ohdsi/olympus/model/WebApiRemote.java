package org.ohdsi.olympus.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 *
 */
@Entity(name = "WEBAPI_REMOTE")
public class WebApiRemote {
    
    @Id
    @GeneratedValue/*(strategy = GenerationType.IDENTITY)*/
    private Long id;
    
    @NotNull
    @Size(max = 100, min = 1)
    private String name;
    
    @NotNull
    @Size(max = 250, min = 1)
    private String url;
    
    /**
     * 
     */
    public WebApiRemote(String name, String url) {
        this.name = name;
        this.url = url;
    }
    
    public WebApiRemote() {
    }
    
    /**
     * @return the name
     */
    public String getName() {
        return name;
    }
    
    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }
    
    /**
     * @return the url
     */
    public String getUrl() {
        return url;
    }
    
    /**
     * @param url the url to set
     */
    public void setUrl(String url) {
        this.url = url;
    }
    
    /**
     * @return the id
     */
    public Long getId() {
        return id;
    }
    
    /**
     * @param id the id to set
     */
    public void setId(Long id) {
        this.id = id;
    }
    
}
