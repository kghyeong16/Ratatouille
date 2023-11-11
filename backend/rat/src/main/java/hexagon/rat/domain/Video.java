package hexagon.rat.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String link;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private String content;
    @Column(nullable = false)
    private int seq;
    @Column(name = "s3key", nullable = false)
    private String key;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LESSON_ID", nullable = false)
    private Lesson lesson;
    @Builder
    public Video(String link, String title, String content, int seq, String key, Lesson lesson){
        this.link = link;
        this.title = title;
        this.content = content;
        this.seq = seq;
        this.key = key;
        this.lesson = lesson;
    }
}
