import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({children}: {children:React.ReactNode}){
    const user = auth.currentUser; // 유저가 로그인 했는지 여부 알렬줌
    console.log(user);
    if(!user){
        return <Navigate to="/login" />
    }
    return children;
}