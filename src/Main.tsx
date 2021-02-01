import React from "react";
import { useNavigate } from "react-router";
import Header from "components/Header";
import Launcher from "components/Launcher";
import { getVideoID } from "./utils/youtube";

interface Props {}

const Main = (props: Props) => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <br />
      <br />
      <br />
      <br />
      <Launcher
        validate={url => getVideoID(url) !== null}
        onSubmitted={value => {
          const id = getVideoID(value);
          navigate(`/game/${id}`);
        }}
      />
    </div>
  );
};

export default Main;
