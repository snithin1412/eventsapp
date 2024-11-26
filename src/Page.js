import React from "react";
import Footer  from "./components/common/Footer";
import Header from "./components/common/Footer";

function Page(props) {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  );
}

export default Page;
