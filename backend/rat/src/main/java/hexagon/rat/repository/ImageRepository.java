package hexagon.rat.repository;

import hexagon.rat.domain.Image;
import hexagon.rat.domain.UserLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    
    // 해당하는 lesson_id 값들을 삭제한다
    @Modifying
    @Query(value = "delete from Image i where i.lesson.id = :id")
    void deleteAllById(@Param("id") Long id);
    
    // 이미지에서 해당하는 lesson_id 값들을 리스트에 저장한다
    @Query(value = "select i from Image i where i.lesson.id = :id")
    List<Image> findAllImage(@Param("id") Long id);
}
