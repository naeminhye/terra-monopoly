import * as React from "react";
import { createRoot } from "react-dom/client";
import LanguageSelector from "@/components/LanguageSelector";

import GameBoard from "./GameBoard"; // Ensure this matches the correct path

import "./i18n"; // Import file cấu hình i18next

import "./index.css"; // Ensure you have global styles if needed

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <LanguageSelector />
    <GameBoard />
  </React.StrictMode>
);
