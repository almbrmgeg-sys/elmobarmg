/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Download, 
  MessageCircle, 
  ShieldCheck, 
  Layout, 
  Cpu, 
  Globe, 
  Mail, 
  Menu, 
  X,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Fix for gray-matter in browser
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

import { products as productsData } from './data/products';
import { articles as articlesData } from './data/articles';

// --- Three.js Background Component ---
const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(200, 50, 0x06b6d4, 0x022c33);
    gridHelper.position.y = -5;
    scene.add(gridHelper);

    // Floating Cubes
    const cubes: THREE.Mesh[] = [];
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x06b6d4, 
      transparent: true, 
      opacity: 0.6,
      wireframe: true 
    });

    for (let i = 0; i < 20; i++) {
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(
        (Math.random() - 0.5) * 40,
        Math.random() * 20,
        (Math.random() - 0.5) * 40
      );
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(cube);
      cubes.push(cube);
    }

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 5, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 5, 50);
    purpleLight.position.set(-10, 5, -10);
    scene.add(purpleLight);

    camera.position.z = 15;
    camera.position.y = 2;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      cubes.forEach((cube, i) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
      });

      particlesMesh.rotation.y += 0.001;
      
      // Smooth camera movement based on mouse
      camera.position.x += (mouseX.current * 0.05 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY.current * 0.05 + 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    const mouseX = { current: 0 };
    const mouseY = { current: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.current = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10 bg-black" />;
};

// --- UI Components ---

const Navbar = ({ activePage, setActivePage }: { activePage: string, setActivePage: (p: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ['الرئيسية', 'المنتجات', 'المقالات', 'اتصل بنا'];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center glass px-6 py-3 neon-border">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActivePage('الرئيسية')}>
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.8)]">
            <Cpu className="text-black" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter neon-text">المبرمج سوفت وير</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActivePage(item)}
              className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                activePage === item ? 'text-cyan-400' : 'text-gray-400'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <button 
            className="neon-button text-sm"
            onClick={() => setActivePage('اتصل بنا')}
          >
            اتصل بنا
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-cyan-400" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 glass p-6 flex flex-col gap-4 neon-border"
          >
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActivePage(item);
                  setIsOpen(false);
                }}
                className={`text-lg font-medium text-left ${
                  activePage === item ? 'text-cyan-400' : 'text-gray-400'
                }`}
              >
                {item}
              </button>
            ))}
            <button 
              className="neon-button w-full mt-2"
              onClick={() => {
                setActivePage('اتصل بنا');
                setIsOpen(false);
              }}
            >
              اتصل بنا
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl"
    >
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
        أفضل برامج <br />
        <span className="neon-text">الكاشير والكمبيوتر</span>
      </h1>
      <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
        نقدم حلولاً برمجية متكاملة لإدارة المبيعات ونقاط البيع (كاشير) بالإضافة إلى مجموعة واسعة من برامج الكمبيوتر المتطورة لتلبية احتياجات أعمالكم.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        <button className="neon-button flex items-center gap-2 group">
          <Download size={20} />
          تحميل الآن
          <ChevronRight size={16} className="group-hover:-translate-x-1 transition-transform rotate-180" />
        </button>
        <button className="neon-button-purple flex items-center gap-2 group">
          <ShieldCheck size={20} />
          شراء الترخيص
        </button>
      </div>
    </motion.div>

    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <span className="text-xs uppercase tracking-widest text-cyan-500/50">قم بالتمرير للاستكشاف</span>
      <div className="w-px h-12 bg-gradient-to-b from-cyan-500 to-transparent" />
    </motion.div>
  </div>
);

const Products = ({ onSelectProduct }: { onSelectProduct: (p: any) => void }) => {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold mb-16 text-center">منتجاتنا <span className="neon-text">المميزة</span></h2>
      <div className="grid md:grid-cols-3 gap-8">
        {productsData.map((p, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="glass p-8 neon-border flex flex-col gap-4 group"
          >
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {p.icon}
            </div>
            <h3 className="text-xl font-bold">{p.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            <button 
              onClick={() => onSelectProduct(p)}
              className="mt-4 text-cyan-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              اقرأ المزيد <ChevronRight size={14} className="rotate-180" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProductDetail = ({ product, onBack }: { product: any, onBack: () => void }) => (
  <div className="py-24 px-6 max-w-4xl mx-auto">
    <button 
      onClick={onBack}
      className="mb-8 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
    >
      <ChevronRight size={20} />
      العودة للمنتجات
    </button>
    
    <div className="glass p-12 neon-border">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8">
        {product.icon}
      </div>
      <h1 className="text-4xl font-bold mb-6">{product.title}</h1>
      <div className="w-20 h-1 bg-cyan-500 mb-8 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
      <p className="text-gray-300 text-lg leading-relaxed mb-8">
        {product.content}
      </p>
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h4 className="font-bold mb-2 text-cyan-400">المميزات الرئيسية</h4>
          <ul className="text-sm text-gray-400 flex flex-col gap-2">
            <li>• واجهة مستخدم عصرية وسهلة</li>
            <li>• دعم فني متواصل 24/7</li>
            <li>• تحديثات دورية مجانية</li>
          </ul>
        </div>
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h4 className="font-bold mb-2 text-purple-400">لماذا تختارنا؟</h4>
          <p className="text-sm text-gray-400">نحن نضمن لك جودة البرمجيات واستقرارها مع توفير تدريب كامل لفريق عملك.</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mt-12">
        <button 
          className="neon-button flex-1 flex items-center justify-center gap-2"
          onClick={() => product.downloadUrl && window.open(product.downloadUrl, '_blank')}
        >
          <Download size={20} />
          تحميل البرنامج الآن
        </button>
        <button 
          className="neon-button-purple flex-1 flex items-center justify-center gap-2"
          onClick={() => {
            const message = encodeURIComponent(`السلام عليكم، أريد طلب النسخة الكاملة من برنامج: ${product.title}`);
            window.open(`https://wa.me/201515049844?text=${message}`, '_blank');
          }}
        >
          <MessageCircle size={20} />
          اطلب نسخة كاملة
        </button>
      </div>
    </div>
  </div>
);

const Blog = ({ onSelectArticle }: { onSelectArticle: (a: any) => void }) => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const loaded = await Promise.all(articlesData.map(async (ref) => {
          const res = await fetch(`/articles/${ref.file}`);
          const text = await res.text();
          const { data, content } = matter(text);
          return { ...data, content, id: ref.id };
        }));
        setArticles(loaded);
      } catch (err) {
        console.error("Error loading articles:", err);
      }
    };

    loadArticles();
  }, []);

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold mb-16 text-center">مقالات <span className="neon-text">تقنية</span></h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="glass overflow-hidden neon-border group cursor-pointer"
            onClick={() => onSelectArticle(article)}
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={article.image || "https://picsum.photos/seed/blog/800/400"} 
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-cyan-400 mb-3 uppercase tracking-widest">
                <BookOpen size={12} />
                <span>{article.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">{article.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-3 mb-4">{article.excerpt}</p>
              <span className="text-cyan-400 text-sm font-bold flex items-center gap-1">
                اقرأ المقال <ChevronRight size={14} className="rotate-180" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const BlogDetail = ({ article, onBack }: { article: any, onBack: () => void }) => (
  <div className="py-24 px-6 max-w-4xl mx-auto">
    <button 
      onClick={onBack}
      className="mb-8 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
    >
      <ChevronRight size={20} />
      العودة للمقالات
    </button>
    
    <article className="glass p-8 md:p-12 neon-border">
      <img 
        src={article.image} 
        alt={article.title} 
        className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
        referrerPolicy="no-referrer"
      />
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <span>بواسطة: {article.author}</span>
        <span>•</span>
        <span>{article.date}</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{article.title}</h1>
      
      {article.downloadUrl && (
        <div className="mb-12 p-6 glass neon-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <Download className="text-cyan-400" size={24} />
            </div>
            <div>
              <h4 className="font-bold">رابط التحميل المباشر</h4>
              <p className="text-xs text-gray-500">نسخة آمنة ومفحوصة ضد الفيروسات</p>
            </div>
          </div>
          <button 
            className="neon-button whitespace-nowrap"
            onClick={() => window.open(article.downloadUrl, '_blank')}
          >
            تحميل البرنامج
          </button>
        </div>
      )}

      {/* --- مكان إعلان أدسنس (اختياري) --- */}
      {/* 
      <div className="my-10 p-4 border border-dashed border-gray-800 rounded-lg text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">إعلان أدسنس</p>
        <div className="bg-white/5 h-24 flex items-center justify-center text-gray-700 text-xs italic">
          سيظهر الإعلان هنا بعد تفعيل كود أدسنس
        </div>
      </div>
      */}

      <div className="markdown-body prose prose-invert max-w-none">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </article>
  </div>
);

const Contact = () => (
  <div className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
    <div>
      <h2 className="text-4xl font-bold mb-6">تواصل <span className="neon-text">معنا</span></h2>
      <p className="text-gray-400 mb-8">هل لديك أسئلة أو تحتاج إلى دعم فني؟ فريقنا متاح على مدار الساعة لمساعدتك في العالم الرقمي.</p>
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 group relative">
          <div className="w-10 h-10 glass flex items-center justify-center neon-border">
            <Mail className="text-cyan-400" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">البريد الإلكتروني</p>
            <p className="font-medium">almbrmg.eg@gmail.com</p>
          </div>
          <span className="absolute -top-8 right-0 bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            البريد الإلكتروني
          </span>
        </div>
        <div className="flex items-center gap-4 group relative">
          <div className="w-10 h-10 glass flex items-center justify-center neon-border">
            <MessageCircle className="text-green-400" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">واتساب</p>
            <p className="font-medium">01515049844</p>
          </div>
          <span className="absolute -top-8 right-0 bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            واتساب
          </span>
        </div>
      </div>

      <div className="mt-12 flex gap-4">
        <button 
          className="w-10 h-10 glass flex items-center justify-center hover:bg-cyan-500/20 transition-colors group relative"
          onClick={() => window.open('https://www.facebook.com/dev.Alexandria/', '_blank')}
        >
          <Facebook size={18} className="text-blue-500" />
          <span className="absolute -top-8 bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            فيسبوك
          </span>
        </button>
        <button className="w-10 h-10 glass flex items-center justify-center hover:bg-cyan-500/20 transition-colors group relative">
          <Twitter size={18} />
          <span className="absolute -top-8 bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            تويتر
          </span>
        </button>
        <button className="w-10 h-10 glass flex items-center justify-center hover:bg-cyan-500/20 transition-colors group relative">
          <Github size={18} />
          <span className="absolute -top-8 bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            جيت هاب
          </span>
        </button>
        <button className="w-10 h-10 glass flex items-center justify-center hover:bg-cyan-500/20 transition-colors group relative">
          <Linkedin size={18} />
          <span className="absolute -top-8 bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            لينكد إن
          </span>
        </button>
      </div>
    </div>

    <div className="glass p-8 neon-border">
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="الاسم" className="bg-white/5 border border-white/10 p-3 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" />
          <input type="email" placeholder="البريد الإلكتروني" className="bg-white/5 border border-white/10 p-3 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" />
        </div>
        <input type="text" placeholder="الموضوع" className="bg-white/5 border border-white/10 p-3 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors" />
        <textarea placeholder="الرسالة" rows={4} className="bg-white/5 border border-white/10 p-3 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors resize-none"></textarea>
        <button className="neon-button w-full">إرسال الرسالة</button>
      </form>
    </div>
  </div>
);

const Footer = () => (
  <footer className="py-12 px-6 border-t border-white/5 glass mt-24">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <Cpu className="text-cyan-400" size={20} />
        <span className="font-bold tracking-tighter">المبرمج سوفت وير</span>
      </div>
      <p className="text-gray-500 text-xs uppercase tracking-widest">© 2026 المبرمج سوفت وير. جميع الحقوق محفوظة في الميتافيرس.</p>
      <div className="flex gap-4">
        <button 
          className="text-gray-500 hover:text-blue-500 transition-colors group relative"
          onClick={() => window.open('https://www.facebook.com/dev.Alexandria/', '_blank')}
        >
          <Facebook size={16} />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            فيسبوك
          </span>
        </button>
        <button className="text-gray-500 hover:text-cyan-400 transition-colors group relative">
          <Twitter size={16} />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            تويتر
          </span>
        </button>
        <button className="text-gray-500 hover:text-cyan-400 transition-colors group relative">
          <Github size={16} />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            جيت هاب
          </span>
        </button>
      </div>
      <div className="flex gap-6">
        <button className="text-xs text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-widest">سياسة الخصوصية</button>
        <button className="text-xs text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-widest">شروط الخدمة</button>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [activePage, setActivePage] = useState('الرئيسية');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  // Scroll to top when page changes or product/article selected
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, selectedProduct, selectedArticle]);

  return (
    <div className="relative min-h-screen" dir="rtl">
      <div className="scanline" />
      <ThreeBackground />
      
      <Navbar activePage={activePage} setActivePage={(p) => {
        setActivePage(p);
        setSelectedProduct(null);
        setSelectedArticle(null);
      }} />

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {selectedProduct ? (
            <motion.div
              key="product-detail"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ProductDetail 
                product={selectedProduct} 
                onBack={() => setSelectedProduct(null)} 
              />
            </motion.div>
          ) : selectedArticle ? (
            <motion.div
              key="article-detail"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <BlogDetail 
                article={selectedArticle} 
                onBack={() => setSelectedArticle(null)} 
              />
            </motion.div>
          ) : (
            <>
              {activePage === 'الرئيسية' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Hero />
                  <Products onSelectProduct={setSelectedProduct} />
                </motion.div>
              )}

              {activePage === 'المنتجات' && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Products onSelectProduct={setSelectedProduct} />
                </motion.div>
              )}

              {activePage === 'المقالات' && (
                <motion.div
                  key="blog"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Blog onSelectArticle={setSelectedArticle} />
                </motion.div>
              )}

              {activePage === 'اتصل بنا' && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Contact />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Floating WhatsApp Button */}
      <button 
        className="fixed bottom-8 left-8 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:scale-110 transition-transform z-50 group"
        onClick={() => window.open('https://wa.me/201515049844', '_blank')}
      >
        <MessageCircle className="text-white" size={28} />
        <span className="absolute left-16 bg-black/80 backdrop-blur px-3 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          تحدث معنا
        </span>
      </button>
    </div>
  );
}
