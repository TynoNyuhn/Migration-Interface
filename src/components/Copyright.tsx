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
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
      >
        <img width="100px" height="75px" src="https://hpcclab.org/wp-content/uploads/2016/04/logo-600x382.jpg">
        </img>
        <img width="75px" height="75px" src="https://www.nsf.gov/policies/images/NSF_Official_logo_High_Res_1200ppi.png">
        </img>
        <img width="175px" height="75px" src="https://web.louisiana.edu/sites/web/files/Screen%20Shot%202017-08-31%20at%203.53.43%20PM.png">
        </img>
      </Typography>
    </>
  );
};

export default Copyright;
