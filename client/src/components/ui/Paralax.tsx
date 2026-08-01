import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useMediaQuery } from 'react-responsive';

export const products = [
  {
    title: "Luxury Sedan",
    link: "#",
    thumbnail: "https://img.freepik.com/premium-photo/luxury-car-rental-car-sale-social-media-instagram-post-template-design_1126722-2530.jpg",
  },
  {
    title: "Sport SUV",
    link: "#",
    thumbnail: "https://evmwheels.com/front-theme/images/Group%20316.png",
  },
  {
    title: "Compact City Car",
    link: "#",
    thumbnail: "https://img.freepik.com/premium-photo/luxury-car-rental-car-sale-social-media-instagram-post-template-design_1126722-2530.jpg",
  },
];

export const HeroParallax = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [10, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-300, 0]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[120vh] py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-slate-50"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="mt-20"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 mb-12 lg:mb-20">
          {products.map((product, index) => (
            <ProductCard
              key={`row1-${index}`}
              product={product}
              translate={translateX}
            />
          ))}
          {/* Duplicate for seamless scrolling feel */}
          {products.map((product, index) => (
            <ProductCard
              key={`row1-dup-${index}`}
              product={product}
              translate={translateX}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-12 lg:mb-20 space-x-10">
          {products.map((product, index) => (
            <ProductCard
              key={`row2-${index}`}
              product={product}
              translate={translateXReverse}
            />
          ))}
          {/* Duplicate for seamless scrolling feel */}
          {products.map((product, index) => (
            <ProductCard
              key={`row2-dup-${index}`}
              product={product}
              translate={translateXReverse}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-10 px-6 w-full text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 tracking-tight font-poppins">
        Featured <span className="text-green-500">Fleet</span>
      </h1>
      <p className="max-w-2xl mx-auto text-lg md:text-xl mt-6 text-slate-600">
        Explore our collection of premium vehicles designed to give you the ultimate driving experience.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -10,
        scale: 1.02,
      }}
      className="group/product h-[250px] w-[350px] md:h-[300px] md:w-[450px] relative flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-100"
    >
      <div className="absolute inset-0 h-full w-full bg-slate-50 flex items-center justify-center p-4">
        <img
          src={product.thumbnail}
          className="object-cover h-full w-full rounded-xl group-hover/product:scale-105 transition-transform duration-500 ease-in-out"
          alt={product.title}
        />
      </div>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-100 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300"></div>
      <h2 className="absolute bottom-6 left-6 opacity-0 group-hover/product:opacity-100 text-white font-bold text-xl transition-all duration-300 translate-y-4 group-hover/product:translate-y-0">
        {product.title}
      </h2>
    </motion.div>
  );
};
