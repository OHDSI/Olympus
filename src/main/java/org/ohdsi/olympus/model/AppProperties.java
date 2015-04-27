package org.ohdsi.olympus.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.Size;

/**
 *
 */
@Entity(name = "app_properties")
public class AppProperties {
    
    public static final String PROP_ACHILLES_DATA_DIR = "achilles.data.dir";
    
    public static final int ID = 1;
    
    @Id
    private int id = ID;
    
    @Size(max = 250, min = 1)
    private String achillesDataDir;
    
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
