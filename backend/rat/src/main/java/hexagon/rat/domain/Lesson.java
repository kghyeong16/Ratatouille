package hexagon.rat.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "lesson")
public class Lesson extends BaseEntity{
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
    @Column
    private String url;
    @Column(nullable = false)
    private LocalDateTime startTime;
    @Column(nullable = false)
    private LocalDateTime endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TUTOR_ID")
    private User tutor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CATEGORY_ID")
    private Category category;

    @OneToMany(mappedBy = "lesson")
    private List<UserLesson> userLessons;

    @OneToMany(mappedBy = "lesson")
    private List<Image> images;

    @OneToMany(mappedBy = "lesson")
    private List<Video> videos;



    @Builder
    public Lesson(String title, String detail, String ingredients, Integer fee, LocalDateTime startTime, LocalDateTime endTime, User tutor, Category category){
        this.title = title;
        this.detail = detail;
        this.ingredients = ingredients;
        this.fee = fee;
        this.startTime = startTime;
        this.endTime = endTime;
        this.tutor = tutor;
        this.category = category;
    }

    public void updateLesson(String title, String detail, String ingredients, Integer fee, LocalDateTime startTime, LocalDateTime endTime) {
        this.title = title;
        this.detail = detail;
        this.ingredients = ingredients;
        this.fee = fee;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public void updateRecordingUrl(String url){
        this.url = url;
    }
}
