package life.lumen.content.repository;

import life.lumen.common.model.entity.post.PostPO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PostRepository extends JpaRepository<PostPO,Long> {

    Page<PostPO> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<PostPO> findAllByOrderByCreatedAtDesc(Pageable pageable);

    PostPO findPostPoById(Long id);

    // 热门帖子 - 使用自定义公式计算热度
    @Query("SELECT p FROM PostPO p ORDER BY (p.viewCount * 0.5 + p.likeCount * 1 + p.commentCount * 1.5) DESC")
    Page<PostPO> findHotPosts(Pageable pageable);
    // 获取固定数量的热门帖子（用于侧边栏）
    @Query("SELECT p FROM PostPO p ORDER BY (p.viewCount * 0.5 + p.likeCount * 1 + p.commentCount * 1.5) DESC")
    List<PostPO> findTopHotPosts(Pageable pageable);

    // 推荐帖子 - 管理员推荐的
    Page<PostPO> findByIsRecommendedTrueOrderByCreatedAtDesc(Pageable pageable);


    // 获取固定数量的推荐帖子（用于首页轮播）
    List<PostPO> findTopByIsRecommendedTrueOrderByCreatedAtDesc(Pageable pageable);

    Page<PostPO> findByCategoryIdOrderByCreatedAtDesc(Long id,Pageable categoryId);
}
