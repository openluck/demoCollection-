import React, { useEffect, useMemo, useState } from "react";
import Index from "./components/index";
import ReactLoading from "react-loading";
const App = (props) => {
  const { width, height, stuList, teaList, otherList, needSreenShot } = props;
  const { screenShot } = props;
  // const [loading, setLoading] = useState(false);
  const content = useMemo(() => {
    return (
      <Index
        width={width}
        needSreenShot={needSreenShot}
        height={height}
        teaList={teaList}
        stuList={stuList}
        otherList={otherList}
        screenShot={screenShot}
      />
    );
  }, [teaList, stuList, otherList, width, height]);

  return <div style={{ width, height }}>{content}</div>;
};

export default App;
