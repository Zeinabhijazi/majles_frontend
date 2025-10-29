"use client";
import React, { use, useState } from "react";
import { useTranslations } from "next-intl";
import IconBreadcrumbs from "@/components/includes/BreadCrumb";
import ConfirmAssignDialog from "@/components/Dialog/ConfirmAssignDialog";
import ReaderListSection from "@/components/includes/ReaderListSection";

export default function AssignReader({
  params,
}: Readonly<{ params: Promise<{ id: number }> }>) {
  const { id } = use(params);

  const t = useTranslations("button");
  
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleAssign = (userId: number) => {
    setSelectedUserId(userId);
    setAssignOpen(true);
  };

  return (
    <>
      <ReaderListSection
        headerExtra={<IconBreadcrumbs />}
        showImage={false}
        buttonLabel={t("choose")}
        onButtonClick={handleAssign}
        variant="admin"
      />

      {assignOpen && selectedUserId && (
        <ConfirmAssignDialog
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          userId={selectedUserId}
          orderId={id}
        />
      )}
    </>
  );
}
