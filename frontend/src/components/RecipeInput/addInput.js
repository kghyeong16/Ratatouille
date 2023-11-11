import React from "react";
import TextBoxes from "../TextBoxes";
import Buttons from "../Buttons";
import { useState, useEffect } from "react";


export default function AddInput({
  number,
  recipeDataset,
  videoDataset,
  recipeTitles,
  recipeContents,
}) {
  const [recipeTitle, setRecipeTitle] = useState()
  const [recipeContent, setRecipeContent] = useState()
  const recipeSeq = number - 1
  const [videoFile, setVideoFile] = useState([]);

  useEffect(()=>{
    if (recipeTitles && recipeContents) {
      setRecipeTitle(recipeTitles[recipeSeq])
      setRecipeContent(recipeContents[recipeSeq])
    }
  }, [recipeTitles, recipeContents])

  const recipeSet = {
    title: recipeTitle,
    content: recipeContent
  };

  function videoFileUpload(e) {
    setVideoFile(e.target.files[0]);
  };

  const dataToArray = () => {
    recipeDataset[recipeSeq] = recipeSet
    videoDataset[recipeSeq] = videoFile
    alert('저장되었습니다!')
  };

  return (
    <div className="add-recipe" key={"key" + { number }}>
      <div className="recipe-title">
        <p className="recipe-title-num">{ number }</p>
        <div className="create-or-edit">
            {
              recipeTitles === undefined || recipeContents === undefined
              ? <TextBoxes
              boxType="title"
              boxClassName="modal-title-box"
              limit={20}
              onChange={setRecipeTitle}
              />
              : <TextBoxes
              boxType="title"
              boxClassName="modal-title-box"
              limit={20}
              onChange={setRecipeTitle}
              defaultValue={recipeTitles[recipeSeq]}
              />
            }
          </div>
        </div>
        <div className="create-or-edit">
          {
            recipeTitles === undefined || recipeContents === undefined
            ? <TextBoxes
            boxClassName="modal-text-box"
            limit={200}
            onChange={setRecipeContent}
            />
            : <TextBoxes
            boxClassName="modal-text-box"
            limit={200}
            onChange={setRecipeContent}
            defaultValue={recipeContents[recipeSeq]}
            />
          }
        </div>
      {/* <Buttons btnType="default" value="영상 업로드" /> */}
      <div>
        <input type="file" accept="video/mp4, video/avi" onChange={videoFileUpload} />
        <Buttons btnType="default" value="저장" link={dataToArray} />
      </div>
    </div>
  )
};