package life.lumen.auth.interceptor;



import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import life.lumen.common.model.bo.UserContext;
import life.lumen.common.utils.context.UserContextHolder;
import life.lumen.common.utils.context.UserHeaderUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;


/**
 * 从请求头中拿到用户的上下文信息，存入上下文中
 */
@Component
public class UserContextInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        UserContext userContext = UserHeaderUtils.convertHeadersToUser(request);
        if (userContext == null) {
            // todo 这里直接return false的话没有result响应
            return false;
        }
        UserContextHolder.setUserContext(userContext);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        UserContextHolder.clearUserContext();
    }
}
