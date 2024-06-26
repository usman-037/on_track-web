import React from "react";
import SideMenu from "./SideMenu";

const layoutContainerStyle = {
  display: "flex",
};

const pageContentStyle = {
  flex: 1,
};

const Layout = ({ children }) => {
  return (
    <div style={layoutContainerStyle}>
      <SideMenu />
      <div style={pageContentStyle}>{children}</div>
    </div>
  );
};

export default Layout;
