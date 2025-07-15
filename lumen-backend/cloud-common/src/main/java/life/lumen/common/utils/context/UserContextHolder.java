package life.lumen.common.utils.context;

import life.lumen.common.enums.ErrorCode;
import life.lumen.common.exception.CustomException;
import life.lumen.common.model.bo.UserContext;

public class UserContextHolder {
    private static final ThreadLocal<UserContext> contextHolder=new  ThreadLocal<>();
    //私有化构造器防止误构建holder类
    private UserContextHolder(){
    }
    public static void setSystemContext(){
        contextHolder.set(UserContext.createSystemContext());
    }
    public static void setUserContext(UserContext userContext){
        contextHolder.set(userContext);
    }
    public static UserContext getUserContext(){
        UserContext userContext = contextHolder.get();
        if(userContext == null){
            throw new CustomException(ErrorCode.NOT_USER_CONTEXT_ERROR);
        }
        return userContext;
    }

    public static void clearUserContext(){
        contextHolder.remove();
    }
}
