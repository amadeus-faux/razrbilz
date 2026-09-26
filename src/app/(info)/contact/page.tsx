import ContactForm from "./ContactForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  path: "/contact",
  title: "Contact Us",
  description:
    "Questions about sizing, stock or an order? Message the RAZRBILZ studio in Bandung Barat, Indonesia — open Monday to Friday, 09:00–17:00 WIB.",
});

export default function ContactPage() {
  return <ContactForm />;
}
