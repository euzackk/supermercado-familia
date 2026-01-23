import { FileText } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center mt-10 animate-in fade-in duration-700">
      <div className="bg-gray-100 rounded-full p-6 mb-6">
        <FileText className="w-12 h-12 text-gray-300" />
      </div>
      
      <h2 className="text-blue-900 font-bold text-xl mb-2 text-center">
        A loja está sendo abastecida
      </h2>
      <p className="text-gray-500 text-center text-sm max-w-[250px]">
        Estamos organizando os produtos nas prateleiras.
      </p>
    </div>
  );
}