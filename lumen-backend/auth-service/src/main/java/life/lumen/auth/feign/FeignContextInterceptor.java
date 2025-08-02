package life.lumen.auth.feign;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import life.lumen.common.model.bo.UserContext;
import life.lumen.common.utils.context.UserContextHolder;
import life.lumen.common.utils.context.UserHeaderUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static life.lumen.common.constants.SystemContextConstant.*;

public class FeignContextInterceptor implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate requestTemplate) {
        Map<String, List<String>> stringListMap=new HashMap<>();

        UserContext userContext = UserContextHolder.getUserContext();
            if(userContext.getIsSystem()){
            stringListMap.put(SYSTEM_CALL_HEAD,List.of("true"));
        }else {
            stringListMap=UserHeaderUtils.convertUserToHeaders(userContext);
        }
        //将用户上下文信息添加到请求头内
        stringListMap.forEach(requestTemplate::header);
    }
}
