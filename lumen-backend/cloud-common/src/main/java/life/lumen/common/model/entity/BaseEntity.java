package life.lumen.common.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 基础实体类，包含所有实体共有的属性
 * 使用@MappedSuperclass注解表示该类不会映射到数据库表，但它的属性会被继承到子类中
 */
@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {
    /**
     * 主键ID
     * @Id - JPA注解，标识主键字段
     * @GeneratedValue - JPA注解，指定主键生成策略
     *   strategy = GenerationType.IDENTITY - 使用数据库自增主键
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * 逻辑删除字段
     */
    @Column(name = "deleted_at", updatable = false)
    private Boolean deletedAt=false;
    /**
     * 创建时间
     * @CreationTimestamp - Hibernate注解，在插入记录时自动设置当前时间
     * @Column - JPA注解，定义列属性
     *   name = "created_at" - 数据库列名
     *   updatable = false - 不允许更新
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt=LocalDateTime.now();
    
    /**
     * 更新时间
     * @UpdateTimestamp - Hibernate注解，在更新记录时自动设置当前时间
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt=LocalDateTime.now();
}