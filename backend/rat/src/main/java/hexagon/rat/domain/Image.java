package hexagon.rat.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "link", nullable = false)
    private String link;

    @Column(name = "seq", nullable = false)
    private int seq;

    @Column(name = "s3key", nullable = false)
    private String key;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LESSON_ID", nullable = false)
    private Lesson lesson;

    @Builder
    public Image(String link, int seq, String key, Lesson lesson){
        this.link = link;
        this.seq = seq;
        this.key = key;
        this.lesson = lesson;
    }
}
