export default function Footer() {
  return (
    <footer className="bg-navy text-white/70 mt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="text-white font-semibold mb-3">Get to know us</h4>
          <ul className="space-y-2">
            <li>About ShopNest</li>
            <li>Careers</li>
            <li>Press releases</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Connect with us</h4>
          <ul className="space-y-2">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>X (Twitter)</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Let us help you</h4>
          <ul className="space-y-2">
            <li>Your orders</li>
            <li>Returns & refunds</li>
            <li>Help center</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Payments</h4>
          <ul className="space-y-2">
            <li>Secured by Razorpay</li>
            <li>UPI, Cards & Netbanking</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} ShopNest. Built for demo purposes.
      </div>
    </footer>
  )
}
