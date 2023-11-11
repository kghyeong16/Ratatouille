package hexagon.rat.dto;

import hexagon.rat.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
public class CreateLessonRequest {

    private String title;

    private String detail;

    private String ingredients;

    private Integer fee;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private long categoryId;
}
