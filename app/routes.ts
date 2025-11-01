import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
route("aboutus", "routes/aboutUs.tsx"),
route("services", "routes/services.tsx"),

] satisfies RouteConfig;
