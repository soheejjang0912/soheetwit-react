import styled from "styled-components";
import { auth } from "../firebase";

const Wrapper = styled.div``;
const AvatarUpload = styled.label``;
const AvatarImg = styled.img``;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span``;

export default function Profile() {
  const user = auth.currentUser;
  return (
    <Wrapper>
      <AvatarUpload>
        <AvatarImg />
      </AvatarUpload>
      <AvatarInput type="file" accept="imgae/*" />
      <Name>{user?.displayName ?? "Anonyomous"}</Name>
    </Wrapper>
  );
}
