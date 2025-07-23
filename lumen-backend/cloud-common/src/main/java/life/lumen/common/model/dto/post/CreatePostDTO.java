package life.lumen.common.model.dto.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreatePostDTO {
    // 必要参数（必须由前端传递）
    @NotBlank(message = "标题不能为空")
    @Size(max = 200, message = "标题长度不能超过200字符")
    private String title;

    @NotBlank(message = "内容不能为空")
    private String content;

    @NotNull(message = "分类ID不能为空")
    private Long categoryId;
}
