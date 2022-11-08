import { Typography, Link } from "@mui/material";
import React from "react";

const Copyright: React.FC<{}> = (props) => {
  return (
    <>
        <Typography
        variant="body2"
        color="text.secondary"
        align="center"
      >
        Live Service Migration created by Thanawat Chanikaphon. Web interface created by Tony Huynh.
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
      >
        University of Louisiana, Lafayette
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
      >
        <Link color="inherit" href="http://hpcclab.org//">
          High Performance Cloud Computing Laboratory
        </Link>{" "}
        2022
        {"."}
      </Typography>
    </>
  );
};

export default Copyright;
