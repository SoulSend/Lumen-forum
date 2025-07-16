package life.lumen.common.model.vo.post;

import lombok.Data;

/**
 * 文章前端展示对象 PostVO
 */
@Data
public class PostVO {

    /** 文章唯一标识 */
    private Long id;

    /** 文章标题 */
    private String title;

    /** 文章内容（完整正文） */
    private String content;

    /** 作者用户ID */
    private Long userId;

    /** 所属分类ID */
    private Long categoryId;

    /** 阅读次数 */
    private Integer viewCount;

    /** 点赞次数 */
    private Integer likeCount;

    /** 评论数量 */
    private Integer commentCount;

    /** 是否置顶：true-置顶，false-未置顶 */
    private Boolean isPinned;

    /** 是否加精：true-加精，false-未加精 */
    private Boolean isFeatured;

    /** 是否已解决（问答帖）：true-已解决，false-未解决 */
    private Boolean isSolved;
    /** 是否推荐 */
    private Boolean isRecommended;

    /** 被采纳的评论ID（问答帖解决时使用） */
    private Long solutionCommentId;
}