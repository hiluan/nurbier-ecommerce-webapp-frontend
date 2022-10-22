import styled from "styled-components";
import { BsSearch } from "react-icons/bs";
import { SMainBtn } from "../styles/SMainBtn";
import Light from "./Light";
import PopUp16 from "./PopUp16";
import { useState } from "react";

export default function IntroBeerCards({ lights }) {
  // const [scrollY, setScrollY] = useState(0);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrollY(window.scrollY);
  //   };
  //   handleScroll();

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);
  return (
    <SIntroBeerCards id="SIntroBeerCards">
      <SCards id="SCards">
        {lights.map((light) => (
          <Light key={light.attributes.handle} light={light} />
        ))}
      </SCards>
    </SIntroBeerCards>
  );
}

const SIntroBeerCards = styled.div`
  margin-top: -18rem;
  margin-bottom: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  //   height: 90vh;

  h1 {
    z-index: 2;
    position: absolute;
    color: white;
    transform: translate(0%, -100%);
    text-shadow: 0px 0px 5px #000000;
  }
`;

const SCards = styled.div`
  //   position: absolute;
  margin: 5rem;
  display: flex;
  // margin-bottom: -20rem;
  z-index: 22;
`;
