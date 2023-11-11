package hexagon.rat.controller;

import hexagon.rat.VO.VideoVO;
//import hexagon.rat.domain.CardData;
import hexagon.rat.domain.Image;
import hexagon.rat.domain.Lesson;
import hexagon.rat.domain.User;
import hexagon.rat.domain.UserLesson;
import hexagon.rat.dto.*;
import hexagon.rat.repository.ImageRepository;
import hexagon.rat.repository.UserRepository;
import hexagon.rat.service.LessonService;
import hexagon.rat.service.UploadDataService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/lesson")
public class LessonController {

    private final LessonService lessonService;
    private final UploadDataService uploadDataService;
    private final ImageRepository imageRepository;
    private final UserRepository userRepository;

    // 모든 강의 조회하기
    @GetMapping("")
    public ResponseEntity<List<LessonResponse>> findAllLessons(){
        List<LessonResponse> lessons = lessonService.findAll()
                .stream()
                .map(LessonResponse::new)
                .toList();

        return ResponseEntity
                .ok()
                .body(lessons);
    }

    // 레슨 데이터 카드화 하기
    @GetMapping("/card")
    public ResponseEntity<List<CardData>> findAllCards() {
        log.info("카드진입");
        List<Lesson> lessons = lessonService.findAll();
        log.info("Lesson 리스트 생성" + lessons.size());
        List<CardData> cards = new ArrayList<>();
        log.info("card 리스트 생성");
        for (Lesson lesson : lessons) {
            log.info("lesson_id 체크 : " + lesson.getId());
            List<Image> imageList = imageRepository.findAllImage(lesson.getId());
            CardData card = new CardData(lesson.getId(), lesson.getTitle(), lesson.getDetail(), lesson.getIngredients(), lesson.getFee(), lesson.getStartTime(), lesson.getEndTime(), lesson.getTutor().getId(), lesson.getCategory().getId(), imageList.get(0).getLink());

            cards.add(card);
        }

        return ResponseEntity
                .ok()
                .body(cards);
    }
    // 강의 생성하기
    @PostMapping(value = "", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Long> createLesson(@RequestPart CreateLessonRequest request,
                                                       @RequestPart MultipartFile[] imgFiles,
                                                       @RequestPart List<VideoVO> videoVOList,
                                                       @RequestPart MultipartFile[] videoFiles) throws Exception {
        log.info("fee:{},images:{}, videos:{}",request.getFee(),imgFiles, videoFiles);
        if (this.user().getRole() != 1){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Lesson lesson = lessonService.save(request);
        Long id = uploadDataService.upload(imgFiles, videoFiles, lesson, videoVOList);

        return ResponseEntity
                .ok()
                .body(id);
    }

    // 개별 강의 조회하기
    @GetMapping("/{lessonId}")
    @Transactional
    public ResponseEntity<LessonDetailResponse> getLessonDetail(@PathVariable("lessonId") String id){
        log.info("진입 체크 1");
        long id_i = -1;
        try {
            id_i = Long.parseLong(id);
        } catch (NumberFormatException e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        log.info("진입 체크 2");
        Lesson lesson = lessonService.findOne(id_i);
        log.info("진입 체크 3");
        boolean isBooked = lessonService.isBooked(lesson);
        return ResponseEntity
                .ok()
                .body(new LessonDetailResponse(lesson, isBooked));
    }
    // 수강생이 강의 수강신청
    @PostMapping("/{lessonId}/book")
    public ResponseEntity<BookResponse> bookLesson(@PathVariable(value = "lessonId") String id){
        long id_i = -1;
        try {
            id_i = Long.parseLong(id);
        } catch (NumberFormatException e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        UserLesson book = lessonService.book(id_i);
        return ResponseEntity
                .ok()
                .body(new BookResponse(book));
    }

    // 수강생이 강의 수강신청 취소
    @DeleteMapping("/{lessonId}/book")
    public ResponseEntity<?> deleteBook(@PathVariable(value = "lessonId") String id){
        long id_i = -1;
        try {
            id_i = Long.parseLong(id);
        } catch (NumberFormatException e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        lessonService.deleteBook(id_i);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 강의 수정하기
    @Transactional
    @PutMapping(value = "/{lessonId}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<LessonDetailResponse> updateLesson(@RequestPart CreateLessonRequest request,
                                                             @RequestPart MultipartFile[] imgFiles,
                                                             @RequestPart List<VideoVO> videoVOList,
                                                             @RequestPart MultipartFile[] videoFiles, @PathVariable(value = "lessonId") Long id) throws Exception {

        Lesson lesson = lessonService.updateLesson(request, id);
        // 참조 데이터만 삭제
        // 레포지터리에서 이미지, 동영상 삭제
        lessonService.updateLesson(id);
        uploadDataService.upload(imgFiles, videoFiles, lesson, videoVOList);

        return ResponseEntity
                .ok()
                .body(new LessonDetailResponse(lesson, false));
    }

    // 강의 삭제하기 -> 추후에 강의가 시작 됬을 경우 삭제 불가로 처리
    @DeleteMapping("/{lessonId}")
    public void deleteLesson(@PathVariable(value = "lessonId") Long id) {
        // Lesson을 삭제 전 book 테이블에서 해당 LessonId를 가지고 있는 row를 삭제해주어야 한다
        // book에서 참조되는 테이블의 데이터도 삭제해야한다 -> image, video
        lessonService.deleteLesson(id);
    }
    private User user(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

}
