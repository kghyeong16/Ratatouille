package hexagon.rat.repository;

import hexagon.rat.domain.Lesson;
import hexagon.rat.domain.User;
import hexagon.rat.domain.UserLesson;
import hexagon.rat.dto.ReviewResponse;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserLessonRepository extends JpaRepository<UserLesson, Long> {
    Optional<UserLesson> findByUserIdAndLessonId(Long userId, Long lessonId);
    List<UserLesson> findByUserId(Long UserId);
    List<UserLesson> findByLessonId(Long lessonId);
    List<UserLesson> findByTutorId(Long tutorId);

    // 해당하는 lesson_id를 가진 예약 목록들을 리스트화
    @Modifying
    @Query(value = "select b from UserLesson b where b.lesson.id = :lesson")
    List<UserLesson> findAllBook(@Param("lesson") Long lesson);

    
    // 추후 개선 가능이 가능해 보임
    @Modifying
    @Query(value = "delete from UserLesson b where b.lesson.id = :id")
    void deleteAllById(@Param("id") Long id);
}
