import React from 'react';
import ClassReview from './classReview';
import './styles.css'

export default function ShowReviews({reviewList}) {
  const reviewArr = []
  reviewList.forEach((review) => {
    if (review.text !== null) {
      reviewArr.push(review)
    }
  })

  return(
    <div className='reviews'>
      {reviewArr.map((review) => {
        return <ClassReview key={review.id} review={review}/>
      })}
    </div>
  )
}
