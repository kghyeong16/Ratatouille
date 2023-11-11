
package hexagon.rat.controller;

import hexagon.rat.domain.Lesson;
import hexagon.rat.domain.User;
import hexagon.rat.repository.UserRepository;
import hexagon.rat.service.LessonService;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/sessions")
public class SessionController {
    private OpenVidu openvidu;
    private final LessonService lessonService;
    private final UserRepository userRepository;
    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    @PostMapping("")
    public ResponseEntity<String> createSession(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        log.info("실시간 강의 session 생성 시작");
        String sessionId = (String) params.get("customSessionId");
        System.out.println(openvidu.getActiveSession(sessionId)+ "openviducustomlogging");
        //학생이고 실시간 강의가 생성 되지 않은 경우 처리
        if ((this.user().getRole() == 2) && (openvidu.getActiveSession(sessionId) == null)){
            log.info("현재 강의자가 오픈하기 전");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        try {
            SessionProperties properties = SessionProperties.fromJson(params).build();
            Session session = openvidu.createSession(properties);
            return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{lessonId}/generate-token")
    public ResponseEntity<String> createConnection(@PathVariable("lessonId") String lessonId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        long id_lesson;
        try{
            id_lesson = Long.parseLong(lessonId);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Lesson lesson = lessonService.findOne(id_lesson);
        Session session = openvidu.getActiveSession(lessonId);
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (lessonService.isBooked(lesson)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);
        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }
    @PostMapping("/record/start")
    public ResponseEntity<String> startRecording(@RequestBody Map<String, Object> params){
        String sessionId = (String) params.get("lessonId");
        try {
            Recording recording = openvidu.startRecording(sessionId);
            return new ResponseEntity<>(recording.getId(),HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/record/stop")
    public ResponseEntity<?> stopRecording(@RequestBody Map<String, Object> params){
        String recordingId = (String) params.get("recordingId");
        Long lessonId = Long.parseLong(recordingId);
        try{
            Recording recording = openvidu.stopRecording(recordingId);
            log.info(recording.getUrl());
            lessonService.updateRecordingUrl(lessonId, recording.getUrl());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    private User user(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }
}