import * as React from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography
} from "@mui/material";

export default function CardData({
  text,
  data,
}: Readonly<{ text: string; data: number | null }>) {
  return (
    <Card sx={{ width: "100%" }}>
      <CardActionArea
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
          height: "100%",
        }}
      >
        <CardContent sx={{ height: "100%" }}>
          <Typography
            variant="h5"
            color="text.primary"
            sx={{
              fontSize: "20px",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {text}
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              fontSize: "20px",
              textAlign: "center",
            }}
          >
            {data}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
