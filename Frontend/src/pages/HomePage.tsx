import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center space-y-8 bg-white">
      <div className="background-color-home resposive-big-container flex flex-wrap justify-between items-center min-h-dvh">
        <div className="flex flex-col space-y-10 w-full sm:w-2/5 items-center sm:items-start sm:text-left text-center">
          <h1 className="heading-extrabig font-bold">
            AI-powered intelligent market analysis
          </h1>
          <h2 className="heading-2">
            Explore data, spot opportunities, and make decisions with insight.
          </h2>
          <Link to="/catalog" className="main-button button-text">
            Learn more
          </Link>
        </div>
        <div className=" w-full sm:w-auto flex justify-center">
          <div className=" w-70 h-70 md:w-90 md:h-90 lg:w-110 lg:h-110 xl:w-130 xl:h-130">
            <DotLottieReact
              src="https://lottie.host/45c511b2-0fa0-4806-a155-89beed5bfa2a/hQyIWuxp4R.lottie"
              loop
              autoplay
            />
          </div>
        </div>
      </div>
    </div>
  );
}
