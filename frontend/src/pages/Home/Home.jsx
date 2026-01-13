import React from 'react'
import "./Home.css"
import Header from '../../components/Header/Header';
import About from '../../components/About/About';
import Products from '../../components/Products/Products';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  return (
    <div>
      <Header/>
      <About/>
      <Products/>
      <Footer/>
    </div>
  )
}

export default Home
