package hexagon.rat.controller;

import hexagon.rat.domain.User;
import hexagon.rat.domain.UserLesson;
import hexagon.rat.dto.*;
import hexagon.rat.jwt.JwtTokenProvider;
import hexagon.rat.repository.UserLessonRepository;
import hexagon.rat.repository.UserRepository;
import hexagon.rat.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/user")
@RestController
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserLessonRepository userLessonRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("")
    public ResponseEntity<User> signup(@RequestBody CreateUserRequest request){
        return ResponseEntity.ok(userService.save(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody UserLoginRequestDto userLoginRequestDto) {
        log.info("로그인 진입");
        String email = userLoginRequestDto.getUserId();
        log.info(email);
        String password = userLoginRequestDto.getPassword();
        log.info(password);
        TokenInfo tokenInfo = userService.login(email, password);
        log.info(tokenInfo.getAccessToken());
        log.info(tokenInfo.getRefreshToken());
        userService.updateToken(userLoginRequestDto, tokenInfo);
        User user = userRepository.findByEmail(email).get();
        LoginResponse response = new LoginResponse(tokenInfo, user);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/logout")
    public void logout(@RequestBody UserLoginRequestDto userLoginRequestDto) {
        log.info("로그아웃 진입");
        userService.deleteToken(userLoginRequestDto);
    }

    @PostMapping("/refresh")
    public TokenInfo refresh(@RequestBody UserLoginRequestDto userLoginRequestDto) {
        // JwtTokenProvider에서 validation을 이용하여 accessToken의 유효성을 체크
        // accessToken의 시간이 초과되고 refreshToken은 유효할 경우 accessToken을 갱신하여 적용
        // 두개 모두 유효하지 않을 경우 새로 로그인을 시킬것
        String email = userLoginRequestDto.getUserId();
        String password = userLoginRequestDto.getPassword();
        Optional<User> user = userRepository.findByEmail(userLoginRequestDto.getUserId());

        TokenInfo tokenInfo;
        if (!jwtTokenProvider.validateToken(user.get().getAccessToken())) {
            log.info("토큰 만료 확인");

            if (!jwtTokenProvider.validateToken(user.get().getRefreshToken())) {
                log.info("refresh 토큰 만료");
                tokenInfo = new TokenInfo("Bearer", "NULL", "NULL");
                userService.updateToken(userLoginRequestDto, tokenInfo);
                return tokenInfo;
            } else {
                return userService.updateAccessToken(email, password);
            }
        } else {
            return new TokenInfo("Bearer", user.get().getAccessToken(), user.get().getRefreshToken());
        }
    }

    // 유저 프로필 조회
    @GetMapping("/{userId}")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable(value = "userId") Long id) {
        User user = userService.findById(id);
        return ResponseEntity
                .ok()
                .body(new ProfileResponse(user));
    }

    // 유저 프로필 조회 DetailReview 전용
    @GetMapping("/detail/{userId}")
    public ResponseEntity<DetailReviewCardResponse> getDetailProfile(@PathVariable(value = "userId") Long id) {
        User user = userService.findById(id);
        return ResponseEntity
                .ok()
                .body(new DetailReviewCardResponse(user.getIntro(), user.getNickname(), user.getProfileImg()));
    }

    // 유저 닉네임 조회
    @GetMapping("/nickname/{nickname}")
    public ResponseEntity<NicknameResponse> getNickname(@PathVariable(value = "nickname") String nickname) {
        User user = userService.findByNickname(nickname);
        boolean check = true;

        if (user != null) {
            check = false;
        }
        return ResponseEntity
                .ok()
                .body(new NicknameResponse(check));
    }

    // 유저 프로필 정보 수정
    @PutMapping("/{userId}")
    public ResponseEntity<ProfileResponse> updateProfile(@PathVariable(value = "userId") Long id,@RequestPart MultipartFile img, @RequestPart UserModifyDto userModifyDto) throws Exception {
        log.info("로그 " +id +" "+ img +" "+ userModifyDto);
        userService.UpdateUserProfile(userModifyDto, img ,id);
        User user = userService.findById(id);
        return ResponseEntity
                .ok()
                .body(new ProfileResponse(user));
    }

    @GetMapping("/lessonId/{userId}")
    public ResponseEntity<List<LessonIdResponse>> findLessonId(@PathVariable(value = "userId") Long id) {
        List<UserLesson> userLessons = userLessonRepository.findByUserId(id);
        List<LessonIdResponse> lessonIdResponses = new ArrayList<>();

        for (UserLesson ul : userLessons) {
            Long lId = ul.getLesson().getId();
            LessonIdResponse lr = new LessonIdResponse(lId);
            lessonIdResponses.add(lr);
        }

        return ResponseEntity
                .ok()
                .body(lessonIdResponses);
    }
}
