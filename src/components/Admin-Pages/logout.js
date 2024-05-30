import React from "react";

export default function Logout() {
    localStorage.clear();
    
    window.location.replace("/login");
}