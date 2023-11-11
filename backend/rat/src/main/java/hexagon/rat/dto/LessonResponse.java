package hexagon.rat.dto;

import hexagon.rat.domain.Lesson;
import lombok.Getter;

@Getter
public class LessonResponse {

    // 속성 추가 예정
    private final Long id;

    public LessonResponse(Lesson lesson){
        this.id = lesson.getId();
    }
}
