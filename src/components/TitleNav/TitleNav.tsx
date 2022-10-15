import { ActionIcon } from "@mantine/core";
import { BarChartFill, ChevronLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

import "./TitleNav.scss";

interface TitleNavProps {
  title: string;
  info?: boolean;
}

function TitleNav({ title, info = false }: TitleNavProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="title-nav">
        <ActionIcon
          color="blue"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ChevronLeft size={20} />
        </ActionIcon>
        <h4 className="page-title-small">{title}</h4>
        {info && (
          <ActionIcon
            color="blue"
            onClick={() => {
              navigate(`stats${window.location.search}`);
            }}
          >
            <BarChartFill size={20} />
          </ActionIcon>
        )}
      </div>
      <div className="title-nav-spacer" />
    </>
  );
}

export default TitleNav;
