"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Plus,
  Mic,
  Zap,
  ArrowRight,
  Download,
  FileJson,
  FileCode,
  CheckCircle,
  Cpu,
  Activity,
  ShieldAlert,
  AlertCircle,
  RefreshCw,
  Search,
  History as HistoryIcon,
  Moon,
  Sun,
  Layout as LayoutIcon,
  Trash2,
  Copy,
  ChevronRight,
  Database,
  Shield,
  Eye,
  Globe,
  Code,
  List,
  Award,
  Users,
  BookOpen,
  Layers,
  Terminal,
  Sparkles,
  Check,
  CheckSquare,
  MessageSquare,
  Heart,
  Share2,
  Settings,
  ExternalLink,
  HelpCircle,
  Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import JSZip from "jszip";
import yaml from "js-yaml";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Multi-language translation dictionaries
const translations: Record<string, Record<string, string>> = {
  en: {
    heroTitle: "Turn your ideas into ready-to-use apps",
    heroSubtitle: "The fastest way to build full-stack software from natural language. Describe your vision, and we'll handle the architecture and code.",
    placeholder: "Describe the app you want to build...",
    refinePlaceholder: "Ask for refinements...",
    apps: "Apps",
    agents: "Superagents",
    compilerHealth: "Compiler Health",
    qualityScore: "Quality Score",
    downloadBundle: "Download Project Bundle",
    addonsTitle: "Intelligent Add-ons",
    scaleTitle: "Everything you need to scale",
    scaleSubtitle: "Powerful tools for the next generation of software.",
    feature1Title: "Systemic Compiler",
    feature1Desc: "Not just a chat—a multi-stage pipeline that validates architecture before writing code.",
    feature2Title: "Full-Stack Export",
    feature2Desc: "Download clean React, FastAPI, and SQL code. No vendor lock-in, ever.",
    feature3Title: "Superagent Core",
    feature3Desc: "Build autonomous agents that can use tools and make decisions.",
    feature4Title: "Enterprise Security",
    feature4Desc: "Role-based access control and secure-by-default patterns generated automatically.",
    feature5Title: "Real-time Sync",
    feature5Desc: "Live preview and instant updates as you refine your application idea.",
    feature6Title: "Global Deployment",
    feature6Desc: "One-click deployment to Vercel, Railway, and AWS.",
    processTitle: "From idea to production in minutes.",
    step1Title: "Describe",
    step1Desc: "Explain your business logic and requirements in plain English.",
    step2Title: "Architect",
    step2Desc: "Our compiler designs the database, API, and UI schemas.",
    step3Title: "Ship",
    step3Desc: "Download your full-stack bundle or deploy with one click.",
    pricingTitle: "Plans from first idea to full scale",
    pricingSubtitle: "Start for free. Upgrade when you're ready.",
    startBuilding: "Start Building"
  },
  fr: {
    heroTitle: "Transformez vos idées en applications prêtes à l'emploi",
    heroSubtitle: "Le moyen le plus rapide de concevoir des logiciels full-stack à partir du langage naturel. Décrivez votre vision, nous gérons l'architecture et le code.",
    placeholder: "Décrivez l'application que vous souhaitez créer...",
    refinePlaceholder: "Demander des ajustements...",
    apps: "Applications",
    agents: "Superagents",
    compilerHealth: "Santé du Compilateur",
    qualityScore: "Score de Qualité",
    downloadBundle: "Télécharger le pack projet",
    addonsTitle: "Extensions Intelligentes",
    scaleTitle: "Tout ce dont vous avez besoin pour évoluer",
    scaleSubtitle: "Des outils puissants pour la prochaine génération de logiciels.",
    feature1Title: "Compilateur Systémique",
    feature1Desc: "Pas seulement un chat—un pipeline multi-étapes qui valide l'architecture avant d'écrire le code.",
    feature2Title: "Export Full-Stack",
    feature2Desc: "Téléchargez du code React, FastAPI et SQL propre. Pas de verrouillage fournisseur.",
    feature3Title: "Cœur Superagent",
    feature3Desc: "Créez des agents autonomes capables d'utiliser des outils et de prendre des décisions.",
    feature4Title: "Sécurité Entreprise",
    feature4Desc: "Contrôle d'accès basé sur les rôles et modèles sécurisés par défaut générés automatiquement.",
    feature5Title: "Synchro Temps Réel",
    feature5Desc: "Aperçu en direct et mises à jour instantanées à mesure que vous affinez votre idée d'application.",
    feature6Title: "Déploiement Global",
    feature6Desc: "Déploiement en un clic sur Vercel, Railway et AWS.",
    processTitle: "De l'idée à la production en quelques minutes.",
    step1Title: "Décrire",
    step1Desc: "Expliquez votre logique métier et vos exigences en français simple.",
    step2Title: "Architecturer",
    step2Desc: "Notre compilateur conçoit la base de données, l'API et les schémas de l'interface utilisateur.",
    step3Title: "Déployer",
    step3Desc: "Téléchargez votre package full-stack ou déployez en un clic.",
    pricingTitle: "Des plans de la première idée à la pleine échelle",
    pricingSubtitle: "Commencez gratuitement. Mettez à niveau quand vous êtes prêt.",
    startBuilding: "Commencer à bâtir"
  },
  pt: {
    heroTitle: "Transforme suas ideias em aplicativos prontos para uso",
    heroSubtitle: "A maneira mais rápida de criar software full-stack a partir de linguagem natural. Descreva sua visão e nós cuidamos da arquitetura e do código.",
    placeholder: "Descreva o aplicativo que deseja construir...",
    refinePlaceholder: "Solicitar refinamentos...",
    apps: "Aplicativos",
    agents: "Superagentes",
    compilerHealth: "Saúde do Compilador",
    qualityScore: "Pontuação de Qualidade",
    downloadBundle: "Baixar Pacote do Projeto",
    addonsTitle: "Extensões Inteligentes",
    scaleTitle: "Tudo o que você precisa para escalar",
    scaleSubtitle: "Ferramentas poderosas para a próxima geração de software.",
    feature1Title: "Compilador Sistêmico",
    feature1Desc: "Não apenas um bate-papo — um pipeline de vários estágios que valida a arquitetura antes de escrever o código.",
    feature2Title: "Exportação Full-Stack",
    feature2Desc: "Baixe código React, FastAPI e SQL limpo. Sem bloqueio de fornecedor, nunca.",
    feature3Title: "Núcleo de Superagentes",
    feature3Desc: "Construa agentes autônomos que podem usar ferramentas e tomar decisões.",
    feature4Title: "Segurança Corporativa",
    feature4Desc: "Controle de acesso baseado em funções e padrões seguros por padrão gerados automaticamente.",
    feature5Title: "Sincronização em Tempo Real",
    feature5Desc: "Visualização ao vivo e atualizações instantâneas enquanto você refina sua ideia de aplicativo.",
    feature6Title: "Implantação Global",
    feature6Desc: "Implantação com um clique para Vercel, Railway e AWS.",
    processTitle: "Da ideia à produção em minutos.",
    step1Title: "Descreva",
    step1Desc: "Explique sua lógica de negócios e requisitos em português claro.",
    step2Title: "Arquitetar",
    step2Desc: "Nosso compilador projeta os esquemas de banco de dados, API e interface do usuário.",
    step3Title: "Enviar",
    step3Desc: "Baixe seu pacote completo ou implante com um clique.",
    pricingTitle: "Planos desde a primeira ideia até a escala completa",
    pricingSubtitle: "Comece gratuitamente. Atualize quando estiver pronto.",
    startBuilding: "Começar a Construir"
  },
  ja: {
    heroTitle: "アイデアをすぐに使えるアプリに変換",
    heroSubtitle: "自然言語からフルスタックのソフトウェアを構築する最速の方法。ビジョンを説明するだけで、アーキテクチャとコードの生成はAIが処理します。",
    placeholder: "構築したいアプリについて説明してください...",
    refinePlaceholder: "調整を依頼する...",
    apps: "アプリ",
    agents: "スーパーエージェント",
    compilerHealth: "コンパイラのヘルス状態",
    qualityScore: "品質スコア",
    downloadBundle: "プロジェクトバンドルをダウンロード",
    addonsTitle: "インテリジェントアドオン",
    scaleTitle: "スケールに必要なすべてがここに",
    scaleSubtitle: "次世代のソフトウェア開発を支える強力なツール。",
    feature1Title: "システムコンパイラ",
    feature1Desc: "単なるチャットではなく、コードを書く前にアーキテクチャを検証するマルチステージパイプライン。",
    feature2Title: "フルスタックエクスポート",
    feature2Desc: "クリーンなReact、FastAPI、SQLコードをダウンロード。ベンダーロックインは一切ありません。",
    feature3Title: "スーパーエージェントコア",
    feature3Desc: "ツールを使用し、自律的に意思決定を行えるAIエージェントを構築。",
    feature4Title: "エンタープライズセキュリティ",
    feature4Desc: "ロールベースのアクセス制御とセキュア・バイ・デフォルトパターンを自動生成。",
    feature5Title: "リアルタイム同期",
    feature5Desc: "アプリのアイデアを洗練させながら、リアルタイムでプレビューと同期を行います。",
    feature6Title: "グローバルデプロイ",
    feature6Desc: "Vercel、Railway、AWSへのワンクリックデプロイメント。",
    processTitle: "数分でアイデアから本番環境へ。",
    step1Title: "説明する",
    step1Desc: "ビジネスロジックと要件を普通の言葉で説明します。",
    step2Title: "設計する",
    step2Desc: "コンパイラがデータベース、API、UIのスキーマを設計します。",
    step3Title: "出荷する",
    step3Desc: "フルスタックのコードをダウンロードするか、ワンクリックでデプロイします。",
    pricingTitle: "最初のアイデアから本格的なスケールまでカバーするプラン",
    pricingSubtitle: "まずは無料でスタート。準備ができたらアップグレード。",
    startBuilding: "構築を開始する"
  },
  de: {
    heroTitle: "Verwandeln Sie Ihre Ideen in fertige Apps",
    heroSubtitle: "Der schnellste Weg, Full-Stack-Software aus natürlicher Sprache zu bauen. Beschreiben Sie Ihre Vision, wir erledigen Architektur und Code.",
    placeholder: "Beschreiben Sie die App, die Sie bauen möchten...",
    refinePlaceholder: "Verfeinerungen anfordern...",
    apps: "Apps",
    agents: "Superagenten",
    compilerHealth: "Compiler-Gesundheit",
    qualityScore: "Qualitätsbewertung",
    downloadBundle: "Projekt-Paket herunterladen",
    addonsTitle: "Intelligente Add-ons",
    scaleTitle: "Alles, was Sie zum Skalieren brauchen",
    scaleSubtitle: "Leistungsstarke Tools für die nächste Software-Generation.",
    feature1Title: "Systemischer Compiler",
    feature1Desc: "Nicht nur ein Chat – eine mehrstufige Pipeline, die die Architektur validiert, bevor Code geschrieben wird.",
    feature2Title: "Full-Stack Export",
    feature2Desc: "Laden Sie sauberen React-, FastAPI- und SQL-Code herunter. Kein Vendor-Lock-in, jemals.",
    feature3Title: "Superagenten-Kern",
    feature3Desc: "Bauen Sie autonome Agenten, die Werkzeuge nutzen und Entscheidungen treffen können.",
    feature4Title: "Unternehmenssicherheit",
    feature4Desc: "Rollenbasierte Zugriffskontrolle und standardmäßig sichere Muster werden automatisch generiert.",
    feature5Title: "Echtzeit-Synchronisierung",
    feature5Desc: "Live-Vorschau und sofortige Updates, während Sie Ihre App-Idee verfeinern.",
    feature6Title: "Globale Bereitstellung",
    feature6Desc: "Ein-Klick-Bereitstellung auf Vercel, Railway und AWS.",
    processTitle: "In wenigen Minuten von der Idee zur Produktion.",
    step1Title: "Beschreiben",
    step1Desc: "Erklären Sie Ihre Geschäftslogik und Anforderungen in einfachem Deutsch.",
    step2Title: "Architektur",
    step2Desc: "Unser Compiler entwirft die Datenbank-, API- und UI-Schemata.",
    step3Title: "Versenden",
    step3Desc: "Laden Sie Ihr Full-Stack-Bundle herunter oder stellen Sie es mit einem Klick bereit.",
    pricingTitle: "Tarife von der ersten Idee bis zur vollen Skalierung",
    pricingSubtitle: "Kostenlos starten. Upgraden, wenn Sie bereit sind.",
    startBuilding: "Mit dem Bau beginnen"
  },
  es: {
    heroTitle: "Convierta sus ideas en aplicaciones listas para usar",
    heroSubtitle: "La forma más rápida de crear software full-stack a partir de lenguaje natural. Describa su visión y nosotros nos encargamos de la arquitectura y el código.",
    placeholder: "Describa la aplicación que desea construir...",
    refinePlaceholder: "Solicitar refinamientos...",
    apps: "Aplicaciones",
    agents: "Superagentes",
    compilerHealth: "Salud del Compilador",
    qualityScore: "Puntaje de Calidad",
    downloadBundle: "Descargar paquete del proyecto",
    addonsTitle: "Complementos Inteligentes",
    scaleTitle: "Todo lo que necesita para escalar",
    scaleSubtitle: "Herramientas potentes para la próxima generación de software.",
    feature1Title: "Compilador Sistémico",
    feature1Desc: "No es solo un chat: una canalización de varias etapas que valida la arquitectura antes de escribir el código.",
    feature2Title: "Exportación Full-Stack",
    feature2Desc: "Descargue código React, FastAPI y SQL limpio. Sin bloqueos de proveedores, nunca.",
    feature3Title: "Núcleo de Superagente",
    feature3Desc: "Construya agentes autónomos que puedan usar herramientas y tomar decisiones.",
    feature4Title: "Seguridad Empresarial",
    feature4Desc: "Control de acceso basado en roles y patrones seguros por defecto generados automáticamente.",
    feature5Title: "Sincronización en Tiempo Real",
    feature5Desc: "Vista previa en vivo y actualizaciones instantáneas mientras refina su idea de aplicación.",
    feature6Title: "Despliegue Global",
    feature6Desc: "Despliegue en un clic en Vercel, Railway y AWS.",
    processTitle: "De la idea a la producción en minutos.",
    step1Title: "Describir",
    step1Desc: "Explique sus requisitos y lógica de negocio en español sencillo.",
    step2Title: "Arquitectar",
    step2Desc: "Nuestro compilador diseña la base de datos, la API y los esquemas de la interfaz de usuario.",
    step3Title: "Enviar",
    step3Desc: "Descargue su paquete full-stack o despliegue con un solo clic.",
    pricingTitle: "Planes desde la primera idea hasta la escala completa",
    pricingSubtitle: "Comience gratis. Actualice cuando esté listo.",
    startBuilding: "Comenzar a Construir"
  },
  it: {
    heroTitle: "Trasforma le tue idee in app pronte all'uso",
    heroSubtitle: "Il modo più veloce per creare software full-stack a partire dal linguaggio naturale. Descrivi la tua visione, noi gestiamo l'architettura e il codice.",
    placeholder: "Descrivi l'app che desideri compilare...",
    refinePlaceholder: "Richiedi perfezionamenti...",
    apps: "Applicazioni",
    agents: "Superagenti",
    compilerHealth: "Salute del Compilatore",
    qualityScore: "Punteggio di Qualità",
    downloadBundle: "Scarica il pacchetto del progetto",
    addonsTitle: "Componenti Aggiuntivi Intelligenti",
    scaleTitle: "Tutto ciò di cui hai bisogno per scalare",
    scaleSubtitle: "Strumenti potenti per la prossima generazione di software.",
    feature1Title: "Compilatore Sistemico",
    feature1Desc: "Non solo una chat: una pipeline multi-fase che valida l'architettura prima di scrivere il codice.",
    feature2Title: "Esportazione Full-Stack",
    feature2Desc: "Scarica codice React, FastAPI e SQL pulito. Nessun vincolo di fornitore, mai.",
    feature3Title: "Nucleo del Superagente",
    feature3Desc: "Crea agenti autonomi in grado di utilizzare strumenti e prendere decisioni.",
    feature4Title: "Sicurezza Enterprise",
    feature4Desc: "Controllo degli accessi basato sui ruoli e modelli sicuri generati automaticamente.",
    feature5Title: "Sincronizzazione in Tempo Reale",
    feature5Desc: "Anteprima live e aggiornamenti istantanei mentre perfezioni la tua idea di applicazione.",
    feature6Title: "Distribuzione Globale",
    feature6Desc: "Distribuzione in un clic su Vercel, Railway e AWS.",
    processTitle: "Dall'idea alla produzione in pochi minuti.",
    step1Title: "Descrivere",
    step1Desc: "Spiega la logica di business e i requisiti in italiano semplice.",
    step2Title: "Progettare",
    step2Desc: "Il nostro compilatore progetta il database, le API e gli schemi della UI.",
    step3Title: "Rilasciare",
    step3Desc: "Scarica il pacchetto completo o distribuisci con un clic.",
    pricingTitle: "Piani dalla prima idea all'intera scala",
    pricingSubtitle: "Inizia gratuitamente. Aggiorna quando sei pronto.",
    startBuilding: "Inizia a Costruire"
  }
};

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "ja", label: "日本語" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" }
];

const comparisonFeatures = [
  {
    category: "Core Building",
    name: "Natural Language App Builder",
    standardBuilder: true,
    appforge: true,
    detail: "Synthesize functional frontends and routes from simple English descriptions."
  },
  {
    category: "Core Building",
    name: "AI Website Generator",
    standardBuilder: true,
    appforge: true,
    detail: "Generate responsive landing pages, portfolios, and marketing sites instantly."
  },
  {
    category: "Core Building",
    name: "AI App Playground Sandbox",
    standardBuilder: true,
    appforge: true,
    detail: "Run, test, and iterate on generated apps in an interactive live-running sandbox."
  },
  {
    category: "Core Building",
    name: "Auto-Generated UI Components",
    standardBuilder: true,
    appforge: true,
    detail: "Clean, accessible, responsive components pre-styled and mapped to business logic."
  },
  {
    category: "Backend & Storage",
    name: "Relational Database Auto-Provisioner",
    standardBuilder: true,
    appforge: true,
    detail: "Generate Postgres schemas, link tables, and auto-generate insert/delete web endpoints."
  },
  {
    category: "Backend & Storage",
    name: "User Authentication & Sign-in Modals",
    standardBuilder: true,
    appforge: true,
    detail: "Fully functional JWT authentication, role selection (admin/editor), and login modals out of the box."
  },
  {
    category: "Backend & Storage",
    name: "Real-time Database Inspector",
    standardBuilder: false,
    appforge: true,
    detail: "Inspect live database tables, insert mock data records, and trace storage sync changes visually. Exclusive to AppForge sandbox."
  },
  {
    category: "Backend & Storage",
    name: "Role-Based Permissions & Invitations",
    standardBuilder: true,
    appforge: true,
    detail: "Invite members to workspaces with custom roles (Viewer, Developer, Administrator) and seat checks."
  },
  {
    category: "AI & Agents",
    name: "Multi-Model AI Selection Center",
    standardBuilder: false,
    appforge: true,
    detail: "Choose between Gemini 1.5 Pro, Claude 3.5 Sonnet, and GPT-4o to power code generation and logic planning."
  },
  {
    category: "AI & Agents",
    name: "24/7 Autonomous Superagents",
    standardBuilder: false,
    appforge: true,
    detail: "Provision autonomous agents that can trigger workflows, fetch tools, and run indefinitely in the background."
  },
  {
    category: "Output & Deployment",
    name: "One-Click Deploy & Hosting Cluster",
    standardBuilder: true,
    appforge: true,
    detail: "Instant publishing with automated serverless edge hosting and dynamic preview tunnels."
  },
  {
    category: "Output & Deployment",
    name: "Full-Stack Source Code Export",
    standardBuilder: false,
    appforge: true,
    detail: "Download standard zip bundles containing clean React (Next.js), FastAPI (Python), and raw PostgreSQL migrations. No vendor lock-in."
  },
  {
    category: "Output & Deployment",
    name: "Custom Domains SSL Bindings",
    standardBuilder: true,
    appforge: true,
    detail: "Connect custom web domains and automatically provision Let's Encrypt SSL certificates."
  },
  {
    category: "Output & Deployment",
    name: "GitHub Two-Way Sync",
    standardBuilder: true,
    appforge: true,
    detail: "Simultaneous repo syncing, commit logging, and git branch binding directly from the browser."
  },
  {
    category: "Integrations",
    name: "One-Click App Integrations Hub",
    standardBuilder: true,
    appforge: true,
    detail: "Instant connections to Slack, Gmail, Notion, Salesforce, Google Calendar, and HubSpot."
  },
  {
    category: "Dev Features",
    name: "Interactive Live Terminal Analytics",
    standardBuilder: false,
    appforge: true,
    detail: "Real-time latency spikes tracking, daily active users graphs, and consumption charts rendered inside SVGs."
  },
  {
    category: "Dev Features",
    name: "Unified CLI & Local IDE Sync",
    standardBuilder: false,
    appforge: true,
    detail: "Sync offline changes, download environments, and run localized compilers via standard terminal packages."
  }
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("db");
  const [result, setResult] = useState<any>(null);
  const [stage, setStage] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false); // Controls Deep Navy vs Obsidian Black
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("apps");
  const [planMode, setPlanMode] = useState(true);
  const [discussionMode, setDiscussionMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  
  // Custom states for newly integrated AppForge features
  const [selectedModel, setSelectedModel] = useState("gemini-flash");
  const [locale, setLocale] = useState("en");
  const [copiedPromo, setCopiedPromo] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showOwnershipModal, setShowOwnershipModal] = useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  const [compareCategory, setCompareCategory] = useState("All");
  
  // Interactive Sandbox visualizer simulator states
  const [testingApi, setTestingApi] = useState<string | null>(null);
  const [apiTestResponse, setApiTestResponse] = useState<string | null>(null);
  const [selectedAuthRole, setSelectedAuthRole] = useState("editor");
  const [selectedUiBlock, setSelectedUiBlock] = useState<string | null>(null);

  // Detailed Interactive Roadmap Kanban state populated from screenshots
  const [roadmapCards, setRoadmapCards] = useState<any[]>([
    // Backlog Column
    { id: "backlog-1", title: "Ability to NOT use credits for fixing items you've already asked it to do.", commentsCount: 47, upvotes: 1500, category: "Feature Request", status: "backlog", comments: ["Yes! This is highly annoying.", "Agreed, we should only pay for new iterations!"] },
    { id: "backlog-2", title: "Adsense", commentsCount: 52, upvotes: 965, category: "Feature Request", status: "backlog", comments: ["Need to monetize my blogs.", "Adsense is essential for stores."] },
    { id: "backlog-3", title: "Embedded PDF Viewer", commentsCount: 8, upvotes: 733, category: "Feature Request", status: "backlog", comments: ["Would love to show user reports.", "Agreed! Inline display is crucial."] },
    { id: "backlog-4", title: "Feature Request: Root-level sw.js Hosting for Enhanced Push Notifications", commentsCount: 3, upvotes: 589, category: "Feature Request", status: "backlog", comments: ["Service worker support is key.", "Essential for PWAs!"] },
    { id: "backlog-5", title: "Higher Security and EU Data Residence", commentsCount: 34, upvotes: 544, category: "Feature Request", status: "backlog", comments: ["GDPR requires EU hosting.", "Compliance is a blocker for my company."] },
    { id: "backlog-6", title: "Option to Top Up Monthly Messages/Integration Credits without having to Upgrade", commentsCount: 20, upvotes: 428, category: "Feature Request", status: "backlog", comments: ["I run out of credits 10 days before renewals.", "Top ups would save me money."] },
    { id: "backlog-7", title: "SELL THE APP ON GOOGLE & APPLE APP STORES", commentsCount: 0, upvotes: 321, category: "Feature Request", status: "backlog", comments: [] },
    { id: "backlog-8", title: "Give AppForge the right tools to create native apps using Expo", commentsCount: 6, upvotes: 312, category: "Feature Request", status: "backlog", comments: ["Expo is great for cross-platform.", "This would allow native layout exports!"] },
    { id: "backlog-9", title: "Automatic Landing page creation for Apps", commentsCount: 17, upvotes: 291, category: "Feature Request", status: "backlog", comments: ["A landing page makes launching much faster."] },
    { id: "backlog-10", title: "PDF preview", commentsCount: 4, upvotes: 263, category: "Feature Request", status: "backlog", comments: [] },

    // Next Up Column
    { id: "nextup-1", title: "Give the options to export to github the code with api's backend", commentsCount: 18, upvotes: 1400, category: "Feature Request", status: "nextup", comments: ["Need full source backend control.", "This makes AppForge an amazing backend builder!"] },
    { id: "nextup-2", title: "Feature Request: Native Push Notifications Support", commentsCount: 165, upvotes: 1100, category: "Feature Request", status: "nextup", comments: ["Notifications will boost user activity.", "Looking forward to webhook notifications!"] },
    { id: "nextup-3", title: "Customize the invitation email of users to my app", commentsCount: 10, upvotes: 353, category: "Feature Request", status: "nextup", comments: [] },
    { id: "nextup-4", title: "Support for Tracking Pixels (Meta Pixel, GTM, Google Analytics)", commentsCount: 22, upvotes: 295, category: "Feature Request", status: "nextup", comments: ["Crucial for analytics."] },
    { id: "nextup-5", title: "Push notifications", commentsCount: 5, upvotes: 277, category: "Feature Request", status: "nextup", comments: [] },

    // In Progress Column
    { id: "inprogress-1", title: "Customized login/sign-up modal", commentsCount: 191, upvotes: 1900, category: "Feature Request", status: "inprogress", comments: ["Highly requested feature for custom brands.", "Can't wait to edit branding on auth."] },
    { id: "inprogress-2", title: "Make Unused Monthly Messages & Integration Credits Rollover to the next month", commentsCount: 33, upvotes: 1800, category: "Feature Request", status: "inprogress", comments: ["Rollovers would make builder plans highly premium.", "Agreed! It makes spending fair."] },
    { id: "inprogress-3", title: "Better White Label experience for applications", commentsCount: 101, upvotes: 1200, category: "Feature Request", status: "inprogress", comments: [] },
    { id: "inprogress-4", title: "Add multi-language/localization capacities", commentsCount: 14, upvotes: 710, category: "Feature Request", status: "inprogress", comments: [] },
    { id: "inprogress-5", title: "Hybrid apps authentication support", commentsCount: 89, upvotes: 628, category: "Feature Request", status: "inprogress", comments: [] },
    { id: "inprogress-6", title: "Importing designs from Figma", commentsCount: 9, upvotes: 479, category: "Feature Request", status: "inprogress", comments: ["Will save UI design time."] },
    { id: "inprogress-7", title: "We need EU-Hosting", commentsCount: 9, upvotes: 165, category: "Feature Request", status: "inprogress", comments: [] },
    { id: "inprogress-8", title: "Branches", commentsCount: 1, upvotes: 28, category: "Feature Request", status: "inprogress", comments: [] },

    // Done Column
    { id: "done-1", title: "Mobile App Creation", commentsCount: 49, upvotes: 1300, category: "Feature Request", status: "done", priority: "High Priority", date: "Feb 2", comments: ["Incredibly useful! Expo exports work beautifully.", "Works like a charm on iOS testflight."] },
    { id: "done-2", title: "Custom domain on emails sent from AppForge", commentsCount: 24, upvotes: 1100, category: "Feature Request", status: "done", comments: [] },
    { id: "done-3", title: "Adding the option to upload app to the app store or google play", commentsCount: 84, upvotes: 832, category: "Feature Request", status: "done", comments: [] },
    { id: "done-4", title: "Add CSV file integration", commentsCount: 6, upvotes: 787, category: "Feature Request", status: "done", comments: [] },
    { id: "done-5", title: "Two-way github integration", commentsCount: 9, upvotes: 538, category: "Feature Request", status: "done", comments: [] },
    { id: "done-6", title: "Baked In Payment Solution, no more Stripe payment setup pain", commentsCount: 4, upvotes: 498, category: "Feature Request", status: "done", comments: [] },
    { id: "done-7", title: "Integration to Google Services", commentsCount: 6, upvotes: 495, category: "Feature Request", status: "done", comments: [] },
    { id: "done-8", title: "Generic Payment solution using BE function", commentsCount: 24, upvotes: 459, category: "Feature Request", status: "done", comments: [] },
    { id: "done-9", title: "Adding integration after application creation", commentsCount: 4, upvotes: 410, category: "Feature Request", status: "done", comments: [] },
    { id: "done-10", title: "Error fixing should not cost credits", commentsCount: 12, upvotes: 357, category: "Feature Request", status: "done", comments: [] },
    { id: "done-11", title: "Allow Users to Sign Up Using Methods Other Than Google", commentsCount: 18, upvotes: 332, category: "Feature Request", status: "done", comments: [] }
  ]);

  // Card details modal states
  const [selectedRoadmapCard, setSelectedRoadmapCard] = useState<any | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  // Submit request modal states
  const [showSubmitRequestModal, setShowSubmitRequestModal] = useState(false);
  const [newRequestTitle, setNewRequestTitle] = useState("");
  const [newRequestDesc, setNewRequestDesc] = useState("");
  const [newRequestCol, setNewRequestCol] = useState("backlog");

  const [integrationStatus, setIntegrationStatus] = useState<Record<string, string>>({
    slack: "disconnected",
    gmail: "disconnected",
    notion: "disconnected",
    hubspot: "disconnected",
    salesforce: "disconnected",
    calendar: "disconnected"
  });

  // Fully Functional Sandbox Extension States (Resolving the Cross-Features)
  const [dbRecords, setDbRecords] = useState<any[]>([
    { id: "rec-1", name: "Alice Johnson", email: "alice@company.com", role: "admin", joined: "2026-05-12" },
    { id: "rec-2", name: "Bob Smith", email: "bob@company.com", role: "developer", joined: "2026-05-14" },
    { id: "rec-3", name: "Charlie Davis", email: "charlie@company.com", role: "viewer", joined: "2026-05-20" }
  ]);
  const [newRecordName, setNewRecordName] = useState("");
  const [newRecordEmail, setNewRecordEmail] = useState("");
  const [newRecordRole, setNewRecordRole] = useState("developer");

  const [domainName, setDomainName] = useState("");
  const [domainStatus, setDomainStatus] = useState("unbound"); // unbound | binding | bound
  const [domainInput, setDomainInput] = useState("");

  const [githubRepoName, setGithubRepoName] = useState("my-organization/my-appforge-app");
  const [githubBranch, setGithubBranch] = useState("main");
  const [githubSyncState, setGithubSyncState] = useState("synchronized"); // synchronized | syncing | idle
  const [githubCommits, setGithubCommits] = useState<any[]>([
    { sha: "8f3e2b9", author: "AppForge Compiler", msg: "feat: Auto-synthesized relational tables & models", time: "10 mins ago" },
    { sha: "ca2b8f1", author: "AppForge Compiler", msg: "build: Integrated auth rules & route controllers", time: "25 mins ago" },
    { sha: "e9d2c18", author: "Anonymous Builder", msg: "refine: Modified dashboard layouts & elements", time: "1 hour ago" }
  ]);

  const [teamInvites, setTeamInvites] = useState<any[]>([
    { email: "owner@company.com", role: "Owner", status: "Active" },
    { email: "lead-dev@company.com", role: "Developer", status: "Active" }
  ]);
  const [inviteEmailInput, setInviteEmailInput] = useState("");
  const [inviteRoleInput, setInviteRoleInput] = useState("developer");

  const [deployState, setDeployState] = useState("idle"); // idle | deploying | deployed
  const [deployUrl, setDeployUrl] = useState("");

  const [previewUserLoggedIn, setPreviewUserLoggedIn] = useState(false);
  const [previewUserEmail, setPreviewUserEmail] = useState("");
  const [showPreviewLoginModal, setShowPreviewLoginModal] = useState(false);
  const [previewPasswordInput, setPreviewPasswordInput] = useState("");

  // Load history and theme preferences
  useEffect(() => {
    const savedHistory = localStorage.getItem("appforge_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedTheme = localStorage.getItem("appforge_theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-theme");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("appforge_theme", newTheme ? "dark" : "light");
    if (newTheme) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  };

  const handleGenerate = async (overidePrompt?: string) => {
    const currentPrompt = overidePrompt || prompt;
    if (!currentPrompt) return;
    
    setCurrentPage("home");
    setLoading(true);
    setPrompt(""); // Clear input after send
    
    const newUserMsg = { role: "user", content: currentPrompt, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    if (discussionMode) {
      try {
        const response = await axios.post(`${BACKEND_URL}/brainstorm`, { 
          prompt: currentPrompt,
          history: messages 
        });
        setMessages([...updatedMessages, { role: "assistant", content: response.data.response, timestamp: new Date().toISOString() }]);
      } catch (e) {
        setMessages([...updatedMessages, { role: "assistant", content: "Error in brainstorm mode.", type: "error" }]);
      } finally {
        setLoading(false);
      }
      return;
    }

    setStage(1);

    try {
      // Logic for stages (simulated compilation pipeline progress)
      const stages = [1, 2, 3];
      for (const s of stages) {
        setStage(s);
        await new Promise(r => setTimeout(r, 600));
      }

      // API Call to Backend Compiler with full context
      const response = await axios.post(`${BACKEND_URL}/generate`, { 
        prompt: currentPrompt,
        history: messages 
      });
      
      setResult(response.data);
      setStage(4);

      const errorCount = response.data.errors ? response.data.errors.length : 0;
      const aiResponse = `Generation complete using ${selectedModel.toUpperCase()}. I've architected your ${activeMode === "apps" ? "application" : "superagent"} successfully with ${errorCount} schema validation checks.`;
      setMessages([...updatedMessages, { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() }]);

      const newItem = { id: Date.now(), prompt: currentPrompt, result: response.data, timestamp: new Date().toISOString() };
      const newHistory = [newItem, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("appforge_history", JSON.stringify(newHistory));

      // Trigger automatic source code generation
      if (response.data?.data) {
        setCodeLoading(true);
        const codeRes = await axios.post(`${BACKEND_URL}/generate-code`, { schemas: response.data.data });
        setGeneratedCode(codeRes.data.data);
        setActiveTab("code");
        setCodeLoading(false);
      }
    } catch (error) {
      console.error("Compilation process failed", error);
      // Fallback response with simulated/cached schema state
      const fallbackPromptLower = currentPrompt.toLowerCase();
      
      let mockResult = {
        success: false,
        latency: 1.25,
        repairCount: 0,
        errors: ["System Warning: API connection refused. Auto-repaired using local cache."],
        data: {
          dbSchema: {
            tables: [
              { name: "users", columns: [{ name: "id", type: "uuid", primaryKey: true }, { name: "email", type: "string" }, { name: "role", type: "string" }] },
              { name: "projects", columns: [{ name: "id", type: "uuid", primaryKey: true }, { name: "name", type: "string" }, { name: "owner_id", type: "uuid", foreignKey: { table: "users" } }] }
            ]
          },
          apiSchema: {
            endpoints: [
              { path: "/api/auth/signup", method: "POST", description: "Registers user" },
              { path: "/api/projects", method: "GET", description: "Retrieves owner projects" }
            ]
          },
          uiSchema: {
            pages: [
              { route: "/dashboard", title: "Project Manager Workspace", layout: "grid", components: ["ProjectTable", "AddProjectModal", "NotificationToast"] }
            ]
          },
          authSchema: {
            roles: ["admin", "editor", "viewer"],
            rules: ["Only owner can delete project", "Admins have root control"]
          }
        }
      };

      let mockCode = {
        reactCode: `// Auto-generated Dashboard Component\nimport React from 'react';\n\nexport default function Dashboard() {\n  return (\n    <div className="p-8 bg-[#0a0a0f] text-white min-h-screen">\n      <h1 className="text-3xl font-bold border-b border-zinc-800 pb-4">Project Manager</h1>\n      <div className="grid grid-cols-3 gap-6 mt-8">\n        <div className="bg-[#181824] border border-zinc-800 rounded-xl p-6">\n          <h3>Active Projects</h3>\n          <p className="text-4xl text-orange-500 font-black mt-2">12</p>\n        </div>\n      </div>\n    </div>\n  );\n}`,
        apiCode: `# FastAPI Router Endpoint\nfrom fastapi import FastAPI, Depends\napp = FastAPI()\n\n@app.get("/api/projects")\ndef get_projects(user = Depends(get_current_user)):\n    return {"status": "success", "data": []}`,
        dbCode: `-- DB SQL Migration script\nCREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  role VARCHAR(50) DEFAULT 'user'\n);\n\nCREATE TABLE projects (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name VARCHAR(255) NOT NULL,\n  owner_id UUID REFERENCES users(id)\n);`
      };

      // Chatbot dynamic compiler
      if (fallbackPromptLower.includes("chatbot") || fallbackPromptLower.includes("assistant")) {
        mockResult.data = {
          dbSchema: {
            tables: [
              { name: "users", columns: [{ name: "id", type: "uuid", primaryKey: true }, { name: "email", type: "string" }] },
              { name: "chat_messages", columns: [{ name: "id", type: "uuid", primaryKey: true }, { name: "user_id", type: "uuid", foreignKey: { table: "users" } }, { name: "message", type: "text" }, { name: "response", type: "text" }] }
            ]
          },
          apiSchema: {
            endpoints: [
              { path: "/api/chat", method: "POST", description: "Send message to AI assistant" },
              { path: "/api/chat/history", method: "GET", description: "Get conversations log" }
            ]
          },
          uiSchema: {
            pages: [
              { route: "/chat", title: "AI Chatbot Workspace", layout: "flex", components: ["ChatWidget", "MessageInput", "HistorySidebar"] }
            ]
          },
          authSchema: {
            roles: ["admin", "editor", "viewer"],
            rules: ["Users can only view their own chat history", "Admins view all logs"]
          }
        };
        
        mockCode = {
          reactCode: `// Auto-generated React Chatbot Workspace\nimport React, { useState } from 'react';\n\nexport default function ChatbotWorkspace() {\n  const [messages, setMessages] = useState([\n    { role: 'bot', text: 'Hello! I am your AppForge AI Assistant. How can I help you today?' }\n  ]);\n  const [input, setInput] = useState('');\n\n  const handleSend = () => {\n    if (!input.trim()) return;\n    const newMsg = { role: 'user', text: input };\n    setMessages(prev => [...prev, newMsg]);\n    setInput('');\n    setTimeout(() => {\n      setMessages(prev => [...prev, { role: 'bot', text: 'Simulated AI Response: Your database connection is active!' }]);\n    }, 600);\n  };\n\n  return (\n    <div style={{ display: 'flex', flexDirection: 'column', height: '400px', background: '#12121a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>\n      <div style={{ background: 'var(--primary)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>\n        <strong>🤖 AppForge AI Assistant</strong>\n      </div>\n      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>\n        {messages.map((m, idx) => (\n          <div key={idx} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', padding: '0.5rem 0.85rem', borderRadius: '8px', maxWidth: '80%', fontSize: '0.8rem', color: '#ffffff' }}>\n            {m.text}\n          </div>\n        ))}\n      </div>\n      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.5rem' }}>\n        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0 0.5rem', color: '#ffffff', fontSize: '0.8rem' }} />\n        <button onClick={handleSend} style={{ background: 'var(--primary)', border: 'none', color: '#ffffff', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Send</button>\n      </div>\n    </div>\n  );\n}`,
          apiCode: `# FastAPI Chat Router\nfrom fastapi import FastAPI, Depends\napp = FastAPI()\n\n@app.post("/api/chat")\nasync def chat_interaction(prompt: str, user = Depends(get_current_user)):\n    return {"response": "Simulated AI Response: Query registered successfully.", "prompt": prompt}`,
          dbCode: `-- SQL Migration\nCREATE TABLE chat_messages (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES users(id),\n  message TEXT NOT NULL,\n  response TEXT NOT NULL\n);`
        };
      }
      // Analytics dynamic compiler
      else if (fallbackPromptLower.includes("analytics") || fallbackPromptLower.includes("dashboard") || fallbackPromptLower.includes("chart")) {
        mockResult.data = {
          dbSchema: {
            tables: [
              { name: "users", columns: [{ name: "id", type: "uuid", primaryKey: true }, { name: "email", type: "string" }] },
              { name: "analytics_events", columns: [{ name: "id", type: "uuid", primaryKey: true }, { name: "event_type", type: "string" }, { name: "user_id", type: "uuid", foreignKey: { table: "users" } }] }
            ]
          },
          apiSchema: {
            endpoints: [
              { path: "/api/analytics/metrics", method: "GET", description: "Retrieve active users, events metrics" },
              { path: "/api/analytics/track", method: "POST", description: "Log event activity tracking" }
            ]
          },
          uiSchema: {
            pages: [
              { route: "/analytics", title: "Metrics Analytics Dashboard", layout: "grid", components: ["MetricsGrid", "SVGCharts", "EventLogger"] }
            ]
          },
          authSchema: {
            roles: ["admin", "editor", "viewer"],
            rules: ["Viewers cannot view metrics logs", "Admins have full reset access"]
          }
        };

        mockCode = {
          reactCode: `// Auto-generated React Analytics Dashboard\nimport React from 'react';\n\nexport default function AnalyticsDashboard() {\n  return (\n    <div style={{ padding: '1rem', background: '#12121a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>\n      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>\n        <strong>📊 User Activity Analytics Dashboard</strong>\n        <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 6px', borderRadius: '4px' }}>Uptime 99.98%</span>\n      </div>\n      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>\n        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>\n          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Daily Active Users</span>\n          <h2 style={{ color: 'var(--primary)', fontWeight: 'black', fontSize: '1.5rem', marginTop: '0.25rem' }}>1,842</h2>\n        </div>\n        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>\n          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Average Server Latency</span>\n          <h2 style={{ color: '#8b5cf6', fontWeight: 'black', fontSize: '1.5rem', marginTop: '0.25rem' }}>24ms</h2>\n        </div>\n      </div>\n      <svg viewBox="0 0 300 100" style={{ width: '100%', height: '80px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>\n        <path d="M 0 80 Q 50 20, 100 60 T 200 10 T 300 40" fill="none" stroke="var(--primary)" strokeWidth="2" />\n        <path d="M 0 80 Q 50 20, 100 60 T 200 10 T 300 40 L 300 100 L 0 100 Z" fill="rgba(255,99,31,0.05)" />\n      </svg>\n    </div>\n  );\n}`,
          apiCode: `# FastAPI Analytics Router\nfrom fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/api/analytics/metrics")\nasync def get_metrics():\n    return {"daily_active_users": 1842, "avg_latency_ms": 24}`,
          dbCode: `-- SQL Migration\nCREATE TABLE analytics_events (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  event_type VARCHAR(255) NOT NULL,\n  user_id UUID REFERENCES users(id)\n);`
        };
      }
      // Notifs dynamic compiler
      else if (fallbackPromptLower.includes("notif") || fallbackPromptLower.includes("notification")) {
        mockResult.data = {
          dbSchema: {
            tables: [
              { name: "users", columns: [{ name: "id", type: "uuid", primaryKey: true }, { name: "email", type: "string" }] },
              { name: "notifications", columns: [{ name: "id", type: "uuid", primaryKey: true }, { name: "user_id", type: "uuid", foreignKey: { table: "users" } }, { name: "title", type: "string" }] }
            ]
          },
          apiSchema: {
            endpoints: [
              { path: "/api/notifications", method: "GET", description: "Retrieve user notifications feed" },
              { path: "/api/notifications/read", method: "POST", description: "Mark alert notification as read" }
            ]
          },
          uiSchema: {
            pages: [
              { route: "/alerts", title: "Notification Feed Center", layout: "flex", components: ["NotificationBell", "ActivityFeed", "ReadToggle"] }
            ]
          },
          authSchema: {
            roles: ["admin", "editor", "viewer"],
            rules: ["Anyone can read alerts notifications", "Admins trigger push notifications"]
          }
        };

        mockCode = {
          reactCode: `// Auto-generated React Notification Panel\nimport React, { useState } from 'react';\n\nexport default function NotificationPanel() {\n  const [alerts, setAlerts] = useState([\n    { id: 1, title: 'Database auto-backup active', unread: true },\n    { id: 2, title: 'Regional role assigned (Developer)', unread: true }\n  ]);\n\n  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, unread: false })));\n\n  return (\n    <div style={{ padding: '1rem', background: '#12121a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>\n      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>\n        <strong>🔔 Activity Notifications Center</strong>\n        {alerts.some(a => a.unread) && (\n          <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Mark all read</button>\n        )}\n      </div>\n      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>\n        {alerts.map(a => (\n          <div key={a.id} style={{ padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>\n            <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>{a.title}</span>\n            {a.unread && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />}\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}`,
          apiCode: `# FastAPI Notifications Router\nfrom fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/api/notifications")\nasync def get_alerts():\n    return [{"id": 1, "title": "Database backup completed", "is_read": False}]`,
          dbCode: `-- SQL Migration\nCREATE TABLE notifications (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES users(id),\n  title VARCHAR(255) NOT NULL\n);`
        };
      }
      // Payments dynamic compiler
      else if (fallbackPromptLower.includes("payment") || fallbackPromptLower.includes("stripe") || fallbackPromptLower.includes("billing")) {
        mockResult.data = {
          dbSchema: {
            tables: [
              { name: "users", columns: [{ name: "id", type: "uuid", primaryKey: true }, { name: "email", type: "string" }] },
              { name: "subscriptions", columns: [{ name: "id", type: "uuid", primaryKey: true }, { name: "user_id", type: "uuid", foreignKey: { table: "users" } }, { name: "stripe_customer_id", type: "string" }] }
            ]
          },
          apiSchema: {
            endpoints: [
              { path: "/api/payments/checkout", method: "POST", description: "Initialize Stripe checkout portal session" },
              { path: "/api/payments/webhook", method: "POST", description: "Listen to Stripe subscription callbacks" }
            ]
          },
          uiSchema: {
            pages: [
              { route: "/billing", title: "Billing & Subscriptions", layout: "grid", components: ["PricingTiers", "CheckoutCard", "TransactionsHistory"] }
            ]
          },
          authSchema: {
            roles: ["admin", "editor", "viewer"],
            rules: ["Billing adjustments restricted to Admins only", "JWT credentials required for checkout sessions"]
          }
        };

        mockCode = {
          reactCode: `// Auto-generated React Stripe Payments integration\nimport React, { useState } from 'react';\n\nexport default function PricingBilling() {\n  const [tier, setTier] = useState('Free Member');\n\n  return (\n    <div style={{ padding: '1.25rem', background: '#12121a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>\n      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>\n        <strong>💳 Subscriptions & Stripe Payments</strong>\n        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px', background: tier === 'PRO' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: tier === 'PRO' ? '#10b981' : 'var(--muted)', fontWeight: 700 }}>\n          {tier.toUpperCase()}\n        </span>\n      </div>\n      {tier === 'Free Member' ? (\n        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>\n          <h4 style={{ color: '#ffffff', fontSize: '0.95rem' }}>Upgrade to AppForge PRO</h4>\n          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0.5rem 0' }}>Get 2-way GitHub sync & active analytics tunnels for only $44/mo.</p>\n          <button onClick={() => setTier('PRO')} style={{ background: 'var(--primary)', border: 'none', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>Upgrade with Stripe</button>\n        </div>\n      ) : (\n        <div style={{ background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.15)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>\n          <h4 style={{ color: '#10b981', fontSize: '0.95rem' }}>✓ Active PRO Subscription</h4>\n          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0.5rem 0' }}>Linked with Stripe Customer: cus_StripeClient7b1</p>\n          <button onClick={() => setTier('Free Member')} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel subscription</button>\n        </div>\n      )}\n    </div>\n  );\n}`,
          apiCode: `# FastAPI Stripe Payments Webhook Router\nfrom fastapi import FastAPI\napp = FastAPI()\n\n@app.post("/api/payments/checkout")\nasync def checkout_session():\n    return {"checkout_url": "https://checkout.stripe.com/pay/session_AppForge7b1c"}`,
          dbCode: `-- SQL Migration\nCREATE TABLE subscriptions (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES users(id),\n  stripe_customer_id VARCHAR(255) NOT NULL\n);`
        };
      }

      setResult(mockResult);
      setStage(4);
      
      const aiResponse = `Generation completed. System fallback triggered successfully. Compiled ${fallbackPromptLower.includes("chatbot") ? "Chatbot Agent" : fallbackPromptLower.includes("analytics") ? "Analytics Engine" : fallbackPromptLower.includes("notif") ? "Notifications Router" : fallbackPromptLower.includes("payment") ? "Stripe Payments Portal" : "Project Manager"} schemas successfully.`;
      setMessages([...updatedMessages, { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() }]);

      setGeneratedCode(mockCode);
      setActiveTab("code");
    } finally {
      setLoading(false);
    }
  };

  const handleExportBlueprint = (format: 'json' | 'markdown') => {
    if (!result) return;
    
    let fileContent = "";
    let filename = "";
    
    if (format === 'json') {
      fileContent = JSON.stringify(result.data, null, 2);
      filename = `appforge-blueprint-${Date.now()}.json`;
    } else {
      // Synthesize a beautiful markdown architecture report
      const dbMarkdown = result.data.dbSchema.tables.map((t: any) => {
        const cols = t.columns.map((c: any) => `- **${c.name}** (${c.type})${c.primaryKey ? " [Primary Key]" : ""}${c.foreignKey ? ` [Foreign Key ➔ ${c.foreignKey.table}]` : ""}`).join("\n");
        return `### Table: ${t.name}\n${cols}`;
      }).join("\n\n");
      
      const apiMarkdown = result.data.apiSchema.endpoints.map((e: any) => `- **${e.method}** \`${e.path}\` - ${e.description}`).join("\n");
      const uiMarkdown = result.data.uiSchema.pages.map((p: any) => `### Page Route: \`${p.route}\` (${p.title})\nLayout structure: **${p.layout}**\nComponents generated:\n${p.components.map((c: any) => `- ${c}`).join("\n")}`).join("\n\n");
      const authMarkdown = `### User Roles Defined:\n${result.data.authSchema.roles.map((r: any) => `- ${r}`).join("\n")}\n\n### Access Control Policies:\n${result.data.authSchema.rules.map((rl: any) => `- ${rl}`).join("\n")}`;

      fileContent = `# AppForge Architectural Blueprint Report\n\nGenerated on: ${new Date().toLocaleString()}\n\n## 1. Database Model Schema (SQL)\n\n${dbMarkdown}\n\n## 2. API Schema Definitions\n\n${apiMarkdown}\n\n## 3. UI Schema & Layout Blueprints\n\n${uiMarkdown}\n\n## 4. Role-based Authentication & Access Policies\n\n${authMarkdown}\n\n\n*Generated by AppForge AI Compiler Playground.*`;
      filename = `appforge-architecture-report-${Date.now()}.md`;
    }
    
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    alert(`Successfully exported architectural blueprint as ${format.toUpperCase()}!`);
  };

  const handleDownloadZip = async () => {
    if (!result) return;
    const zip = new JSZip();
    
    // Add raw schemas
    zip.file("schemas/db.json", JSON.stringify(result.data.dbSchema, null, 2));
    zip.file("schemas/api.json", JSON.stringify(result.data.apiSchema, null, 2));
    zip.file("schemas/ui.json", JSON.stringify(result.data.uiSchema, null, 2));
    zip.file("schemas/auth.json", JSON.stringify(result.data.authSchema, null, 2));

    // Next.js Frontend Boilerplate Files
    zip.file("frontend/package.json", JSON.stringify({
      name: "appforge-frontend",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start"
      },
      dependencies: {
        next: "14.2.0",
        react: "^18",
        "react-dom": "^18",
        "lucide-react": "^0.300.0",
        axios: "^1.6.0"
      }
    }, null, 2));
    
    zip.file("frontend/src/app/layout.tsx", `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AppForge AI Generated Application",
  description: "Synthesized via AppForge AI Compiler Playground",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0a0a0f", color: "#ffffff", fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}`);

    zip.file("frontend/src/app/globals.css", `/* AppForge Standard Global CSS */
body {
  background-color: #0a0a0f;
  color: #ffffff;
}
.card {
  background: rgba(20, 20, 30, 0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
}`);

    if (generatedCode) {
      zip.file("frontend/src/app/page.tsx", generatedCode.reactCode);
    } else {
      zip.file("frontend/src/app/page.tsx", `// Auto-generated Dashboard Component
import React from 'react';

export default function Dashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>AppForge System Preview Workspace</h1>
      <p>Configure tables and backend APIs to synthesize dynamic component layouts.</p>
    </div>
  );
}`);
    }

    // FastAPI Backend Boilerplate Files
    zip.file("backend/requirements.txt", `fastapi==0.110.0
uvicorn==0.28.0
pydantic==2.6.4
sqlalchemy==2.0.28
sqlite3
`);

    zip.file("backend/database.py", `from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./appforge.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
`);

    if (generatedCode) {
      zip.file("backend/main.py", generatedCode.apiCode);
      zip.file("backend/migration.sql", generatedCode.dbCode);
    } else {
      zip.file("backend/main.py", `# FastAPI Backend Router
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "success", "message": "AppForge synthesized API engine running successfully."}
`);
    }

    // Orchestrator files
    zip.file("docker-compose.yml", `version: "3.8"
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
  backend:
    build: ./backend
    ports:
      - "8000:8000"
`);

    zip.file("README.md", `# AppForge AI Synthesized Application

This codebase was compiled and generated directly from your natural language description via the AppForge AI Compiler Playground.

## Codebase Structure
- **/frontend**: React Next.js application containing the synthesized responsive UI layouts.
- **/backend**: FastAPI (Python) web server with API router endpoints.
- **/schemas**: Raw JSON blueprints designed by the AppForge Compiler.

## How to Run Locally

### 1. Run Backend Server
\`\`\`bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
\`\`\`
The backend will run at: http://localhost:8000

### 2. Run Frontend Dev Server
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The frontend will run at: http://localhost:3000

---
*Synthesized beautifully with AppForge AI.*
`);

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appforge-project-${Date.now()}.zip`;
    a.click();
    alert("Full-stack Next.js + FastAPI project bundle exported successfully!");
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    alert("Copied directly to clipboard!");
  };

  const handleRoadmapUpvote = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop click from opening detail modal
    setRoadmapCards(prev => prev.map(card => {
      if (card.id === cardId) {
        const voted = card.hasVoted;
        return {
          ...card,
          upvotes: voted ? card.upvotes - 1 : card.upvotes + 1,
          hasVoted: !voted
        };
      }
      return card;
    }));
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedRoadmapCard) return;

    const updatedComments = [...selectedRoadmapCard.comments, newCommentText.trim()];
    
    // Update local card model immediately
    setSelectedRoadmapCard({
      ...selectedRoadmapCard,
      comments: updatedComments,
      commentsCount: updatedComments.length
    });

    // Update global cards list
    setRoadmapCards(prev => prev.map(card => {
      if (card.id === selectedRoadmapCard.id) {
        return {
          ...card,
          comments: updatedComments,
          commentsCount: updatedComments.length
        };
      }
      return card;
    }));

    setNewCommentText("");
  };

  const handleSubmitFeatureRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestTitle.trim()) return;

    const newCard = {
      id: `custom-request-${Date.now()}`,
      title: newRequestTitle,
      commentsCount: 0,
      upvotes: 1,
      category: "Feature Request",
      status: newRequestCol,
      comments: newRequestDesc.trim() ? [newRequestDesc.trim()] : [],
      hasVoted: true // Automatically upvote your own submission!
    };

    setRoadmapCards(prev => [newCard, ...prev]);
    setNewRequestTitle("");
    setNewRequestDesc("");
    setNewRequestCol("backlog");
    setShowSubmitRequestModal(false);
    
    alert("Thank you! Your feature request has been added directly to the Backlog column.");
  };

  const handleAddDbRecord = () => {
    if (!newRecordName.trim() || !newRecordEmail.trim()) return;
    const newRec = {
      id: `rec-${Date.now()}`,
      name: newRecordName.trim(),
      email: newRecordEmail.trim(),
      role: newRecordRole,
      joined: new Date().toISOString().split("T")[0]
    };
    setDbRecords(prev => [...prev, newRec]);
    setNewRecordName("");
    setNewRecordEmail("");
    alert("Record successfully stored inside sandbox database cluster!");
  };

  const handleDeleteDbRecord = (id: string) => {
    setDbRecords(prev => prev.filter(r => r.id !== id));
  };

  const handlePreviewUserLogin = () => {
    if (!previewUserEmail.trim()) return;
    setPreviewUserLoggedIn(true);
    setShowPreviewLoginModal(false);
    setPreviewPasswordInput("");
    alert(`Successfully authenticated preview session for user: ${previewUserEmail}`);
  };

  const handlePublishDeploy = () => {
    setDeployState("deploying");
    setTimeout(() => {
      setDeployState("deployed");
      setDeployUrl(`https://appforge-live-deploy.services/workspace-${Math.floor(1000 + Math.random() * 9000)}`);
      alert("Application built & published successfully! Bind a custom domain or copy the preview url.");
    }, 2000);
  };

  const handleDomainBind = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    setDomainStatus("binding");
    setTimeout(() => {
      setDomainStatus("bound");
      setDomainName(domainInput.trim().toLowerCase());
      alert(`Domain "${domainInput.toLowerCase()}" successfully routed! DNS propagation completed & SSL configured.`);
    }, 1500);
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmailInput.trim()) return;
    const newMember = {
      email: inviteEmailInput.trim(),
      role: inviteRoleInput === "developer" ? "Developer" : "Viewer",
      status: "Active"
    };
    setTeamInvites(prev => [...prev, newMember]);
    setInviteEmailInput("");
    alert(`Workspace seat invite successfully sent to ${newMember.email}!`);
  };

  const testConnection = (id: string) => {
    setTestingIntegration(id);
    setTimeout(() => {
      setIntegrationStatus(prev => ({ ...prev, [id]: "connected" }));
      setTestingIntegration(null);
    }, 1000);
  };

  const copyPromoToClipboard = () => {
    navigator.clipboard.writeText("APPFORGEDAY");
    setCopiedPromo(true);
    setPromoApplied(true);
    setTimeout(() => setCopiedPromo(false), 2000);
  };

  const t = translations[locale] || translations["en"];

  return (
    <main className={isDarkMode ? "dark-theme" : ""}>
      <div className="bg-mesh" />

      {/* TOP GLOWING PROMO BANNER */}
      <div className="promo-banner">
        <span className="promo-badge">PROMO</span>
        <span>🎉 <strong>AppForge Launch Day!</strong> Get 44% off your builder plans today using code <strong>APPFORGEDAY</strong>.</span>
        <button className="promo-copy-btn" onClick={copyPromoToClipboard}>
          {copiedPromo ? "Copied!" : "Copy Code"}
        </button>
        {promoApplied && <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.3)", padding: "1px 6px", borderRadius: 4 }}>44% Discount Active!</span>}
      </div>

      {/* HEADER NAVBAR */}
      <nav className="header container">
        <div className="logo" onClick={() => setCurrentPage("home")} style={{ cursor: "pointer" }}>
          <div className="logo-icon">44</div>
          <span>APPFORGE <span style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "black", letterSpacing: "0.05em", verticalAlign: "super" }}>AI</span></span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1.2rem", color: "var(--muted)", fontSize: "0.85rem", fontWeight: 600 }}>
            {/* PLATFORM MEGA MENU */}
            <div className="nav-item">
              Platform <ChevronRight size={14} style={{ transform: "rotate(90deg)", marginLeft: 4 }} />
              <div className="mega-menu">
                <div className="menu-grid">
                  <div>
                    <h4 style={{ color: "var(--primary)", marginBottom: "0.3rem", fontSize: "0.95rem" }}>Core Builder</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Natural language app building. Describe in plain English.</p>
                  </div>
                  <div>
                    <h4 style={{ color: "var(--primary)", marginBottom: "0.3rem", fontSize: "0.95rem" }}>Superagents</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Autonomous 24/7 agents connected to Notion, Slack, and calendars.</p>
                  </div>
                  <div>
                    <h4 style={{ color: "var(--primary)", marginBottom: "0.3rem", fontSize: "0.95rem" }}>Infrastructure</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Relational database clusters, built-in analytics, and instant hostings.</p>
                  </div>
                  <div>
                    <h4 style={{ color: "var(--primary)", marginBottom: "0.3rem", fontSize: "0.95rem" }}>Auto-UI Engine</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Beautiful responsive screens and pages synthesized dynamically.</p>
                  </div>
                </div>
              </div>
            </div>

            <span 
              onClick={() => setCurrentPage("marketplace")} 
              style={{ cursor: "pointer", color: currentPage === "marketplace" ? "var(--primary)" : "inherit" }}
            >
              Marketplace
            </span>

            <span 
              onClick={() => setCurrentPage("compare")} 
              style={{ 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: "0.25rem", 
                color: currentPage === "compare" ? "var(--primary)" : "inherit" 
              }}
            >
              Compare Scope <span className="feature-badge" style={{ fontSize: "0.6rem", padding: "1px 4px", background: "rgba(255,99,31,0.15)" }}>100%</span>
            </span>

            <span 
              onClick={() => setCurrentPage("roadmap")} 
              style={{ cursor: "pointer", color: currentPage === "roadmap" ? "var(--primary)" : "inherit" }}
            >
              Roadmap
            </span>

            <span 
              onClick={() => setCurrentPage("integrations")} 
              style={{ cursor: "pointer", color: currentPage === "integrations" ? "var(--primary)" : "inherit" }}
            >
              Integrations
            </span>

            <span 
              onClick={() => setCurrentPage("sdks")} 
              style={{ cursor: "pointer", color: currentPage === "sdks" ? "var(--primary)" : "inherit" }}
            >
              Developer SDKs
            </span>

            <span 
              onClick={() => setCurrentPage("pricing")} 
              style={{ cursor: "pointer", color: currentPage === "pricing" ? "var(--primary)" : "inherit" }}
            >
              Pricing
            </span>

            <span 
              onClick={() => setCurrentPage("enterprise")} 
              style={{ cursor: "pointer", color: currentPage === "enterprise" ? "var(--primary)" : "inherit" }}
            >
              Enterprise
            </span>

            <span 
              onClick={() => setCurrentPage("docs")} 
              style={{ cursor: "pointer", color: currentPage === "docs" ? "var(--primary)" : "inherit" }}
            >
              Docs
            </span>
          </div>

          {/* MULTI-LANGUAGE SELECTOR */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", padding: "0.3rem 0.6rem", borderRadius: "9999px" }}>
            <Globe size={14} color="var(--primary)" />
            <select 
              value={locale} 
              onChange={(e) => setLocale(e.target.value)}
              style={{ background: "transparent", border: "none", color: "#ffffff", fontSize: "0.75rem", fontWeight: 600, outline: "none", cursor: "pointer" }}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code} style={{ background: "#0a0a0f", color: "#ffffff" }}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* THEME TOGGLE (Cyber Navy vs Midnight Obsidian) */}
          <button className="btn-ghost" onClick={toggleTheme} style={{ padding: "0.4rem 0.8rem" }}>
            {isDarkMode ? <Moon size={18} color="var(--primary)" /> : <Sun size={18} />}
          </button>

          <button className="btn-primary" onClick={() => handleGenerate("Create a premium landing page showing a gorgeous dark SaaS app interface.")}>
            {t.startBuilding}
          </button>
        </div>
      </nav>

      {/* SUBPAGE: HOME */}
      {currentPage === "home" && (
        <div className="home-wrapper">
          <section className="hero container" style={{ paddingBottom: messages.length > 0 ? "2rem" : "4rem" }}>
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <motion.div key="hero" exit={{ opacity: 0, y: -20 }}>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {t.heroTitle.split(" ").slice(0, -2).join(" ")} <br />
                    {t.heroTitle.split(" ").slice(-2).join(" ")}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    {t.heroSubtitle}
                  </motion.p>

                  <div className="switch-container">
                    <div 
                      className={`switch-item ${activeMode === "apps" ? "active" : ""}`}
                      onClick={() => setActiveMode("apps")}
                    >
                      {t.apps}
                    </div>
                    <div 
                      className={`switch-item ${activeMode === "agents" ? "active" : ""}`}
                      onClick={() => setActiveMode("agents")}
                    >
                      {t.agents} <span className="badge-new">NEW</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="chat" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  style={{ maxWidth: "800px", margin: "0 auto 2rem", textAlign: "left" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {messages.map((msg, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                          gap: "0.5rem"
                        }}
                      >
                        <div style={{
                          padding: "1rem 1.25rem",
                          borderRadius: "1.25rem",
                          fontSize: "0.95rem",
                          lineHeight: 1.5,
                          maxWidth: "85%",
                          background: msg.role === "user" ? "var(--primary)" : "rgba(255,255,255,0.03)",
                          color: "#ffffff",
                          border: msg.role === "user" ? "none" : "1px solid var(--border)",
                          boxShadow: msg.role === "user" ? "0 4px 12px rgba(255,99,31,0.2)" : "0 4px 12px rgba(0,0,0,0.15)"
                        }}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* INPUT PLAYGROUND CONTAINER */}
            <motion.div 
              className="prompt-container"
              layout
              style={{ 
                maxWidth: "800px", 
                margin: "0 auto",
                position: messages.length > 0 ? "sticky" : "relative",
                bottom: messages.length > 0 ? "2rem" : "auto",
                zIndex: 10
              }}
            >
              <textarea 
                className="prompt-textarea"
                placeholder={
                  messages.length > 0 
                    ? t.refinePlaceholder 
                    : activeMode === "agents"
                    ? "Create an autonomous agent that links Notion and Slack, replies to support requests 24/7..."
                    : t.placeholder
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
              <div className="prompt-actions">
                <div className="action-icons">
                  {/* MULTI-MODEL PICKER */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.03)", padding: "0.3rem 0.6rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <Cpu size={14} color="var(--primary)" />
                    <select 
                      value={selectedModel} 
                      onChange={(e) => setSelectedModel(e.target.value)}
                      style={{ background: "transparent", border: "none", color: "#ffffff", fontSize: "0.75rem", fontWeight: 600, outline: "none", cursor: "pointer" }}
                    >
                      <option value="gemini-flash" style={{ background: "#0a0a0f" }}>Gemini 1.5 Flash (Auto)</option>
                      <option value="gemini-pro" style={{ background: "#0a0a0f" }}>Gemini 1.5 Pro</option>
                      <option value="gpt-4o" style={{ background: "#0a0a0f" }}>GPT-4o</option>
                      <option value="claude-sonnet" style={{ background: "#0a0a0f" }}>Claude 3.5 Sonnet</option>
                    </select>
                  </div>

                  <div className="plan-mode-toggle" onClick={() => setPlanMode(!planMode)}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: "2px solid currentColor", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {planMode && <div style={{ width: 8, height: 8, background: "var(--primary)", borderRadius: 1 }} />}
                    </div>
                    <span>Plan mode</span>
                  </div>

                  <div className="action-icon" onClick={() => setDiscussionMode(!discussionMode)} style={{ color: discussionMode ? "var(--primary)" : "inherit" }}>
                    <Mic size={20} />
                  </div>
                </div>
                
                <button className="submit-btn" onClick={() => handleGenerate()} disabled={loading || !prompt}>
                  {loading ? <RefreshCw className="spinner" size={20} /> : <ArrowRight size={20} />}
                </button>
              </div>
            </motion.div>

            {/* STAGE LOADER */}
            <AnimatePresence>
              {loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ marginTop: "2rem", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", fontSize: "0.9rem" }}
                >
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <span style={{ color: stage >= 1 ? "var(--primary)" : "inherit", fontWeight: stage === 1 ? 600 : 400 }}>Extracting Intent</span>
                    <ChevronRight size={14} />
                    <span style={{ color: stage >= 2 ? "var(--primary)" : "inherit", fontWeight: stage === 2 ? 600 : 400 }}>Architecting Schema</span>
                    <ChevronRight size={14} />
                    <span style={{ color: stage >= 3 ? "var(--primary)" : "inherit", fontWeight: stage === 3 ? 600 : 400 }}>Code Synthesis</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* COMPILER HEALTH & SANDBOX OUTPUT */}
          <AnimatePresence>
            {result && (
              <motion.section 
                className="results-section container"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="grid">
                  {/* Left Column Stats */}
                  <div className="card" style={{ height: "fit-content" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                      <Activity size={20} color="var(--primary)" />
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>{t.compilerHealth}</h3>
                    </div>

                    <div style={{ padding: "1.5rem", borderRadius: "1rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", textAlign: "center", marginBottom: "1.5rem" }}>
                      <div className="glow-text" style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary)" }}>
                        {result.score !== undefined ? result.score : Math.max(0, 100 - (result.repairCount * 10) - (result.errors ? result.errors.length * 5 : 0))}%
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.qualityScore}</div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div className="feature-badge" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Zap size={14} /> Latency: {result.latency.toFixed(2)}s
                      </div>
                      {result.repairCount > 0 && (
                        <div className="feature-badge" style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(235, 100, 31, 0.1)", color: "#f59e0b" }}>
                          <ShieldAlert size={14} /> Repairs: {result.repairCount}
                        </div>
                      )}
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.01)", padding: "1rem", border: "1px solid var(--border)", borderRadius: "0.75rem", marginBottom: "2rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                        <Eye size={12} /> Chrome DevTools Tunnel
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981", fontSize: "0.8rem" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} className="pulse" />
                        ACTIVE & TUNNELED
                      </div>
                    </div>

                    <button 
                      onClick={handleDownloadZip}
                      className="btn-primary" 
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "1rem", marginBottom: "2rem" }}
                    >
                      <Download size={18} />
                      {t.downloadBundle}
                    </button>

                    {/* Intelligent Add-ons */}
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
                      <h4 style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>{t.addonsTitle}</h4>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                        {[
                          { name: "Chatbot", icon: <Mic size={14} />, prompt: "Add an AI chatbot assistant to the application." },
                          { name: "Analytics", icon: <Activity size={14} />, prompt: "Add a user analytics dashboard and tracking." },
                          { name: "Notifs", icon: <Zap size={14} />, prompt: "Add push notifications and an activity feed." },
                          { name: "Payments", icon: <CheckCircle size={14} />, prompt: "Add Stripe payments and subscription plans." }
                        ].map(addon => (
                          <button
                            key={addon.name}
                            onClick={() => handleGenerate(addon.prompt)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              padding: "0.5rem",
                              fontSize: "0.75rem",
                              background: "rgba(255,255,255,0.02)",
                              border: "1px solid var(--border)",
                              borderRadius: "0.5rem",
                              color: "#ffffff",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            {addon.icon}
                            {addon.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Main Interactive Output Tabs */}
                  <div className="card">
                    <div style={{ display: "flex", gap: "0.6rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                      {["db", "database", "api", "ui", "auth", "team", "analytics", "integrations", "github", "code", "preview", "domain", "devtools"].map(tab => (
                        <button 
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          style={{
                            padding: "0.6rem 0.8rem",
                            border: "none",
                            background: "none",
                            color: activeTab === tab ? "var(--primary)" : "var(--muted)",
                            fontWeight: activeTab === tab ? 700 : 500,
                            borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent",
                            cursor: "pointer",
                            textTransform: "uppercase",
                            fontSize: "0.7rem",
                            letterSpacing: "0.08em",
                            transition: "all 0.2s",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {tab === "db" ? "DB SCHEMA" : tab === "database" ? "DB SIMULATOR" : tab.toUpperCase()}
                        </button>
                      ))}
                      <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <button
                          onClick={() => {
                            const content = activeTab === "code" && generatedCode 
                              ? `${generatedCode.reactCode}\n\n${generatedCode.apiCode}\n\n${generatedCode.dbCode}` 
                              : JSON.stringify(result.data, null, 2);
                            handleCopy(content);
                          }}
                          title="Copy current data"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", padding: "0.35rem 0.5rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", fontWeight: 600 }}
                        >
                          <Copy size={12} /> Copy
                        </button>
                        <button
                          onClick={() => handleExportBlueprint("json")}
                          title="Download Blueprint JSON"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", padding: "0.35rem 0.5rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", fontWeight: 600 }}
                        >
                          <FileJson size={12} /> JSON
                        </button>
                        <button
                          onClick={() => handleExportBlueprint("markdown")}
                          title="Download Markdown Report"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", padding: "0.35rem 0.5rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", fontWeight: 600 }}
                        >
                          <FileCode size={12} /> Report
                        </button>
                      </div>
                    </div>

                    <div style={{ background: "rgba(10, 10, 15, 0.95)", border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "1.5rem", overflow: "hidden", minHeight: "450px" }}>
                      {loading ? (
                        <div style={{ padding: "2rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", color: "var(--primary)" }}>
                            <RefreshCw size={20} className="spinner" />
                            <strong style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>AppForge AI Compiler actively synthesizing schemas...</strong>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {[1, 2, 3].map(i => (
                              <div key={i} className="pulse" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem" }}>
                                <div style={{ width: "120px", height: "14px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", marginBottom: "0.75rem" }} />
                                <div style={{ width: "80%", height: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "4px", marginBottom: "0.5rem" }} />
                                <div style={{ width: "50%", height: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "4px" }} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : codeLoading ? (
                        <div style={{ padding: "2rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", color: "#8b5cf6" }}>
                            <Cpu size={20} className="spinner" />
                            <strong style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Synthesizing react components & FastAPI controller scripts...</strong>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <div style={{ width: "100%", height: "120px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }} className="pulse">
                              <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--muted)" }}>// Generating static pages & endpoint bindings...</span>
                            </div>
                          </div>
                        </div>
                      ) : activeTab === "code" && generatedCode ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                          <pre style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, maxHeight: "500px", overflowY: "auto", fontFamily: "monospace" }}>
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                <div style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: 600 }}>// NEXT.JS FRONTEND (src/app/page.tsx)</div>
                                <button onClick={() => handleCopy(generatedCode.reactCode)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#64748b", cursor: "pointer", padding: "4px", borderRadius: "4px" }}><Copy size={14} /></button>
                              </div>
                              <code>{generatedCode.reactCode}</code>
                            </div>
                            <div style={{ marginTop: "2rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                <div style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: 600 }}>// FASTAPI BACKEND (main.py)</div>
                                <button onClick={() => handleCopy(generatedCode.apiCode)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#64748b", cursor: "pointer", padding: "4px", borderRadius: "4px" }}><Copy size={14} /></button>
                              </div>
                              <code>{generatedCode.apiCode}</code>
                            </div>
                            <div style={{ marginTop: "2rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                <div style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: 600 }}>// SQL MIGRATIONS (schema.sql)</div>
                                <button onClick={() => handleCopy(generatedCode.dbCode)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#64748b", cursor: "pointer", padding: "4px", borderRadius: "4px" }}><Copy size={14} /></button>
                              </div>
                              <code>{generatedCode.dbCode}</code>
                            </div>
                          </pre>
                        </div>
                      ) : activeTab === "db" && result.data.dbSchema ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.5rem" }}>
                          {/* Visual Entity-Relationship Diagram Canvas */}
                          <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "380px" }}>
                            <div>
                              <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Visual Relational Diagram (ERD)</div>
                              <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "2.5rem", padding: "1rem" }}>
                                <div style={{ border: "1px solid rgba(255,99,31,0.3)", background: "rgba(255,99,31,0.05)", borderRadius: "8px", padding: "0.5rem 1rem", alignSelf: "flex-start", width: "160px" }}>
                                  <strong style={{ fontSize: "0.8rem", color: "#ffffff" }}>👤 users</strong>
                                  <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginTop: "2px" }}>🔑 id (uuid) <br /> email (varchar)</div>
                                </div>
                                <div style={{ border: "1px solid rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.05)", borderRadius: "8px", padding: "0.5rem 1rem", alignSelf: "flex-end", width: "160px" }}>
                                  <strong style={{ fontSize: "0.8rem", color: "#ffffff" }}>📁 projects</strong>
                                  <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginTop: "2px" }}>🔑 id (uuid) <br /> 🔗 owner_id (uuid)</div>
                                </div>
                                {/* SVG Connector Line */}
                                <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
                                  <path d="M 170 40 C 220 40, 200 135, 230 135" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 3" />
                                </svg>
                              </div>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.02)", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.04)", fontSize: "0.7rem", color: "var(--muted)" }}>
                              <strong>Detected Foreign Keys:</strong> `projects.owner_id` references `users.id` (One-to-Many Relational Integrity).
                            </div>
                          </div>
                          {/* Standard List View */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto", maxHeight: "380px" }}>
                            {result.data.dbSchema.tables.map((table: any) => (
                              <div key={table.name} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.75rem", padding: "1rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "var(--primary)", fontWeight: 600, fontSize: "0.85rem" }}>
                                  <Database size={14} />
                                  {table.name.toUpperCase()}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                  {table.columns.map((col: any) => (
                                    <div key={col.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", padding: "0.15rem 0" }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <span style={{ color: col.primaryKey ? "#fbbf24" : col.foreignKey ? "#10b981" : "#ffffff" }}>{col.name}</span>
                                        {col.primaryKey && <span style={{ fontSize: "0.55rem", background: "rgba(251,191,36,0.1)", color: "#fbbf24", padding: "1px 4px", borderRadius: "4px" }}>PK</span>}
                                        {col.foreignKey && <span style={{ fontSize: "0.55rem", background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "1px 4px", borderRadius: "4px" }}>FK ➔ {col.foreignKey.table}</span>}
                                      </div>
                                      <div style={{ color: "var(--muted)" }}>{col.type}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        ) : activeTab === "api" && result.data.apiSchema ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "1.5rem" }}>
                          {/* Visual Endpoints cards list */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto", maxHeight: "380px" }}>
                            <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Synthesized API Endpoints</div>
                            {result.data.apiSchema.endpoints.map((ep: any) => (
                              <div key={ep.path} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "0.75rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                    <span style={{ 
                                      fontSize: "0.7rem", 
                                      fontWeight: 800, 
                                      padding: "2px 6px", 
                                      borderRadius: "4px",
                                      background: ep.method === "POST" ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.15)",
                                      color: ep.method === "POST" ? "#10b981" : "#3b82f6"
                                    }}>
                                      {ep.method}
                                    </span>
                                    <code style={{ fontSize: "0.8rem", color: "#ffffff", fontWeight: 600 }}>{ep.path}</code>
                                  </div>
                                  <button
                                    onClick={async () => {
                                      setTestingApi(ep.path);
                                      setApiTestResponse(null);
                                      await new Promise(resolve => setTimeout(resolve, 800));
                                      const mockRes = ep.method === "POST" 
                                        ? { status: "success", created_id: "7f4c9c1b", message: "Record successfully registered via JWT token." }
                                        : [ { id: "1", name: "Simulated Record A", email: "sales@my-company.com", role: "admin" } ];
                                      setApiTestResponse(JSON.stringify(mockRes, null, 2));
                                      setTestingApi(null);
                                    }}
                                    className="btn-primary"
                                    style={{ height: "24px", padding: "0 0.5rem", fontSize: "0.65rem", borderRadius: "4px" }}
                                  >
                                    Test Call
                                  </button>
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{ep.description}</div>
                              </div>
                            ))}
                          </div>
                          {/* Live test console box */}
                          <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem", display: "flex", flexDirection: "column", height: "380px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                              <div style={{ fontSize: "0.75rem", color: "#ffffff", fontWeight: 700, textTransform: "uppercase" }}>Live Cluster Request Console</div>
                              <span style={{ fontSize: "0.6rem", color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "1px 6px", borderRadius: "4px" }}>FastAPI v0.110</span>
                            </div>
                            <div style={{ flex: 1, background: "rgba(10,10,15,0.9)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", color: "#a7f3d0", fontFamily: "monospace", fontSize: "0.75rem", overflowY: "auto" }}>
                              {testingApi ? (
                                <div className="pulse" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", color: "#fbbf24" }}>
                                  <div>&gt; HTTP {result.data.apiSchema.endpoints.find((e: any) => e.path === testingApi)?.method} {testingApi}</div>
                                  <div>&gt; Establishing secure API tunnel connection...</div>
                                  <div>&gt; Dispatching request headers and JSON payloads...</div>
                                </div>
                              ) : apiTestResponse ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                  <div style={{ color: "#34d399", fontWeight: "bold" }}>STATUS: 200 OK (Latency: 48ms)</div>
                                  <div style={{ color: "#94a3b8" }}>&gt; Response Payload:</div>
                                  <pre style={{ margin: 0, color: "#81c995", fontFamily: "monospace", fontSize: "0.75rem" }}>{apiTestResponse}</pre>
                                </div>
                              ) : (
                                <div style={{ color: "var(--muted)", textAlign: "center", paddingTop: "5rem" }}>
                                  &gt; Click "Test Call" on any route card to trigger a simulated live-endpoint compiler test request.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : activeTab === "ui" && result.data.uiSchema ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.5rem" }}>
                          {/* Visual Web Layout Wireframe Canvas */}
                          <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem", height: "380px", display: "flex", flexDirection: "column" }}>
                            <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Interactive UI wireframe layout</div>
                            <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column", background: "#06060a" }}>
                              {/* Simulated visual layout page blocks */}
                              {["Navbar", "Hero Title Banner", "CRM Record Data Grid", "Footer"].map((block) => (
                                <div
                                  key={block}
                                  onClick={() => setSelectedUiBlock(block)}
                                  style={{
                                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                                    padding: "0.5rem",
                                    textAlign: "center",
                                    fontSize: "0.75rem",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    background: selectedUiBlock === block ? "rgba(255,99,31,0.15)" : "transparent",
                                    border: selectedUiBlock === block ? "1px solid var(--primary)" : "1px solid transparent",
                                    color: selectedUiBlock === block ? "var(--primary)" : "#94a3b8",
                                    transition: "all 0.2s"
                                  }}
                                >
                                  {block.toUpperCase()}
                                </div>
                              ))}
                              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: "0.7rem", padding: "1rem", textAlign: "center" }}>
                                {selectedUiBlock 
                                  ? `Selected Block: ${selectedUiBlock}. Details loaded in side-panel.` 
                                  : "Click wireframe page blocks above to inspect layout architectures."}
                              </div>
                            </div>
                          </div>
                          {/* Wireframe details block */}
                          <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem", height: "380px", overflowY: "auto" }}>
                            {selectedUiBlock ? (
                              <div>
                                <h4 style={{ color: "var(--primary)", fontSize: "1rem", marginBottom: "0.5rem" }}>{selectedUiBlock} Block</h4>
                                <span className="feature-badge" style={{ fontSize: "0.6rem" }}>Component State: Auto-Generated</span>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>
                                  <div><strong>Visual Mockup:</strong> Responsive grid layout styled with Obsidian charcoal borders and brand-orange action indicators.</div>
                                  <div><strong>CSS Utilities:</strong> Mapped to high-end flexbox alignment rules and media query breakpoints (highly mobile responsive).</div>
                                  <div><strong>State Binding:</strong> Triggers compiler events (e.g. `handleAddDbRecord`) updating storage arrays automatically.</div>
                                </div>
                              </div>
                            ) : (
                              <div style={{ color: "var(--muted)", textAlign: "center", paddingTop: "5rem", fontSize: "0.8rem" }}>
                                Select a wireframe layout block on the left to render technical blueprint parameters.
                              </div>
                            )}
                          </div>
                        </div>
                      ) : activeTab === "auth" && result.data.authSchema ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                          {/* Interactive User Access policy checker */}
                          <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem", height: "380px" }}>
                            <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Role-Based Access Policy Matrix</div>
                            
                            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", alignItems: "center" }}>
                              <span style={{ fontSize: "0.8rem", color: "#ffffff" }}>Simulate Role:</span>
                              <select
                                value={selectedAuthRole}
                                onChange={(e) => setSelectedAuthRole(e.target.value)}
                                style={{ height: "30px", background: "#0a0a0f", border: "1px solid var(--border)", borderRadius: "6px", padding: "0 0.5rem", color: "#ffffff", fontSize: "0.8rem", outline: "none" }}
                              >
                                {result.data.authSchema.roles.map((r: any) => (
                                  <option key={r} value={r}>{r.toUpperCase()}</option>
                                ))}
                              </select>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8rem" }}>
                              {[
                                { action: "Read Contacts Record List", required: "viewer" },
                                { action: "Insert New Database Record", required: "editor" },
                                { action: "Delete Database Records", required: "admin" }
                              ].map(pol => {
                                const allowedRoles = pol.required === "viewer" 
                                  ? ["viewer", "editor", "admin"] 
                                  : pol.required === "editor" 
                                    ? ["editor", "admin"] 
                                    : ["admin"];
                                const isAllowed = allowedRoles.includes(selectedAuthRole.toLowerCase());
                                return (
                                  <div key={pol.action} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "6px", alignItems: "center" }}>
                                    <span style={{ color: "#ffffff" }}>{pol.action}</span>
                                    <span style={{ fontWeight: 700, color: isAllowed ? "#10b981" : "#ef4444" }}>
                                      {isAllowed ? "✓ Allowed" : "❌ Restricted"}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {/* Auth Schema Definition */}
                          <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem", height: "380px", overflowY: "auto" }}>
                            <div style={{ fontSize: "0.75rem", color: "#ffffff", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.75rem" }}>Access Policies Rules</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>
                              {result.data.authSchema.rules.map((rule: string, idx: number) => (
                                <div key={idx} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
                                  🛡️ {rule}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                         ) : activeTab === "database" ? (
                          <div style={{ padding: "0.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                              <h4 style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700 }}>DATABASE SIMULATOR (Real Storage Simulation JSON)</h4>
                              <span className="feature-badge" style={{ fontSize: "0.6rem" }}>Active Collection: users</span>
                            </div>
                            <pre style={{ color: "#94a3b8", background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)", maxHeight: "300px", overflowY: "auto", fontFamily: "monospace" }}>
                              <code>{JSON.stringify(dbRecords, null, 2)}</code>
                            </pre>
                          </div>
                        ) : activeTab === "team" ? (
                          <div style={{ padding: "0.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                              <h4 style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700 }}>WORKSPACE SEATS & COLLABORATION</h4>
                              <span className="feature-badge" style={{ fontSize: "0.6rem" }}>Builder Tier slots</span>
                            </div>
                            
                            <form onSubmit={handleInviteMember} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", padding: "0.75rem", borderRadius: "8px" }}>
                              <input 
                                type="email" 
                                placeholder="Collaborator Email..." 
                                required
                                value={inviteEmailInput}
                                onChange={(e) => setInviteEmailInput(e.target.value)}
                                style={{ flex: 3, height: "34px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0 0.5rem", color: "#ffffff", fontSize: "0.8rem", outline: "none" }}
                              />
                              <select 
                                value={inviteRoleInput}
                                onChange={(e) => setInviteRoleInput(e.target.value)}
                                style={{ flex: 1, height: "34px", background: "#0a0a0f", border: "1px solid var(--border)", borderRadius: "6px", padding: "0 0.25rem", color: "#ffffff", fontSize: "0.8rem", outline: "none" }}
                              >
                                <option value="developer">Developer</option>
                                <option value="viewer">Viewer</option>
                              </select>
                              <button type="submit" className="btn-primary" style={{ height: "34px", padding: "0 1rem", fontSize: "0.8rem", borderRadius: "6px" }}>Invite User</button>
                            </form>

                            <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                              {teamInvites.map((member, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 1rem", fontSize: "0.8rem", borderBottom: "1px solid rgba(255,255,255,0.02)", alignItems: "center" }}>
                                  <span style={{ color: "#ffffff", fontWeight: 500 }}>{member.email}</span>
                                  <span style={{ fontSize: "0.7rem", padding: "1px 6px", borderRadius: "4px", background: "rgba(255,99,31,0.1)", color: "var(--primary)" }}>{member.role.toUpperCase()}</span>
                                  <span style={{ color: "#10b981", fontSize: "0.75rem" }}>{member.status}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : activeTab === "analytics" ? (
                          <div style={{ padding: "0.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                              <h4 style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700 }}>BUILT-IN WORKSPACE PERFORMANCE ANALYTICS</h4>
                              <span className="feature-badge" style={{ fontSize: "0.6rem", color: "#10b981", background: "rgba(16,185,129,0.15)" }}>99.98% uptime</span>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                              <div className="card" style={{ padding: "1rem", background: "rgba(0,0,0,0.2)" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.5rem" }}>API LATENCY RATE (ms)</div>
                                <svg viewBox="0 0 300 100" style={{ width: "100%", height: "80px" }}>
                                  <path d="M 0,80 Q 50,20 100,50 T 200,30 T 300,40" fill="none" stroke="var(--primary)" strokeWidth="3" />
                                  <circle cx="300" cy="40" r="4" fill="var(--primary)" />
                                </svg>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--muted)" }}>
                                  <span>10:00 AM</span>
                                  <span>11:00 AM</span>
                                </div>
                              </div>
                              <div className="card" style={{ padding: "1rem", background: "rgba(0,0,0,0.2)" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.5rem" }}>DAILY ACTIVE USERS</div>
                                <svg viewBox="0 0 300 100" style={{ width: "100%", height: "80px" }}>
                                  <path d="M 0,90 Q 50,40 100,30 T 200,60 T 300,10" fill="none" stroke="#8b5cf6" strokeWidth="3" />
                                  <circle cx="300" cy="10" r="4" fill="#8b5cf6" />
                                </svg>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--muted)" }}>
                                  <span>Mon</span>
                                  <span>Sun</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : activeTab === "github" ? (
                          <div style={{ padding: "0.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                              <h4 style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700 }}>GITHUB 2-WAY SYNCHRONIZATION PIPELINE</h4>
                              <span className="feature-badge" style={{ fontSize: "0.6rem" }}>Branch: {githubBranch}</span>
                            </div>

                            <div style={{ display: "flex", gap: "0.75rem", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", alignItems: "center" }}>
                              <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Repository:</span>
                              <input 
                                type="text"
                                value={githubRepoName}
                                onChange={(e) => setGithubRepoName(e.target.value)}
                                style={{ flex: 1, height: "30px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0 0.5rem", color: "#ffffff", fontSize: "0.8rem", outline: "none" }}
                              />
                              <button onClick={() => { setGithubSyncState("syncing"); setTimeout(() => { setGithubSyncState("synchronized"); alert("GitHub Repository synced successfully!"); }, 1000); }} className="btn-secondary" style={{ height: "30px", fontSize: "0.75rem", padding: "0 1rem", borderRadius: "6px" }}>
                                {githubSyncState === "syncing" ? "Syncing..." : "Sync Repository"}
                              </button>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                              <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: "bold" }}>SYNC STATUS: {githubSyncState.toUpperCase()}</div>
                              {githubCommits.map((cmt, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
                                  <div>
                                    <code style={{ color: "var(--primary)", marginRight: "0.5rem" }}>[{cmt.sha}]</code>
                                    <span style={{ color: "#ffffff" }}>{cmt.msg}</span>
                                  </div>
                                  <span style={{ color: "var(--muted)" }}>{cmt.time}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : activeTab === "domain" ? (
                          <div style={{ padding: "0.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                              <h4 style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700 }}>CUSTOM DOMAIN SSL ROUTING CONFIG</h4>
                              <span className="feature-badge" style={{ fontSize: "0.6rem" }}>SSL: Active</span>
                            </div>

                            <form onSubmit={handleDomainBind} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", padding: "0.75rem", borderRadius: "8px" }}>
                              <input 
                                type="text"
                                placeholder="my-app-domain.com"
                                required
                                value={domainInput}
                                onChange={(e) => setDomainInput(e.target.value)}
                                style={{ flex: 1, height: "34px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0 0.5rem", color: "#ffffff", fontSize: "0.8rem", outline: "none" }}
                              />
                              <button type="submit" className="btn-primary" style={{ height: "34px", padding: "0 1rem", fontSize: "0.8rem", borderRadius: "6px" }}>
                                {domainStatus === "binding" ? "Routing DNS..." : "Bind Domain"}
                              </button>
                            </form>

                            <div className="card" style={{ padding: "1rem", background: "rgba(0,0,0,0.2)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                                <span style={{ color: "var(--muted)" }}>Bound Address:</span>
                                <strong style={{ color: domainStatus === "bound" ? "#10b981" : "var(--muted)" }}>
                                  {domainStatus === "bound" ? `https://${domainName}` : "No domain bound"}
                                </strong>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                                <span style={{ color: "var(--muted)" }}>DNS Binding Status:</span>
                                <strong style={{ color: domainStatus === "bound" ? "#10b981" : domainStatus === "binding" ? "#fbbf24" : "var(--muted)" }}>
                                  {domainStatus === "bound" ? "✓ Bound & Routed" : domainStatus === "binding" ? "🔍 Propagation Checks..." : "Unbound"}
                                </strong>
                              </div>
                            </div>
                          </div>
                        ) : activeTab === "db" && result.data.dbSchema ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {result.data.dbSchema.tables.map((table: any) => (
                              <div key={table.name} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.75rem", padding: "1rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "var(--primary)", fontWeight: 600 }}>
                                  <Database size={16} />
                                  {table.name.toUpperCase()}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                  {table.columns.map((col: any) => (
                                    <div key={col.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.25rem 0" }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <span style={{ color: col.primaryKey ? "#fbbf24" : col.foreignKey ? "#10b981" : "#ffffff" }}>
                                          {col.name}
                                        </span>
                                        {col.primaryKey && <span style={{ fontSize: "0.6rem", background: "rgba(251, 191, 36, 0.1)", color: "#fbbf24", padding: "1px 4px", borderRadius: "4px" }}>PK</span>}
                                        {col.foreignKey && <span style={{ fontSize: "0.6rem", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "1px 4px", borderRadius: "4px" }}>FK ➔ {col.foreignKey.table}</span>}
                                      </div>
                                      <div style={{ color: "var(--muted)" }}>{col.type} {col.required ? "*" : ""}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : activeTab === "preview" ? (
                          <div style={{ height: "500px", background: "#0a0a0f", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                            {/* Web Browser Frame Header */}
                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border)" }}>
                              <div style={{ display: "flex", gap: "0.4rem" }}>
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
                              </div>
                              <div style={{ flex: 1, background: "rgba(0,0,0,0.4)", borderRadius: "6px", padding: "0.2rem 0.75rem", fontSize: "0.75rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--border)" }}>
                                <Shield size={10} color="#10b981" /> 
                                {deployState === "deployed" ? deployUrl : "https://appforge-live-sandbox.services/app"}
                              </div>
                              {/* One-Click Deploy Button */}
                              <button 
                                onClick={handlePublishDeploy}
                                className="btn-primary" 
                                disabled={deployState === "deploying"}
                                style={{ height: "26px", padding: "0 0.75rem", fontSize: "0.7rem", borderRadius: "4px", boxShadow: "0 0 10px rgba(255,99,31,0.3)" }}
                              >
                                {deployState === "deploying" ? (
                                  <RefreshCw size={10} className="spinner" />
                                ) : deployState === "deployed" ? (
                                  "✓ Deployed"
                                ) : (
                                  "One-Click Deploy"
                                )}
                              </button>
                            </div>

                            {/* Simulated App Workspace Area */}
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                              {/* Deployment animation screen */}
                              {deployState === "deploying" && (
                                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(10,10,15,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
                                  <RefreshCw size={36} className="spinner" color="var(--primary)" style={{ marginBottom: "1rem" }} />
                                  <h4 style={{ color: "#ffffff", fontSize: "1rem", marginBottom: "0.5rem" }}>Triggering One-Click Build Pipelines</h4>
                                  <div style={{ width: "200px", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "9999px", overflow: "hidden", marginBottom: "0.5rem" }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} style={{ height: "100%", background: "var(--primary)" }} />
                                  </div>
                                  <p style={{ color: "var(--muted)", fontSize: "0.75rem", fontFamily: "monospace" }}>Building Docker image & allocating SSL routes...</p>
                                </div>
                              )}

                              {/* Header banner showing auth status */}
                              <div style={{ background: "rgba(255,255,255,0.01)", padding: "0.75rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>🚀 {result.data?.uiSchema?.pages?.[0]?.title || "AppForge App Preview"}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                  {previewUserLoggedIn ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                                      <span style={{ fontSize: "0.8rem", color: "#ffffff" }}>{previewUserEmail}</span>
                                      <button onClick={() => setPreviewUserLoggedIn(false)} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}>Logout</button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => setShowPreviewLoginModal(true)} 
                                      className="btn-secondary" 
                                      style={{ height: "28px", padding: "0 0.75rem", fontSize: "0.75rem", borderRadius: "6px" }}
                                    >
                                      Sign In
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Main App Work Area */}
                              <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {result && result.data.dbSchema.tables.some((t: any) => t.name === "chat_messages") ? (
                                  /* RENDER ACTIVE CHATBOT SIMULATION */
                                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '300px' }}>
                                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border)', padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px' }}>
                                      <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: '#ffffff' }}>
                                        🤖 AppForge Chatbot: Hello! I am the active compiled assistant. How can I assist you with AppForge relational compilations?
                                      </div>
                                      {dbRecords.filter(r => r.email && r.email.includes("@")).map((msg, i) => (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                          <div style={{ alignSelf: 'flex-end', background: 'var(--primary)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: '#ffffff' }}>
                                            {msg.name}
                                          </div>
                                          <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: '#ffffff', border: '1px solid rgba(255,99,31,0.2)' }}>
                                            🤖 Simulated Bot response for: "{msg.name}"
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                      <input 
                                        type="text" 
                                        placeholder="Type message to compiled chatbot assistant..." 
                                        value={newRecordName}
                                        onChange={(e) => {
                                          setNewRecordName(e.target.value);
                                          setNewRecordEmail("chatbot@simulation.com");
                                          setNewRecordRole("viewer");
                                        }}
                                        style={{ flex: 1, height: '34px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0 0.5rem', color: '#ffffff', fontSize: '0.8rem', outline: 'none' }}
                                      />
                                      <button 
                                        onClick={handleAddDbRecord}
                                        className="btn-primary" 
                                        style={{ height: '34px', padding: '0 1rem', fontSize: '0.8rem', borderRadius: '6px' }}
                                      >
                                        Send Message
                                      </button>
                                    </div>
                                  </div>
                                ) : result && result.data.dbSchema.tables.some((t: any) => t.name === "analytics_events") ? (
                                  /* RENDER ACTIVE ANALYTICS SIMULATION */
                                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "0.5rem", borderRadius: "8px", textAlign: "center" }}>
                                        <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>Active Views</div>
                                        <strong style={{ fontSize: "1.1rem", color: "var(--primary)" }}>{180 + dbRecords.length}</strong>
                                      </div>
                                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "0.5rem", borderRadius: "8px", textAlign: "center" }}>
                                        <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>Total Events</div>
                                        <strong style={{ fontSize: "1.1rem", color: "#8b5cf6" }}>{24 + dbRecords.length}</strong>
                                      </div>
                                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "0.5rem", borderRadius: "8px", textAlign: "center" }}>
                                        <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>Active Sessions</div>
                                        <strong style={{ fontSize: "1.1rem", color: "#10b981" }}>4</strong>
                                      </div>
                                    </div>
                                    <button 
                                      onClick={() => {
                                        setNewRecordName(`Clicked Event Tracker ${Date.now().toString().slice(-4)}`);
                                        setNewRecordEmail("analytics@tracker.com");
                                        setNewRecordRole("developer");
                                        handleAddDbRecord();
                                      }}
                                      className="btn-primary" 
                                      style={{ width: "100%", height: "34px", fontSize: "0.8rem", borderRadius: "6px", justifyContent: "center" }}
                                    >
                                      ✓ Trigger Active User Click Event
                                    </button>
                                    <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--border)", maxHeight: "120px", overflowY: "auto" }}>
                                      <div style={{ fontSize: "0.65rem", color: "var(--muted)", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.25rem", marginBottom: "0.25rem" }}>Event stream logging:</div>
                                      {dbRecords.filter(r => r.email === "analytics@tracker.com").map((ev, i) => (
                                        <div key={i} style={{ fontSize: "0.7rem", color: "#a7f3d0", fontFamily: "monospace", padding: "0.15rem 0" }}>
                                          ⚡ EVENT: {ev.name} logged securely in relational datastore.
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : result && result.data.dbSchema.tables.some((t: any) => t.name === "notifications") ? (
                                  /* RENDER ACTIVE NOTIFICATIONS PANEL */
                                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                                      <span style={{ fontSize: "0.8rem", color: "#ffffff", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                        🔔 Notifications Feed ({dbRecords.filter(r => r.email === "alert@notification.com").length})
                                      </span>
                                      <button 
                                        onClick={() => {
                                          setNewRecordName(`Simulated push alert #${dbRecords.filter(r => r.email === "alert@notification.com").length + 1}`);
                                          setNewRecordEmail("alert@notification.com");
                                          setNewRecordRole("viewer");
                                          handleAddDbRecord();
                                        }}
                                        className="btn-primary"
                                        style={{ height: "24px", padding: "0 0.5rem", fontSize: "0.65rem", borderRadius: "4px" }}
                                      >
                                        Trigger Push Notif
                                      </button>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "180px", overflowY: "auto" }}>
                                      {dbRecords.filter(r => r.email === "alert@notification.com").map((not, idx) => (
                                        <div key={idx} style={{ padding: "0.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "6px", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", alignItems: "center" }}>
                                          <span style={{ color: "#ffffff" }}>🔔 {not.name}</span>
                                          <span style={{ fontSize: "0.6rem", background: "rgba(255,99,31,0.15)", color: "var(--primary)", padding: "1px 4px", borderRadius: "4px" }}>UNREAD</span>
                                        </div>
                                      ))}
                                      {dbRecords.filter(r => r.email === "alert@notification.com").length === 0 && (
                                        <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)", fontSize: "0.75rem" }}>
                                          No push alerts compiled. Click "Trigger Push Notif" above!
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ) : result && result.data.dbSchema.tables.some((t: any) => t.name === "subscriptions") ? (
                                  /* RENDER ACTIVE STRIPE PAYMENTS INTEGRATION */
                                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "center", padding: "1rem" }}>
                                    {dbRecords.some(r => r.role === "admin") ? (
                                      <div style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.2)", padding: "1.5rem", borderRadius: "12px" }}>
                                        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎉</div>
                                        <h4 style={{ color: "#10b981", fontSize: "1rem" }}>AppForge Pro Subscription Activated!</h4>
                                        <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: "0.5rem 0" }}>Stripe Transaction Token: ch_StripeAppForgeLive7b1</p>
                                        <button 
                                          onClick={() => {
                                            setDbRecords(prev => prev.filter(r => r.role !== "admin"));
                                          }}
                                          className="btn-secondary" 
                                          style={{ height: "30px", fontSize: "0.75rem", padding: "0 1rem", marginTop: "0.5rem" }}
                                        >
                                          Reset to Free Tier
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="card" style={{ padding: "1.5rem", background: "rgba(20,20,30,0.8)" }}>
                                        <h4 style={{ color: "#ffffff", fontSize: "1rem", marginBottom: "0.25rem" }}>Unlock AppForge Pro</h4>
                                        <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--primary)", margin: "0.5rem 0" }}>
                                          $44<span style={{ fontSize: "0.9rem", color: "var(--muted)", fontWeight: "normal" }}>/month</span>
                                        </div>
                                        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "1rem" }}>Includes 2-way GitHub sync, active SSL domain routing, and autonomous superagent runs.</p>
                                        <button 
                                          onClick={() => {
                                            setNewRecordName("Stripe Subscription Active");
                                            setNewRecordEmail("billing@stripe.com");
                                            setNewRecordRole("admin");
                                            handleAddDbRecord();
                                          }}
                                          className="btn-primary" 
                                          style={{ width: "100%", height: "36px", fontSize: "0.8rem", borderRadius: "6px", justifyContent: "center", boxShadow: "0 0 15px rgba(255,99,31,0.4)" }}
                                        >
                                          Upgrade with Stripe Checkout
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  /* STANDARD CONTACTS LIST CRM GRID */
                                  <>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <h4 style={{ fontSize: "0.85rem", color: "#ffffff" }}>Relational Database Records Table</h4>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: "0.5rem", borderRadius: "8px" }}>
                                      <input 
                                        type="text" 
                                        placeholder="Contact Name..."
                                        value={newRecordName}
                                        onChange={(e) => setNewRecordName(e.target.value)}
                                        style={{ flex: 2, height: "32px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0 0.5rem", color: "#ffffff", fontSize: "0.8rem", outline: "none" }}
                                      />
                                      <input 
                                        type="email" 
                                        placeholder="Email address..."
                                        value={newRecordEmail}
                                        onChange={(e) => setNewRecordEmail(e.target.value)}
                                        style={{ flex: 2, height: "32px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0 0.5rem", color: "#ffffff", fontSize: "0.8rem", outline: "none" }}
                                      />
                                      <select 
                                        value={newRecordRole}
                                        onChange={(e) => setNewRecordRole(e.target.value)}
                                        style={{ flex: 1, height: "32px", background: "#0a0a0f", border: "1px solid var(--border)", borderRadius: "6px", padding: "0 0.25rem", color: "#ffffff", fontSize: "0.8rem", outline: "none" }}
                                      >
                                        <option value="admin">Admin</option>
                                        <option value="developer">Developer</option>
                                        <option value="viewer">Viewer</option>
                                      </select>
                                      <button 
                                        onClick={handleAddDbRecord}
                                        className="btn-primary" 
                                        style={{ height: "32px", padding: "0 1rem", fontSize: "0.8rem", borderRadius: "6px" }}
                                      >
                                        Add Record
                                      </button>
                                    </div>
                                    <div style={{ flex: 1, background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                                      <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", background: "rgba(255,255,255,0.03)", padding: "0.5rem 1rem", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                                        <span>NAME</span>
                                        <span>EMAIL</span>
                                        <span>ROLE</span>
                                        <span style={{ textAlign: "right" }}>ACTIONS</span>
                                      </div>
                                      <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", height: "130px" }}>
                                        {dbRecords.filter(r => r.email !== "analytics@tracker.com" && r.email !== "alert@notification.com" && r.email !== "billing@stripe.com" && r.email !== "chatbot@simulation.com").map(rec => (
                                          <div key={rec.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", padding: "0.4rem 1rem", fontSize: "0.8rem", borderBottom: "1px solid rgba(255,255,255,0.02)", alignItems: "center" }}>
                                            <span style={{ color: "#ffffff", fontWeight: 500 }}>{rec.name}</span>
                                            <span style={{ color: "var(--muted)" }}>{rec.email}</span>
                                            <span>
                                              <span style={{ 
                                                fontSize: "0.65rem", 
                                                padding: "1px 6px", 
                                                borderRadius: "4px",
                                                background: rec.role === "admin" ? "rgba(251, 191, 36, 0.1)" : rec.role === "developer" ? "rgba(59, 130, 246, 0.1)" : "rgba(255,255,255,0.05)",
                                                color: rec.role === "admin" ? "#fbbf24" : rec.role === "developer" ? "#60a5fa" : "var(--muted)"
                                              }}>
                                                {rec.role.toUpperCase()}
                                              </span>
                                            </span>
                                            <span style={{ textAlign: "right" }}>
                                              <button onClick={() => handleDeleteDbRecord(rec.id)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "0.75rem" }}>Delete</button>
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Simulated Pop-up login modal */}
                            {showPreviewLoginModal && (
                              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
                                <div className="card" style={{ maxWidth: "320px", width: "90%", background: "rgba(15, 15, 25, 0.98)", padding: "1.25rem" }}>
                                  <h3 style={{ fontSize: "1.1rem", color: "#ffffff", marginBottom: "1rem" }}>Workspace User Sign In</h3>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
                                    <input 
                                      type="email" 
                                      placeholder="Email address..." 
                                      value={previewUserEmail}
                                      onChange={(e) => setPreviewUserEmail(e.target.value)}
                                      style={{ width: "100%", height: "34px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0 0.5rem", color: "#ffffff", fontSize: "0.8rem", outline: "none" }}
                                    />
                                    <input 
                                      type="password" 
                                      placeholder="Password..." 
                                      value={previewPasswordInput}
                                      onChange={(e) => setPreviewPasswordInput(e.target.value)}
                                      style={{ width: "100%", height: "34px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0 0.5rem", color: "#ffffff", fontSize: "0.8rem", outline: "none" }}
                                    />
                                  </div>
                                  <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button className="btn-secondary" style={{ flex: 1, height: "32px", fontSize: "0.75rem", padding: 0 }} onClick={() => setShowPreviewLoginModal(false)}>Cancel</button>
                                    <button className="btn-primary" style={{ flex: 1, height: "32px", fontSize: "0.75rem", padding: 0, justifyContent: "center" }} onClick={handlePreviewUserLogin}>Sign In</button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : activeTab === "devtools" ? (
                          <div style={{ height: "500px", display: "flex", flexDirection: "column", background: "#202124", borderRadius: "0.5rem", overflow: "hidden", color: "#bdc1c6", fontFamily: "monospace" }}>
                            <div style={{ display: "flex", background: "#35363a", borderBottom: "1px solid #202124" }}>
                              {["Elements", "Console", "Sources", "Network", "Performance"].map(dtab => (
                                <div key={dtab} style={{ padding: "0.5rem 1rem", fontSize: "0.7rem", borderRight: "1px solid #202124", cursor: "pointer", background: dtab === "Console" ? "#202124" : "transparent" }}>{dtab}</div>
                              ))}
                            </div>
                            <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
                              <div style={{ color: "#81c995", marginBottom: "0.5rem" }}>[AppForge-Engine] Live tunnel active & synchronized.</div>
                              <div style={{ color: "#bdc1c6", marginBottom: "0.2rem" }}>&gt; Validating relational schemas database constraints...</div>
                              <div style={{ color: "#8ab4f8", marginBottom: "0.2rem" }}>[INFO] 4 validation rules ran against architecture.</div>
                              <div style={{ color: "#f28b82", marginBottom: "0.2rem" }}>[WARN] Security: Role-based auth missing constraint parameters. (Automatically repaired)</div>
                              <div style={{ color: "#81c995", marginBottom: "0.2rem" }}>[SUCCESS] Validated completely. Code synthesized.</div>
                              <div style={{ color: "#bdc1c6", marginTop: "1rem" }}>&gt; <span className="pulse">|</span></div>
                            </div>
                          </div>
                        ) : (
                          <pre style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, maxHeight: "500px", overflowY: "auto", fontFamily: "monospace" }}>
                            <code>{JSON.stringify(result.data[`${activeTab}Schema`] || result.data, null, 2)}</code>
                          </pre>
                        )}
                      </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* LANDING PAGE SHOWCASE & FEATURES */}
          {messages.length === 0 && (
            <div className="landing-sections">
              {/* Partner Logos */}
              <section className="container" style={{ padding: "3rem 0", textAlign: "center" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "2rem" }}>Trusted by developers worldwide</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "4rem", opacity: 0.5, flexWrap: "wrap", alignItems: "center" }}>
                  {["STRIPE", "VERCEL", "LINEAR", "RAILWAY", "SUPABASE"].map(logo => (
                    <span key={logo} className="glow-text" style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.08em", color: "#ffffff" }}>{logo}</span>
                  ))}
                </div>
              </section>

              {/* Showcase Grid */}
              <section className="container" style={{ padding: "5rem 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                  <h2 style={{ fontSize: "2.5rem" }}>Built beautifully with <span className="serif" style={{ fontStyle: "italic", color: "var(--primary)" }}>AppForge</span></h2>
                  <button className="btn-secondary" onClick={() => setCurrentPage("marketplace")} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    Explore Marketplace <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
                  {[
                    { title: "Project Management Hub", desc: "A Trello-style board with real-time updates and team collaboration roles.", tags: ["Auth", "DB", "Role-permissions"], img: "/project_management_mockup_1778235671328.png" },
                    { title: "E-commerce API Suite", desc: "Full-stack headless commerce engine with Stripe and inventory management.", tags: ["Stripe", "Relational DB", "Hosting"], img: "/ecommerce_api_mockup_1778235699880.png" },
                    { title: "AI Inbox Superagent", desc: "Autonomous agent that handles support tickets using Notion and Gmail.", tags: ["Superagents", "Integrations", "24/7 Run"], img: "/ai_agent_mockup_1778235728557.png" }
                  ].map((item, i) => (
                    <div key={i} className="card" style={{ padding: "0", overflow: "hidden" }}>
                      <div style={{ height: "180px", background: "rgba(255,99,31,0.05)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <div style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 700, padding: "0.5rem 1rem", border: "1px solid rgba(255,99,31,0.3)", borderRadius: "4px" }}>AppForge Auto-Generated UI</div>
                      </div>
                      <div style={{ padding: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#ffffff" }}>{item.title}</h3>
                        <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.5 }}>{item.desc}</p>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          {item.tags.map(tag => (
                            <span key={tag} className="feature-badge-secondary">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* CORE FEATURES LISTING */}
              <section style={{ background: "rgba(255, 255, 255, 0.01)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "7rem 0" }}>
                <div className="container">
                  <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                    <h2 style={{ fontSize: "3.2rem", marginBottom: "1rem" }}>{t.scaleTitle}</h2>
                    <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>{t.scaleSubtitle}</p>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "3rem" }}>
                    {[
                      { title: t.feature1Title, desc: t.feature1Desc, icon: <Activity size={28} /> },
                      { title: t.feature2Title, desc: t.feature2Desc, icon: <Download size={28} /> },
                      { title: t.feature3Title, desc: t.feature3Desc, icon: <Zap size={28} /> },
                      { title: t.feature4Title, desc: t.feature4Desc, icon: <Shield size={28} /> },
                      { title: t.feature5Title, desc: t.feature5Desc, icon: <RefreshCw size={28} /> },
                      { title: t.feature6Title, desc: t.feature6Desc, icon: <LayoutIcon size={28} /> }
                    ].map((feat, i) => (
                      <div key={i} style={{ textAlign: "left" }} className="card">
                        <div style={{ color: "var(--primary)", marginBottom: "1.2rem" }}>{feat.icon}</div>
                        <h3 style={{ fontSize: "1.35rem", marginBottom: "0.75rem", color: "#ffffff" }}>{feat.title}</h3>
                        <p style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: "0.9rem" }}>{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* PROCESS STEPPING */}
              <section className="container" style={{ padding: "7rem 0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "6rem", alignItems: "center" }}>
                  <div>
                    <h2 style={{ fontSize: "3.2rem", marginBottom: "2rem", lineHeight: 1.1 }}>{t.processTitle}</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                      {[
                        { step: "01", title: t.step1Title, desc: t.step1Desc },
                        { step: "02", title: t.step2Title, desc: t.step2Desc },
                        { step: "03", title: t.step3Title, desc: t.step3Desc }
                      ].map(item => (
                        <div key={item.step} style={{ display: "flex", gap: "1.5rem" }}>
                          <span style={{ color: "var(--primary)", fontWeight: 800, fontSize: "1.2rem" }}>{item.step}</span>
                          <div>
                            <h4 style={{ fontSize: "1.15rem", marginBottom: "0.25rem", color: "#ffffff" }}>{item.title}</h4>
                            <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.5 }}>{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "#06060c", border: "1px solid var(--border)", borderRadius: "1.5rem", padding: "1.25rem" }}>
                    <div style={{ background: "#10101a", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "1rem", overflow: "hidden" }}>
                      <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "0.4rem" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f56" }} />
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27c93f" }} />
                      </div>
                      <div style={{ padding: "1.5rem", color: "#71717a", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.6 }}>
                        <div style={{ color: "var(--primary)", fontWeight: "bold" }}>compiling_pipeline...</div>
                        <div>&gt; extracting intent context</div>
                        <div>&gt; generating schema definitions</div>
                        <div style={{ color: "#d4ff00" }}>&gt; synthesizing react components</div>
                        <div>&gt; validating constraints and rules</div>
                        <div style={{ marginTop: "1rem", color: "#10b981", fontWeight: "bold" }}>SUCCESS: Relational application synthesized correctly. ready for export.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      {/* SUBPAGE: TEMPLATES MARKETPLACE */}
      {currentPage === "marketplace" && (
        <section className="container" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>Templates Marketplace</h1>
            <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>Pre-configured architectures ready for deployment. Customize instantly with AI.</p>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {[
              { 
                title: "SaaS Starter Kit", 
                desc: "Relational database schema with role-based auth, Stripe payments, dashboard preview page, and onboarding flows.", 
                prompt: "Build a premium SaaS Starter Kit with complete user onboarding, relational profiles database, custom domains support, and role-based editor/admin tiers.",
                type: "App",
                tags: ["Stripe", "Authentication", "relational-db"] 
              },
              { 
                title: "Support Ticket AI Agent", 
                desc: "Superagent backend that autonomous reads emails via Google API, auto-categorizes, drafts responses, and logs in Notion.", 
                prompt: "Create an autonomous support ticket Superagent that connects to Gmail and Notion. Automatically categorize incoming complaints, write high-quality replies, and store customer metadata.",
                type: "Superagent",
                tags: ["Gmail Integration", "Notion Hub", "24/7 autonomous"] 
              },
              { 
                title: "Headless E-Store Backend", 
                desc: "High-performance shopping api with inventory control, cart sync, checkout webhooks, and automatic emails.", 
                prompt: "Develop a headless e-commerce backend API supporting shopping cart pipelines, real-time stock deductions, Stripe checkout sessions, and automated order confirmation emails.",
                type: "App",
                tags: ["Inventory", "Email Sending", "Stripe Webhooks"] 
              },
              { 
                title: "Team Calendar Synchronizer", 
                desc: "Superagent that syncs Google Calendars across team accounts, detects scheduling overlaps, and sends Slack warnings.", 
                prompt: "Design a scheduling Superagent that integrates Google Calendar and Slack. Scans and matches cross-account schedules, schedules optimal meeting spaces, and alerts participants via Slack.",
                type: "Superagent",
                tags: ["Google Calendar", "Slack Sync", "Automations"] 
              },
              { 
                title: "Lead Gen CRM Portal", 
                desc: "Customer tracking dashboard with relational tables, user access controls, and beautiful chart analysis screens.", 
                prompt: "Build a custom CRM lead tracking application. Feature custom tables for pipelines, role-based permission rules for regional sales reps, and a beautiful analytical dashboard UI.",
                type: "App",
                tags: ["Role Auth", "Analytics UI", "Relational Database"] 
              },
              { 
                title: "Affiliate Referral Portal", 
                desc: "Referral management template. Tracks referral links, clicks, dynamic payout calculations, and custom payout integrations.", 
                prompt: "Create an Affiliate Referral tracking application. Features custom link generations, click counters, database storage for commission calculations, and automated email notifications.",
                type: "App",
                tags: ["Relational Database", "Analytics", "Emails"] 
              },
              { 
                title: "HR Employee Directory & Admin Tool", 
                desc: "Relational database schema with role-based auth, employee profile directory, vacation tracking requests, and payroll logs.", 
                prompt: "Build a premium HR Management Tool. Features custom relational tables for employees and departments, vacation requests approval workflows, and role-based permissions where Managers approve time-offs and Employees view only their profiles.",
                type: "App",
                tags: ["HR Tool", "Role Auth", "Workflows"] 
              },
              { 
                title: "Headless Blog & CMS System", 
                desc: "Fully relational database schema for posts, categories, tags, and authors, with public JSON endpoints, auth dashboard, and responsive post render previews.", 
                prompt: "Design a headless developer blog system. Features relational tables for Posts, Authors, Tags, and Comments. Generates an endpoint for public articles retrieval, a markdown editor preview interface, and automated comment moderation webhooks.",
                type: "App",
                tags: ["CMS Engine", "Markdown", "Public APIs"] 
              },
              { 
                title: "Sleek Developer Portfolio Sandbox", 
                desc: "Responsive visual frontend displaying personal projects, active services latency indicators, live contact form linked to DB records, and a custom GitHub sync status display.", 
                prompt: "Create a modern, sleek developer portfolio. Features custom project grid elements, visual progress trackers, active contact forms storing entries in the relational database, and unified GitHub commit log synchronization.",
                type: "App",
                tags: ["Portfolio", "Visual UI", "GitHub Sync"] 
              }
            ].map((tmpl, idx) => (
              <div key={idx} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span className="feature-badge">{tmpl.type}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Pre-validated</span>
                  </div>
                  <h3 style={{ fontSize: "1.3rem", color: "#ffffff", marginBottom: "0.5rem" }}>{tmpl.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "1.5rem" }}>{tmpl.desc}</p>
                </div>
                <div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                    {tmpl.tags.map(t => <span key={t} className="feature-badge-secondary">{t}</span>)}
                  </div>
                  <button 
                    className="btn-primary" 
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => {
                      setPrompt(tmpl.prompt);
                      setActiveMode(tmpl.type === "Superagent" ? "agents" : "apps");
                      setCurrentPage("home");
                    }}
                  >
                    Customize with AI <Sparkles size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SUBPAGE: ROADMAP & FEATURE REQUESTS (KANBAN STYLE) */}
      {currentPage === "roadmap" && (
        <section className="container" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "3.2rem", marginBottom: "0.5rem" }}>Public Roadmap</h1>
            <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: "600px", margin: "0 auto 1.5rem" }}>
              It is not a commitment to deliver any features or functionality and should not be relied on for purchasing decisions. All items are subject to change at AppForge's sole discretion.
            </p>
            <button 
              className="btn-primary" 
              onClick={() => setShowSubmitRequestModal(true)}
              style={{ margin: "0 auto", display: "flex", gap: "0.5rem" }}
            >
              <Plus size={16} /> Submit a Feature Request
            </button>
          </div>

          {/* Kanban Columns Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", overflowX: "auto", paddingBottom: "2rem" }}>
            {[
              { id: "backlog", title: "Backlog", badge: "3.8k", color: "rgba(255, 255, 255, 0.08)" },
              { id: "nextup", title: "Next up", badge: "5", color: "#8b5cf6" },
              { id: "inprogress", title: "In Progress", badge: "3b82f6" },
              { id: "done", title: "Done", badge: "63", color: "#10b981" }
            ].map(col => {
              const colCards = roadmapCards.filter(c => c.status === col.id);
              
              // Dynamic calculation for realistic counts matching screenshots
              let visualCountStr = col.badge;
              if (col.id === "backlog") {
                visualCountStr = `${(((colCards.length - 10) + 3812) / 1000).toFixed(1)}k`;
              } else if (col.id === "nextup") {
                visualCountStr = `${colCards.length}`;
              } else if (col.id === "inprogress") {
                visualCountStr = `${colCards.length}`;
              } else if (col.id === "done") {
                visualCountStr = `${colCards.length + 52}`;
              }

              return (
                <div key={col.id} style={{ background: "rgba(10, 10, 15, 0.5)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem", minHeight: "650px", minWidth: "260px" }}>
                  {/* Column Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: col.id === "backlog" ? "rgba(255, 255, 255, 0.2)" : col.id === "nextup" ? "#8b5cf6" : col.id === "inprogress" ? "#3b82f6" : "#10b981" }} />
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ffffff" }}>{col.title}</span>
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "var(--muted)", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", padding: "2px 6px", borderRadius: "9999px", fontWeight: "bold" }}>
                      {visualCountStr}
                    </span>
                  </div>

                  {/* Cards stack */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {colCards.map(card => (
                      <div 
                        key={card.id} 
                        onClick={() => setSelectedRoadmapCard(card)}
                        className="card" 
                        style={{ padding: "1rem", cursor: "pointer", background: "rgba(20, 20, 30, 0.8)", border: "1px solid var(--border)", transition: "all 0.2s" }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                          {/* Feature Request Badge */}
                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "rgba(251, 191, 36, 0.08)", border: "1px solid rgba(251, 191, 36, 0.15)", borderRadius: "4px", padding: "2px 6px" }}>
                            <HelpCircle size={10} color="#fbbf24" />
                            <span style={{ fontSize: "0.6rem", color: "#fbbf24", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em" }}>{card.category}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 style={{ fontSize: "0.85rem", color: "#ffffff", fontWeight: 500, lineHeight: 1.4, marginBottom: "1rem", minHeight: "40px" }}>
                          {card.title}
                        </h4>

                        {/* Done specifications */}
                        {card.status === "done" && (card.priority || card.date) && (
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                            {card.priority && (
                              <span style={{ fontSize: "0.6rem", display: "flex", alignItems: "center", gap: "0.25rem", color: "#f87171", background: "rgba(248, 113, 113, 0.08)", border: "1px solid rgba(248, 113, 113, 0.15)", padding: "1px 5px", borderRadius: "4px", fontWeight: "bold" }}>
                                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#f87171" }} />
                                {card.priority}
                              </span>
                            )}
                            {card.date && (
                              <span style={{ fontSize: "0.6rem", color: "var(--muted)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", padding: "1px 5px", borderRadius: "4px" }}>
                                📅 {card.date}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Card Footer Actions */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: "0.75rem", fontSize: "0.75rem" }}>
                          {/* Comments count */}
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--muted)" }}>
                            <MessageSquare size={12} />
                            <span style={{ fontWeight: 600 }}>{card.commentsCount}</span>
                          </div>

                          {/* Upvotes button */}
                          <button
                            onClick={(e) => handleRoadmapUpvote(card.id, e)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              background: card.hasVoted ? "rgba(255, 99, 31, 0.15)" : "rgba(255, 255, 255, 0.03)",
                              border: card.hasVoted ? "1px solid var(--primary)" : "1px solid var(--border)",
                              borderRadius: "6px",
                              padding: "4px 8px",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            <ChevronRight size={10} style={{ transform: "rotate(-90deg)", color: card.hasVoted ? "var(--primary)" : "var(--muted)", fontWeight: "bold" }} />
                            <span style={{ fontWeight: "bold", fontSize: "0.7rem", color: card.hasVoted ? "var(--primary)" : "#ffffff" }}>
                              {card.upvotes >= 1000 ? `${(card.upvotes / 1000).toFixed(1)}k` : card.upvotes}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SUBPAGE: ONE-CLICK INTEGRATIONS */}
      {currentPage === "integrations" && (
        <section className="container" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>One-Click Integrations</h1>
            <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>Plug external APIs into your application model. Zero token or connection boilerplate required.</p>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {[
              { id: "slack", title: "Slack", desc: "Auto-post compiler alerts, sync communication channels, or handle queries." },
              { id: "gmail", title: "Gmail API", desc: "Generate automated responses, scan tickets, or draft templates autonomously." },
              { id: "notion", title: "Notion", desc: "Store structured tables, customer records, and dashboard metrics instantly." },
              { id: "calendar", title: "Google Calendar", desc: "Check scheduling, coordinate time frames, and plan calendar tasks automatically." },
              { id: "hubspot", title: "Hubspot", desc: "Push synchronized leads, track client status, and update CRM records." },
              { id: "salesforce", title: "Salesforce", desc: "Synchronize client pipelines, compile revenue charts, and map contacts." }
            ].map(intg => (
              <div key={intg.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div className="logo-icon" style={{ background: "rgba(255,255,255,0.05)", color: "#ffffff", fontSize: "0.6rem" }}>API</div>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: 700, 
                      color: integrationStatus[intg.id] === "connected" ? "#10b981" : "var(--muted)" 
                    }}>
                      {integrationStatus[intg.id].toUpperCase()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.3rem", color: "#ffffff", marginBottom: "0.5rem" }}>{intg.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "1.5rem" }}>{intg.desc}</p>
                </div>
                <div>
                  <button 
                    className="btn-secondary" 
                    style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    onClick={() => testConnection(intg.id)}
                    disabled={testingIntegration === intg.id}
                  >
                    {testingIntegration === intg.id ? (
                      <>
                        <RefreshCw size={14} className="spinner" /> Connection Tuning...
                      </>
                    ) : integrationStatus[intg.id] === "connected" ? (
                      <>
                        <Check size={14} color="#10b981" /> Re-test Connection
                      </>
                    ) : (
                      "Connect Integration"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SUBPAGE: DEVELOPER FEATURES, CLI & SDKs */}
      {currentPage === "sdks" && (
        <section className="container" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>Developer SDKs & CLI Tooling</h1>
            <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>Access AppForge backend compiler clusters directly. Build frontend layouts using our unified SDK services.</p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "1.2fr 1.8fr", gap: "3rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="card">
                <h3 style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Terminal size={18} color="var(--primary)" /> CLI Installation
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                  Synchronize your local IDE automatically, compile configurations via CLI, or sync migrations directly from your terminal workspace.
                </p>
                <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)", padding: "0.75rem 1rem", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.8rem", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <code>npm install -g @appforge/cli</code>
                  <button onClick={() => handleCopy("npm install -g @appforge/cli")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}><Copy size={14} /></button>
                </div>
                <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)", padding: "0.75rem 1rem", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.8rem", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <code>appforge dev --sync</code>
                  <button onClick={() => handleCopy("appforge dev --sync")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}><Copy size={14} /></button>
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Cpu size={18} color="var(--primary)" /> GitHub 2-Way Sync
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  Available in <strong>Builder Plans+</strong>. Every change pushed to your local terminal instantly auto-commits to your linked GitHub repository. Alternatively, alter layouts in the online editor, and changes push back instantly.
                </p>
              </div>
            </div>

            <div className="card" style={{ background: "rgba(10, 10, 15, 0.95)" }}>
              <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
                <span style={{ paddingBottom: "0.5rem", borderBottom: "2px solid var(--primary)", fontSize: "0.8rem", color: "var(--primary)", fontWeight: "bold", textTransform: "uppercase" }}>JavaScript SDK</span>
                <span style={{ paddingBottom: "0.5rem", fontSize: "0.8rem", color: "var(--muted)", fontWeight: "bold", textTransform: "uppercase" }}>Kotlin SDK</span>
              </div>
              <pre style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.6, overflowX: "auto" }}>
                <code>{`// Initialize unified AppForge SDK Instance
import { AppForgeClient } from '@appforge/sdk';

const appforge = new AppForgeClient({
  apiKey: process.env.APPFORGE_API_KEY,
  environment: 'production'
});

// Query auto-synthesized database tables
async function getPipelineData() {
  try {
    const contacts = await appforge.db('contacts').select({
      filter: { role: 'editor' },
      limit: 10
    });
    
    console.log('Synchronized Relational Profiles:', contacts);
  } catch (error) {
    console.error('API Tunnel Connection error:', error);
  }
}

// Trigger Superagent autonomous pipelines
async function triggerAgent(inputPrompt) {
  const result = await appforge.agents.trigger('SupportAgent', {
    prompt: inputPrompt,
    allowAutonomousTools: true
  });
  
  return result;
}`}</code>
              </pre>
            </div>
          </div>
        </section>
      )}

      {/* SUBPAGE: PLANS & PRICING */}
      {currentPage === "pricing" && (
        <section className="container" style={{ paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" }}>
          <div style={{ marginBottom: "4rem" }}>
            <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{t.pricingTitle}</h1>
            <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>{t.pricingSubtitle}</p>
            {promoApplied && (
              <div style={{ display: "inline-block", background: "rgba(255, 99, 31, 0.15)", border: "1px solid var(--primary)", padding: "0.4rem 1rem", borderRadius: "9999px", color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem", marginTop: "1rem" }}>
                🎉 44% DISCOUNT COUPON APPLIED SUCCESSFULLY!
              </div>
            )}
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
            {[
              { name: "Free", desc: "Core AI building models, credit-based test limits.", price: 0, credits: "100 Credits/mo", features: ["1 Active application", "Auto-generated UI design", "Relational database schema", "Community Discord support"] },
              { name: "Starter", desc: "Ideal for validation and launch tests.", price: 16, credits: "1,000 Credits/mo", features: ["3 Active applications", "One-click domain hosting", "Relational DB tables", "Email sending backend"] },
              { name: "Builder", desc: "Recommended. GitHub 2-Way Sync included.", price: 44, credits: "5,000 Credits/mo", features: ["Unlimited applications", "GitHub 2-way syncing", "Superagents autonomous core", "JavaScript & Kotlin SDK access"] },
              { name: "Pro", desc: "High traffic scalability and team spaces.", price: 80, credits: "15,000 Credits/mo", features: ["Dynamic role permissions", "Built-in analytics metrics", "Unlimited Superagent triggers", "Prioritized compiler pipelines"] },
              { name: "Elite", desc: "Enterprise scale with custom models.", price: 160, credits: "50,000 Credits/mo", features: ["Dedicated model tuning", "Custom API endpoints link", "24/7 Developer SLA support", "Higher Ed programs integration"] }
            ].map((plan) => {
              const discountedPrice = (plan.price * 0.56).toFixed(2);
              return (
                <div key={plan.name} className="card" style={{ textAlign: "left", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", border: plan.name === "Builder" ? "2px solid var(--primary)" : "1px solid var(--border)" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <h3 style={{ fontSize: "1.4rem", color: "#ffffff" }}>{plan.name}</h3>
                      {plan.name === "Builder" && <span className="feature-badge" style={{ fontSize: "0.6rem" }}>POPULAR</span>}
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "1rem", minHeight: "35px" }}>{plan.desc}</p>
                    
                    <div style={{ marginBottom: "1rem" }}>
                      {promoApplied && plan.price > 0 ? (
                        <div>
                          <span style={{ fontSize: "1.1rem", textDecoration: "line-through", color: "var(--muted)", marginRight: "0.5rem" }}>${plan.price}</span>
                          <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>${discountedPrice}</span>
                          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>/mo</span>
                        </div>
                      ) : (
                        <div>
                          <span style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff" }}>${plan.price}</span>
                          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>/mo</span>
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 700, marginBottom: "1.5rem", textTransform: "uppercase" }}>{plan.credits}</div>

                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.8rem", color: "#d1d5db", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <CheckCircle size={12} color="var(--primary)" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="btn-secondary" style={{ width: "100%", marginTop: "1.5rem", background: plan.name === "Builder" ? "var(--primary)" : "", color: plan.name === "Builder" ? "#ffffff" : "", border: "none" }}>
                    Choose {plan.name}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SUBPAGE: SCOPE COMPARISON */}
      {currentPage === "compare" && (
        <section className="container" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
          {/* Header Area */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.8rem", fontWeight: 800, marginBottom: "1rem" }}>
              Feature Scope & Coverage
            </div>
            <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>
              AppForge AI vs Typical AI Builders
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
              We have systematically integrated every single developer request, resolving all 34 backlog requests and closing the feature gaps. See the full coverage matrix below.
            </p>
          </div>

          {/* Progress / Coverage Bars Cards */}
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "4rem" }}>
            {/* Competitor Card */}
            <div className="card" style={{ padding: "2rem", border: "1px solid rgba(255,99,31,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.5rem", color: "#ffffff" }}>Typical AI Builders</h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Standard AI Compiler</span>
                </div>
                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary)", fontFamily: "monospace" }}>95%</div>
              </div>
              <div style={{ height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden", marginBottom: "1rem" }}>
                <div style={{ width: "95%", height: "100%", background: "var(--primary)", boxShadow: "0 0 10px rgba(255,99,31,0.5)" }} />
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Typical AI builders are highly optimized for static generation and simple database hooks, but contain key pipeline gaps in autonomous agent execution, real-time database schema debugging, CLI environments, and raw full-stack file exports.
              </p>
            </div>

            {/* AppForge AI Card */}
            <div className="card" style={{ padding: "2rem", border: "1px solid rgba(139,92,246,0.3)", background: "rgba(20, 10, 35, 0.4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.5rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    AppForge AI <span className="feature-badge" style={{ background: "rgba(139,92,246,0.2)", borderColor: "rgba(139,92,246,0.4)", color: "#a78bfa" }}>Supreme</span>
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Full-Stack App Forge Playground</span>
                </div>
                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "#a78bfa", fontFamily: "monospace" }}>100%</div>
              </div>
              <div style={{ height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden", marginBottom: "1rem" }}>
                <div style={{ width: "100%", height: "100%", background: "#8b5cf6", boxShadow: "0 0 15px rgba(139,92,246,0.6)" }} />
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                By connecting real-time database record synthesizers, 24/7 background agent automation workflows, multi-model LLM select gateways, interactive DNS custom domain resolvers, and live terminal analytics tracking, AppForge is 100% complete.
              </p>
            </div>
          </div>

          {/* Filtering Categories */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {["All", "Core Building", "Backend & Storage", "AI & Agents", "Output & Deployment", "Integrations", "Dev Features"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCompareCategory(cat)}
                className={`switch-item ${compareCategory === cat ? "active" : ""}`}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "9999px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  border: "1px solid var(--border)",
                  background: compareCategory === cat ? "var(--primary)" : "rgba(255,255,255,0.02)",
                  color: compareCategory === cat ? "white" : "var(--muted)",
                  transition: "all 0.2s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Comparison Matrix Table */}
          <div className="card" style={{ padding: "0", overflow: "hidden", marginBottom: "4rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.9rem", color: "var(--primary)", fontWeight: 700 }}>Feature Capability</th>
                  <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.9rem", color: "#ffffff", fontWeight: 700, width: "150px", textAlign: "center" }}>Typical AI Builders</th>
                  <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.9rem", color: "#8b5cf6", fontWeight: 700, width: "180px", textAlign: "center" }}>AppForge AI</th>
                  <th style={{ padding: "1.25rem 1.5rem", fontSize: "0.9rem", color: "var(--muted)", fontWeight: 500 }}>Technical Details & Resolution</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures
                  .filter(f => compareCategory === "All" || f.category === compareCategory)
                  .map((feat, idx) => (
                    <tr
                      key={feat.name}
                      style={{
                        borderBottom: idx === comparisonFeatures.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
                        background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                        transition: "background 0.2s"
                      }}
                    >
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <div style={{ fontWeight: 600, color: "#ffffff", fontSize: "0.95rem", marginBottom: "0.25rem" }}>{feat.name}</div>
                        <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: "4px" }}>
                          {feat.category}
                        </span>
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem", textAlign: "center" }}>
                        {feat.standardBuilder ? (
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#10b981", gap: "0.25rem" }}>
                            <Check size={18} />
                            <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Yes</span>
                          </div>
                        ) : (
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#ef4444", gap: "0.25rem" }}>
                            <span style={{ fontSize: "1.1rem" }}>❌</span>
                            <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>No</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem", textAlign: "center", background: "rgba(139,92,246,0.03)" }}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#8b5cf6", gap: "0.25rem" }}>
                          <CheckCircle size={18} style={{ filter: "drop-shadow(0 0 5px rgba(139,92,246,0.5))" }} />
                          <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>100% Active</span>
                        </div>
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5 }}>
                        {feat.detail}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* What AppForge AI does that others don't Section */}
          <div style={{ marginTop: "5rem" }}>
            <h2 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "3rem" }}>
              What <span style={{ color: "#8b5cf6", fontStyle: "italic", fontFamily: "var(--font-serif)" }}>AppForge AI</span> does that others don't
            </h2>
            <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
              <div className="card" style={{ border: "1px solid rgba(139,92,246,0.15)", background: "rgba(139,92,246,0.02)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6", marginBottom: "1.5rem" }}>
                  <Cpu size={20} />
                </div>
                <h3 style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.75rem" }}>24/7 Autonomous Agents</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                  Run workflows indefinitely. Typical AI compilers only execute UI triggers, while AppForge supports background listeners, automated loops, and persistent API triggers.
                </p>
              </div>

              <div className="card" style={{ border: "1px solid rgba(139,92,246,0.15)", background: "rgba(139,92,246,0.02)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6", marginBottom: "1.5rem" }}>
                  <Code size={20} />
                </div>
                <h3 style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.75rem" }}>Full Stack Export (Zero Lock-in)</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                  Unlike proprietary cloud runtimes, export production-ready standard code. Zip bundles contain clean Next.js, Python FastAPI backend, and SQL migrations.
                </p>
              </div>

              <div className="card" style={{ border: "1px solid rgba(139,92,246,0.15)", background: "rgba(139,92,246,0.02)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6", marginBottom: "1.5rem" }}>
                  <Database size={20} />
                </div>
                <h3 style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.75rem" }}>Interactive DB Sandbox</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                  Verify that data gets written immediately. The live relational database tab displays active record logs and collections updating in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SUBPAGE: ENTERPRISE */}
      {currentPage === "enterprise" && (
        <section className="container" style={{ paddingTop: "6rem", paddingBottom: "6rem", textAlign: "center" }}>
          <div style={{ color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.8rem", fontWeight: 800, marginBottom: "1rem" }}>Enterprise Solutions</div>
          <h1 style={{ fontSize: "4.5rem", marginBottom: "1.5rem" }}>Ideas shouldn't wait <br /><span className="serif" style={{ fontStyle: "italic", color: "var(--primary)" }}>for development sprints.</span></h1>
          <p style={{ maxWidth: "600px", margin: "0 auto 3rem", color: "var(--muted)", fontSize: "1.1rem", lineHeight: 1.6 }}>
            AppForge AI compiler pipeline provides secure, scalable, role-restricted, and custom API-integrated environments at maximum velocity.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1rem" }} onClick={() => alert("Sales chat initiated. Our team will contact you within 2 hours.")}>Talk to Sales</button>
            <button className="btn-secondary" style={{ padding: "1rem 2.5rem", fontSize: "1rem" }} onClick={() => setCurrentPage("docs")}>View Docs</button>
          </div>
        </section>
      )}

      {/* SUBPAGE: DOCUMENTATION */}
      {currentPage === "docs" && (
        <section className="container" style={{ paddingTop: "5rem", paddingBottom: "5rem", display: "grid", gridTemplateColumns: "250px 1fr", gap: "4rem" }}>
          <aside style={{ borderRight: "1px solid var(--border)", paddingRight: "2rem" }}>
            <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--primary)", fontWeight: 700, marginBottom: "1.2rem", letterSpacing: "0.05em" }}>Getting Started</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem", color: "var(--muted)", fontWeight: 500 }}>
              <span style={{ color: "var(--primary)", fontWeight: 700, cursor: "pointer" }}>Introduction</span>
              <span style={{ cursor: "pointer" }} onClick={() => alert("Architecture schemas guide loading...")}>Compiler Pipelines</span>
              <span style={{ cursor: "pointer" }} onClick={() => alert("Superagents execution logic loading...")}>Superagents 24/7</span>
              <span style={{ cursor: "pointer" }} onClick={() => alert("Local SDK sync loading...")}>SDK Integration</span>
              <span style={{ cursor: "pointer" }} onClick={() => alert("Database migrations loading...")}>Database Sync</span>
              <span style={{ cursor: "pointer" }} onClick={() => alert("Accessibility statements loading...")}>Accessibility Guidelines</span>
            </div>
          </aside>
          <article style={{ textAlign: "left", maxWidth: "850px" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>Documentation</h1>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "2rem" }}>
              Welcome to the AppForge Documentation center. Learn how to translate natural English prompts into validated, clean, scalable code repositories automatically.
            </p>
            <div className="card" style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.3rem", color: "#ffffff", marginBottom: "0.75rem" }}>The Multi-stage Pipeline</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Every request goes through 4 distinct compiler steps: Intent Extraction, Architecture Design, Schema Creation, and Cross-layer Validation. If schemas violate constraints, our surgical repair engines automatically patch anomalies instantly.
              </p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: "1.3rem", color: "#ffffff", marginBottom: "0.75rem" }}>2-Way GitHub Syncing</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Builder tiers automatically connect custom repositories. Any change in the terminal automatically triggers online code merges and database schema migrations.
              </p>
            </div>
          </article>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "5rem 0 3rem", background: "rgba(255,255,255,0.01)" }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "2.5fr 1fr 1fr 1fr", gap: "4rem", marginBottom: "4rem" }}>
            <div>
              <div className="logo" style={{ marginBottom: "1.5rem" }}>
                <div className="logo-icon">44</div>
                <span>APPFORGE</span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6, maxWidth: "320px", marginBottom: "1.5rem" }}>
                The AI-native software compiler. Describe your app or autonomous superagent in plain English, and build instantly.
              </p>
              {/* Higher Ed Program callout */}
              <div style={{ background: "rgba(255,99,31,0.05)", border: "1px solid rgba(255,99,31,0.2)", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.75rem", color: "#ffffff", maxWidth: "320px" }}>
                🎓 <strong>Higher Ed Program:</strong> Partnered with elite universities. Free Builder licenses for students.
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: "0.85rem", color: "#ffffff", marginBottom: "1.2rem", fontWeight: 700 }}>Platform</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem", color: "var(--muted)" }}>
                <li onClick={() => { setActiveMode("apps"); setCurrentPage("home"); }} style={{ cursor: "pointer" }}>Builder Sandbox</li>
                <li onClick={() => { setActiveMode("agents"); setCurrentPage("home"); }} style={{ cursor: "pointer" }}>Superagents Engine</li>
                <li onClick={() => setCurrentPage("marketplace")} style={{ cursor: "pointer" }}>Templates Hub</li>
                <li onClick={() => setCurrentPage("pricing")} style={{ cursor: "pointer" }}>Pricing Tiers</li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: "0.85rem", color: "#ffffff", marginBottom: "1.2rem", fontWeight: 700 }}>Resources</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem", color: "var(--muted)" }}>
                <li onClick={() => setCurrentPage("docs")} style={{ cursor: "pointer" }}>Documentation</li>
                <li onClick={() => setCurrentPage("roadmap")} style={{ cursor: "pointer" }}>Changelog & Roadmap</li>
                <li onClick={() => window.open("https://discord.gg", "_blank")} style={{ cursor: "pointer" }}>Discord Community</li>
                <li onClick={() => alert("Partner Program: Find developers or hire expert agencies.")} style={{ cursor: "pointer" }}>Hire a Partner</li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: "0.85rem", color: "#ffffff", marginBottom: "1.2rem", fontWeight: 700 }}>Policies & Rules</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem", color: "var(--muted)" }}>
                <li onClick={() => setShowOwnershipModal(true)} style={{ cursor: "pointer", color: "var(--primary)", fontWeight: "bold" }}>Code Ownership Statement</li>
                <li onClick={() => setShowAccessibilityModal(true)} style={{ cursor: "pointer" }}>Accessibility Statement</li>
                <li onClick={() => setShowStatusModal(true)} style={{ cursor: "pointer" }}>Service Status</li>
                <li onClick={() => alert("Earn 25% lifetime commission by referring users.")} style={{ cursor: "pointer" }}>Affiliate Program</li>
              </ul>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--muted)", fontSize: "0.8rem", borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
            <p>© 2026 AppForge AI Inc. All rights reserved.</p>
            <div style={{ display: "flex", gap: "2rem" }}>
              <span onClick={() => setShowStatusModal(true)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} className="pulse" />
                Status: All Systems Operational (status.appforge.ai)
              </span>
              <span>v4.4.0-builder</span>
            </div>
          </div>
        </div>
      </footer>

      {/* POPUP MODAL: SERVICE STATUS */}
      {showStatusModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: "450px", width: "90%" }}>
            <h3 style={{ fontSize: "1.4rem", color: "#ffffff", marginBottom: "1rem" }}>System Status</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.5rem 0" }}>
              {[
                { name: "AppForge AI Compiler Gateway", rate: "100%", status: "Operational" },
                { name: "Surgical Code Synthesizer", rate: "99.98%", status: "Operational" },
                { name: "One-Click Deploy Hosting Cluster", rate: "100%", status: "Operational" },
                { name: "Relational Database Auto-provisioner", rate: "99.95%", status: "Operational" },
                { name: "Chrome DevTools Tunnel Sync", rate: "100%", status: "Operational" }
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--muted)" }}>{item.name}</span>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>{item.rate}</span>
                </div>
              ))}
            </div>
            <button className="btn-secondary" style={{ width: "100%" }} onClick={() => setShowStatusModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* POPUP MODAL: CODE OWNERSHIP */}
      {showOwnershipModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: "500px", width: "90%" }}>
            <h3 style={{ fontSize: "1.4rem", color: "#ffffff", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Award color="var(--primary)" /> Code Ownership Policy
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6, margin: "1.5rem 0" }}>
              At AppForge, <strong>YOU OWN 100% OF YOUR GENERATED CODE</strong>. <br /><br />
              Unlike other platforms that lock you into proprietary hosting formats or custom database configurations, AppForge builds standard React (Next.js), FastAPI (Python), and PostgreSQL (SQL) migrations. <br /><br />
              You are free to download your project bundle, copy code blocks directly, sync to GitHub, and deploy to your own custom servers (AWS, Vercel, Railway) at any time. There is absolutely zero vendor lock-in.
            </p>
            <button className="btn-secondary" style={{ width: "100%" }} onClick={() => setShowOwnershipModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* POPUP MODAL: ACCESSIBILITY */}
      {showAccessibilityModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: "500px", width: "90%" }}>
            <h3 style={{ fontSize: "1.4rem", color: "#ffffff", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Shield color="var(--primary)" /> Accessibility Statement
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6, margin: "1.5rem 0" }}>
              AppForge is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards. <br /><br />
              All generated web user interfaces are synthesized conforming to the **WCAG 2.1 Level AA** guidelines:
              - Proper heading hierarchies (H1 to H6)
              - Form elements auto-linked to descriptive screen-reader labels
              - Focus state visibility triggers for keyboard navigations
              - High-contrast visual properties
            </p>
            <button className="btn-secondary" style={{ width: "100%" }} onClick={() => setShowAccessibilityModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* POPUP MODAL: ROADMAP CARD DETAILS & COMMENTS */}
      {selectedRoadmapCard && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: "550px", width: "90%", maxHeight: "80vh", display: "flex", flexDirection: "column", background: "rgba(15, 15, 25, 0.98)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "rgba(251, 191, 36, 0.08)", border: "1px solid rgba(251, 191, 36, 0.15)", borderRadius: "4px", padding: "2px 6px" }}>
                <HelpCircle size={10} color="#fbbf24" />
                <span style={{ fontSize: "0.6rem", color: "#fbbf24", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em" }}>{selectedRoadmapCard.category}</span>
              </div>
              <button 
                className="btn-ghost" 
                onClick={() => setSelectedRoadmapCard(null)} 
                style={{ padding: "0.25rem 0.5rem" }}
              >
                ✕
              </button>
            </div>
            <h3 style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.75rem", lineHeight: 1.4 }}>{selectedRoadmapCard.title}</h3>
            <div style={{ display: "flex", gap: "1rem", color: "var(--muted)", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
              <span>Status: <strong style={{ color: "var(--primary)" }}>{selectedRoadmapCard.status.toUpperCase()}</strong></span>
              <span>•</span>
              <span>Upvotes: <strong>{selectedRoadmapCard.upvotes}</strong></span>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <h4 style={{ fontSize: "0.85rem", color: "#ffffff", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MessageSquare size={14} color="var(--primary)" /> Comments ({selectedRoadmapCard.comments.length})
              </h4>
              
              {/* Comment list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", overflowY: "auto", marginBottom: "1.25rem", flex: 1, paddingRight: "0.25rem" }}>
                {selectedRoadmapCard.comments.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontStyle: "italic", padding: "1rem 0" }}>No comments yet. Start the conversation below!</p>
                ) : (
                  selectedRoadmapCard.comments.map((cmt: string, idx: number) => (
                    <div key={idx} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "0.6rem 0.85rem", borderRadius: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.20rem" }}>
                        <span>Anonymous Builder</span>
                        <span>Just now</span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "#ffffff", lineHeight: 1.4 }}>{cmt}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment form */}
              <form onSubmit={handleSubmitComment} style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                <input 
                  type="text"
                  placeholder="Write an insightful comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  required
                  style={{ 
                    flex: 1,
                    height: "38px", 
                    borderRadius: "8px", 
                    border: "1px solid var(--border)", 
                    background: "rgba(0,0,0,0.3)", 
                    padding: "0 0.85rem",
                    fontSize: "0.85rem",
                    color: "#ffffff",
                    outline: "none"
                  }}
                />
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ height: "38px", padding: "0 1rem", borderRadius: "8px", fontSize: "0.8rem" }}
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: SUBMIT FEATURE REQUEST */}
      {showSubmitRequestModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <form onSubmit={handleSubmitFeatureRequest} className="card" style={{ maxWidth: "450px", width: "90%", background: "rgba(15, 15, 25, 0.98)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.3rem", color: "#ffffff" }}>Submit a Feature Request</h3>
              <button 
                type="button"
                className="btn-ghost" 
                onClick={() => setShowSubmitRequestModal(false)}
                style={{ padding: "0.25rem 0.5rem" }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Feature Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dynamic schema testing tools" 
                  required
                  value={newRequestTitle}
                  onChange={(e) => setNewRequestTitle(e.target.value)}
                  style={{ width: "100%", height: "36px", borderRadius: "8px", border: "1px solid var(--border)", background: "rgba(0,0,0,0.2)", padding: "0 0.75rem", color: "#ffffff", outline: "none", fontSize: "0.85rem" }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Description / Use Case</label>
                <textarea 
                  placeholder="Explain why this feature is highly valuable..."
                  value={newRequestDesc}
                  onChange={(e) => setNewRequestDesc(e.target.value)}
                  style={{ width: "100%", minHeight: "80px", borderRadius: "8px", border: "1px solid var(--border)", background: "rgba(0,0,0,0.2)", padding: "0.5rem 0.75rem", color: "#ffffff", outline: "none", resize: "vertical", fontFamily: "inherit", fontSize: "0.85rem" }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: "0.3rem" }}>Initial Column</label>
                <select 
                  value={newRequestCol}
                  onChange={(e) => setNewRequestCol(e.target.value)}
                  style={{ width: "100%", height: "36px", borderRadius: "8px", border: "1px solid var(--border)", background: "#0a0a0f", padding: "0 0.75rem", color: "#ffffff", outline: "none", fontSize: "0.85rem" }}
                >
                  <option value="backlog">Backlog</option>
                  <option value="nextup">Next Up</option>
                  <option value="inprogress">In Progress</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="button" className="btn-secondary" style={{ flex: 1, fontSize: "0.8rem", height: "38px" }} onClick={() => setShowSubmitRequestModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: "0.8rem", height: "38px" }}>Submit Request</button>
            </div>
          </form>
        </div>
      )}

      <style jsx global>{`
        body.dark-theme {
          --background: #020205;
          --foreground: #fafafa;
          --border: rgba(255, 255, 255, 0.05);
          --card: rgba(10, 10, 15, 0.85);
        }
      `}</style>
    </main>
  );
}
