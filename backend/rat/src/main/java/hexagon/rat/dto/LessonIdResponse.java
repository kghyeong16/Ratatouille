package hexagon.rat.dto;

import lombok.Data;

@Data
public class LessonIdResponse {
    Long lessonId;

    public LessonIdResponse(Long lessonId) {
        this.lessonId = lessonId;
    }
}
