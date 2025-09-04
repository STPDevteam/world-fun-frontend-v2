import React from 'react'
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'
import { Box, Text, Flex } from '@chakra-ui/react'
import { FaLock } from "react-icons/fa";
import { COLORS_ARR } from '@/constants'

// const data = [
//   { name: 'Public Sale', value: 37.5, color: '#6ed6e9', desc: 'Fixed Supply' },
//   { name: 'Liquidity Pool', value: 12.5, color: '#ffa94d', desc: 'Fixed Supply', locked: true },
//   { name: 'Content Creation and Community', value: 50.0, color: '#d6df4e', desc: '100% tokens immediately released at 27 Jun 2025 04:30pm', locked: true },
// ]


export default function ChartOverview({ data = [] }: { data: any }) {

  return (
    <Box>
      <Text fontSize="md" fontFamily="DMMono" mb={4} color="#e0e0e0">Tokenomics Overview</Text>

      <div style={{
        background: '#131926',
        borderRadius: 8,
        padding: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        flexWrap: 'wrap'
      }}>
        <div className="w-[100%] md:w-[38%]">
          <ResponsiveContainer height={320}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                stroke="none"
                animationDuration={0}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS_ARR[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-[100%] md:w-[60%]" style={{ marginLeft: 'auto' }}>
          <ul className="list-none m-0 p-0">
            {data.map((entry: any, index: number) => (
              <li key={`item-${index}`} className="flex items-center" style={{ marginBottom: 16 }}>
                <span style={{
                  display: 'inline-block',
                  width: 20,
                  height: 20,
                  background: COLORS_ARR[index],
                  borderRadius: 6,
                  marginRight: 12,
                  flexShrink: 0
                }} />
                <div style={{ marginRight: 20 }}>
                  <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: 16 }}>
                    {entry.name}
                    {entry.locked && <FaLock style={{ marginLeft: 6, display: 'inline-block' }} />}
                  </span>
                  <div style={{ color: '#8a99a8', fontFamily: 'monospace', fontSize: 12 }}>
                    {entry.desc}
                  </div>
                </div>
                <span style={{ marginLeft: 'auto', color: '#fff', fontFamily: 'monospace', fontSize: 16 }}>
                  {entry.value.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Flex justifyContent="flex-end" alignItems="center" mt={4}>
        <img className="w-[50%] md:w-[160px]" src="/tokentable_dark.svg" alt="tokentable" />
      </Flex>
    </Box>
  )
}
