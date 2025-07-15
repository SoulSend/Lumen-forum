package life.lumen.auth.config;

import life.lumen.auth.interceptor.UserContextInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    private final UserContextInterceptor userContextInterceptor;
    public WebMvcConfig(UserContextInterceptor userContextInterceptor){
        this.userContextInterceptor = userContextInterceptor;
    }
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userContextInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/login")
                .excludePathPatterns("/login/code");
        ;
    }
}
