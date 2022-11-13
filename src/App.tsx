import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AKS from "./components/AKS";
import GKE from "./components/GKE";
import axios from "axios";
import { Button } from "@mui/material";
import Copyright from "./components/Copyright";

function App() {
  const [leftPods, setLeftPods] = useState<any>([]);
  const [hasLeft, setHasLeft] = useState(false);
  const [rightPods, setRightPods] = useState<any>([]);
  const [hasRight, setHasRight] = useState(false);
  const [activate, setActivate] = useState(0);

  const [migratingPod, setMigratingPod] = useState({
    name: "",
    region: "",
    namespace: "",
    status: "",
  });

  function delay(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

  const handleMigratingPodChange = (
    name: string,
    region: string,
    namespace: string,
    status: string,
  ) => {
    //console.log(migratingPod)
    setMigratingPod({
      name: name,
      region: region,
      namespace: namespace,
      status: status,
    })
    //console.log(migratingPod);
  };

  const getPods = async (
    setPods: React.Dispatch<React.SetStateAction<any[]>>,
    cloudIp: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    await axios.get("http://" +cloudIp + ":30001/list").then(function (r) {
      //console.log(r.data);
      setPods(r.data.filter((item: any) => item.namespace !== "kube-system"));
      setLoading(true);
    });
  };

  const timerActivate = async () => {
    await delay(1000)
    setActivate(activate + 1)
  }

  useEffect(() => {
    // if (activate === 1) {
    //   console.log(process.env)
    //   console.log((process.env['REACT_APP_AKS_IP'] as string) + "\n" + (process.env['REACT_APP_GKE_IP'] as string))
    // }
    getPods(setLeftPods, "20.121.139.124", setHasLeft);
    getPods(setRightPods, "34.171.128.48", setHasRight);
    timerActivate()
  }, [activate]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            setActivate(activate + 1);
          }}
          sx={{borderRadius: "0"}}
        >
          Refresh Pods
        </Button>
        <div className="row">
          <div className="column">
            <AKS
              migratingPod={migratingPod}
              handleMigratingPodChange={handleMigratingPodChange}
              pods={leftPods}
              setPods={setLeftPods}
              activate={activate}
              setActivate={setActivate}
            />
          </div>
          <div className="column">
            <GKE
              migratingPod={migratingPod}
              handleMigratingPodChange={handleMigratingPodChange}
              pods={rightPods}
              setPods={setRightPods}
              activate={activate}
              setActivate={setActivate}
            />
          </div>
        </div>
        <Copyright />
      </div>
    </DndProvider>
  );
}

export default App;
