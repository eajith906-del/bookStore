import React from 'react'
import LandingBanar from "../Home/HomeComponents/LandingBanner/LandingBanner"
import BestSellers from "./HomeComponents/BestSellers/BestSellers"
import RecommendedBooks from "./HomeComponents/RecommendedBooks/RecommendedBooks"
import Events from "./HomeComponents/Events/Events"
import Footer from "../../Components/Footer/Footer"

const Home = () => {
  return (
    <div>
        <LandingBanar/>
        <BestSellers/>
        <RecommendedBooks/>
        <Events/>
        <Footer/>
    </div>
  )
}

export default Home