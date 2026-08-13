const APPLE_APP_SITE_ASSOCIATION = {
  applinks: {
    apps: [],
    details: [
      {
        appID: "25CT3W85BU.com.safediet.app",
        components: [
          {
            "/": "/orders/*/tracking",
          },
        ],
      },
    ],
  },
};

export function GET() {
  return Response.json(APPLE_APP_SITE_ASSOCIATION, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
