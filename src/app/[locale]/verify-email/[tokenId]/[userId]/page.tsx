'use client';
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function VerifyEmailPage() {
  const params = useParams(); // params.token and params.userId are strings
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    if (!params?.tokenId || !params?.userId) {
      setMessage("Invalid verification link");
      return;
    }

    async function verify() {
      try {
        const response = await api.get(
          `/verify-email/verify/${params.tokenId}/${params.userId}`
        );
        setMessage(response.data.message || "Email verified!");
        setTimeout(() => (globalThis.location.href = "/"), 2000);
      } catch (err: any) {
        setMessage(err.response?.data?.message || "Server error");
      }
    }

    verify();
  }, [params]);

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-xl font-bold">Email Verification</h1>
      <p className="mt-4">{message}</p>
    </div>
  );
}
