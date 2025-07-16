package life.lumen.common.model.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserDTO {
    @NotBlank
    private String username;

    private String bio;
    @NotBlank
    private String avatar;
}
