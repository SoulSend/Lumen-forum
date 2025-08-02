package life.lumen.auth.interceptor;



import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import life.lumen.common.constants.SystemContextConstant;
import life.lumen.common.enums.ErrorCode;
import life.lumen.common.exception.CustomException;
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
        //先看看是不是系统调用
        if("true".equals(request.getHeader(SystemContextConstant.SYSTEM_CALL_HEAD))){
            //是系统调用
            UserContextHolder.setSystemContext();
            return true;
        }
        UserContext userContext = UserHeaderUtils.convertHeadersToUser(request);
        if (userContext == null) {
            // 这里返回false 会导致信息静默，什么输出都没有，不好定位 直接报错
            throw new CustomException(ErrorCode.NOT_USER_CONTEXT_ERROR);
        }
        UserContextHolder.setUserContext(userContext);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        UserContextHolder.clearUserContext();
    }
}
