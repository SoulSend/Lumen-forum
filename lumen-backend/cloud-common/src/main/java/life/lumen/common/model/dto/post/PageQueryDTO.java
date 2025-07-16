package life.lumen.common.model.dto.post;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class PageQueryDTO {
    @NotNull
    private Long id ;// 如果不需要使用就传入一个-1值即可 这个属性是给获取指定id用户的帖子，如果是别的接口就没有这个id参数 就传递-1即可
    @PositiveOrZero
    private int page=0;
    @Positive
    private int size=10;
}
