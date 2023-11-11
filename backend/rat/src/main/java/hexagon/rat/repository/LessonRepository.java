package hexagon.rat.repository;

import hexagon.rat.dto.CardData;
import hexagon.rat.domain.Lesson;
import hexagon.rat.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

}
