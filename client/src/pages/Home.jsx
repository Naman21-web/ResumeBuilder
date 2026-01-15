import React from 'react'
import Banner from '../components/home/Banner'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import Testimonials from '../components/home/Testimonials'
import CallToActions from '../components/home/CallToActions'
import Footer from '../components/home/Footer'

const Home = () => {
  return (
    <div>
        <Banner />
        <Hero />
        <Features />
        <Testimonials />
        <CallToActions />
        <Footer />
    </div>
  )
}

export default Home