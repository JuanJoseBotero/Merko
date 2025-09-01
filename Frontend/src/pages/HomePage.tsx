import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center h-screen space-y-8">
      <div className="background-color-home flex flex-row w-full h-dvw items-center justify-around">
        <div className="flex flex-col space-y-10 w-2/5 ">
          <h1 className="text-8xl font-bold">
            AI-powered intelligent market analysis
          </h1>
          <h2 className="text-3xl">
            Explore data, spot opportunities, and make decisions with insight.
          </h2>
          <Link to="/about" className="main-button button-text">Learn more</Link>
        </div>
        <div className="w-130 h-130">
          <DotLottieReact
            src="https://lottie.host/45c511b2-0fa0-4806-a155-89beed5bfa2a/hQyIWuxp4R.lottie"
            loop
            autoplay
          />
        </div>
      </div>
    </div>
  );
}
