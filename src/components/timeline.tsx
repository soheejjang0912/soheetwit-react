import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import Tweet from "./tweet";
import type { Unsubscribe } from "firebase/auth";

// tweets 데이터 구조 정의 interface!
export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  useId: string;
  username: string;
  createdAt: number;
}
const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;
export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      /* const snapshot = await getDocs(tweetsQuery); // 쿼리 결과 가져오기 getDocs
    // 각 문서를 ITweet 형태로 변환
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, useId, username, photo } = doc.data();
      return {
        id: doc.id,
        tweet,
        createdAt,
        useId,
        username,
        photo,
      };
    }); */
      unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, useId, username, photo } = doc.data();
          return {
            id: doc.id,
            tweet,
            createdAt,
            useId,
            username,
            photo,
          };
        });
        setTweet(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe?.();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
