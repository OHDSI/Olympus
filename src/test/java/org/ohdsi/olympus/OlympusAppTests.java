package org.ohdsi.olympus;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.ohdsi.olympus.SecurityConfig.SecurityUtilsConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.util.Assert;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = { SecurityUtilsConfiguration.class })
@WebAppConfiguration
public class OlympusAppTests {
    
    private static final Log log = LogFactory.getLog(OlympusAppTests.class);
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Test
    public void contextLoads() {
        System.out.println("Test if context loads...");
    }
    
    @Test
    public void encrypt() {
        String encoded = passwordEncoder.encode("admin");
        log.info("Encoded:" + encoded);
        Assert.isTrue(passwordEncoder.matches("admin", encoded));
    }
    
}
