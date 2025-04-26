import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MetricsOverTimeProps {
  labels: string[];
  usersData: number[];
  decisionsData: number[];
}

export default function MetricsOverTime({ labels, usersData, decisionsData }: MetricsOverTimeProps) {
  // Verificar se há dados para exibir
  if (!labels || !usersData || !decisionsData || labels.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  // Transformar os dados em formato adequado para o gráfico
  const chartData = labels.map((label, index) => ({
    name: label,
    Usuários: usersData[index] || 0,
    Decisões: decisionsData[index] || 0,
  }));

  // Encontrar o valor máximo para ajustar o domínio do eixo Y
  const maxUsers = Math.max(...usersData);
  const maxDecisions = Math.max(...decisionsData);
  const maxValue = Math.max(maxUsers, maxDecisions);
  
  // Adicionar 20% de margem ao valor máximo para melhor visualização
  const yDomain = [0, Math.ceil(maxValue * 1.2) || 10];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`metric-${index}`} className="text-sm">
              <span
                className="inline-block w-3 h-3 mr-2"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}: <span className="font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={yDomain} 
            tickCount={5}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="Usuários"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Decisões"
            stroke="#82ca9d"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}