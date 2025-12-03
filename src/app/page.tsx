"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, LogOut, CheckCircle2, Calendar, Kanban, ListTodo, BarChart3 } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

export default function Home() {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = "/";
  };

  const navigationLinks = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/tasks", label: "Tarefas", icon: ListTodo },
    { href: "/kanban", label: "Kanban", icon: Kanban },
    { href: "/calendar", label: "Calendário", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white dark:bg-black dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold">TaskFlow</span>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                Recursos
              </Link>
              <Link href="#how-it-works" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                Como Funciona
              </Link>
              <Link href="#about" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                Sobre
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</span>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Cadastro
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-3 border-t dark:border-zinc-800 pt-4">
              <Link href="#features" className="block text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white py-2">
                Recursos
              </Link>
              <Link href="#how-it-works" className="block text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white py-2">
                Como Funciona
              </Link>
              <Link href="#about" className="block text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white py-2">
                Sobre
              </Link>
              {user ? (
                <div className="space-y-3 pt-3 border-t dark:border-zinc-800">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-3 border-t dark:border-zinc-800">
                  <Link href="/login" className="block px-4 py-2 text-center text-zinc-600 dark:text-zinc-400">
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700"
                  >
                    Cadastro
                  </Link>
                </div>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
            Organize suas tarefas<br />
            <span className="text-indigo-600">com simplicidade</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400">
            TaskFlow é a solução perfeita para gerenciar suas tarefas, prazos e projetos em um único lugar. Trabalhe melhor, sem complicações.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Ir ao Dashboard
                </Link>
                <Link
                  href="/tasks"
                  className="px-8 py-4 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white rounded-lg font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                >
                  Minhas Tarefas
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Começar Agora
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white rounded-lg font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                >
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-zinc-50 dark:bg-zinc-950 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Recursos Principais</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">Tudo que você precisa para ser produtivo</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle2,
                title: "Gerenciamento Completo",
                desc: "Crie, edite, acompanhe e conclua tarefas com facilidade.",
              },
              {
                icon: Kanban,
                title: "Quadro Kanban",
                desc: "Visualize seu trabalho em um quadro tipo Kanban interativo.",
              },
              {
                icon: Calendar,
                title: "Calendário Integrado",
                desc: "Veja todas as suas tarefas em um calendário visual.",
              },
              {
                icon: BarChart3,
                title: "Dashboard Analytics",
                desc: "Acompanhe métricas e progresso com gráficos detalhados.",
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white dark:bg-black border dark:border-zinc-800 rounded-xl hover:border-indigo-600 transition">
                <feature.icon className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      {user && (
        <section id="how-it-works" className="py-20 sm:py-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Navegação Rápida</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">Acesse todas as funcionalidades da aplicação</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:shadow-lg hover:border-indigo-600 transition transform hover:scale-105"
              >
                <link.icon className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-black dark:text-white">{link.label}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                  {link.label === "Dashboard" && "Veja suas métricas e estatísticas"}
                  {link.label === "Tarefas" && "Gerencie todas as suas tarefas"}
                  {link.label === "Kanban" && "Organize tarefas em colunas"}
                  {link.label === "Calendário" && "Visualize tarefas por data"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="bg-zinc-50 dark:bg-zinc-950 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Sobre o TaskFlow</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
                TaskFlow é uma aplicação moderna de gerenciamento de tarefas construída com as mais recentes tecnologias web.
              </p>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
                Desenvolvida com Next.js, Firebase e Tailwind CSS, oferecemos uma experiência de usuário fluida e intuitiva.
              </p>
              <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>✓ Interface responsiva e acessível</li>
                <li>✓ Sincronização em tempo real com Firebase</li>
                <li>✓ Suporte a Kanban e Calendário</li>
                <li>✓ Análise de produtividade</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Pronto para começar?</h3>
              <p className="mb-6">
                Cadastre-se agora e comece a organizar suas tarefas com o TaskFlow.
              </p>
              <Link
                href="/register"
                className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-zinc-100 transition"
              >
                Criar Conta Grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t dark:border-zinc-800 bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                TaskFlow
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Gerenciamento de tarefas simples, poderoso e eficiente.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li><Link href="#features" className="hover:text-black dark:hover:text-white">Recursos</Link></li>
                <li><Link href="#how-it-works" className="hover:text-black dark:hover:text-white">Como Funciona</Link></li>
                <li><Link href="#about" className="hover:text-black dark:hover:text-white">Sobre</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Conta</h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li><Link href="/login" className="hover:text-black dark:hover:text-white">Entrar</Link></li>
                <li><Link href="/register" className="hover:text-black dark:hover:text-white">Cadastrar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li><a href="#" className="hover:text-black dark:hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white">Termos</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t dark:border-zinc-800 pt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            <p>&copy; 2025 TaskFlow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
