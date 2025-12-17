import { motion } from 'framer-motion';
import { FaMicrophone, FaImage, FaFile, FaBrain, FaRocket } from 'react-icons/fa';

export default function FeatureShowcase() {
  const features = [
    {
      icon: FaMicrophone,
      title: 'Voice Input',
      desc: 'Speak your queries naturally',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: FaImage,
      title: 'Image Analysis',
      desc: 'Upload and analyze documents',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: FaFile,
      title: 'File Upload',
      desc: 'Process PDFs and documents',
      color: 'from-pink-400 to-pink-600'
    },
    {
      icon: FaBrain,
      title: 'AI Agents',
      desc: '9 specialized AI agents',
      color: 'from-indigo-400 to-indigo-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {features.map((feature, idx) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-card-strong p-4 rounded-2xl group cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <Icon className="text-white text-xl" />
            </div>
            <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
            <p className="text-white/70 text-xs">{feature.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

