import React, { useState } from "react";
// import PropTypes from "prop-types";
import "./ProfileCard.scss";
import { useSelector } from "react-redux";
import './styles.css'
import emptyProfileImage from '../../assets/profile/empty-profile.png';

// ProfileCard.js
export default function ProfileCard({
  data: {
    name,
    posts,
    isOnline = false,
    bio = "",
    location = "",
    technologies = [],
    creationDate,
    onViewChange,

    data,
    email,
    intro,
    phoneNumber,
    profileImg,
    nickname,
  },
}) {
  const [introduction, others] = useState(true);

  const handleBioVisibility = () => {
    others(!introduction);
    if (typeof onViewChange === "function") {
      onViewChange(!introduction);
    }
  };
  // const userData = data.data;
  // const userName = userData.name;
  // const userEmail = userData.email;
  // const userIntro = userData.intro;
  // const userPhone = userData.phoneNumber;
  // const userProfileImg = userData.profileImg;
  const userRole = useSelector((state) => state.loginRole);

  return (
    <div className="ProfileCard">
      <div className="avatar">
        <h2>{userRole == 1 ? "강사" : "수강생"}</h2>
        { profileImg
          ? <img src={profileImg} alt="Profile" className="photo" />
          : <img src={emptyProfileImage} alt="Profile" className="photo" />
        }
        <span>{name}</span>
        <i className={`status ${isOnline ? "online" : "offline"}`} />
      </div>
      <div className={`details ${introduction ? "bio" : "technologies"}`}>
        {introduction ? (
          <>
            <h3>회원정보</h3>
            {/* <p>{bio !== "" ? bio : "No bio provided yet"}</p> */}
            <p>NickName : {nickname}</p>
            <p>PhoneNumber : {phoneNumber}</p>
            <p>Email : {email}</p>
            {userRole == 1 ? <p>Introduction : {intro}</p> : ""}
            {/* <div>
              <button onClick={handleBioVisibility}>View Skills</button>
              <p className="joined">join: {creationDate}</p>
            </div> */}
          </>
        ) : (
          <>
            <h3>Technologies</h3>
            {technologies.length > 0 && (
              <ul>
                {technologies.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
            <div>
              <button onClick={handleBioVisibility}>View Bio</button>
              {!!location && <p className="location">Location: {location}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ProfileCard.propTypes = {
//   data: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     posts: PropTypes.number.isRequired,
//     isOnline: PropTypes.bool,
//     bio: PropTypes.string,
//     location: PropTypes.string,
//     technologies: PropTypes.arrayOf(PropTypes.string),
//     creationDate: PropTypes.string.isRequired,
//     onViewChange: PropTypes.func,
//   }).isRequired,
// };
