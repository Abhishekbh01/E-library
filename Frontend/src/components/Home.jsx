import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import Footer from './shared/Footer'

function Home() {
  return (
    <div className='overflow-hidden m-0 box-border'>
        <Navbar/>
        <HeroSection/>
        <Footer/>
    </div>
  )
}

export default Home