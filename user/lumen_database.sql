-- Lumen论坛数据库结构
-- 数据库使用UTF8编码

-- 创建数据库
CREATE DATABASE IF NOT EXISTS lumen_forum CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE lumen_forum;

-- 用户表
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL UNIQUE,
    password_hash VARCHAR(255) NULL COMMENT '如果使用第三方登录可以为空',
    avatar VARCHAR(255) NULL DEFAULT '/default-avatar.png',
    bio TEXT NULL,
    website VARCHAR(255) NULL,
    location VARCHAR(100) NULL,
    title VARCHAR(100) NULL COMMENT '用户头衔/职称',
    show_email BOOLEAN DEFAULT FALSE,
    reputation INT UNSIGNED DEFAULT 0,
    post_count INT UNSIGNED DEFAULT 0,
    comment_count INT UNSIGNED DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    is_moderator BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    last_active_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_reputation (reputation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户技能表
CREATE TABLE user_skills (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    name VARCHAR(50) NOT NULL,
    level TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '技能等级1-5',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_skill (user_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户社交链接表
CREATE TABLE user_social_links (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    name VARCHAR(30) NOT NULL COMMENT '社交平台名称',
    icon VARCHAR(50) NOT NULL COMMENT '图标名称',
    url VARCHAR(255) NOT NULL COMMENT '社交链接URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_social (user_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 分类表
CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NULL,
    icon VARCHAR(50) NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    parent_id INT UNSIGNED NULL COMMENT '父分类ID，顶级分类为NULL',
    post_count INT UNSIGNED DEFAULT 0,
    display_order INT UNSIGNED DEFAULT 0 COMMENT '显示顺序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 标签表
CREATE TABLE tags (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    description TEXT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    post_count INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 帖子表
CREATE TABLE posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content MEDIUMTEXT NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    view_count INT UNSIGNED DEFAULT 0,
    like_count INT UNSIGNED DEFAULT 0,
    comment_count INT UNSIGNED DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE COMMENT '是否置顶',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '是否精华',
    is_solved BOOLEAN DEFAULT FALSE COMMENT '是否已解决(问答类帖子)',
    solution_comment_id INT UNSIGNED NULL COMMENT '最佳回答ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FULLTEXT INDEX idx_post_search (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 帖子标签关联表
CREATE TABLE post_tag (
    post_id INT UNSIGNED NOT NULL,
    tag_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 评论表
CREATE TABLE comments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    post_id INT UNSIGNED NOT NULL,
    parent_id INT UNSIGNED NULL COMMENT '父评论ID，顶级评论为NULL',
    like_count INT UNSIGNED DEFAULT 0,
    is_solution BOOLEAN DEFAULT FALSE COMMENT '是否为最佳答案',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 帖子点赞表
CREATE TABLE post_likes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    post_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_post_like (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 评论点赞表
CREATE TABLE comment_likes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    comment_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_comment_like (comment_id, user_id),
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 收藏表
CREATE TABLE bookmarks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    post_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_bookmark (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 通知表
CREATE TABLE notifications (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    type VARCHAR(50) NOT NULL COMMENT '通知类型',
    data JSON NOT NULL COMMENT '通知数据',
    read_at TIMESTAMP NULL COMMENT '阅读时间，未读为NULL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, read_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户活动记录表
CREATE TABLE activities (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    type VARCHAR(50) NOT NULL COMMENT '活动类型',
    subject_id INT UNSIGNED NOT NULL COMMENT '相关对象ID',
    subject_type VARCHAR(50) NOT NULL COMMENT '相关对象类型',
    data JSON NULL COMMENT '额外数据',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_activity_type (type),
    INDEX idx_subject (subject_type, subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 验证码表
CREATE TABLE verification_codes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type ENUM('email', 'phone') NOT NULL,
    contact VARCHAR(100) NOT NULL COMMENT '邮箱或手机号',
    code VARCHAR(10) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contact_type (contact, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户认证令牌表
CREATE TABLE auth_tokens (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    token VARCHAR(100) NOT NULL UNIQUE,
    device VARCHAR(100) NULL COMMENT '设备信息',
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 系统配置表
CREATE TABLE settings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    value TEXT NULL,
    type VARCHAR(20) DEFAULT 'string' COMMENT '值类型: string, number, boolean, json',
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 初始化一些基础数据

-- 管理员用户
INSERT INTO users (username, email, avatar, bio, is_admin, email_verified_at) 
VALUES ('admin', 'admin@example.com', '/default-avatar.png', '系统管理员', TRUE, NOW());

-- 分类数据
INSERT INTO categories (name, description, icon, slug, display_order) VALUES 
('前端开发', '前端开发相关讨论', 'icon-frontend', 'frontend', 1),
('后端开发', '后端开发技术分享', 'icon-backend', 'backend', 2),
('移动开发', 'iOS、Android等移动平台开发', 'icon-mobile', 'mobile', 3),
('人工智能', 'AI、机器学习、深度学习讨论', 'icon-ai', 'ai', 4),
('开发工具', '开发工具和环境配置', 'icon-tools', 'tools', 5),
('生活技巧', '日常生活技巧分享', 'icon-life', 'life', 6),
('问答', '技术问答', 'icon-qa', 'qa', 7);

-- 标签数据
INSERT INTO tags (name, description, slug) VALUES 
('JavaScript', 'JavaScript编程语言', 'javascript'),
('Vue.js', 'Vue.js前端框架', 'vuejs'),
('React', 'React前端框架', 'react'),
('Node.js', 'Node.js运行环境', 'nodejs'),
('Python', 'Python编程语言', 'python'),
('Java', 'Java编程语言', 'java'),
('Spring', 'Spring框架', 'spring'),
('MySQL', 'MySQL数据库', 'mysql'),
('Redis', 'Redis数据库', 'redis'),
('Docker', 'Docker容器技术', 'docker'),
('AI', '人工智能技术', 'ai'),
('机器学习', '机器学习算法和应用', 'machine-learning'),
('深度学习', '深度学习技术', 'deep-learning'),
('Android', 'Android开发', 'android'),
('iOS', 'iOS开发', 'ios'),
('Flutter', 'Flutter跨平台开发', 'flutter'),
('微信小程序', '微信小程序开发', 'wechat-mini'),
('Git', 'Git版本控制', 'git'),
('VS Code', 'Visual Studio Code编辑器', 'vscode'),
('Linux', 'Linux操作系统', 'linux');

-- 系统设置
INSERT INTO settings (name, value, type, description) VALUES 
('site_name', 'Lumen论坛', 'string', '站点名称'),
('site_description', '分享生活智慧，发现日常精彩', 'string', '站点描述'),
('allow_registration', 'true', 'boolean', '是否允许新用户注册'),
('posts_per_page', '10', 'number', '每页显示的帖子数量'),
('comments_per_page', '10', 'number', '每页显示的评论数量'),
('enable_email_notification', 'true', 'boolean', '启用邮件通知'),
('enable_moderation', 'true', 'boolean', '启用内容审核');
