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

  // Transfer GKE pod to AKS
  const handleTransfer = (name: string, namespace: string) => {
    console.log("GKE pod to AKS");
    axios
      .post(
        "http://" + "34.171.128.48" + ":30001/migrate",
        {
          name: name,
          namespace: namespace,
          destinationUrl: "20.121.139.124" + ":30001",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (r) {
        alert(r.data);
        props.setActivate(props.activate + 1);
        props.handleMigratingPodChange(name, "right", namespace, "deleting...");
      });
  };

  const addImageToBoard = (id: number, namespace: string, name: string, region: string) => {
    if (region !== "left") {
      var answer = window.confirm("Do you want to migrate the " + name + " pod to AKS?");
      if (answer) {
        props.handleMigratingPodChange(
          name,
          "right",
          namespace,
          "migrating..."
        );
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
      <Typography variant="h2">
        <img
          height="50"
          width="50"
          src="https://boxboat.com/2019/10/01/quick-intro-to-aks/featured.svg"
        ></img>
        Azure Kubernetes Service
        <img
          height="50"
          width="50"
          src="https://boxboat.com/2019/10/01/quick-intro-to-aks/featured.svg"
        ></img>
      </Typography>
      <div className="AKSBoard" ref={drop}>
        {props.pods.map((pod: any, index: number) => {
          return (
            <Item
              region="left"
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

export default AKS;
