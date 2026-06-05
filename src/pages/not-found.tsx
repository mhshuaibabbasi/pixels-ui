import { Link } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-neon">
          <Zap className="text-primary w-10 h-10 fill-primary" />
        </div>
        
        <h1 className="text-8xl font-display font-bold text-white mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-300 mb-6">Page Not Found</h2>
        
        <p className="text-gray-400 mb-10 leading-relaxed">
          The node you're looking for doesn't exist on this network. It might have been moved or deleted.
        </p>

        <Link
          to="/"
          className="btn-gradient inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Network
        </Link>
      </motion.div>
    </div>
  );
}
