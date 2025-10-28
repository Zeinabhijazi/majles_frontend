"use client";
import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserRegistrationStatus } from "@/redux/slices/dashboardSlice";
import { useTranslations } from "next-intl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function UserRegistrationChart() {
  const t = useTranslations("adminDashboard");
  const dispatch = useDispatch<AppDispatch>();
  const { userRegistrationStatus } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchUserRegistrationStatus());
  }, [dispatch]);

  // Default labels (Months)
  const monthLabels = [
    t("jan"),
    t("feb"),
    t("mar"),
    t("apr"),
    t("may"),
    t("jun"),
    t("jul"),
    t("aug"),
    t("sep"),
    t("oct"),
    t("nov"),
    t("dec"),
  ];

  // Map your data to monthly order
  const monthlyData = monthLabels.map((month, index) => {
    const key = `${new Date().getFullYear()}-${String(index + 1).padStart(
      2,
      "0"
    )}`;
    return userRegistrationStatus?.[key] || 0; // fallback 0 if no data
  });

  const data = {
    labels: monthLabels,
    datasets: [
      {
        label: t("userCounts"),
        data: monthlyData,
        borderColor: "#42A5F5",
        backgroundColor: "rgba(66, 165, 245, 0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#1E88E5",
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: t("userOverview"),
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5 },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={data} options={options} height={220} />
    </div>
  );
}
