'use client'
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import CreateOrderModal from "@/components/Forms/CreateOrderModal";
import LoginModal from "@/components/Forms/LoginModal";
import RegisterModal from "@/components/Forms/RegisterModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ReaderListSection from "@/components/includes/ReaderListSection";

export default function Readers() {
  const t1 = useTranslations("heading");
  const t2 = useTranslations("button");

  const { userDetails } = useSelector((state: RootState) => state.user);
  const [selectedReaderId, setSelectedReaderId] = useState<number | null>(null);

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  const handleAddOrder = (userId: number) => {
    if (!userDetails?.userType) {
      setLoginOpen(true);
    } else {
      setSelectedReaderId(userId); 
      setCreateOrderOpen(true);
    }
  };

  return (
    <>
      <ReaderListSection
        title={t1("readersPage")}
        showImage
        buttonLabel={t2("addOrder")}
        onButtonClick={handleAddOrder}
        variant="readers"
        className="reader_page"
      />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onOpenSecond={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
      <CreateOrderModal
        open={createOrderOpen}
        onClose={() => setCreateOrderOpen(false)}
        readerId={selectedReaderId}
      />
    </>
  );
}
