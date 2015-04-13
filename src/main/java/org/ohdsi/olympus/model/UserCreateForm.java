package org.ohdsi.olympus.model;

import java.util.Set;

import javax.validation.constraints.Size;

public class UserCreateForm {
    
    @Size(min = 4, message = "Minimum length = 4")
    private String username = "";
    
    @Size(min = 4, message = "Minimum length = 4")
    private String password = "";
    
    private Set<Role> roles;
    
    private boolean enabled = true;
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public Set<Role> getRoles() {
        return roles;
    }
    
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
    
    /**
     * @return the username
     */
    public String getUsername() {
        return username;
    }
    
    /**
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }
}
