package hexagon.rat.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "profileImage")
public class ProfileImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Column(name = "link", nullable = true)
    private String link;

    @Column(name = "s3key", nullable = true)
    private String key;

    @Builder
    public ProfileImage(Long userId, String link, String key) {
//        this.email = email;
        this.userId = userId;
        this.link = link;
        this.key = key;
    }
}
