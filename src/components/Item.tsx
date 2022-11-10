import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useDrag } from "react-dnd";

const Item: React.FC<{
  id: number;
  namespace: string;
  name: string;
  url: string;
  status: string;
  migratable: string;
  migratingPod: {
    name: string;
    region: string;
    namespace: string;
    status: string;
  };
  region: string;
}> = (props) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { id: props.id, namespace: props.namespace, name: props.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <>
      <Card
        sx={{
          //backgroundColor: "#D3D3D3",
          //width: "48vw",
          borderRadius: "0",
          borderColor: props.migratable === "True" ? "white": "black",
          backgroundColor: props.migratable === "True" ? "white": "gray",
          display: "flex",
          //mb: 2,
          borderBottom: "1px solid gray",
        }}
        variant="outlined"
      >
        <img
          ref={props.migratable === "True" ? drag : null}
          src="https://t4.ftcdn.net/jpg/03/20/69/73/240_F_320697394_ePxphXpLXtSwIcdaKG88iV0l1rf0Pbat.jpg"
          height="70px"
          style={{
            border: isDragging
              ? "5px solid blue"
              : props.region === "left"
              ? "2px solid gray"
              : "4px solid black",
            borderRadius: 5,
          }}
        />
        <Box
          sx={{
            width: "47vw",
            //display: "flex", flexDirection: "column"
          }}
        >
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5" sx={{ textAlign: "left" }}>
              {props.name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ float: "left" }}
            >
              {props.namespace}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ textAlign: "center" }}
            >
              {props.status}
            </Typography>
            {
            // props.name === props.migratingPod.name &&
            //   props.namespace === props.migratingPod.namespace &&
            //   props.migratingPod.region === props.region && (
            //     <Typography
            //       variant="subtitle1"
            //       color="text.secondary"
            //       //component="div"
            //       sx={{ float: "right" }}
            //     >
            //       {props.migratingPod.status}
            //     </Typography>
            //   )
              }
          </CardContent>
          <Box
            sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
          ></Box>
        </Box>
      </Card>
    </>
  );
};

export default Item;
