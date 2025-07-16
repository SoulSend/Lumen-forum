package life.lumen.common.model.entity.user;

import jakarta.persistence.*;
import life.lumen.common.model.entity.BaseEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;


/**
 * 用户实体类
 * @Entity - JPA注解，标识这是一个实体类，会映射到数据库表
 * @Table - JPA注解，指定映射的数据库表名
 *   name = "users" - 数据库表名为"users"
 */
@Entity
@Table(name = "users")
@SQLDelete(sql="update users set delated = 1 where id = ? ")
@Where(clause = "deleted = 0")
@Getter
@Setter
public class UserPO extends BaseEntity {
    /**
     * 用户名
     * @Column - JPA注解，定义列属性
     *   nullable = false - 非空
     *   unique = true - 唯一
     *   length = 50 - 最大长度50
     */
    @Column(unique = true, length = 50)
    private String username;
    /**
     * 邮箱地址
     */
    @Column(unique = true, length = 100)
    private String email;
    /**
     * 手机号码
     */
    @Column(unique = true, length = 20)
    private String phone;
    /**
     * 密码哈希值
     * 如果使用第三方登录可以为空
     */
    @Column(name = "password_hash", length = 255)
    private String passwordHash;
    /**
     * 头像URL，默认值/default-avatar.png
     */
    @Column(length = 255)
    private String avatar = "/default-avatar.png";
    /**
     * 个人简介
     * @Lob - JPA注解，表示大文本字段
     */
    @Lob
    private String bio;
    /**
     * 个人网站
     */
    private String website;
    /**
     * 所在地
     */
    private String location;
    /**
     * 头衔/职称
     */
    private String title;
    /**
     * 是否公开邮箱
     */
    @Column(name = "show_email")
    private Boolean showEmail = false;
    /**
     * 声望值
     */
    private Integer reputation = 0;
    /**
     * 发帖数量
     */
    @Column(name = "post_count")
    private Integer postCount = 0;
    /**
     * 评论数量
     */
    @Column(name = "comment_count")
    private Integer commentCount = 0;
    /**
     * 是否是管理员
     */
    @Column(name = "is_admin")
    private Boolean isAdmin = false;
    /**
     * 是否是版主
     */
    @Column(name = "is_moderator")
    private Boolean isModerator = false;
    /**
     * 版主管理的分类的id
     */
    @Column(name = "moderated_category")
    private Long moderatedCategory;
    /**
     * 邮箱验证时间
     */
    @Column(name = "email_verified_at")
    private LocalDateTime emailVerifiedAt;
    /**
     * 手机验证时间
     */
    @Column(name = "phone_verified_at")
    private LocalDateTime phoneVerifiedAt;
    /**
     * 最后活跃时间
     */
    @Column(name = "last_active_at")
    private LocalDateTime lastActiveAt;
    /**
     * 记住我令牌
     */
    @Column(name = "remember_token", length = 100)
    private String rememberToken;

}