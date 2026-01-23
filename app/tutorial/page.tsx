'use client';

import { ArrowLeft, Share, PlusSquare, MoreVertical, Download, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TutorialPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => router.back()} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
          <ArrowLeft className="w-5 h-5 text-gray-600"/>
        </button>
        <h1 className="text-xl font-bold text-blue-900">Instalar o App</h1>
      </div>

      <div className="p-6 space-y-8 max-w-lg mx-auto">
        
        <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 animate-bounce">
                <Download className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Tenha nosso App!</h2>
            <p className="text-gray-500">Instale gratuitamente para acessar ofertas exclusivas e pedir mais rápido.</p>
        </div>

        {/* Tutorial iPhone (iOS) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                <Smartphone className="w-6 h-6 text-gray-800" />
                <h3 className="font-bold text-lg text-gray-800">No iPhone (iOS)</h3>
            </div>
            
            <ol className="space-y-4 relative border-l-2 border-gray-100 ml-3">
                <li className="pl-6 relative">
                    <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></span>
                    <p className="text-sm text-gray-600 mb-2">Toque no botão de <strong>Compartilhar</strong> na barra inferior do Safari.</p>
                    <div className="bg-gray-100 p-3 rounded-lg inline-block">
                        <Share className="w-6 h-6 text-blue-500" />
                    </div>
                </li>
                <li className="pl-6 relative">
                    <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></span>
                    <p className="text-sm text-gray-600 mb-2">Role as opções para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.</p>
                    <div className="bg-gray-100 p-2 rounded-lg inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                        <PlusSquare className="w-5 h-5 text-gray-500" /> Adicionar à Tela de Início
                    </div>
                </li>
                <li className="pl-6 relative">
                    <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></span>
                    <p className="text-sm text-gray-600">Confirme clicando em <strong>Adicionar</strong> no canto superior direito.</p>
                </li>
            </ol>
        </div>

        {/* Tutorial Android */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                <Smartphone className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-lg text-gray-800">No Android (Chrome)</h3>
            </div>
            
            <ol className="space-y-4 relative border-l-2 border-gray-100 ml-3">
                <li className="pl-6 relative">
                    <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></span>
                    <p className="text-sm text-gray-600 mb-2">Toque nos <strong>3 pontinhos</strong> no canto superior do navegador.</p>
                    <div className="bg-gray-100 p-2 rounded-lg inline-block">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </div>
                </li>
                <li className="pl-6 relative">
                    <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></span>
                    <p className="text-sm text-gray-600 mb-2">Selecione a opção <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</p>
                </li>
                <li className="pl-6 relative">
                    <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></span>
                    <p className="text-sm text-gray-600">Confirme a instalação e o ícone aparecerá no seu celular.</p>
                </li>
            </ol>
        </div>

      </div>
    </div>
  );
}