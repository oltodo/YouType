import React from "react";
import { validateURL, getVideoID } from "ytdl-core";
import { useNavigate } from "react-router";
import Header from "components/Header";
import Launcher from "components/Launcher";

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
        validate={validateURL}
        onSubmitted={value => {
          const id = getVideoID(value);
          navigate(`/game/${id}`);
        }}
      />
    </div>
  );
};

export default Main;
