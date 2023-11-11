package hexagon.rat.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import hexagon.rat.VO.VideoVO;
import hexagon.rat.domain.Image;
import hexagon.rat.domain.Lesson;
import hexagon.rat.domain.ProfileImage;
import hexagon.rat.domain.Video;
import hexagon.rat.repository.ImageRepository;
import hexagon.rat.repository.ProfileImageRepository;
import hexagon.rat.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UploadDataService {
    private String S3Bucket = "ssafy-ratbox"; // Bucket 이름


    private final AmazonS3Client amazonS3Client;
    private final ImageRepository imageRepository;
    private final VideoRepository videoRepository;
    private final ProfileImageRepository profileImageRepository;


    public Long upload(MultipartFile[] imgList, MultipartFile[] videoList, Lesson lesson, List<VideoVO> videoVOList) throws Exception {
        log.info("업로드 진입");
        int index = 0;
        for(MultipartFile multipartFile: imgList) {
            String mTime = String.valueOf(System.currentTimeMillis());
            log.info("시간 : " + mTime);
            String oName = multipartFile.getOriginalFilename();
            String originalName = mTime + oName; // 파일 이름
            log.info("key 값 : " + originalName);
            long size = multipartFile.getSize(); // 파일 크기

            ObjectMetadata objectMetaData = new ObjectMetadata();
            objectMetaData.setContentType(multipartFile.getContentType());
            objectMetaData.setContentLength(size);

            // S3에 업로드
            amazonS3Client.putObject(
                    new PutObjectRequest(S3Bucket, originalName, multipartFile.getInputStream(), objectMetaData)
                            .withCannedAcl(CannedAccessControlList.PublicRead)
            );

            String imagePath = amazonS3Client.getUrl(S3Bucket, originalName).toString(); // 접근가능한 URL 가져오기
            Image image = Image.builder()
                    .link(imagePath)
                    .seq(index)
                    .key(originalName)
                    .lesson(lesson)
                    .build();
            imageRepository.save(image);
            index++;
        }
        index = 0;
        for(MultipartFile multipartFile: videoList) {
            String mTime = String.valueOf(System.currentTimeMillis());
            String oName = multipartFile.getOriginalFilename();
            String originalName = mTime + oName; // 파일 이름

            long size = multipartFile.getSize(); // 파일 크기

            ObjectMetadata objectMetaData = new ObjectMetadata();
            objectMetaData.setContentType(multipartFile.getContentType());
            objectMetaData.setContentLength(size);

            // S3에 업로드
            amazonS3Client.putObject(
                    new PutObjectRequest(S3Bucket, originalName, multipartFile.getInputStream(), objectMetaData)
                            .withCannedAcl(CannedAccessControlList.PublicRead)
            );

            String videoPath = amazonS3Client.getUrl(S3Bucket, originalName).toString(); // 접근가능한 URL 가져오기
            Video video = Video.builder()
                    .link(videoPath)
                    .title(videoVOList.get(index).getTitle())
                    .content(videoVOList.get(index).getContent())
                    .seq(index)
                    .key(originalName)
                    .lesson(lesson)
                    .build();
            videoRepository.save(video);
            index++;
        }

        return lesson.getId();
    }

    public String profileImageUpload(MultipartFile img, Long id) throws Exception {
        log.info("프로필 이미지 업로드 진입");
        String mTime = String.valueOf(System.currentTimeMillis());
        String oName = img.getOriginalFilename();
        String originalName = mTime + oName; // 파일 이름

        long size = img.getSize(); // 파일 크기
        ObjectMetadata objectMetaData = new ObjectMetadata();
        objectMetaData.setContentType(img.getContentType());
        objectMetaData.setContentLength(size);

        // S3에 업로드
        amazonS3Client.putObject(
                new PutObjectRequest(S3Bucket, originalName, img.getInputStream(), objectMetaData)
                        .withCannedAcl(CannedAccessControlList.PublicRead)
        );

        String imagePath = amazonS3Client.getUrl(S3Bucket, originalName).toString(); // 접근가능한 URL 가져오기

        ProfileImage profileImage = ProfileImage.builder()
                .userId(id)
                .key(originalName)
                .link(imagePath)
                .build();

        profileImageRepository.save(profileImage);

        return imagePath;
    }

    public String deleteData(String key) {
        String result = "success";
        try {
            amazonS3Client.deleteObject(new DeleteObjectRequest(S3Bucket, key));
        } catch (AmazonServiceException e) {
            e.printStackTrace();
        } catch (SdkClientException e) {
            e.printStackTrace();
        }

        return result;
    }
}
