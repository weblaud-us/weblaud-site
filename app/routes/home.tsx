import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "WebLaud - Your Digital Partner" },
    {
      name: "description",
      content: "WebLaud - Professional web development and digital solutions",
    },
  ];
}

export default function Home() {
  return <Welcome />;
}
