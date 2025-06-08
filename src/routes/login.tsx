import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Error, Form, Input, Swither, Title, Wrapper } from "../components/auth-components";
import GithubButton from "../components/github-btn";

// CreateAccount 컴포넌트 정의
export default function CreateAccount(){
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    
    // 각각 사용자 입력을 저장할 상태 변수 정의 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 에러 관련 처리
    const [error, setError] = useState("");

    // 입력 필드(onChange 이벤트) 변경 시 호출되는 함수
    const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {target: {name, value}} = e;
        if(name ==="email"){
            setEmail(value)
        }else if(name ==="password"){
            setPassword(value)
        } 
    }

    const onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지 (페이지 새로고침 방지)
        setError(""); // 버튼 클릭시 에러 메시지 포멧을 위함
        if(isLoading || email === "" || password === "") return;
        try{
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            
            navigate("/");
        }catch(e){
            // 성공하지 못하면 오류가 발생 
            // (해당 이메일로 이미 계정이 있거나 비밀번호가 유효하지 않은 경우)
            
            if(e instanceof FirebaseError){
                console.log("e code : "+ e.code, ", e.message : "+ e.message); // e code : auth/email-already-in-use , e.message : Firebase: Error (auth/email-already-in-use).
                setError(e.message);
            }
            console.log(e);
        }finally{
            setLoading(false);
        }
       
        console.log(email, password); // 현재 입력값 콘솔 출력 (개발용 확인)
    };

    // 실제 렌더링되는 JSX 반환
    return (
        <Wrapper>
            <Title>Login soheetwit</Title>
            <Form onSubmit={onSubmit}> 
                <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required/>
                <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required />
                <Input type="submit" 
                    value={isLoading ? "Loading..." : "Login"}/>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}

            <Swither>
                Don't have an account?{" "}
                <Link to="/create-account">Create one</Link>
            </Swither>
            <GithubButton />
        </Wrapper>
    )
}