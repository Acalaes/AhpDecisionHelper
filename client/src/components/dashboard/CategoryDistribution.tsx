import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DECISION_CATEGORIES } from '@shared/schema';

interface CategoryDistributionProps {
  data: { category: string; count: number }[];
  showLegend?: boolean;
}

// Cores temáticas para as diferentes categorias
const COLORS = [
  '#3b82f6', // Azul
  '#22c55e', // Verde
  '#f59e0b', // Âmbar
  '#ef4444', // Vermelho
  '#8b5cf6', // Violeta
  '#ec4899', // Rosa
  '#06b6d4', // Ciano
  '#f97316', // Laranja
  '#a3e635', // Lima
  '#64748b', // Cinza
];

export default function CategoryDistribution({ data, showLegend = false }: CategoryDistributionProps) {
  // Formatar dados para o gráfico e mapear as categorias para nomes legíveis
  const chartData = data.map(item => ({
    name: DECISION_CATEGORIES[item.category as keyof typeof DECISION_CATEGORIES] || item.category,
    value: item.count
  }));

  // Calcular a porcentagem para renderização do rótulo
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
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
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={showLegend ? "70%" : "90%"}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {showLegend && (
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            wrapperStyle={{ fontSize: "12px" }}
          />
        )}
        <Tooltip 
          formatter={(value) => [`${value} decisões`, 'Quantidade']}
          labelFormatter={(label) => `Categoria: ${label}`}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}