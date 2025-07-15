package life.lumen.common.model.dto.user;

import jakarta.validation.constraints.NotBlank;

public class UpdateUserDTO {
    @NotBlank
    private String username;
    @NotBlank
    private String email;

    private String bio;

    private String avatar;
}
