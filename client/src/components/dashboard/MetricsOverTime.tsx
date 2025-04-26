import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, subDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MetricsOverTimeProps {
  data: { date: string; count: number }[];
  dateRange: '7d' | '30d' | '90d' | '1y';
  title: string;
  color: string;
}

export default function MetricsOverTime({ data, dateRange, title, color }: MetricsOverTimeProps) {
  // Preparar dados para o gráfico, preenchendo datas faltantes com zero
  const prepareChartData = () => {
    if (!data || !data.length) return [];

    // Criar intervalo de datas com base no filtro selecionado
    const endDate = new Date();
    let startDate: Date;
    
    switch (dateRange) {
      case '7d':
        startDate = subDays(endDate, 7);
        break;
      case '30d':
        startDate = subDays(endDate, 30);
        break;
      case '90d':
        startDate = subDays(endDate, 90);
        break;
      case '1y':
        startDate = new Date(endDate);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = subDays(endDate, 30);
    }

    // Gerar todas as datas no intervalo
    const dateInterval = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Converter dados da API para um mapa para fácil acesso
    const dataMap = new Map();
    data.forEach(item => {
      // Se a data for no formato ISO, extrair apenas a parte da data
      const dateStr = item.date.includes('T') ? item.date.split('T')[0] : item.date;
      dataMap.set(dateStr, item.count);
    });
    
    // Preencher o array final com todas as datas, atribuindo zero para datas sem dados
    return dateInterval.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        date: dateStr,
        count: dataMap.has(dateStr) ? dataMap.get(dateStr) : 0,
        formattedDate: format(date, 'dd/MM', { locale: ptBR })
      };
    });
  };

  const chartData = prepareChartData();

  // Formatação do tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{format(parseISO(data.date), 'dd/MM/yyyy', { locale: ptBR })}</p>
          <p>{`${title}: ${data.count}`}</p>
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
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="formattedDate" 
          tick={{ fontSize: 12 }} 
          stroke="#9ca3af"
          tickMargin={10}
        />
        <YAxis 
          allowDecimals={false}
          tick={{ fontSize: 12 }} 
          stroke="#9ca3af"
          tickMargin={10}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke={color} 
          activeDot={{ r: 8 }} 
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}