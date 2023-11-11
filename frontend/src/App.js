import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home';
import AllClasses from './allClasses';
import Detail from './detail';
import Header from "./components/Header";
import ClassCreate from './classCreate';
import Mypage from './mypage';
import EditClass from './classEdit';
import Guide from './guide';
import LiveLesson from './liveLesson';
import NotFound from './notFound';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Header를 기본으로 렌더링 */}
        {/* 다른 페이지들의 라우팅 설정 */}
        <Route path="/" element={<HomeWithHeader />} />
        <Route path="/class" element={<AllClassesWithHeader />} />
        <Route path="/detail/:index" element={<DetailWithHeader />} />
        <Route path="/detail/:index/edit" element={<EditClassWithHeader />} />
        <Route path="/class/create" element={<ClassCreateWithHeader />} />
        <Route path="/user/:userId" element={<MypageWithHeader />} />
        <Route path="/detail/:index/guide" element={<GuideWithHeader />} />
        <Route path="/livelesson" element={<LiveLesson />} />
        <Route path="/*" element={<NotFoundWithoutHeader />} />
      </Routes>
    </BrowserRouter>
  );
}

// Header를 포함한 홈 페이지
function HomeWithHeader() {
  return (
    <>
      <Header/>
      <Home />
      <Footer />
    </>
  );
}

// Header를 포함한 AllClasses 페이지
function AllClassesWithHeader() {
  return (
    <>
      <Header/>
      <AllClasses />
      <Footer />
    </>
  );
}

// Header를 포함한 Detail 페이지
function DetailWithHeader() {
  return (
    <>
      <Header />
      <Detail />
      <Footer />
    </>
  );
}

// Header를 포함한 EditClass 페이지
function EditClassWithHeader() {
  return (
    <>
      <Header />
      <EditClass />
      <Footer />
    </>
  );
}

// Header를 포함한 ClassCreate 페이지
function ClassCreateWithHeader() {
  return (
    <>
      <Header />
      <ClassCreate />
      <Footer />
    </>
  );
}

// Header를 포함한 Mypage 페이지
function MypageWithHeader() {
  return (
    <>
      <Header />
      <Mypage />
      <Footer />
    </>
  );
}

// Header를 포함한 Guide 페이지
function GuideWithHeader() {
  return (
    <>
      <Header />
      <Guide />
    </>
  );
}

// Header를 포함한 NotFound 페이지
function NotFoundWithoutHeader() {
  return (
    <>
      <NotFound />
    </>
  );
}
