export const backGroundColor = "#FFFFFF";
export const themeColor = "#ABE5F7";

export const manifest = (env: "PreProd" | "Local" | "" = ``) => ({
  short_name: `w3notif${env}`,
  name: `w3notif App${!env ? "" : " " + env}`,
  icons: [
    {
      src: `icons/l192m.png`,
      type: `image/png`,
      sizes: `192x192`,
      purpose: "maskable",
    },
    {
      src: `icons/l512m.png`,
      type: `image/png`,
      sizes: `512x512`,
      purpose: "maskable",
    },
    {
      src: `icons/l192.png`,
      type: `image/png`,
      sizes: `192x192`,
    },
    {
      src: `icons/l512.png`,
      type: `image/png`,
      sizes: `512x512`,
    },
  ],
  id: `/?source=pwa`,
  start_url: `/?source=pwa`,
  background_color: backGroundColor,
  display: `standalone`,
  scope: `/`,
  theme_color: themeColor,
  description: `w3notif Web App for Members (dashboards)`,
});
