import { User, Settings, CreditCard, MapPin, LogOut } from "lucide-react";

export default function PerfilPage() {
  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
        Meu Perfil
      </h1>
      
      {/* Card do Usuário */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
            <User className="w-8 h-8" />
        </div>
        <div>
            <h2 className="font-bold text-lg">Visitante</h2>
            <p className="text-gray-500 text-sm">Faça login para ver seus pedidos</p>
        </div>
      </div>

      {/* Menu de Opções */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
            <MapPin className="text-gray-400 w-5 h-5" />
            <span className="text-gray-700 font-medium">Meus Endereços</span>
        </div>
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
            <CreditCard className="text-gray-400 w-5 h-5" />
            <span className="text-gray-700 font-medium">Métodos de Pagamento</span>
        </div>
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
            <Settings className="text-gray-400 w-5 h-5" />
            <span className="text-gray-700 font-medium">Configurações</span>
        </div>
        <div className="p-4 flex items-center gap-3 hover:bg-red-50 cursor-pointer text-red-500">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
        </div>
      </div>
    </div>
  );
}