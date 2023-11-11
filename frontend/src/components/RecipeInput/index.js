import React, {useState, useEffect} from "react";
import TextBoxes from "../TextBoxes";
import AddInput from "./addInput";
import Buttons from "../Buttons";


export default function RecipeInput({ 
  number, 
  onDownRecipe, 
  recipeDataset,
  videoDataset,
  recipeTitles,
  recipeContents,
}) {
  const recipeSeq = 0;
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeContent, setRecipeContent] = useState('');
  const [videoFile, setVideoFile] = useState({});
  
  useEffect(()=>{
    if (recipeTitles && recipeContents) {
      setRecipeTitle(recipeTitles[recipeSeq])
      setRecipeContent(recipeContents[recipeSeq])
    }
  }, [recipeTitles, recipeContents])

  function videoFileUpload(e) {
    setVideoFile(e.target.files[0]);
  };

  const downRecipeNum = () => {
    onDownRecipe();
  };

  const recipeSet = {
    title: recipeTitle,
    content: recipeContent
  };

  const dataToArray = () => {
    recipeDataset[recipeSeq] = recipeSet;
    videoDataset[recipeSeq] = videoFile;
    alert('저장되었습니다!')
  };

  function addRecipeInput() {
    let arr = [
      <div className="primary-recipe" key="key1" >   
        <div className="create-or-edit">
          {
            recipeTitles === undefined || recipeContents === undefined
            ? 
            <div className="recipe-title">
            <p className="recipe-title-num">1.</p>
            <TextBoxes
            boxType="title"
            boxClassName="create-title-box"
            limit={20}
            onChange={setRecipeTitle}
            />
            </div>
            :
            <div className="recipe-title">
            <p className="recipe-title-num">1.</p>
            <TextBoxes
            boxType="title"
            boxClassName="create-title-box"
            limit={20}
            onChange={setRecipeTitle}
            defaultValue={recipeTitles[recipeSeq]}
            />
            </div>
          }
        </div>
        <div className="create-or-edit">
          {
            recipeTitles === undefined || recipeContents === undefined
            ? <TextBoxes
            boxClassName="small-text-box"
            limit={200}
            onChange={setRecipeContent}
            />
            : <TextBoxes
            boxClassName="small-text-box"
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
    ]

    for(let recipeNum = 2; recipeNum <= number; recipeNum++){
      arr.push(
        <div>
          <AddInput
          number={ recipeNum }
          recipeDataset={recipeDataset}
          videoDataset={videoDataset}
          recipeTitles={recipeTitles}
          recipeContents={recipeContents}
          />
        </div>
      )
    }
    if(number > 1) { 
      arr.push(
        <Buttons btnType="default" value="레시피 삭제하기" link={downRecipeNum} />
      )
    }
    return arr
  }

  return (
    <div className="recipe-box">
      {addRecipeInput()}
    </div>
  )
};