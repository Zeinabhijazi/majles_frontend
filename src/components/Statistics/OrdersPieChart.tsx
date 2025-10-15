"use client";
import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchStatus } from "@/redux/slices/dashboardSlice";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OrdersPieChart() {
  const t = useTranslations("adminDashboard");
  const { orderStatus } = useSelector((state: RootState) => state.dashboard);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchStatus());
  }, [dispatch]);

  const data = {
    labels: [t("accepted"), t("pending"), t("cancelled")],
    datasets: [
      {
        data: [
          orderStatus.accepted,
          orderStatus.pending,
          orderStatus.cancelled,
        ],
        backgroundColor: ["#242329", "#212b36", "#e72544"],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: t("orderOverive"),
      },
    },
  };

  return (
    <div className="w-96 h-96">
      <Pie data={data} options={options} />
    </div>
  );
}
