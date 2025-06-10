import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCVJAiJ2km5qIPQVBCoIt42j6mBu14mSc",
  authDomain: "soheetwit.firebaseapp.com",
  projectId: "soheetwit",
  storageBucket: "soheetwit.firebasestorage.app",
  messagingSenderId: "155464582969",
  appId: "1:155464582969:web:f19aac667e5d5934b00ae8",
};

// 1. 앱 생성 후
const app = initializeApp(firebaseConfig);
// 2. app에 대한 인증 서비스 사용 (다른 파일에서 사용할 수 있도록 export공개 처리)
export const auth = getAuth(app);

// 데이터 베이스 액세스 권한 얻기
export const db = getFirestore(app);
