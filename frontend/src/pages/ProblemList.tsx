import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { MainHeader } from "../components/MainHeader";
import { SearchFilter, List } from "../components/ProblemList";
import { Footer } from "../components/Footer";
import { filterState } from "../recoils";
import problems from "../utils/ProblemsDummy";
import { ProblemInfo } from "@types";
import { userState } from "../recoils";

const URL = import.meta.env.VITE_SERVER_URL;

const MainWrapper = styled.div`
  width: 100%;
  height: 135rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-width: 1100px;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  height: 8rem;
`;

const ListWrapper = styled.div`
  width: 100%;
  height: 95rem;
  background: #f1f5ee;
  display: flex;
`;

const FooterWrapper = styled.div`
  width: 100%;
  height: 20rem;
`;

const ProblemList = () => {
  const [filter, setFilter] = useRecoilState(filterState);
  const [list, setList] = useState<ProblemInfo[]>([]);
  const [filtered, setFiltered] = useState<ProblemInfo[]>([]);
  const [user] = useRecoilState(userState);
  
  useEffect(() => {
    const {ID} = user;
    console.log(ID);
    const fetchURL = ID ? `${URL}/problem?loginId=${ID}` : `${URL}/problem`;
    setFilter({solved: '푼 상태', level: '문제 레벨', search: ''});
    fetch(fetchURL)
    .then(res => res.json())
    .then(res => {
      if (res.statusCode === 200) {
        delete res.statusCode;
        setList(Object.values(res));
      }
    })
  }, [user]);
  
  useEffect(() => {
    const { solved, level, search } = filter;
    let filtered = [...list];
    if (level && level !== "문제 레벨") filtered = filtered.filter((elem) => elem.level === +level.slice(-1));
    if (search && search !== "") filtered = filtered.filter((elem) => {
      if (elem.title) return elem.title.includes(search);
      else return false;
    });
    if (solved && solved !== '푼 상태') filtered = filtered.filter((elem) => {
      return solved === '푼 문제'? elem.isSolved === true : elem.isSolved === false;
    });

    setFiltered(filtered);
  }, [filter, list]);


  return (
    <MainWrapper>
      <HeaderWrapper>
        <MainHeader></MainHeader>
      </HeaderWrapper>
      <SearchFilter></SearchFilter>
      <ListWrapper>
        <List list={filtered}></List>
      </ListWrapper>
      <FooterWrapper>
        <Footer></Footer>
      </FooterWrapper>
    </MainWrapper>
  );
};

export default ProblemList;
