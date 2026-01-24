'use client';

import { X, MapPin, Phone, MessageSquare, ExternalLink, Clock, Bike, Download, ChevronRight, FileText } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const facebookLink = "https://www.facebook.com/supermercadofamiliapvh/?locale=pt_BR";
  const instagramLink = "https://www.instagram.com/supermercadofamiliapvh";

  return (
    <div className={`fixed inset-0 z-50 flex justify-start ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      
      <div 
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />

      <div className={`relative w-[85%] max-w-xs bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Cabeçalho do Menu */}
        <div className="bg-blue-900 p-6 pt-12 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-full transition">
            <X className="w-6 h-6" />
          </button>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">Supermercado Família</h2>
            <p className="text-blue-200 text-sm">Feito pra você.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 bg-gray-50">
          
          {/* Botão Destaque App */}
          <Link 
            href="/tutorial"
            onClick={onClose}
            className="block relative overflow-hidden rounded-xl shadow-lg shadow-orange-200 group"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 transition-transform group-hover:scale-105" />
             <div className="relative p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                   <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <Download className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg leading-none mb-1">Baixar o App</h3>
                      <p className="text-xs text-orange-100 opacity-90">Instale no seu celular</p>
                   </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/70" />
             </div>
          </Link>

          {/* Informações */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
             <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Informações</h3>
             
             <div className="flex gap-3 items-start text-sm text-gray-600">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span>R. Principal, 1675<br/>Novo Horizonte<br/>Porto Velho - RO, 76810-160</span>
             </div>
             
             <div className="flex gap-3 items-start text-sm text-gray-600">
                <Clock className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-800">Loja Física:</span>
                  <p className="text-xs">Seg à Sáb: 06h às 20h</p>
                  <p className="text-xs">Domingo: 06h às 12h</p>
                </div>
             </div>

             <div className="flex gap-3 items-start text-sm text-gray-600">
                <Bike className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-800">Entregas:</span>
                  <p className="text-xs">Seg à Sáb: 08h às 19h</p>
                  <p className="text-xs">Domingo: 08h às 11h</p>
                </div>
             </div>

             <div className="flex gap-3 items-center text-sm text-gray-600">
                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                <span>(69) 99255-7719</span>
             </div>
          </div>

          {/* NOVO LINK DE POLÍTICAS */}
          <Link 
            href="/politicas" 
            onClick={onClose}
            className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-orange-300 transition group"
          >
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition">
                      <FileText className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-800">Termos e Políticas</h3>
                      <p className="text-xs text-gray-500">Privacidade, Trocas e Regras</p>
                   </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
             </div>
          </Link>

          <Link 
            href="/sugestoes" 
            onClick={onClose}
            className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-orange-300 transition group"
          >
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition">
                      <MessageSquare className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-800">Caixa de Sugestões</h3>
                      <p className="text-xs text-gray-500">Ajude-nos a melhorar</p>
                   </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-300" />
             </div>
          </Link>

          <div className="text-center">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Siga-nos nas redes</p>
             <div className="flex justify-center gap-4">
                <a 
                  href={facebookLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-blue-600 hover:scale-110 hover:shadow-md transition"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.747-2.971 2.54v1.43h5.114l-.257 3.666h-4.857v7.98h-4.8z"/></svg>
                </a>

                <a 
                  href={instagramLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full shadow-sm flex items-center justify-center text-white hover:scale-110 hover:shadow-md transition"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
             </div>
          </div>

        </div>
        
        <div className="p-4 bg-gray-100 text-center text-[10px] text-gray-400">
           App Versão 1.1.0
        </div>
      </div>
    </div>
  );
}