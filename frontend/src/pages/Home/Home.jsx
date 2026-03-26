import { motion } from 'framer-motion';
import Header from '../../components/Header/Header';
import About from '../../components/About/About';
import Products from '../../components/Products/Products';
import Footer from '../../components/Footer/Footer';
import "./Home.css"

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header/>
      <About/>
      <Products/>
      <Footer/>
    </motion.div>
  )
}

export default Home
