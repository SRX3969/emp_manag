import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://valuable-aardvark-358.convex.cloud";

export const convex = new ConvexReactClient(convexUrl);
