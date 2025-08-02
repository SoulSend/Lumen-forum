package life.lumen.common.model.vo.category;

import lombok.Data;

@Data
public class CategoryVO {
    private Long id;
    private String name;

    private String description;

    private String icon;
}
