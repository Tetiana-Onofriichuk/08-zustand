import css from "./Home.module.css";
import { Metadata } from "next";

const NotFound = () => {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFound;

export const metadata: Metadata = {
  title: "Page Not Found | Notes App",
  description:
    "The page you are looking for does not exist. Please check the URL or return to the homepage.",
  openGraph: {
    title: "Page Not Found | Notes App",
    description:
      "This page does not exist. Discover more features and create notes on our homepage.",
    url: `https://08-zustand-phi-three.vercel.app`,
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "404 - NoteHub",
      },
    ],
    type: "website",
  },
};
