<template>
  <Navbar :search="searchQuery" @update:search="searchQuery = $event" @go-home="goToHome" />
  <div class="name-page">
    <h1 class="name-page">Diagrama de Gantt</h1>
  </div>
  <div class="sidebar">
      <Sidebar @navigate="handleSidebarClick" />
    </div>
  <div class="gantt-wrapper">
    <div ref="chart" class="gantt-container"></div>
  </div>
  
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'
import Navbar from "../components/Navbar.vue";
import Sidebar from '../components/Sidebar.vue';
import axios from 'axios'
import { useRoute } from 'vue-router'  // Importa o useRoute

const route = useRoute()  // Usa o composable para acessar a rota

const chart = ref(null)
const tarefas = ref([])
function normalizeDate(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}
onMounted( async () => {
  try {
    console.log("rotue: ", route.params.id);
    const response = await axios.get('http://localhost:3000/todos/todosGantt', {
          params: {
            idProjeto: route.params.id,
          },
          withCredentials: true
    });
    // const response = await fetch('http://localhost:3000/tarefas') // Substitua pela sua URL real
    // const data = await response.json()
    console.log('Tarefas recebidas:', response.data);
    // console.log('Tarefas recebidas:', tarefas.value);
    // Transforma os campos de data em objetos Date
    tarefas.value = [] // Limpa antes

  response.data.forEach(t => {
    const startOriginal = new Date(t.createdAt)
    const endOriginal = new Date(t.concludeAt ?? new Date())
    const pausasOrdenadas = t.pausas.sort((a, b) => new Date(a.inicioPausa) - new Date(b.inicioPausa))

    if (pausasOrdenadas.length === 0) {
      tarefas.value.push({
        id: t.tarefa_id,
        name: t.titulo,
        start: startOriginal,
        end: endOriginal,
        colorBar: t.colorBar,
      })
      return
    }

    // Parte 1: início até primeira pausa
    tarefas.value.push({
      id: t.tarefa_id,
      name: t.titulo ,
      start: startOriginal,
      end: new Date(pausasOrdenadas[0].inicioPausa),
      colorBar: t.colorBar,
    })

    // Entre pausas
    for (let i = 0; i < pausasOrdenadas.length - 1; i++) {
      const fimAtual = pausasOrdenadas[i].fimPausa
      const inicioProx = pausasOrdenadas[i + 1].inicioPausa

      if (fimAtual && inicioProx) {
        tarefas.value.push({
          id: t.tarefa_id,
          name: t.titulo,
          start: new Date(fimAtual),
          end: new Date(inicioProx),
          colorBar: t.colorBar,
        })
      }
    }

    // Último trecho: fim da última pausa até concludeAt
    const ultimaPausa = pausasOrdenadas[pausasOrdenadas.length - 1]
    if (ultimaPausa.fimPausa) {
      tarefas.value.push({
        id: t.tarefa_id,
        name: t.titulo,
        start: new Date(ultimaPausa.fimPausa),
        end: endOriginal,
        colorBar: t.colorBar,
      })
    }
  })
    console.log("tarefas: ", tarefas.value);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error)
    return
  }

  

  const dayWidth = 50
  const taskHeight = 30
  const margin = { top: 60, right: 20, bottom: 40, left: 0 }
  const tasks = tarefas.value
  
  // Determina os limites com base nas tarefas
  const taskStart = d3.min(tasks, d => d.start.toISOString().split('T')[0])
  //const dateString = taskStart.toISOString().split('T')[0];
  console.log("taskStart: ", taskStart);
  const taskEnd = d3.max(tasks, d => d.end.toISOString().split('T')[0])
  
  console.log("taskEnd: ", taskEnd);

  // Garante que a contagem de semanas comece no início da primeira tarefa
  const startDate = new Date(taskStart)
  console.log("statDate: ", startDate);
  const endDate = new Date(taskEnd)
  console.log("calcula: ", (endDate - startDate));
  if ((endDate - startDate) < 1814400000) {
     endDate.setDate(endDate.getDate() + (21 - (d3.timeDay.count(startDate, endDate) % 7 || 7))) // fecha semana cheia
  } else {
    endDate.setDate(endDate.getDate() + (7 - (d3.timeDay.count(startDate, endDate) % 7 || 7))) // fecha semana cheia
  }

  const totalDays = d3.timeDay.count(startDate, endDate)
  const width = margin.left + totalDays * dayWidth + margin.right
  
  let count = 0;
  if (tasks.length < 17) {
    count = (17 - tasks.length);
  }
  console.log("tasks.length: ", (tasks.length));
  const height = margin.top + (tasks.length + count) * taskHeight + margin.bottom

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
  .attr('fill', '#5bff9a')
  // .attr('stroke', '#333')      // cor do contorno
  // .attr('stroke-width',3)    // largura do contorno

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
    .style('font-weight')
    
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
  const taskGroups = Array.from(new Set(tasks.map(t => t.id)))
  const taskYMap = {}
    let currentIndex = 0
    for (const task of tasks) {
      if (!(task.id in taskYMap)) {
        taskYMap[task.id] = currentIndex++
      }
  }
  svg.selectAll('.task-bar')
    .data(tasks)
    .enter()
    .append('rect')
    .attr('x', d => x(d.start) + 8)
    .attr('y', d => y(taskYMap[d.id]) + 5)
    .attr('width', d => x(d.end) - x(d.start) + dayWidth - 60) 
    .attr('height', taskHeight - 10)
    .attr('fill', '#3B82F6')
    .attr('rx', 4)

  // Nomes das tarefas
  svg.selectAll('.task-label')
    .data(tasks)
    .enter()
    .append('text')
    .attr('x', d => x(d.start) + 10)
    .attr('y', d => y(taskYMap[d.id]) + taskHeight / 2 + 4)
    .attr('fill', 'white')
    .attr('font-size', '12px')
    .text(d => d.name)

  

})
</script>

<style scoped>
.name-page {
  position: flex;
  text-align: center;
  /* font-size: 32px; */
  font-size: 141%;
  /* align-items: center; */
  margin-top: -60px;
}
.gantt-wrapper {
  width: 50%;
  margin-left: 300px;
  height: 590px;
  width: 77%;
  margin-top: 41px;
  border: 1px solid #ccc;
  overflow: auto;
  background-color: rgb(0, 0, 0);
}
.gantt-container{
  width: 100%;
  height: 590px;
}
.gantt-container svg {
  font-family: sans-serif;
}
</style>
