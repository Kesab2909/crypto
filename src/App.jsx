import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Crypto from "./pages/Crypto";
export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/crypto/:cryptoId" element={<Crypto/>}/>
      </Routes>
    </div>
  )
}