import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: About Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">MediTest BD</h3>
          <p className="text-sm text-muted-foreground">
            Your trusted platform to find and compare medical test prices across hospitals in Bangladesh.
            Make informed decisions for your healthcare needs.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline" prefetch={false}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/browse-tests" className="hover:underline" prefetch={false}>
                Browse Tests
              </Link>
            </li>
            <li>
              <Link href="/browse-hospitals" className="hover:underline" prefetch={false}>
                Browse Hospitals
              </Link>
            </li>
            <li>
              <Link href="/compare" className="hover:underline" prefetch={false}>
                Compare Tests
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/contact" className="hover:underline" prefetch={false}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline" prefetch={false}>
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:underline" prefetch={false}>
                Help Center
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal & Social (Placeholder) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy" className="hover:underline" prefetch={false}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline" prefetch={false}>
                Terms of Service
              </Link>
            </li>
          </ul>
          {/* Social links can be added here */} 
        </div>
      </div>

      <div className="container text-center text-sm text-muted-foreground mt-8 pt-8 border-t border-border">
        &copy; {new Date().getFullYear()} MediTest BD. All rights reserved.
      </div>
    </footer>
  );
}
