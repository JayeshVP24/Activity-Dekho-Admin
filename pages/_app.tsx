import GlobalStateProvider from "@/components/GlobalStateProvider";
import "@/styles/globals.css";
import { Raleway } from "@next/font/google";
import type { AppProps } from "next/app";
const poppins = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${poppins.variable} font-sans`} >
      <GlobalStateProvider>
        <Component {...pageProps} />
      </GlobalStateProvider>
    </div>
  );
}
