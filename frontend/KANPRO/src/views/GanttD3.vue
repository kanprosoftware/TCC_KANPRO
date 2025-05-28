<template>
  <div class="gantt-wrapper">
    <div ref="chart" class="gantt-container"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'

const chart = ref(null)

onMounted(() => {
  const dayWidth = 50
  const taskHeight = 30
  const margin = { top: 60, right: 20, bottom: 20, left: 100 }

  const tasks = [
    { name: 'Planejamento', start: new Date('2025-01-05'), end: new Date('2025-01-15') },
    { name: 'Execução', start: new Date('2025-01-20'), end: new Date('2025-02-10') },
    { name: 'Revisão Final', start: new Date('2025-03-01'), end: new Date('2025-03-15') },
    { name: 'Entrega', start: new Date('2025-03-20'), end: new Date('2025-03-25') },
    { name: 'Avaliação', start: new Date('2026-03-26'), end: new Date('2026-03-31') }
  ]

  // Determina os limites com base nas tarefas
  const taskStart = d3.min(tasks, d => d.start)
  const taskEnd = d3.max(tasks, d => d.end)

  // Garante que a contagem de semanas comece no início da primeira tarefa
  const startDate = new Date(taskStart)
  const endDate = new Date(taskEnd)
  endDate.setDate(endDate.getDate() + (7 - (d3.timeDay.count(startDate, endDate) % 7 || 7))) // fecha semana cheia

  const totalDays = d3.timeDay.count(startDate, endDate)
  const width = margin.left + totalDays * dayWidth + margin.right
  const height = margin.top + tasks.length * taskHeight + margin.bottom

  const svg = d3.select(chart.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // Fundo branco
  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'white')

  const x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([margin.left, width - margin.right])

  const y = (i) => margin.top + i * taskHeight

  const days = d3.timeDay.range(startDate, endDate)

  // Criar semanas fixas de 7 dias
  const weekCount = Math.ceil(totalDays / 7)
  const weeks = Array.from({ length: weekCount }, (_, i) => {
    const weekStart = new Date(startDate)
    weekStart.setDate(startDate.getDate() + i * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return { number: i + 1, start: weekStart, end: weekEnd }
  })

  const months = d3.groups(days, d => `${d.getFullYear()}-${d.getMonth()}`)


  // Linhas verticais dos dias
  svg.selectAll('.day-line')
    .data(days)
    .enter()
    .append('line')
    .attr('x1', d => x(d))
    .attr('x2', d => x(d))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', '#eee')
svg.selectAll('.week-bg')
  .data(weeks)
  .enter()
  .insert('rect', '.week-label') // insere atrás do texto
//   .append('rect')
  .attr('x', d => x(d.start))
  .attr('y', 25)
  .attr('width', dayWidth * 7)
  .attr('height', 20)
  .attr('fill', 'white')
  .attr('stroke', '#ccc')      // cor do contorno
  .attr('stroke-width',2)    // largura do contorno

  // Nome das semanas
  svg.selectAll('.week-label')
    .data(weeks)
    .enter()
    .append('text')
    .attr('x', d => x(d.start) + (dayWidth * 7) / 2)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text(d => `Semana ${d.number}`)
  // Linhas das semanas (mais grossas)
  svg.selectAll('.week-line')
    .data(weeks)
    .enter()
    .append('line')
    .attr('x1', d => x(d.start))
    .attr('x2', d => x(d.start))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', '#ccc')
    .attr('stroke-width', 2)

  // Linhas dos meses (grossas)
 
// Fundo branco para o cabeçalho dos meses
svg.selectAll('.month-bg')
  .data(months)
  .enter()
  .insert('rect', '.month-label') // insere antes dos textos do mês
  .attr('class', 'month-bg')
  .attr('x', ([_, values]) => x(values[0]))
  .attr('y', 5)
  .attr('width', ([_, values]) => values.length * dayWidth)
  .attr('height', 20)
  .attr('fill', 'white')
  .attr('stroke', '#333')      // cor do contorno
  .attr('stroke-width',3)    // largura do contorno

  // Nome dos meses
  svg.selectAll('.month-label')
    .data(months)
    .enter()
    .append('text')
    .attr('x', ([_, values]) => x(values[0]) + (values.length * dayWidth) / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    
    // .text(([month]) => d3.timeFormat('%B')(new Date(2025, month, 1)))
    .text(([_, values]) => {
    const sampleDate = values[0]
    const label = sampleDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    return label.charAt(0).toUpperCase() + label.slice(1)

    })
    .style('font-weight', 'bold')
    
     svg.selectAll('.month-line')
    .data(months)
    .enter()
    .append('line')
    .attr('x1', ([_, values]) => x(values[0]))
    .attr('x2', ([_, values]) => x(values[0]))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', '#333')
    .attr('stroke-width', 3)
    
// Fundo branco para o cabeçalho das semanas

    // Linhas das semanas (mais grossas)
//   svg.selectAll('.week-line')
//     .data(weeks)
//     .enter()
//     .append('line')
//     .attr('x1', d => x(d.start))
//     .attr('x2', d => x(d.start))
//     .attr('y1', 0)
//     .attr('y2', height)
//     .attr('stroke', '#ccc')
//     .attr('stroke-width', 2)
// Fundo branco para os dias
svg.selectAll('.day-bg')
  .data(days)
  .enter()
  .append('rect')
  .attr('x', d => x(d))
  .attr('y', 45)
  .attr('width', dayWidth)
  .attr('height', 20)
  .attr('fill', 'white')

  // Números dos dias
  svg.selectAll('.day-label')
  .data(days)
  .enter()
  .append('text')
  .attr('x', d => x(d) + dayWidth / 2)
  .attr('y', 55)
  .attr('text-anchor', 'middle')
  .attr('font-size', '10px')
  .text(d => {
    const diaSemana = d.toLocaleDateString('pt-BR', { weekday: 'short' }) // ex: "dom", "seg"
    const dia = d.getDate()
    return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} ${dia}`
  })
  // Barras das tarefas
  svg.selectAll('.task-bar')
    .data(tasks)
    .enter()
    .append('rect')
    .attr('x', d => x(d.start))
    .attr('y', (d, i) => y(i) + 5)
    .attr('width', d => x(d.end) - x(d.start) + dayWidth)
    .attr('height', taskHeight - 10)
    .attr('fill', '#3B82F6')
    .attr('rx', 4)

  // Nomes das tarefas
  svg.selectAll('.task-label')
    .data(tasks)
    .enter()
    .append('text')
    .attr('x', d => x(d.start) + 5)
    .attr('y', (d, i) => y(i) + taskHeight / 2 + 4)
    .attr('fill', 'white')
    .attr('font-size', '12px')
    .text(d => d.name)

  

})
</script>

<style scoped>
.gantt-wrapper {
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
  overflow: auto;
  background-color: rgb(0, 0, 0);
}

.gantt-container svg {
  font-family: sans-serif;
}
</style>
