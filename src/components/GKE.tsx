import React, { useState } from "react";
import { useDrop } from "react-dnd";
import "../App.css";
import axios from "axios";
import { Typography } from "@mui/material";
import Item from "./Item";

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
      addImageToBoard(item.id, item.namespace, item.name);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Transfer AKS pod to GKE
  const handleTransfer = (name: string, namespace: string) => {
    console.log("AKS pod migrating to GKE")
    axios
      .post("http://" + (process.env.REACT_APP_AKS_IP as string) + ":30001/migrate", {
        name: name,
        namespace: namespace,
        destinationUrl: (process.env.REACT_APP_GKE_IP as string) + ":30001",
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(function (r) {
        alert(r.data)
        props.setActivate(props.activate + 1);
        props.handleMigratingPodChange(name, "left", namespace, "deleting...");
      });
  };

  const addImageToBoard = (id: number, namespace: string, name: string) => {
    if (namespace !== "gke") {
      var answer = window.confirm(
        "Do you want to migrate " + name + "?"
      );
      if (answer) {
        props.handleMigratingPodChange(name, "left", namespace, 'migrating...');
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
      <Typography variant="h2">Google Kubernetes Engine</Typography>
      <div className="GKEBoard" ref={drop}>
        {props.pods.map((pod: any, index: number) => {
          return (
            <Item
              region="right"
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

export default GKE;
