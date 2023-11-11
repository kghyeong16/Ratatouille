package hexagon.rat.service;

import hexagon.rat.domain.*;
import hexagon.rat.dto.CardData;
import hexagon.rat.dto.CreateLessonRequest;
import hexagon.rat.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LessonService {

    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final UserLessonRepository userlessonRepository;
    private final ImageRepository imageRepository;
    private final VideoRepository videoRepository;
    private final UploadDataService uploadDataService;
    private final CategoryRepository categoryRepository;

    public List<Lesson> findAll(){
        return lessonRepository.findAll();
    }

    public Lesson findOne(Long id) { return lessonRepository.findById(id).get(); }
    public Lesson save(CreateLessonRequest request){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(email);
        User user = userRepository.findByEmail(email).get();
        Lesson lesson = Lesson.builder()
                .title(request.getTitle())
                .detail(request.getDetail())
                .ingredients(request.getIngredients())
                .fee(request.getFee())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .tutor(user)
                .category(categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new NullPointerException("해당 카테고리가 존재하지 않습니다")))
                .build();
        return lessonRepository.save(lesson);
    }

    // Lesson 내용 업데이트
    @Transactional
    public Lesson updateLesson(CreateLessonRequest request, Long id) {

        Lesson lesson = lessonRepository.findById(id).get();
        lesson.updateLesson(request.getTitle(), request.getDetail(), request.getIngredients(), request.getFee(), request.getStartTime(), request.getEndTime());

        return lesson;
    }

    // Lesson 삭제

    @Transactional
    public void deleteLesson(Long id) {
        List<Image> imageList = imageRepository.findAllImage(id);
        List<Video> videoList = videoRepository.findAllVideo(id);

        for (Image img : imageList) {
            log.info("이미지 키 값 출력 " + img.getKey());
            uploadDataService.deleteData(img.getKey());
        }

        for (Video v : videoList) {
            log.info("동영상 키 값 출력 " + v.getKey());
            uploadDataService.deleteData(v.getKey());
        }

        imageRepository.deleteAllById(id);
        videoRepository.deleteAllById(id);
        userlessonRepository.deleteAllById(id);
        lessonRepository.deleteById(id);
    }

    @Transactional
    public void updateLesson(Long id) {
        List<Image> imageList = imageRepository.findAllImage(id);
        List<Video> videoList = videoRepository.findAllVideo(id);

        for (Image img : imageList) {
            log.info("이미지 키 값 출력 " + img.getKey());
            uploadDataService.deleteData(img.getKey());
        }

        for (Video v : videoList) {
            log.info("동영상 키 값 출력 " + v.getKey());
            uploadDataService.deleteData(v.getKey());
        }

        imageRepository.deleteAllById(id);
        videoRepository.deleteAllById(id);
    }

    @Transactional
    public void updateRecordingUrl(Long id, String url){
        Lesson lesson = lessonRepository.findById(id).orElseThrow(()-> new NullPointerException("해당 강의는 존재하지 않습니다."));
        lesson.updateRecordingUrl(url);
    }
    public UserLesson book(Long lessonId){
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(()->new NullPointerException("해당 강의는 존재하지 않습니다."));
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).get();
        long id = lessonRepository.findById(lessonId).get().getTutor().getId();
        UserLesson book = UserLesson.builder()
                .user(user)
                .lesson(lesson)
                .tutorId(id)
                .build();
        return userlessonRepository.save(book);
    }

    public void deleteBook(Long lessonId){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).get();
        UserLesson book = userlessonRepository.findByUserIdAndLessonId(user.getId(),lessonId).orElseThrow(()->new NullPointerException("수강 신청 내역이 없습니다."));
        userlessonRepository.deleteById(book.getId());
    }

    public boolean isBooked(Lesson lesson){
        for (UserLesson book:userlessonRepository.findAllBook(lesson.getId())){
            if (book.getUser().equals(this.user())){
                return true;
            }
        }
        return false;
    }


    private User user(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("유저 이메일 : " + email);
        if (userRepository.findByEmail(email).isPresent()) {
            return userRepository.findByEmail(email).orElseThrow();
        } else {
            return new User("", "","", "", "", "", "", "", "", 2);
        }
    }
}
