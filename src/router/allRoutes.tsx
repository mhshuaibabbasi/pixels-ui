import Home from "@/pages/Home";

interface AppRoute {
  label: string;
  path: string;
  element: React.ReactNode;
  protected?: boolean;
}

const RoutesList: AppRoute[] = [
  { label: "home", path: "/", element: <Home /> },
];

export default RoutesList;
