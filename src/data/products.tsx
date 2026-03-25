import React from 'react';
import { Layout, Cpu, Globe, ShieldCheck, Zap, Database } from 'lucide-react';

export interface Product {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  downloadUrl?: string;
  content: string;
}

export const products: Product[] = [
  { 
    id: 'cashier', 
    title: 'نظام الكاشير الذكي', 
    desc: 'إدارة كاملة للمبيعات والمخازن والتقارير المالية بدقة عالية.', 
    icon: <Layout className="text-cyan-400" />, 
    downloadUrl: 'https://example.com/download/cashier.exe',
    content: 'هذا النظام مصمم خصيصاً للمحلات التجارية والمطاعم، حيث يوفر واجهة سهلة الاستخدام لإدارة المبيعات اليومية، تتبع المخزون، وإصدار الفواتير الضريبية المتوافقة مع القوانين المحلية. يتميز النظام بالسرعة والقدرة على العمل دون اتصال بالإنترنت.' 
  },
  { 
    id: 'erp', 
    title: 'برامج إدارة الشركات', 
    desc: 'حلول برمجية مخصصة لتنظيم سير العمل في المؤسسات والشركات.', 
    icon: <Cpu className="text-purple-400" />, 
    downloadUrl: 'https://example.com/download/erp-suite.exe',
    content: 'نظام متكامل لإدارة الموارد البشرية، الحسابات، والمشاريع. يساعد الشركات على أتمتة العمليات الإدارية وتقليل الأخطاء البشرية، مع توفير تقارير تحليلية دقيقة لمتخذي القرار.' 
  },
  { 
    id: 'apps', 
    title: 'تطبيقات الكمبيوتر', 
    desc: 'مجموعة من الأدوات والبرامج المكتبية والخدمية المتطورة.', 
    icon: <Globe className="text-cyan-400" />, 
    downloadUrl: 'https://example.com/download/tools-pack.zip',
    content: 'نقدم مجموعة واسعة من البرامج الخدمية التي تسهل العمل اليومي على أجهزة الكمبيوتر، بدءاً من أدوات تنظيم الملفات وصولاً إلى برامج الحماية والنسخ الاحتياطي المتطورة.' 
  },
  // أضف منتجات جديدة هنا بنفس التنسيق أعلاه
];
