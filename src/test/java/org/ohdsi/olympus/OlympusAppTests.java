package org.ohdsi.olympus;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.util.Assert;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = OlympusAppTests.class)
@WebAppConfiguration
public class OlympusAppTests {
    
    private static final Log log = LogFactory.getLog(OlympusAppTests.class);
    
    @Test
    public void contextLoads() {
        System.out.println("Test if context loads...");
    }
    
    @Test
    public void encrypt() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        String encoded = encoder.encode("admin");
        log.info("Encoded:" + encoded);
        Assert.isTrue(encoder.matches("admin", encoded));
    }
    
}
