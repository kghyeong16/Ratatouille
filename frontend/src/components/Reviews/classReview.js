import React, { useEffect, useState } from 'react';
import api from '../../interceptors/axios';
import emptyProfileImage from '../../assets/profile/empty-profile.png';

export default function ClassReview({key, review}) {
  const userId = review.userId
  const reviewText = review.text
  const rating = review.rating 

  const [userNickname, setUserNickname] = useState('')
  const [userProfileImg, setUserProfileImg] = useState('')

  useEffect(() => {
    const getUserData = async () => {
      const {data} = await api.get(`/api/user/detail/${userId}`)
      setUserNickname(data.nickname)
      setUserProfileImg(data.profileImg)
    }
    getUserData()
  }, [])

  return(
    <div className='class-review'>
      <div className='user-profile'>
        <div>
          { userProfileImg
          ?<img className="profile-img" src={userProfileImg} alt='user-profile' />
          : <img src={emptyProfileImage} width='60' height='60' alt='tutor'/>
          }
        </div>
        <div>수강생 {userNickname} 님</div>
      </div>
      <div>평점 {rating}점</div>
      <div>{reviewText}</div>
    </div>
  )
}
