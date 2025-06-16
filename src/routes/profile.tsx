import styled from "styled-components";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Tweet from "../components/tweet";
import type { ITweet } from "../components/timeline";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: skyblue;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const AvatarImg = styled.img``;

const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    fecthTweets();
    const loadAvatar = async () => {
      if (!user) return;
      const docRef = doc(db, "avatars", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAvatar(docSnap.data().photo);
      }
    };
    loadAvatar();
  });

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    let base64Image: string | null = null;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      base64Image = await resizeImage(file, 500, 0.7); // 최대 너비 500px, 압축률 70%
      if (base64Image.length > 1_048_487) {
        alert("이미지 크기가 너무 큽니다. 다른 이미지를 선택해주세요.");
        return;
      }
      await setDoc(doc(db, "avatars", user.uid), {
        photo: base64Image,
      });
      setAvatar(base64Image);
    }
  };

  const resizeImage = (
    file: File,
    maxWidth = 500,
    quality = 0.7
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== "string") return reject("Invalid file");

        image.src = reader.result;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = maxWidth / image.width;
          canvas.width = maxWidth;
          canvas.height = image.height * scale;

          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas not supported");

          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const resizedBase64 = canvas.toDataURL("image/jpeg", quality); // 압축률 0~1
          resolve(resizedBase64);
        };
        image.onerror = reject;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const fecthTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        id: doc.id,
        tweet,
        createdAt,
        userId,
        username,
        photo,
      };
    });
    setTweets(tweets);
  };

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-5-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 9c-1.825 0-3.422.977-4.295 2.437A5.49 5.49 0 0 0 8 13.5a5.49 5.49 0 0 0 4.294-2.063A4.997 4.997 0 0 0 8 9Z"
            />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>{user?.displayName ?? "Anonyomous"}</Name>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
