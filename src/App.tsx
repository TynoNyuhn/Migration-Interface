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
  });

  const handleMigratingPodChange = (
    name: string,
    region: string,
    namespace: string
  ) => {
    //console.log(migratingPod)
    setMigratingPod({
      name: name,
      region: region,
      namespace: namespace,
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

  useEffect(() => {
    getPods(setLeftPods, (process.env.REACT_APP_AKS_IP as string), setHasLeft);
    getPods(setRightPods, (process.env.REACT_APP_GKE_IP as string), setHasRight);
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
