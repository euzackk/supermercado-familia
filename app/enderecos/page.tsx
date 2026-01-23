'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, MapPin, Plus, Trash2, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EnderecosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado do Formulário
  const [cep, setCep] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [newAddress, setNewAddress] = useState({ 
    street: '', number: '', district: '', city: '', complement: '', uf: '' 
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  async function fetchAddresses() {
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user?.id);
    setAddresses(data || []);
    setLoading(false);
  }

  // Mágica do CEP
  async function handleCepBlur() {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      
      if (!data.erro) {
        setNewAddress(prev => ({
          ...prev,
          street: data.logradouro,
          district: data.bairro,
          city: data.localidade,
          uf: data.uf
        }));
      } else {
        alert("CEP não encontrado!");
      }
    } catch (error) {
      console.error("Erro no CEP", error);
    } finally {
      setLoadingCep(false);
    }
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    
    const { error } = await supabase.from('addresses').insert({
      ...newAddress,
      user_id: user.id
    });

    if (!error) {
      setNewAddress({ street: '', number: '', district: '', city: '', complement: '', uf: '' });
      setCep('');
      setIsAdding(false);
      fetchAddresses();
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
          
          {/* Lista de Endereços */}
          {addresses.map(addr => (
            <div key={addr.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
              <div className="flex items-start gap-3 pl-2">
                <MapPin className="text-orange-500 w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800 text-sm">{addr.street}, {addr.number}</p>
                  <p className="text-xs text-gray-500 uppercase">{addr.district} • {addr.city}-{addr.uf || 'RO'}</p>
                  {addr.complement && <p className="text-xs text-gray-400 mt-1 italic">{addr.complement}</p>}
                </div>
              </div>
              <button onClick={() => handleDelete(addr.id)} className="text-red-300 hover:text-red-500 p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold flex items-center justify-center gap-2 hover:border-orange-500 hover:text-orange-500 transition shadow-sm"
            >
              <Plus className="w-5 h-5" /> Adicionar Novo Endereço
            </button>
          )}

          {/* Formulário Inteligente */}
          {isAdding && (
            <form onSubmit={handleAddAddress} className="bg-white p-5 rounded-xl shadow-xl border border-orange-100 animate-in fade-in slide-in-from-bottom-4 relative">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500"/> Novo Local
              </h3>
              
              <div className="space-y-4">
                {/* Campo de CEP */}
                <div className="relative">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">CEP</label>
                    <div className="relative">
                        <input 
                            placeholder="00000-000" 
                            className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-orange-200 font-mono tracking-widest"
                            value={cep}
                            onChange={e => setCep(e.target.value)}
                            onBlur={handleCepBlur}
                            maxLength={9}
                        />
                        {loadingCep && <div className="absolute right-3 top-3"><Loader2 className="animate-spin w-5 h-5 text-orange-500"/></div>}
                    </div>
                </div>

                {/* Campos Automáticos (Desabilitados para edição rápida, mas visíveis) */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Rua</label>
                        <input 
                            className="w-full p-3 bg-gray-100 text-gray-600 rounded-lg outline-none" 
                            value={newAddress.street} 
                            readOnly 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Número</label>
                        <input 
                            placeholder="Nº" 
                            required 
                            className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" 
                            value={newAddress.number} 
                            onChange={e => setNewAddress({...newAddress, number: e.target.value})} 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Bairro</label>
                        <input 
                            className="w-full p-3 bg-gray-100 text-gray-600 rounded-lg outline-none" 
                            value={newAddress.district} 
                            readOnly 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Cidade</label>
                        <input 
                            className="w-full p-3 bg-gray-100 text-gray-600 rounded-lg outline-none" 
                            value={newAddress.city} 
                            readOnly 
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Complemento</label>
                    <input 
                        placeholder="Ex: Ao lado da padaria" 
                        className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-orange-200" 
                        value={newAddress.complement} 
                        onChange={e => setNewAddress({...newAddress, complement: e.target.value})} 
                    />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg shadow-green-200 transition transform active:scale-95">Salvar Endereço</button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}