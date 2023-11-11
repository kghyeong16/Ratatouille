package hexagon.rat.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

//ERD에서 book 엔티티에 해당
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "book")
public class UserLesson extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOOK_ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LESSON_ID")
    private Lesson lesson;

    @Column(name = "REVIEW_TEXT")
    private String reviewText;

    @Column(name = "REVIEW_RATING")
    private Integer reviewRating;

    @Column(name = "TUTOR_ID")
    private long tutorId;
    @Builder
    public UserLesson(User user, Lesson lesson, long tutorId) {
        this.user = user;
        this.lesson = lesson;
        this.tutorId = tutorId;
    }

    public void UpdateReview(String reviewText, Integer reviewRating) {
        this.reviewText = reviewText;
        this.reviewRating = reviewRating;
    }
}
