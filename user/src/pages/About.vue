<template>
  <main-layout>
    <div class="about-container">
      <div class="about-header animate-fade-in">
        <h1 class="about-title">关于 Lumen 论坛</h1>
        <p class="about-subtitle">分享知识，连接世界</p>
        <div class="header-animation">
          <span class="pulse-circle"></span>
          <span class="pulse-circle delay-1"></span>
          <span class="pulse-circle delay-2"></span>
        </div>
      </div>
      
      <div class="about-content">
        <section class="about-section animate-slide-up">
          <h2 class="section-title">我们的使命</h2>
          <div class="mission-content">
            <div class="mission-icon">
              <span class="material-icons-round mission-icon-pulse">lightbulb</span>
            </div>
            <div class="mission-text">
              <p>Lumen 论坛致力于创建一个开放、友善、充满活力的在线社区，让用户可以自由分享知识、经验和见解。我们相信知识的力量，也相信通过交流可以激发创新和进步。</p>
              <p class="highlight-text">让每一次交流都成为思想的火花，让每一次分享都成为知识的传递。</p>
            </div>
          </div>
        </section>
        
        <section class="about-section animate-slide-up">
          <h2 class="section-title">社区价值观</h2>
          <div class="values-grid">
            <div class="value-item hover-lift">
              <div class="value-icon"><span class="material-icons-round">diversity_3</span></div>
              <h3>尊重</h3>
              <p>尊重每一位用户的观点和背景，创造包容的讨论环境。</p>
            </div>
            <div class="value-item hover-lift">
              <div class="value-icon"><span class="material-icons-round">verified</span></div>
              <h3>质量</h3>
              <p>鼓励高质量的内容创作和有深度的讨论。</p>
            </div>
            <div class="value-item hover-lift">
              <div class="value-icon"><span class="material-icons-round">handshake</span></div>
              <h3>协作</h3>
              <p>促进用户之间的互助和协作，共同解决问题。</p>
            </div>
            <div class="value-item hover-lift">
              <div class="value-icon"><span class="material-icons-round">auto_awesome</span></div>
              <h3>创新</h3>
              <p>拥抱新思想和创新观点，推动社区不断发展。</p>
            </div>
          </div>
        </section>
        
        <section class="about-section animate-slide-up">
          <h2 class="section-title">社区数据</h2>
          <div class="stats-grid">
            <div class="stat-item counter-animate">
              <div class="stat-number" data-target="15000">0</div>
              <div class="stat-label">活跃用户</div>
            </div>
            <div class="stat-item counter-animate">
              <div class="stat-number" data-target="30000">0</div>
              <div class="stat-label">优质帖子</div>
            </div>
            <div class="stat-item counter-animate">
              <div class="stat-number" data-target="120000">0</div>
              <div class="stat-label">热心回复</div>
            </div>
            <div class="stat-item counter-animate">
              <div class="stat-number" data-target="365">0</div>
              <div class="stat-label">运营天数</div>
            </div>
          </div>
        </section>
        
        <section class="about-section animate-slide-up">
          <h2 class="section-title">我们的团队</h2>
          <div class="team-grid">
            <div class="team-member hover-card">
              <div class="member-avatar-wrapper">
                <img src="../assets/default-avatar.png" alt="团队成员" class="member-avatar">
                <div class="avatar-overlay">
                  <div class="social-links">
                    <a href="#" class="social-link"><span class="material-icons-round">link</span></a>
                    <a href="#" class="social-link"><span class="material-icons-round">mail</span></a>
                  </div>
                </div>
              </div>
              <h3>张明</h3>
              <p class="member-role">创始人 & CEO</p>
              <p class="member-desc">拥有10年社区运营经验，致力于打造高质量的内容社区。</p>
            </div>
            <div class="team-member hover-card">
              <div class="member-avatar-wrapper">
                <img src="../assets/default-avatar.png" alt="团队成员" class="member-avatar">
                <div class="avatar-overlay">
                  <div class="social-links">
                    <a href="#" class="social-link"><span class="material-icons-round">link</span></a>
                    <a href="#" class="social-link"><span class="material-icons-round">mail</span></a>
                  </div>
                </div>
              </div>
              <h3>李华</h3>
              <p class="member-role">技术总监</p>
              <p class="member-desc">全栈开发专家，精通前后端技术，推动产品技术创新。</p>
            </div>
            <div class="team-member hover-card">
              <div class="member-avatar-wrapper">
                <img src="../assets/default-avatar.png" alt="团队成员" class="member-avatar">
                <div class="avatar-overlay">
                  <div class="social-links">
                    <a href="#" class="social-link"><span class="material-icons-round">link</span></a>
                    <a href="#" class="social-link"><span class="material-icons-round">mail</span></a>
                  </div>
                </div>
              </div>
              <h3>王芳</h3>
              <p class="member-role">社区经理</p>
              <p class="member-desc">专注于用户体验优化，构建温暖、互助的社区氛围。</p>
            </div>
          </div>
        </section>
        
        <section class="about-section animate-slide-up">
          <h2 class="section-title">联系我们</h2>
          <div class="contact-info">
            <div class="contact-item hover-effect">
              <span class="material-icons-round">email</span>
              <span>contact@lumen-forum.com</span>
            </div>
            <div class="contact-item hover-effect">
              <span class="material-icons-round">location_on</span>
              <span>北京市海淀区科技园区88号</span>
            </div>
            <div class="contact-item hover-effect">
              <span class="material-icons-round">phone</span>
              <span>400-123-4567</span>
            </div>
          </div>
          
          <div class="social-links">
            <a href="#" class="social-link-btn"><span class="material-icons-round">public</span> 官网</a>
            <a href="#" class="social-link-btn"><span class="material-icons-round">chat</span> 微信</a>
            <a href="#" class="social-link-btn"><span class="material-icons-round">code</span> GitHub</a>
          </div>
        </section>
        
        <section class="about-section animate-slide-up">
          <h2 class="section-title">加入我们</h2>
          <div class="join-us-content">
            <p class="join-text">我们始终欢迎优秀人才的加入。如果您对社区建设充满热情，对知识分享有独到见解，请随时与我们联系。</p>
            <div class="cta-button-container">
              <a href="#" class="cta-button pulse-button">
                <span class="material-icons-round">work</span>
                查看职位
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main-layout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import MainLayout from '../components/layout/MainLayout.vue';

// 数字计数器动画
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // 当元素进入视口时执行动画
      if (entry.isIntersecting) {
        // 对所有计数器元素执行动画
        const counters = document.querySelectorAll('.counter-animate .stat-number');
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0');
          const duration = 1500; // 动画持续时间（毫秒）
          const step = target / (duration / 16); // 每16ms增加的值
          
          let current = 0;
          const updateCounter = () => {
            current += step;
            if (current < target) {
              counter.textContent = Math.floor(current).toString();
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toString();
            }
          };
          updateCounter();
        });
        
        // 动画只需执行一次，执行后取消观察
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 }); // 当10%的元素可见时触发

  // 观察统计区域
  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  }
  
  // 添加动画类
  const animateElements = document.querySelectorAll('.animate-slide-up, .animate-fade-in');
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animationObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animateElements.forEach(el => {
    animationObserver.observe(el);
  });
  
  // 清理函数
  onUnmounted(() => {
    observer.disconnect();
    animationObserver.disconnect();
  });
});
</script>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-6);
}

/* 头部样式 */
.about-header {
  text-align: center;
  margin-bottom: var(--spacing-10);
  padding-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--border-light);
  position: relative;
  opacity: 0;
}

.about-header.animated {
  animation: fadeIn 1s forwards;
}

.about-title {
  font-size: var(--font-size-3xl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-4);
}

.about-subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
}

/* 脉冲动画 */
.header-animation {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pulse-circle {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--primary-color);
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  animation: pulse 2s infinite;
}

.delay-1 {
  animation-delay: 0.6s;
}

.delay-2 {
  animation-delay: 1.2s;
}

/* 内容区块通用样式 */
.about-section {
  margin-bottom: var(--spacing-10);
  opacity: 0;
  transform: translateY(20px);
}

.about-section.animated {
  animation: slideUp 0.8s forwards;
}

.section-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-6);
  color: var(--text-primary);
  position: relative;
  padding-bottom: var(--spacing-3);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.about-section:hover .section-title::after {
  width: 100px;
}

/* 使命部分 */
.mission-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

.mission-icon {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mission-icon-pulse {
  font-size: 40px;
  color: var(--primary-color);
  animation: iconPulse 2s infinite;
}

.mission-text {
  flex-grow: 1;
}

.highlight-text {
  font-style: italic;
  color: var(--primary-color);
  font-weight: 500;
  margin-top: var(--spacing-4);
  padding-left: var(--spacing-3);
  border-left: 3px solid var(--primary-color);
}

/* 价值观网格 */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-6);
}

.value-item {
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  background-color: var(--bg-surface);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-lg);
}

.value-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-subtle);
  border-radius: 50%;
  margin-bottom: var(--spacing-4);
  color: var(--primary-color);
}

.value-icon .material-icons-round {
  font-size: 30px;
}

/* 统计数据 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-6);
  margin: var(--spacing-8) 0;
}

.stat-item {
  text-align: center;
  padding: var(--spacing-5);
  border-radius: var(--radius-lg);
  background: linear-gradient(to bottom right, var(--bg-surface), var(--bg-subtle));
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: scale(1.05);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: var(--spacing-2);
}

.stat-label {
  color: var(--text-secondary);
  font-size: var(--font-size-md);
}

/* 团队样式 */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-6);
  margin: var(--spacing-8) 0;
}

.team-member {
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  background-color: var(--bg-surface);
  box-shadow: var(--shadow-sm);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.member-avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-4);
  overflow: hidden;
  border-radius: 50%;
}

.member-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.member-avatar-wrapper:hover .member-avatar {
  transform: scale(1.1);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.member-avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay .social-links {
  display: flex;
  gap: var(--spacing-3);
}

.avatar-overlay .social-link {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  color: var(--primary-color);
  transition: all 0.2s ease;
}

.avatar-overlay .social-link:hover {
  background-color: var(--primary-color);
  color: white;
  transform: scale(1.1);
}

.member-role {
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-2);
}

.member-desc {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

/* 联系信息 */
.contact-info {
  margin-bottom: var(--spacing-6);
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-4);
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.hover-effect:hover {
  background-color: var(--bg-subtle);
  transform: translateX(10px);
}

.contact-item .material-icons-round {
  margin-right: var(--spacing-3);
  color: var(--primary-color);
}

.social-links {
  display: flex;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
  justify-content: center;
}

.social-link-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--bg-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link-btn:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

/* 加入我们 */
.join-us-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.join-text {
  font-size: var(--font-size-md);
  line-height: 1.6;
  margin-bottom: var(--spacing-6);
}

.cta-button-container {
  margin-top: var(--spacing-6);
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

/* 确保按钮中的图标始终为白色，包括悬浮状态 */
.cta-button .material-icons-round {
  color: white !important; /* 确保图标是白色 */
  transition: none; /* 禁用图标的颜色过渡效果 */
}

/* 修复悬浮状态 */
.cta-button:hover,
.cta-button:focus {
  background-color: var(--primary-dark) !important;
  color: white !important;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

/* 确保悬浮状态下图标保持白色 */
.cta-button:hover .material-icons-round,
.cta-button:focus .material-icons-round {
  color: white !important;
}

.pulse-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: var(--radius-md);
  animation: pulseBorder 2s infinite;
  box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.7);
}

/* 动画效果 */
@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 0.6;
  }
  70% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}

@keyframes iconPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseBorder {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0);
  }
}

@media (max-width: 768px) {
  .values-grid,
  .stats-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .mission-content {
    flex-direction: column;
    text-align: center;
  }
  
  .about-title {
    font-size: var(--font-size-2xl);
  }
}
</style> 