package hexagon.rat.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user")

public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID", updatable = false)
    private Long id;

    @Column(nullable = false, length = 100, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100, unique = true)
    private String nickname;

    @Column(nullable = false, length = 15)
    private String phoneNumber;

    @Column(nullable = false)
    private int role;

    @Column(nullable = true)
    private String intro;

    @Column(nullable = true, length = 255)
    private String profileImg;

    @Column(nullable = true, length = 255)
    private String accessToken;

    @Column(nullable = true, length = 255)
    private String refreshToken;

    @Builder
    public User(String email, String password, String name, String nickname, String phoneNumber, String intro, String profileImg, String accessToken, String refreshToken, int role) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
        this.nickname = nickname;
        this.phoneNumber = phoneNumber;
        this.intro = intro;
        this.profileImg = profileImg;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public void updateUserToken(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public void updateProfile(String nickname, String phoneNumber, String intro, String link) {
        this.nickname = nickname;
        this.phoneNumber = phoneNumber;
        this.intro = intro;
        this.profileImg = link;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("user"));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
