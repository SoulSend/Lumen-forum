package life.lumen.common.model.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import life.lumen.common.enums.LoginType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserDTO {
    @NotNull(message = "登录方式不能为空")
    private LoginType loginType;
    @NotBlank(message = "手机号或邮箱号不能为空")
    private String identifier; // 邮箱或手机号
}
