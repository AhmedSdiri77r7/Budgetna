package tn.esprit.spring.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Toutes les routes Angular non-API renvoient index.html
        registry.addViewController("/{spring:[^.]+}").setViewName("forward:/index.html");
        registry.addViewController("/**/{spring:[^.]+}").setViewName("forward:/index.html");
    }
}
