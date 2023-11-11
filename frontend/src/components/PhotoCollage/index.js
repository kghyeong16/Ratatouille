// import React from 'react'
// import { ReactPhotoCollage } from "react-photo-collage";

// function PhotoCollage({ setting }) {
//   if (setting !== {}) {
//     return (
//       <div>
//         <ReactPhotoCollage {...setting} />
//       </div>
//     );
//   } else {
//     return null
//   }
// }
// export default PhotoCollage

// import React from "react";
// import './styles.css'; // 스타일을 담은 CSS 파일

// function PhotoCollage({ imgList }) {
//   if (imgList) {
//     const layoutMap = {
//       1: { rows: [1], cols: [1] },
//       2: { rows: [2], cols: [1] },
//       3: { rows: [1, 2], cols: [1, 2] },
//       4: { rows: [1, 3], cols: [1, 3] },
//       5: { rows: [2, 3], cols: [2, 3] },
//     };
  
//     const layout = layoutMap[imgList.length];

//     return (
//       <div>
//         { layout !== undefined
//         ? <div className="photo-collage">
//         {layout.rows.map((rowCount, rowIndex) => (
//           <div className={`row row-${rowIndex}`} key={rowIndex}>
//             {Array.from({ length: rowCount }, (_, colIndex) => (
//               <div className={`col col-${colIndex}`} key={colIndex}>
//                 <img
//                   src={imgList[rowIndex * rowCount + colIndex]}
//                   alt={`Collage ${rowIndex * rowCount + colIndex}`}
//                   className={`photo ${layout.cols[colIndex] === 1 ? 'single-col' : ''}`}
//                 />
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//         : null
//         }
//       </div>
//     );
//   } else {
//     return null
//   }
// }

// export default PhotoCollage;

import React from "react";
import './styles.css'; // 스타일을 담은 CSS 파일

function PhotoCollage({ imgList }) {
  if (imgList) {
    const imgCnt = imgList.length;

    if (imgCnt === 1) {
      return (
        <div className="photo-collage">
          <div className="row-0">
            <div className="single-col">
              <img
                src={imgList[0]}
                alt={`Collage 0`}
                className="photo"
              />
            </div>
          </div>
        </div>
      );
    } else if (imgCnt === 2) {
      return (
        <div className="photo-collage">
          <div className="row-0">
            <div className="single-col">
              <img
                src={imgList[0]}
                alt={`Collage 0`}
                className="photo"
              />
            </div>
            <div className="single-col">
              <img
                src={imgList[1]}
                alt={`Collage 1`}
                className="photo"
              />
            </div>
          </div>
        </div>
      );
    } else if (imgCnt === 3) {
      return (
        <div className="photo-collage">
          <div className="row-0">
            <div className="col">
              <img
                src={imgList[0]}
                alt={`Collage 0`}
                className="photo"
              />
            </div>
          </div>
          <div className="row-1">
            <div className="col">
              <img
                src={imgList[1]}
                alt={`Collage 1`}
                className="photo"
              />
            </div>
            <div className="col">
              <img
                src={imgList[2]}
                alt={`Collage 2`}
                className="photo"
              />
            </div>
          </div>
        </div>
      );
    } else if (imgCnt === 4) {
      return (
        <div className="photo-collage">
          <div className="row-0">
            <div className="col">
              <img
                src={imgList[0]}
                alt={`Collage 0`}
                className="photo"
              />
            </div>
          </div>
          <div className="row-1">
            <div className="col">
              <img
                src={imgList[1]}
                alt={`Collage 1`}
                className="photo"
              />
            </div>
            <div className="col">
              <img
                src={imgList[2]}
                alt={`Collage 2`}
                className="photo"
              />
            </div>
            <div className="col">
              <img
                src={imgList[3]}
                alt={`Collage 3`}
                className="photo"
              />
            </div>
          </div>
        </div>
      );
    } else if (imgCnt === 5) {
      return (
        <div className="photo-collage">
          <div className="row-0">
            <div className="col">
              <img
                src={imgList[0]}
                alt={`Collage 0`}
                className="photo"
              />
            </div>
            <div className="col">
              <img
                src={imgList[1]}
                alt={`Collage 1`}
                className="photo"
              />
            </div>
          </div>
          <div className="row-1">
            <div className="col">
              <img
                src={imgList[2]}
                alt={`Collage 2`}
                className="photo"
              />
            </div>
            <div className="col">
              <img
                src={imgList[3]}
                alt={`Collage 3`}
                className="photo"
              />
            </div>
            <div className="col">
              <img
                src={imgList[4]}
                alt={`Collage 4`}
                className="photo"
              />
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
}

export default PhotoCollage;