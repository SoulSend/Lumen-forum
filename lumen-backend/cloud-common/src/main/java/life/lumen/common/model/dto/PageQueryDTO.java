package life.lumen.common.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class PageQueryDTO {
    @NotNull
    private Long id ;// 如果不需要使用就传入一个-1值即可 这个属性是给获取指定id的的分页数据 比如：获取指定用户的文章分页列表，指定分类的文章分页列表
    @PositiveOrZero
    private int page=0;
    @Positive
    private int size=10;
}
