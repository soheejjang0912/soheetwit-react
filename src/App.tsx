// React Router의 브라우저 라우터 생성 함수, 라우터 제공 컴포넌트 import
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";

// 라우터 생성: 경로(path)와 해당 컴포넌트(element)를 연결하는 규칙 정의
const router = createBrowserRouter([
  // 배열을 router에 전달
  {
    path: "/", // 어떤 경로에 대한 규칙인지 지정, 루트 경로
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ), // 이 경로에서 먼저 렌더링할 컴포넌트 (공통 레이아웃)
    // element인 Layout 내부에서 <Outlet /> 위치에 랜더링될 자식 경로들 정의
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  *{
    box-sizing: border-box;
  }
  body{
    background-color: black;
    color:white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 
    'Helvetica Neue', sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

// App 안에서 렌더링됨
/*
<RouterProvider router={router} />
위에서 정의한 router를 실제 앱에 적용
*/
function App() {
  const [isLoading, setLoading] = useState(true); // Firebase authentication
  const init = async () => {
    //wait for firebase
    await auth.authStateReady(); // 인증 상태가 준비되었는지를 기다림
    // 최조 인증 상태가 완료될 때 실행되는 promise를 return 함
    // 즉 Firebase가 쿠키와 토큰을 읽고 백엔드와 소통해서 로그인 여부를 확인하는 동안 기다리겠다는것
    setLoading(false); // Firebase가 준비 되면 loading을 false로 변경
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
