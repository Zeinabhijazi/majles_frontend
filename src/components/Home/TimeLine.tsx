import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Typography } from "@mui/material";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import { useTranslations } from "next-intl";

export default function BasicTimeline() {
  const t = useTranslations("timeLine");
  return (
    <Timeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 0.2,
        },
      }}
    >
      <TimelineItem sx={{ mb: 2 }}>
        <TimelineOppositeContent color="text.secondary">
          <Typography
            variant="h5"
            color="secondary"
            sx={{
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            {t("mision")}
          </Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot color="secondary">
            <RemoveRedEyeIcon color="primary" />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ textAlign: "justify", width: "80%", lineHeight: "24px" }}
          >
            {t("misionBody")}
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          <Typography
            variant="h5"
            color="secondary"
            sx={{
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            {t("vision")}
          </Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot color="secondary">
            <WbIncandescentIcon color="primary" />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ textAlign: "justify", width: "80%", lineHeight: "24px" }}
          >
            {t("visionBody")}
          </Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
