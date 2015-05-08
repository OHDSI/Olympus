package org.ohdsi.olympus;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@EnableWebSecurity
@Configuration
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * #10 This needed to only disable h2 console from csrf.
     */
    @Configuration
    @Order(1)
    public static class H2ConfigurationAdapter extends WebSecurityConfigurerAdapter {
        
        @Override
        protected void configure(final HttpSecurity http) throws Exception {
            http.antMatcher("/console/**").csrf().disable()
                .headers().frameOptions().disable()
                .authorizeRequests()
                .antMatchers("/console/**").hasAuthority("ADMIN");
            http.formLogin().failureUrl("/login?error").defaultSuccessUrl("/").loginPage("/login").permitAll().and()
                .logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout")).logoutSuccessUrl("/login")
                .permitAll();
        }
        
    }
    
    @Configuration
    public static class OlympusConfigurationAdapter extends WebSecurityConfigurerAdapter {
        
        @Autowired
        private DataSource dataSource;
        
        @Autowired
        private PasswordEncoder encoder;
        
        @Override
        protected void configure(final AuthenticationManagerBuilder auth) throws Exception {
            final JdbcUserDetailsManager userDetailsService = new JdbcUserDetailsManager();
            userDetailsService.setDataSource(this.dataSource);
            auth.userDetailsService(userDetailsService).passwordEncoder(this.encoder);
            auth.jdbcAuthentication().dataSource(this.dataSource);
        }
        
        @Override
        public void configure(final WebSecurity web) throws Exception {
            web.ignoring().antMatchers("/static/**", "/webjars/**", "/js/**", "/css/**", "/img/**");
        }
        
        @Override
        protected void configure(final HttpSecurity http) throws Exception {
            http.headers()
                    .frameOptions()
                    .disable()
                    .authorizeRequests()
                    //                    .antMatchers("/console/**").hasAuthority("ADMIN")
                    .antMatchers("/user/**").hasAuthority("ADMIN")
                    .antMatchers("/webapi/**").hasAuthority("ADMIN")
                    .antMatchers("/Circe/**").hasAuthority("CIRCE")
                    .antMatchers("/Hermes/**").hasAuthority("HERMES")
                    .antMatchers("/Heracles/**").hasAuthority("HERACLES")
                    .antMatchers("/JobViewer/**").hasAuthority("JOB_VIEWER")
                    .antMatchers("/Calypso/**").hasAuthority("CALYPSO")
                    .antMatchers("/Athena/**").hasAuthority("ATHENA")
                    //.antMatchers("/WebAPI/**").hasAuthority("WEBAPI") //TODO Review options of securing WebAPI itself
                    .anyRequest().authenticated();
            http.formLogin().failureUrl("/login?error").defaultSuccessUrl("/").loginPage("/login").permitAll().and()
                    .logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout")).logoutSuccessUrl("/login")
                    .permitAll().and().rememberMe().tokenRepository(persistentTokenRepository())
                    .tokenValiditySeconds(1209600);//14 days
        }
        
        @Bean
        public PersistentTokenRepository persistentTokenRepository() {
            final JdbcTokenRepositoryImpl db = new JdbcTokenRepositoryImpl();
            db.setDataSource(this.dataSource);
            return db;
        }
    }
    
    @Configuration
    public static class SecurityUtilsConfiguration {
        
        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }
}
