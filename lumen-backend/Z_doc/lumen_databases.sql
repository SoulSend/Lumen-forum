-- 创建数据库
CREATE DATABASE IF NOT EXISTS lumen_forum CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE users (
    -- 主键ID，自增
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    -- 用户名，唯一且非空，最大长度50
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    -- 邮箱地址，唯一，最大长度100
    email VARCHAR(100) UNIQUE COMMENT '邮箱地址',
    -- 手机号码，唯一，最大长度20
    phone VARCHAR(20) UNIQUE COMMENT '手机号码',
    -- 密码哈希值，最大长度255，可为空
    password_hash VARCHAR(255) COMMENT '密码哈希值',
    -- 头像URL，默认值为/default-avatar.png，最大长度255
    avatar VARCHAR(255) DEFAULT '/default-avatar.png' COMMENT '头像URL',
    -- 个人简介，大文本字段
    bio TEXT COMMENT '个人简介',
    -- 个人网站，最大长度255
    website VARCHAR(255) COMMENT '个人网站',
    -- 所在地，最大长度255
    location VARCHAR(255) COMMENT '所在地',
    -- 头衔/职称，最大长度255
    title VARCHAR(255) COMMENT '头衔/职称',
    -- 是否公开邮箱，默认值为false
    show_email BOOLEAN DEFAULT FALSE COMMENT '是否公开邮箱',
    -- 声望值，默认值为0
    reputation INT DEFAULT 0 COMMENT '声望值',
    -- 发帖数量，默认值为0
    post_count INT DEFAULT 0 COMMENT '发帖数量',
    -- 评论数量，默认值为0
    comment_count INT DEFAULT 0 COMMENT '评论数量',
    -- 是否是管理员，默认值为false
    is_admin BOOLEAN DEFAULT FALSE COMMENT '是否是管理员',
    -- 是否是版主，默认值为false
    is_moderator BOOLEAN DEFAULT FALSE COMMENT '是否是版主',
    -- 版主管理的分类的ID
    moderated_category BIGINT COMMENT '版主管理的分类的ID',
    -- 邮箱验证时间
    email_verified_at DATETIME COMMENT '邮箱验证时间',
    -- 手机验证时间
    phone_verified_at DATETIME COMMENT '手机验证时间',
    -- 最后活跃时间
    last_active_at DATETIME COMMENT '最后活跃时间',
    -- 记住我令牌，最大长度100
    remember_token VARCHAR(100) COMMENT '记住我令牌',
    -- 逻辑删除字段，默认值为false
    deleted_at BOOLEAN DEFAULT FALSE COMMENT '逻辑删除字段',
    -- 创建时间，自动设置为当前时间，不可更新
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- 更新时间，自动更新为当前时间
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='用户表';
-- 初始化用户表数据
INSERT INTO users (username, email, phone, password_hash, avatar, bio, website, location, title, show_email, reputation, post_count, comment_count, is_admin, is_moderator, moderated_category, email_verified_at, phone_verified_at, last_active_at, remember_token, deleted_at)
VALUES
    ('管理员', 'admin@example.com', '13800000000', 'hashed_password_admin', '/default-avatar.png', 'Site Administrator', 'http://example.com', 'Beijing', 'Admin', false, 1000, 50, 100, true, false, NULL, '2025-07-08 10:00:00', '2025-07-08 10:05:00', '2025-07-08 10:10:00', 'token_admin', false),
    ('版主', 'moderator@example.com', '13900000000', 'hashed_password_moderator', '/default-avatar.png', 'Community Moderator', 'http://moderator.com', 'Shanghai', 'Moderator', false, 500, 30, 50, false, true, 1, '2025-07-08 11:00:00', '2025-07-08 11:05:00', '2025-07-08 11:10:00', 'token_moderator', false),
    ('用户1', 'user1@example.com', '13700000000', 'hashed_password_user1', '/default-avatar.png', 'Just a regular user', 'http://user1.com', 'Guangzhou', 'User', false, 100, 10, 20, false, false, NULL, '2025-07-08 12:00:00', '2025-07-08 12:05:00', '2025-07-08 12:10:00', 'token_user1', false),
    ('用户2', 'user2@example.com', '13600000000', 'hashed_password_user2', '/default-avatar.png', 'Another regular user', 'http://user2.com', 'Shenzhen', 'User', false, 150, 15, 25, false, false, NULL, '2025-07-08 13:00:00', '2025-07-08 13:05:00', '2025-07-08 13:10:00', 'token_user2', false);

-- 分类表
CREATE TABLE categories (
    id            INT UNSIGNED AUTO_INCREMENT COMMENT '主键 ID',
    name          VARCHAR(50)  NOT NULL COMMENT '分类名称',
    description   TEXT                  COMMENT '分类描述',
    icon          VARCHAR(50)           COMMENT '分类图标（CSS class 或文件名）',
    parent_id     INT UNSIGNED          COMMENT '父分类 ID，顶级分类为 NULL',
    post_count    INT UNSIGNED DEFAULT 0 COMMENT '该分类下的文章数量',
    display_order INT UNSIGNED DEFAULT 0 COMMENT '显示顺序（升序）',
    deleted_at       TINYINT(1)   DEFAULT 0 COMMENT '逻辑删除标识：0-正常，1-已删除',
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id)
) COMMENT='用户表';

-- 清空表并重置自增ID（可选）
TRUNCATE TABLE categories;

-- 插入顶级分类
INSERT INTO categories (name, description, icon, parent_id, display_order) VALUES
   ('生活百科', '日常生活小窍门和实用知识', 'fa-home', NULL, 1),
   ('健康医疗', '常见疾病预防和健康养生知识', 'fa-heartbeat', NULL, 2),
   ('科学技术', '科学原理解读和科技应用分享', 'fa-flask', NULL, 3),
   ('家庭育儿', '家庭关系处理和育儿经验交流', 'fa-child', NULL, 4),
   ('食品安全', '食品选购和饮食健康指南', 'fa-utensils', NULL, 5),
   ('环保节能', '环境保护和资源节约方法', 'fa-leaf', NULL, 6);

-- 插入一些子分类（可选）
INSERT INTO categories (name, description, icon, parent_id, display_order) VALUES
   ('家电使用', '家用电器使用和维护技巧', 'fa-plug', 1, 1),
   ('急救知识', '常见意外情况的急救处理方法', 'fa-first-aid', 2, 1),
   ('儿童教育', '各年龄段儿童教育方法分享', 'fa-book', 4, 1),
   ('垃圾分类', '各类垃圾的正确分类方法', 'fa-recycle', 6, 1);



