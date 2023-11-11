import React, { useState } from "react";
import "./styles.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import api from "../../interceptors/axios";

export default function ModifyInfo({ isOpen, onClose, data }) {
  const [nickname, setNickname] = useState(data.nickname);
  const [profileImg, setProfileImg] = useState(data.profileImg);
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber);
  const [intro, setIntro] = useState(data.intro);
  const [isLoading, setIsLoading] = useState(false);
  const loginRole = useSelector((store) => store.loginRole);
  const { userId } = useParams();
  const [nicknameCheck, setNicknameCheck] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    const userModifyDto = {
      nickname,
      phoneNumber,
      intro,
    };

    formData.append(
      "userModifyDto",
      new Blob([JSON.stringify(userModifyDto)], { type: "application/json" })
    );
    formData.append("img", profileImg);

    try {
      const apiUrl = `/api/user/${userId}`;

      const response = await api.put(apiUrl, formData);
      onClose();
      setNickname(nickname);
      setPhoneNumber(phoneNumber);
      setProfileImg(profileImg);
      alert("사용자 정보가 성공적으로 업데이트되었습니다.");
      window.location.href = `/user/${userId}`;
    } catch (error) {
      alert("오류가 발생하여 사용자 정보를 업데이트하지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };


  const checkNickname = async () => {
    try {
      if (nickname) {
        const { data } = await api.get(`/api/user/nickname/${nickname}`);
        if (data.check) {
          setNicknameCheck(true);
          alert("사용 가능한 닉네임입니다!");
        } else {
          setNicknameCheck(false);
          alert("이미 사용 중인 닉네임입니다!");
        }
      } else {
        alert("닉네임을 입력해주세요!");
      }
    } catch (err) {
      setNicknameCheck(false);
      alert("이미 사용 중인 닉네임입니다!");
    }
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <h2>프로필 수정</h2>
          <form onSubmit={handleSubmit}>
            <label>
              닉네임 :
              <input
                type="text"
                name="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <button onClick={checkNickname} className="check">
                중복검사
              </button>
            </label>
            <label>
              핸드폰 번호 :
              <input
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </label>
            {loginRole == 1 && (
              <label>
                강사소개글 :
                <input
                  type="text"
                  name="intro"
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                />
              </label>
            )}
            <label>
              프로필 이미지 :
              <input
                type="file"
                name="profileImg"
                accept=".jpg, .png, .jpeg"
                // value={profileImg}
                onChange={(e) => setProfileImg(e.target.files[0])}
              />
            </label>
            <button type="submit">수정하기</button>
          </form>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    )
  );
}
