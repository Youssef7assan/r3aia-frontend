export const metadata = {
  title: "لوحة التحكم | رعاية",
  description: "لوحة تحكم الأدمن لمنصة رعاية",
};

export default function AdminLayout({ children }) {
  // Admin dashboard has its own full-screen layout — no Navbar or Footer
  return <>{children}</>;
}
