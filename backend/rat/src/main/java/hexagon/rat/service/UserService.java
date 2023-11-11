package hexagon.rat.service;

import hexagon.rat.domain.User;
import hexagon.rat.dto.CreateUserRequest;
import hexagon.rat.dto.TokenInfo;
import hexagon.rat.dto.UserLoginRequestDto;
import hexagon.rat.dto.UserModifyDto;
import hexagon.rat.jwt.JwtTokenProvider;
import hexagon.rat.repository.ProfileImageRepository;
import hexagon.rat.repository.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final ProfileImageRepository profileImageRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UploadDataService uploadDataService;

    public User save(CreateUserRequest request){
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .nickname(request.getNickname())
                .phoneNumber(request.getPhoneNumber())
                .intro(request.getIntro())
                .accessToken(request.getAccessToken())
                .refreshToken(request.getRefreshToken())
                .role(request.getRole())
                .build();
        log.info(request.getAccessToken());
        log.info(request.getRefreshToken());
        return userRepository.save(user);
    }

    @Transactional
    public Optional<User> updateToken(UserLoginRequestDto userLoginRequestDto, TokenInfo tokenInfo) {
        Optional<User> user = userRepository.findByEmail(userLoginRequestDto.getUserId());
        log.info(user.get().getEmail());
        user.get().updateUserToken(tokenInfo.getAccessToken(), tokenInfo.getRefreshToken());
        return user;
    }

    @Transactional
    public Optional<User> deleteToken(UserLoginRequestDto userLoginRequestDto) {
        Optional<User> user = userRepository.findByEmail(userLoginRequestDto.getUserId());
        user.get().updateUserToken("NULL", "NULL");
        return user;
    }

    @Transactional
    public TokenInfo updateAccessToken(String userId, String password) {
        Optional<User> user = userRepository.findByEmail(userId);
        Claims claims = jwtTokenProvider.parseClaims(user.get().getAccessToken());
        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get("auth").toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userId, password, authorities);
        //authenticationToken.se;
        log.info("업데이트 엑세스 토큰 권한 : " + authenticationToken.getAuthorities().toString());
        log.info(user.get().getAccessToken());
        log.info(user.get().getRefreshToken());
        TokenInfo tokenInfo = jwtTokenProvider.generateAccessToken(authenticationToken, user.get().getRefreshToken());
        user.get().updateUserToken(tokenInfo.getAccessToken(), user.get().getRefreshToken());
        log.info(user.get().getAccessToken());
        log.info(user.get().getRefreshToken());
        return tokenInfo;
    }


    public TokenInfo login(String userId, String password) {
        // 1. Login ID/PW 를 기반으로 Authentication 객체 생성
        // 이때 authentication 는 인증 여부를 확인하는 authenticated 값이 false
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userId, password);

        // 2. 실제 검증 (사용자 비밀번호 체크)이 이루어지는 부분
        // authenticate 매서드가 실행될 때 CustomUserDetailsService 에서 만든 loadUserByUsername 메서드가 실행
        log.info(String.valueOf(authenticationToken));
        log.info("로그인 오류 체크용 로그");
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        log.info("로그인 오류 체크용 로그");
        log.info(String.valueOf(authentication));
        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);
        return tokenInfo;
    }

    public User findById(Long id){
        return userRepository.findById(id).orElseThrow(()-> new NullPointerException("유저가 존재하지 않습니다."));
    }

    @Transactional
    public void UpdateUserProfile(UserModifyDto userModifyDto, MultipartFile img, Long id) throws Exception {
        User user = userRepository.findById(id).get();
        log.info("접근하는 유저 아이디 : " + id);
        log.info("이미지레포 아이디 검색 : " + profileImageRepository.findByUserId(id));
        if (profileImageRepository.findByUserId(id) != null){
            log.info("기존 프로필 존재 확인");
            uploadDataService.deleteData(profileImageRepository.findByUserId(id).getKey());
            profileImageRepository.deleteByUserId(id);
        }

        String link = uploadDataService.profileImageUpload(img, id);

        log.info(userModifyDto.getNickname() + " " + userModifyDto.getPhoneNumber() +" " + userModifyDto.getIntro());
        user.updateProfile(userModifyDto.getNickname(), userModifyDto.getPhoneNumber(), userModifyDto.getIntro(), link);
    }

    public User findByNickname(String nickname) {
        return userRepository.findByNickname(nickname);
    }
}
