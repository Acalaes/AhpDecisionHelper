import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StepEngagement {
  step: string;
  averageDuration: number;
  count: number;
}

interface UsageStatisticsProps {
  data: StepEngagement[];
}

export default function UsageStatistics({ data }: UsageStatisticsProps) {
  // Verificar se há dados para exibir
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  // Mapear nomes dos passos para português
  const stepNameMapping = {
    define_problem: "Definir problema",
    create_criteria: "Criar critérios",
    compare_criteria: "Comparar critérios",
    create_alternatives: "Criar alternativas",
    compare_alternatives: "Comparar alternativas",
    review_results: "Revisar resultados"
  };

  // Formatar dados para o gráfico
  const chartData = data.map(item => ({
    step: stepNameMapping[item.step as keyof typeof stepNameMapping] || item.step,
    tempoMedio: Math.round(item.averageDuration / 60), // Converter para minutos
    contagem: item.count
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span
              className="inline-block w-3 h-3 mr-2"
              style={{ backgroundColor: '#0088FE' }}
            />
            Tempo médio: <span className="font-medium">{payload[0].value} min</span>
          </p>
          <p className="text-sm">
            <span
              className="inline-block w-3 h-3 mr-2"
              style={{ backgroundColor: '#FF8042' }}
            />
            Número de vezes: <span className="font-medium">{payload[1].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="step" 
            tick={{ fontSize: 11 }}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis yAxisId="left" orientation="left" stroke="#0088FE" label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#FF8042" label={{ value: 'Contagem', angle: 90, position: 'insideRight' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar yAxisId="left" dataKey="tempoMedio" name="Tempo Médio (min)" fill="#0088FE" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="contagem" name="Número de Vezes" fill="#FF8042" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}