"use client";
import React, { useState, MouseEvent } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import LanguageIcon from "@mui/icons-material/Language";

interface Language {
  id: string;
  language: string;
}

export default function Language() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Create the array
  const languageArray: Language [] = [
    {id: "en", language: "English"},
    {id: "ar", language: "Arabic"},
    {id: "fr", language: "French"},
    {id: "de", language: "Deutsch"}
  ]
 
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  // Change Language
  const changeLanguage = (lng: string) => {
    if (lng !== locale) {
      router.replace(pathname, { locale: lng });
    }
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <LanguageIcon color="secondary" />
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {languageArray.map((item) => (
          <MenuItem key={item.id} onClick={() => changeLanguage(item.id)}>{item.language}</MenuItem>
        ))}
      </Menu>
    </div>
  );
}
