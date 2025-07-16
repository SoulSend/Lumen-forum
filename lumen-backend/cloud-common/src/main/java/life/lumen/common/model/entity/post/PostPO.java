package life.lumen.common.model.entity.post;

import jakarta.persistence.*;
import life.lumen.common.model.entity.BaseEntity;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;


@Entity
@Table(name = "posts")
@Where(clause = "deleted = 0")                           // 查询时自动过滤已删除
@SQLDelete(sql = "UPDATE posts SET deleted = 1 WHERE id = ?") // 逻辑删除
@Getter
@Setter
public class PostPO extends BaseEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Lob
    @Column(name = "content", nullable = false, columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(name = "view_count", columnDefinition = "INT UNSIGNED DEFAULT 0")
    private Integer viewCount = 0;

    @Column(name = "like_count", columnDefinition = "INT UNSIGNED DEFAULT 0")
    private Integer likeCount = 0;

    @Column(name = "comment_count", columnDefinition = "INT UNSIGNED DEFAULT 0")
    private Integer commentCount = 0;

    @Column(name = "is_pinned", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isPinned = false;

    @Column(name = "is_featured", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isFeatured = false;

    @Column(name = "is_solved", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isSolved = false;
    @Column(name = "is_recommended", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isRecommended=false;

    @Column(name = "solution_comment_id")
    private Long solutionCommentId;


}