package hexagon.rat.repository;

import hexagon.rat.domain.Image;
import hexagon.rat.domain.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {
    @Modifying
    @Query(value = "delete from Video v where v.lesson.id = :id")
    void deleteAllById(@Param("id") Long id);

    // 이미지에서 해당하는 lesson_id 값들을 리스트에 저장한다
    @Query(value = "select v from Video v where v.lesson.id = :id")
    List<Video> findAllVideo(@Param("id") Long id);
}
