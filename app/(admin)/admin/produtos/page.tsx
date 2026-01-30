'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Edit, Plus, Save, X, Image as ImageIcon } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('name');
    if (data) setProducts(data);
    setLoading(false);
  }

  function startEdit(product: any) {
    setEditingId(product.id);
    setEditForm(product);
  }

  async function saveEdit() {
    const { error } = await supabase
      .from('products')
      .update({
        name: editForm.name,
        price: parseFloat(editForm.price),
        image_url: editForm.image_url,
        department: editForm.department
      })
      .eq('id', editingId);

    if (!error) {
      setEditingId(null);
      fetchProducts();
    } else {
      alert("Erro ao salvar produto.");
    }
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
            <p className="text-sm text-gray-500">Gerencie catálogo, preços e fotos.</p>
        </div>
        {/* Botão Novo Produto (Lógica futura) */}
        <button disabled className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 opacity-50 cursor-not-allowed" title="Use o importador por enquanto">
            <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Buscar por nome do produto..." 
                className="w-full pl-10 p-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100 transition"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando produtos...</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Produto</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Departamento</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Preço</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.slice(0, 100).map(product => (
                            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <td className="p-4">
                                    {editingId === product.id ? (
                                        <div className="space-y-2">
                                            <input 
                                                className="border p-2 rounded w-full text-sm" 
                                                value={editForm.name} 
                                                onChange={e => setEditForm({...editForm, name: e.target.value})}
                                                placeholder="Nome do produto"
                                            />
                                            <div className="flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4 text-gray-400"/>
                                                <input 
                                                    className="border p-2 rounded w-full text-xs font-mono text-gray-600" 
                                                    value={editForm.image_url || ''} 
                                                    onChange={e => setEditForm({...editForm, image_url: e.target.value})}
                                                    placeholder="URL da Imagem"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded border flex-shrink-0 overflow-hidden relative">
                                                {product.image_url ? (
                                                    <img src={product.image_url} className="w-full h-full object-cover"/>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ImageIcon className="w-4 h-4"/>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-800 block text-sm">{product.name}</span>
                                                {product.barcode && <span className="text-[10px] text-gray-400 font-mono">{product.barcode}</span>}
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {editingId === product.id ? (
                                        <input 
                                            className="border p-2 rounded w-full" 
                                            value={editForm.department} 
                                            onChange={e => setEditForm({...editForm, department: e.target.value})}
                                        />
                                    ) : (
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{product.department}</span>
                                    )}
                                </td>
                                <td className="p-4 font-bold text-gray-800 text-sm">
                                    {editingId === product.id ? (
                                        <input 
                                            type="number"
                                            step="0.01"
                                            className="border p-2 rounded w-24" 
                                            value={editForm.price} 
                                            onChange={e => setEditForm({...editForm, price: e.target.value})}
                                        />
                                    ) : `R$ ${product.price.toFixed(2)}`}
                                </td>
                                <td className="p-4 text-right">
                                    {editingId === product.id ? (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={saveEdit} className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"><Save className="w-4 h-4"/></button>
                                            <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"><X className="w-4 h-4"/></button>
                                        </div>
                                    ) : (
                                        <button onClick={() => startEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}