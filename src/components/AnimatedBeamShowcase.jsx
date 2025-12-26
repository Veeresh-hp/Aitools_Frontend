import React, { useRef } from "react";
import AnimatedBeam from "./AnimatedBeam";
import { SiOpenai, SiGooglecloud, SiGoogledrive, SiNotion, SiWhatsapp, SiGmail } from "react-icons/si";
import { FaFacebookMessenger } from "react-icons/fa";

const Circle = React.forwardRef(({ className = "", children }, ref) => {
  return (
    <div
      ref={ref}
      className={`z-10 flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] ${className}`}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle"; 

const AnimatedBeamShowcase = () => {
  const containerRef = useRef(null);
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);
  const div5Ref = useRef(null);
  const div6Ref = useRef(null);
  const div7Ref = useRef(null);

  return (
    <div className="w-full flex justify-center p-4">
        <div
        className="relative flex h-[500px] w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 md:shadow-xl"
        ref={containerRef}
        >
        <div className="flex h-full w-full flex-col items-stretch justify-between gap-10 p-10">
            {/* Top Row */}
            <div className="flex flex-row items-center justify-between">
                <Circle ref={div1Ref}>
                    <SiGooglecloud className="text-[#4285F4]" size={28} />
                </Circle>
                <Circle ref={div5Ref}>
                    <SiGoogledrive className="text-[#34A853]" size={28} />
                </Circle>
            </div>

            {/* Middle Row */}
            <div className="flex flex-row items-center justify-between">
                <Circle ref={div2Ref}>
                    <SiNotion className="text-black" size={28} />
                </Circle>
                {/* Center Hub (OpenAI) */}
                <Circle ref={div4Ref} className="h-24 w-24 p-2 border-gray-200 shadow-xl">
                   <SiOpenai className="text-black" size={48} />
                </Circle>
                <Circle ref={div6Ref}>
                    <SiGmail className="text-[#EA4335]" size={28} />
                </Circle>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-row items-center justify-between">
                <Circle ref={div3Ref}>
                    <SiWhatsapp className="text-[#25D366]" size={28} />
                </Circle>
                <Circle ref={div7Ref}>
                    <FaFacebookMessenger className="text-[#0084FF]" size={28} />
                </Circle>
            </div>
        </div>

        {/* Beams */}
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={div1Ref}
            toRef={div4Ref}
            curvature={50}
            endYOffset={-10}
            duration={3}
            pathColor="#gray"
            gradientStartColor="#4285F4"
            gradientStopColor="#000000"
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={div2Ref}
            toRef={div4Ref}
            curvature={0}
            duration={3}
            pathColor="#gray"
            gradientStartColor="#000000"
            gradientStopColor="#000000"
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={div3Ref}
            toRef={div4Ref}
            curvature={-50}
            endYOffset={10}
            duration={3}
            pathColor="#gray"
            gradientStartColor="#25D366"
            gradientStopColor="#000000"
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={div5Ref}
            toRef={div4Ref}
            curvature={50}
            endYOffset={-10}
            reverse
            duration={3}
            pathColor="#gray"
            gradientStartColor="#000000"
            gradientStopColor="#34A853"
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={div6Ref}
            toRef={div4Ref}
            curvature={0}
            reverse
            duration={3}
            pathColor="#gray"
            gradientStartColor="#000000"
            gradientStopColor="#EA4335"
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={div7Ref}
            toRef={div4Ref}
            curvature={-50}
            endYOffset={10}
            reverse
            duration={3}
            pathColor="#gray"
            gradientStartColor="#000000"
            gradientStopColor="#0084FF"
        />
        </div>
    </div>
  );
};

export default AnimatedBeamShowcase;
