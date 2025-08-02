package life.lumen.common.model.entity.tag;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import life.lumen.common.model.entity.BaseEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "tags")
@Where(clause = "deleted = 0")                           // 查询时自动过滤已删除
@SQLDelete(sql = "UPDATE tags SET deleted = 1 WHERE id = ?") // 逻辑删除
@Getter
@Setter
public class TagPO extends BaseEntity {
    private String name;
    private String slug;
}
