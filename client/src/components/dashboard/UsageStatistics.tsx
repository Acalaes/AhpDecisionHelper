import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UsageStatisticsProps {
  data: { step: string; averageDuration: number; count: number }[];
}

// Mapeamento de nomes de etapas para exibição legível
const STEP_NAMES = {
  'define_problem': 'Definição do Problema',
  'create_criteria': 'Criar Critérios',
  'compare_criteria': 'Comparar Critérios',
  'create_alternatives': 'Criar Alternativas',
  'compare_alternatives': 'Comparar Alternativas',
  'review_results': 'Revisar Resultados'
};

export default function UsageStatistics({ data }: UsageStatisticsProps) {
  // Processar dados para exibição
  const processedData = data.map(item => ({
    name: STEP_NAMES[item.step] || item.step,
    minutes: Math.round(item.averageDuration / 60), // Converter de segundos para minutos
    count: item.count
  })).sort((a, b) => {
    // Ordenar baseado na ordem natural das etapas do AHP
    const order = Object.values(STEP_NAMES);
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  // Formatação do tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <p>{`Tempo médio: ${payload[0].value} minutos`}</p>
          <p>{`Total de sessões: ${payload[0].payload.count}`}</p>
        </div>
      );
    }
    return null;
  };

  // Renderizar mensagem se não houver dados
  if (!data.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={processedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 11 }} 
          stroke="#9ca3af" 
          tickMargin={10}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          label={{ 
            value: 'Minutos', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: 12 }
          }}
          tick={{ fontSize: 12 }} 
          stroke="#9ca3af"
          tickMargin={10}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="minutes" 
          fill="#8b5cf6" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}