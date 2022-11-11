import React, { useState } from "react";
import { useDrop } from "react-dnd";
import "../App.css";
import axios from "axios";
import { Typography } from "@mui/material";
import Item from "./Item";
import { setEmitFlags } from "typescript";

const GKE: React.FC<{
  pods: any;
  setPods: React.Dispatch<React.SetStateAction<any[]>>;
  activate: number;
  setActivate: React.Dispatch<React.SetStateAction<number>>;
  handleMigratingPodChange: (
    name: string,
    region: string,
    namespace: string,
    status: string
  ) => void;
  migratingPod: {
    name: string;
    region: string;
    namespace: string;
    status: string;
  };
}> = (props) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: (item: any) => {
      addImageToBoard(item.id, item.namespace, item.name, item.region);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Transfer AKS pod to GKE
  const handleTransfer = (name: string, namespace: string) => {
    console.log("AKS pod migrating to GKE");

    var sse = new EventSource(
      "http://" +
        (process.env.REACT_APP_AKS_IP as string) +
        ":30001/demo?name=" +
        name +
        "&namespace=" +
        namespace +
        "&destinationUrl=" +
        (process.env.REACT_APP_GKE_IP as string) +
        ":30001&keep=true&redirect=" +
        (process.env.REACT_APP_GKE_IP as string) + ":30080"
    );
    sse.addEventListener("message", function (e) {
      console.log(e);
      var data = e.data;
      if (!data) {
        console.log("No data in event");
        return;
      }
      if (data === "DONE") {
        alert("Migration Complete!")
        console.log("done!");
        sse.close();
      }
    });

    // axios
    //   .post(
    //     "http://" + (process.env.REACT_APP_AKS_IP as string) + ":30001/migrate",
    //     {
    //       name: name,
    //       namespace: namespace,
    //       destinationUrl: (process.env.REACT_APP_GKE_IP as string) + ":30001",
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )
    //   .then(function (r) {
    //     alert(r.data);
    //     props.setActivate(props.activate + 1);
    //     props.handleMigratingPodChange(name, "left", namespace, "deleting...");
    //   });
  };

  const addImageToBoard = (id: number, namespace: string, name: string, region: string) => {
    if (region !== "right") {
      var answer = window.confirm("Do you want to migrate the " + name + " pod to GKE?");
      if (answer) {
        props.handleMigratingPodChange(name, "left", namespace, "migrating...");
        handleTransfer(name, namespace);
        // console.log("aks2gke");
        // const pictureList = PictureList.filter((picture) => id === picture.id);
        // props.setPods([
        //     ...props.pods,
        //     { migratable: true, name: name, namespace: namespace, status: "todo"},
        //   ]);
      }
    }
  };
  return (
    <>
      <Typography variant="h2">
        <img
          height="50"
          width="50"
          src="https://lh3.googleusercontent.com/Aane0AssTO_QZK7MZ3yV89oPg95K5LgJ7Keang1B9Vi1DEMWG4vTUqBewXM3ibwZdEO0IW1NnumogaGOZVwf=w160-h160"
        ></img>
        Google Kubernetes Engine
        <img
          height="50"
          width="50"
          src="https://lh3.googleusercontent.com/Aane0AssTO_QZK7MZ3yV89oPg95K5LgJ7Keang1B9Vi1DEMWG4vTUqBewXM3ibwZdEO0IW1NnumogaGOZVwf=w160-h160"
        ></img>
      </Typography>
      <div className="GKEBoard" ref={drop}>
        {props.pods.map((pod: any, index: number) => {
          return (
            <Item
              region="right"
              migratingPod={props.migratingPod}
              name={pod.name}
              status={pod.status}
              migratable={pod.migratable}
              url={""}
              id={index}
              namespace={pod.namespace}
            />
          );
        })}
      </div>
    </>
  );
};

export default GKE;
