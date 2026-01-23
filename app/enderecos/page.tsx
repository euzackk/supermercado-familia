'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, MapPin, Plus, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EnderecosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado do Formulário
  const [newAddress, setNewAddress] = useState({ street: '', number: '', district: '', city: '', complement: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  async function fetchAddresses() {
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user?.id);
    setAddresses(data || []);
    setLoading(false);
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    
    // Salva no banco vinculando ao ID do usuário
    const { error } = await supabase.from('addresses').insert({
      ...newAddress,
      user_id: user.id
    });

    if (!error) {
      setNewAddress({ street: '', number: '', district: '', city: '', complement: '' }); // Limpa form
      setIsAdding(false); // Fecha form
      fetchAddresses(); // Recarrega lista
    } else {
      alert('Erro ao salvar endereço.');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja apagar?')) return;
    await supabase.from('addresses').delete().eq('id', id);
    fetchAddresses();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-sm text-gray-600">
            <ArrowLeft className="w-5 h-5"/>
        </button>
        <h1 className="text-xl font-bold text-blue-900">Meus Endereços</h1>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-orange-500"/></div>
      ) : (
        <div className="space-y-4">
          
          {/* Lista de Endereços Existentes */}
          {addresses.map(addr => (
            <div key={addr.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex items-start gap-3">
                <MapPin className="text-orange-500 w-5 h-5 mt-1" />
                <div>
                  <p className="font-bold text-gray-800">{addr.street}, {addr.number}</p>
                  <p className="text-sm text-gray-500">{addr.district} - {addr.city}</p>
                  {addr.complement && <p className="text-xs text-gray-400 mt-1">{addr.complement}</p>}
                </div>
              </div>
              <button onClick={() => handleDelete(addr.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-full">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Botão para abrir formulário */}
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold flex items-center justify-center gap-2 hover:border-orange-500 hover:text-orange-500 transition"
            >
              <Plus className="w-5 h-5" /> Adicionar Novo Endereço
            </button>
          )}

          {/* Formulário de Adição */}
          {isAdding && (
            <form onSubmit={handleAddAddress} className="bg-white p-4 rounded-xl shadow-lg border border-orange-100 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="font-bold text-gray-800 mb-4">Novo Endereço</h3>
              <div className="space-y-3">
                <input placeholder="Rua / Avenida" required className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-orange-200" 
                  value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                
                <div className="flex gap-3">
                  <input placeholder="Número" required className="w-1/3 p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-orange-200" 
                    value={newAddress.number} onChange={e => setNewAddress({...newAddress, number: e.target.value})} />
                  <input placeholder="Bairro" required className="w-2/3 p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-orange-200" 
                    value={newAddress.district} onChange={e => setNewAddress({...newAddress, district: e.target.value})} />
                </div>

                <input placeholder="Cidade" required className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-orange-200" 
                  value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />

                <input placeholder="Complemento (opcional)" className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-orange-200" 
                  value={newAddress.complement} onChange={e => setNewAddress({...newAddress, complement: e.target.value})} />

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg shadow-green-200">Salvar</button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}