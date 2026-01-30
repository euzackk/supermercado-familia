'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPedidos: 0,
    faturamento: 0,
    produtosAtivos: 0,
    clientes: 0
  });

  useEffect(() => {
    async function fetchStats() {
      // 1. Contar Produtos
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
      
      // 2. Pegar Pedidos para calcular total e clientes
      const { data: orders } = await supabase.from('orders').select('total, user_id');
      
      const totalPedidos = orders?.length || 0;
      const faturamento = orders?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
      
      // Contar clientes únicos
      const uniqueUsers = new Set(orders?.map(o => o.user_id)).size;

      setStats({
        totalPedidos,
        faturamento,
        produtosAtivos: count || 0,
        clientes: uniqueUsers
      });
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Visão Geral</h1>
      <p className="text-gray-500 mb-8">Resumo do desempenho da loja.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Faturamento Total" value={`R$ ${stats.faturamento.toFixed(2).replace('.', ',')}`} icon={DollarSign} color="green" />
        <StatCard title="Total de Pedidos" value={stats.totalPedidos} icon={ShoppingCart} color="blue" />
        <StatCard title="Produtos Cadastrados" value={stats.produtosAtivos} icon={Package} color="orange" />
        <StatCard title="Clientes Ativos" value={stats.clientes} icon={Users} color="purple" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-4 rounded-full ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}