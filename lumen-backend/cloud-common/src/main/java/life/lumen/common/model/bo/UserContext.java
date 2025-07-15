package life.lumen.common.model.bo;

import life.lumen.common.constants.SystemContextConstant;
import lombok.Data;


@Data
public class UserContext {
    // 用户基础信息
    private Long userId;
    private String username;
    private String avatar;

    // 权限信息
    private Boolean isAdmin;
    private Boolean isModerator;
    private Long moderatedCategory=-1L;

    // 系统身份标识
    private Boolean isSystem = false;


    // 快速创建系统上下文 用户系统内部feign调用
    public static UserContext createSystemContext() {
        UserContext context = new UserContext();
        context.setUserId(-1L);          // 系统用户ID固定为-1
        context.setUsername(SystemContextConstant.SYSTEM_USER_NAME);
        context.setIsSystem(true);
        return context;
    }

}