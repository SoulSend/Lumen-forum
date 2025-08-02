package life.lumen.content.repository;

import life.lumen.common.model.entity.tag.TagPO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<TagPO,Integer> {
    Page<TagPO> findAllByOrderByCreatedAtDesc(Pageable pageable);
    @Query("select e from TagPO e order by e.createdAt asc")
    List<TagPO> findTopNOrderByCreateTime(@Param("limit") int limit);
}
