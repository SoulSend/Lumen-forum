package life.lumen.user.repository;

import life.lumen.common.model.entity.user.UserPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<UserPO, Long> {
    UserPO findByPhone(String phone);

    UserPO findByEmail(String email);

    UserPO findUserPoById(Long id);

    UserPO findByUsername(String username);
}
