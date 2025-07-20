package life.lumen.common.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class PageQueryDTO {
    @NotNull
    private Long id =-1L;
    @PositiveOrZero
    private int page=0;
    @Positive
    private int size=10;
}
