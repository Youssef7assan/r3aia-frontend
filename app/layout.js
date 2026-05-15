import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";

export const metadata = {
  title: "رعاية | منصة الرعاية الصحية الخيرية",
  description:
    "رعاية - منصة خيرية لتقديم الرعاية الصحية المجانية للمرضى المحتاجين في مصر. استشارات طبية مجانية، توصيل أدوية، وفرص للتطوع.",
  keywords:
    "رعاية صحية, خيرية, مصر, استشارة طبية مجانية, توصيل أدوية, تطوع",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
