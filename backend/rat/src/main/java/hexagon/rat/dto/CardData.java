package hexagon.rat.dto;

import hexagon.rat.domain.Category;
import hexagon.rat.domain.Image;
import hexagon.rat.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CardData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LESSON_ID")
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;
    @Column(nullable = false)
    private String detail;
    @Column(nullable = false)
    private String ingredients;
    @Column(nullable = false)
    private Integer fee;
    @Column(nullable = false)
    private LocalDateTime startTime;
    @Column(nullable = false)
    private LocalDateTime endTime;

    private Long tutorId;

    private Long categoryId;

    private String images;


    @Builder
    public CardData(Long id, String title, String detail, String ingredients, Integer fee, LocalDateTime startTime, LocalDateTime endTime, Long tutorId, Long categoryId, String image){
        this.id = id;
        this.title = title;
        this.detail = detail;
        this.ingredients = ingredients;
        this.fee = fee;
        this.startTime = startTime;
        this.endTime = endTime;
        this.tutorId = tutorId;
        this.categoryId = categoryId;
        this.images = image;
    }
}
