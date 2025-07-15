package life.lumen.common.model.vo.auth;

import life.lumen.common.model.bo.UserContext;
import lombok.Data;

@Data
public class LoginVO {
    private String token;
    private UserContext userContext;
}
