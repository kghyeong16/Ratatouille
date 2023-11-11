package hexagon.rat.repository;

import hexagon.rat.domain.ProfileImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileImageRepository extends JpaRepository<ProfileImage, Long> {
    ProfileImage findByUserId(Long userId);
    Integer deleteByUserId(Long userId);
}
