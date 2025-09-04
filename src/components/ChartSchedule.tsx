import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Text, Flex } from "@chakra-ui/react";
import type { TooltipProps, LegendProps } from "recharts";
import { COLORS_ARR } from '@/constants'
import { formatNumber } from '@/utils'

// const data = [
//   { date: "20 Jun", publicSale: 375000000, liquidityPool: 125000000 },
//   {
//     date: "30 Jun",
//     publicSale: 375000000,
//     liquidityPool: 125000000,
//     contentCommunity: 500000000,
//   },
//   {
//     date: "09 Jul",
//     publicSale: 375000000,
//     liquidityPool: 125000000,
//     contentCommunity: 500000000,
//   },
//   {
//     date: "27 Jul",
//     publicSale: 375000000,
//     liquidityPool: 125000000,
//     contentCommunity: 500000000,
//   },
// ];

const colorArr = [
  '#6ed6e9', '#ffa94d', '#d6df4e', '#519D9E', '#D1B6E1', '#8FBC94', '#548687', '#56445D'
]

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <Box bg="#181F2A" borderRadius="8px" p={3} fontFamily="DMMono" color="#fff" fontSize="sm" boxShadow="md">
        <Text mb={1}>{new Date(label * 1000).toLocaleDateString()}</Text>
        {payload.map((entry: any, idx: number) => (
          <Text key={idx} color={entry.color} fontSize="sm">
            {entry.name}: {entry.value.toLocaleString()}
          </Text>
        ))}
      </Box>
    );
  }
  return null;
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <Flex alignItems="center" wrap="wrap" gap={6} mt={2} mb={4} fontFamily="DMMono">
      {payload && payload.map((entry: any, idx: number) => (
        <Box key={idx} display="flex" alignItems="center" gap={2}>
          <Box w="18px" h="18px" borderRadius="4px" bg={entry.color} />
          <Text color="#B0B8C1">{entry.value}</Text>
        </Box>
      ))}
    </Flex>
  );
};

const StackedAreaChart = ({ data }: { data: any }) => {
  const { vesting, vesting_desc } = data;

  return (
    <Box>
      <Text fontSize="md" fontFamily="DMMono" mb={4} color="#e0e0e0">Vesting Schedule</Text>

      <Box
        bg="#0B1321"
        borderRadius="8px"
        p={{ base: 4, md: 8 }}
        w="100%"
        height={{ base: 700, md: 500 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={vesting} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 3" stroke="#222" />
            <XAxis
              style={{ fontSize: 12 }}
              dataKey="timestamp"
              tick={{ fill: "#B0B8C1" }}
              axisLine={{ stroke: "#222" }}
              tickLine={false}
              tickFormatter={(v) => new Date(v * 1000).toLocaleDateString()}
            />
            <YAxis
              style={{ fontSize: 12 }}
              tick={{ fill: "#fff" }}
              axisLine={{ stroke: "#222" }}
              tickLine={false}
              tickFormatter={(v) => formatNumber(v)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#222", opacity: 0.1 }} />
            <Legend verticalAlign="top" align="left" content={<CustomLegend />} />
            {
              Object.entries(vesting_desc || {}).map(([key, value]: any, index: number) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={value}
                  stackId="1"
                  stroke={COLORS_ARR[index]}
                  fill={COLORS_ARR[index]}
                />
              ))
            }
          </AreaChart>
        </ResponsiveContainer>
      </Box>
      <Flex justifyContent="flex-end" alignItems="center" mt={4}>
        <img className="w-[50%] md:w-[160px]" src="/tokentable_dark.svg" alt="tokentable" />
      </Flex>
    </Box>
  );
};

export default StackedAreaChart;
