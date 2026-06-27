import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import How from "../components/home/How";
import Security from "../components/home/Security";
import CTA from "../components/home/CTA";
import Footer from "../components/layout/Footer";
import { Element, scroller } from "react-scroll";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      scroller.scrollTo(location.hash.replace("#", ""), {
        smooth: true,
        duration: 600,
        offset: -80,
      });
    }
  }, [location]);

  return (
    <div>
      <Navbar />
      <Element name="hero">
        <Hero id="hero" />
      </Element>
      <Element name="features">
        <Features id="features" />
      </Element>
      <Element name="how">
        <How id="how" />
      </Element>
      <Element name="security">
        <Security id="security" />
      </Element>
      <Element name="cta">
        <CTA id="cta" />
      </Element>
      <Footer />
    </div>
  );
}

export default Home;
