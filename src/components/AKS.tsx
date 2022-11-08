import React, { useState } from "react";
import { useDrop } from "react-dnd";
import "../App.css";
import axios from "axios";
import { Typography } from "@mui/material";
import Item from "./Item";

const AKS: React.FC<{
  pods: any;
  setPods: React.Dispatch<React.SetStateAction<any[]>>;
  activate: number;
  setActivate: React.Dispatch<React.SetStateAction<number>>;
  handleMigratingPodChange: (
    name: string,
    region: string,
    namespace: string
  ) => void;
  migratingPod: {
    name: string;
    region: string;
    namespace: string;
  };
}> = (props) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: (item: any) => {
      addImageToBoard(item.id, item.namespace, item.name);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Transfer GKE pod to AKS
  const handleTransfer = (name: string, namespace: string) => {
    console.log("GKE pod to AKS")
    axios
      .post("http://" + (process.env.REACT_APP_GKE_IP as string) + ":30001/migrate", {
        name: name,
        namespace: namespace,
        destinationUrl: (process.env.REACT_APP_AKS_IP as string) + ":30001",
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(function (r) {
        props.setActivate(props.activate + 1);
        props.handleMigratingPodChange("", "left", "");
      });
  };

  const addImageToBoard = (id: number, namespace: string, name: string) => {
    if (namespace !== "aks") {
      var answer = window.confirm(
        "Do you want to migrate " + name + "?"
      );
      if (answer) {
        props.handleMigratingPodChange(name, "right", namespace);
        handleTransfer(name, namespace);
        // console.log("aks2gke");
        // const pictureList = PictureList.filter((picture) => id === picture.id);
        // props.setPods([
        //   ...props.pods,
        //   { migratable: true, name: name, namespace: namespace, status: "todo"},
        // ]);
      }
    }
  };
  return (
    <>
      <Typography variant="h1">Azure Kubernetes System</Typography>
      <div className="AKSBoard" ref={drop}>
        {props.pods.map((pod: any, index: number) => {
          return (
            <Item
              region="left"
              migratingPod={props.migratingPod}
              name={pod.name}
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

export default AKS;
