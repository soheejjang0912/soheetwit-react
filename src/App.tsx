// React Router의 브라우저 라우터 생성 함수, 라우터 제공 컴포넌트 import
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

// 라우터 생성: 경로(path)와 해당 컴포넌트(element)를 연결하는 규칙 정의
const router = createBrowserRouter([ // 배열을 router에 전달
  {
    path:"/", // 어떤 경로에 대한 규칙인지 지정, 루트 경로
    element: <Layout />, // 이 경로에서 먼저 렌더링할 컴포넌트 (공통 레이아웃)
    
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
    ]
  },

  {
    path: "/login",
    element:<Login /> 
  },
  {
    path: "/create-account", 
    element: <CreateAccount /> 
  }
])

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

// App 안에서 렌더링됨
/*
<RouterProvider router={router} />
위에서 정의한 router를 실제 앱에 적용해줘
*/

function App() {
  return <>
    <GlobalStyles />
    <RouterProvider router={router} />
  </>;
}

export default App
