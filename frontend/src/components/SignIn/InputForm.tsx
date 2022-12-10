import {
  IDInputContainer,
  InputFormContainer,
  PasswordInputContainer,
  AnchorLogo,
  GreenMark,
  TextLink,
  InfoContainer,
} from '../../styles/SignIn.style';
import React, { useCallback, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserState } from '../../hooks/useUserState';

export const SigninInputForm = () => {
  const [isLoading, setLoading] = useState(false);
  const id = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const requestURL = useMemo(
    () => import.meta.env.VITE_SERVER_URL + '/auth/signin',
    [],
  );
  const navigate = useNavigate();
  const { loginHandler } = useUserState();
  const { version } = useParams();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      fetch(requestURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: id.current?.value,
          password: password.current?.value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.msg === 'success') {
            const expirationTime = new Date(
              new Date().getTime() + data.effectiveTime,
            ).toISOString();
            // console.log(data.accessToken);
            loginHandler(data.accessToken, expirationTime, data.userId);
            !version && navigate(-1);
            return;
          }
          alert('로그인에 실패하였습니다.');
        })
        .catch((e) => {
          setLoading(false);
          alert('로그인에 실패하였습니다.');
          console.log(e);
        });
    },
    [id, password, requestURL],
  );

  return (
    <>
      <InfoContainer>
        <AnchorLogo to={'/'}>
          Signin to
          <br />
          Camper<GreenMark>Rank</GreenMark>
        </AnchorLogo>
        <TextLink to={'/signup'}>↪ Go to Signup</TextLink>
      </InfoContainer>
      <InputFormContainer onSubmit={handleSubmit}>
        <IDInputContainer>
          <p>아이디</p>
          <input type={'text'} ref={id} />
        </IDInputContainer>
        <PasswordInputContainer>
          <p>비밀번호</p>
          <input type={'password'} ref={password} />
        </PasswordInputContainer>
        {isLoading ? (
          <span>sending...</span>
        ) : (
          <button type={'submit'}>로그인</button>
        )}
      </InputFormContainer>
    </>
  );
};
