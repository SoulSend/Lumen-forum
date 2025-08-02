package life.lumen.user.repository;

import life.lumen.common.model.entity.user.UserPO;
import life.lumen.common.model.vo.user.UserVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<UserPO, Long> {
    UserPO findByPhone(String phone);

    UserPO findByEmail(String email);

    UserPO findUserPoById(Long id);

    UserPO findByUsername(String username);

    @Query("SELECT u FROM UserPO u " +
            "WHERE u.deleted = false AND u.lastActiveAt IS NOT NULL " +
            "ORDER BY u.lastActiveAt DESC, (u.postCount + u.commentCount) DESC")
    Page<UserPO> findActiveUsers(Pageable pageable);
}
