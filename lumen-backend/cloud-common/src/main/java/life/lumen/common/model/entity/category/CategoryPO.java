package life.lumen.common.model.entity.category;


import jakarta.persistence.*;
import life.lumen.common.model.entity.BaseEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "categories")
@SQLDelete(sql="update users set delated = 1 where id = ? ")
@Where(clause = "deleted = 0")
@Getter
@Setter
public class CategoryPO extends BaseEntity {

    private String name;
    
    private String description;
    
    private String icon;
    
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private CategoryPO parent;
    
    private Integer postCount = 0;
    
    private Integer displayOrder = 0;

}