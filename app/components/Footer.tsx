export default function Footer() {
  return (
    <footer className="bg-deep-green text-cream-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-serif font-bold mb-4">Ruby Tea</h3>
          <p className="mb-2">Panchatiya Akhara, Gaya Bihar 823001</p>
          <p className="mb-4">
            Phone: <a href="tel:9631321029" className="hover:text-gold transition-colors">9631321029</a> |
            <a href="tel:7277173643" className="hover:text-gold transition-colors ml-2">7277173643</a>
          </p>
          <p className="text-sm">&copy; 2024 Ruby Tea. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
