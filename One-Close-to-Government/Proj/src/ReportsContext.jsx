import React, { createContext, useState, useContext } from "react";


const ReportsContext = createContext();


export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);

  const contextValue = {
    reports,
    setReports,
    submittedReports: reports,
  };


  return (
    <ReportsContext.Provider value={{ reports, setReports }}>
      {children}
    </ReportsContext.Provider>
  );
};


export const useReports = () => {
  const context = useContext(ReportsContext);
  if(!context){
    throw new Error("useReports must be used in a ReportsProvider ");
  }
  return context;
  };