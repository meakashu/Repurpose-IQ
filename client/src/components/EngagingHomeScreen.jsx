import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaBrain, FaChartLine, FaFlask, FaPills } from 'react-icons/fa';
import gsap from 'gsap';

// Custom SplitText implementation
const createSplitText = (element, options) => {
  if (!element) return { chars: [] };
  const text = element.textContent;
  const chars = text.split('').map((char) => {
    const span = document.createElement('span');
    span.className = options.charsClass || 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.willChange = 'transform';
    return span;
  });
  
  element.innerHTML = '';
  chars.forEach(char => element.appendChild(char));
  
  return { chars };
};

export default function EngagingHomeScreen({ onGetStarted }) {
  const textBlockRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize animated text
    if (textBlockRef.current) {
      const paragraph = textBlockRef.current.querySelector('p');
      if (!paragraph) return;

      try {
        const st = createSplitText(paragraph, { 
          type: "chars", 
          charsClass: "char" 
        });

        st.chars.forEach((char) => {
          const originalText = char.textContent;
          char.setAttribute('data-content', originalText);
        });

        const handlePointerMove = (e) => {
          st.chars.forEach((char) => {
            const rect = char.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
              const originalText = char.getAttribute('data-content');
              const duration = 1.2 - dist / 100;
              
              // Create scramble effect
              const scrambleChars = ".:0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
              let scrambleText = originalText;
              let iterations = 0;
              const maxIterations = 10;
              
              const scrambleInterval = setInterval(() => {
                scrambleText = originalText.split('').map((ch, i) => {
                  if (ch === ' ' || ch === '\u00A0') return ch;
                  if (iterations < maxIterations) {
                    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                  }
                  return originalText[i];
                }).join('');
                
                char.textContent = scrambleText;
                iterations++;
                
                if (iterations >= maxIterations) {
                  clearInterval(scrambleInterval);
                  char.textContent = originalText;
                }
              }, duration * 100 / maxIterations);
              
              // Animate scale
              gsap.to(char, {
                overwrite: true,
                duration: duration,
                scale: 1.2,
                ease: 'power2.out',
                onComplete: () => {
                  gsap.to(char, {
                    duration: 0.3,
                    scale: 1,
                    ease: 'power2.in'
                  });
                }
              });
            }
          });
        };

        textBlockRef.current.addEventListener('pointermove', handlePointerMove);

        return () => {
          textBlockRef.current?.removeEventListener('pointermove', handlePointerMove);
        };
      } catch (error) {
        console.warn('Text animation initialization failed:', error);
      }
    }
  }, []);

  // Enhanced animated background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const particles = [];
    const particleCount = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.color = `hsl(${Math.random() * 60 + 200}, 70%, ${Math.random() * 30 + 50}%)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
      gradient.addColorStop(0.5, 'rgba(10, 10, 30, 0.9)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections with gradient
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const opacity = 0.2 * (1 - distance / 200);
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y,
              otherParticle.x, otherParticle.y
            );
            gradient.addColorStop(0, particle.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla'));
            gradient.addColorStop(1, otherParticle.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla'));
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const features = [
    { icon: FaBrain, title: '9 AI Agents', desc: 'Specialized intelligence for every need', color: 'from-blue-500 to-cyan-500' },
    { icon: FaChartLine, title: 'Real-time Data', desc: 'Live market and patent insights', color: 'from-purple-500 to-pink-500' },
    { icon: FaRocket, title: 'Fast Analysis', desc: 'Get answers in seconds', color: 'from-orange-500 to-red-500' },
    { icon: FaFlask, title: 'Smart Insights', desc: 'AI-powered recommendations', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden engaging-bg">
      {/* Enhanced Animated Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Animated Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-block"
            ref={textBlockRef}
            style={{
              margin: '0',
              maxWidth: '100%',
              fontFamily: '"Space Mono", monospace',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: 'clamp(16px, 4vw, 40px)',
              color: '#fff',
            }}
          >
            <p>
              Welcome to RepurposeIQ - where artificial intelligence meets pharmaceutical innovation. 
              Discover hidden opportunities, analyze market trends, and accelerate drug repurposing 
              with our cutting-edge multi-agent system. Transform your research workflow with real-time 
              insights and predictive analytics.
            </p>
          </motion.div>

          {/* Right Side - Features & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl rounded-2xl`}
                    />
                    <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 h-full">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                        <Icon className="text-white text-xl" />
                      </div>
                      <h3 className="text-white font-semibold mb-2 text-lg">{feature.title}</h3>
                      <p className="text-white/70 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg flex items-center justify-center gap-3 shadow-2xl transition-all duration-300"
            >
              <FaRocket />
              <span>Get Started</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Floating particles overlay */}
      <div className="fixed inset-0 pointer-events-none z-[5]">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
