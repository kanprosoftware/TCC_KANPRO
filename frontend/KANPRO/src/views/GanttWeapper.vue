<template>
  <div class="gantt-wrapper" ref="wrapper" style="position:relative;">
    <div ref="weekLabels" class="week-labels" style="display:flex; position:relative; margin-bottom:5px;"></div>
    <div ref="gantt" class="gantt-container"></div>
  </div>
</template>

<script>
import Gantt from "frappe-gantt";

export default {
  name: "GanttChart",
  data() {
    return {
      tasks: [
        {
          id: "1",
          name: "Planejamento",
          start: "2025-06-01",
          end: "2025-06-05",
          progress: 100,
        },
        {
          id: "2",
          name: "Execução",
          start: "2025-06-06",
          end: "2025-06-16",
          progress: 60,
          dependencies: "1",
        },
        {
          id: "3",
          name: "Testes",
          start: "2025-06-17",
          end: "2025-06-21",
          progress: 0,
          dependencies: "2",
        },
      ],
      gantt: null,
      pixelsPerDay: 40, // Ajuste aqui conforme o tamanho real de cada dia no gráfico
    };
  },
  mounted() {
    this.gantt = new Gantt(this.$refs.gantt, this.tasks, {
      view_mode: "Day",
      language: "pt-br",
    });

    this.renderWeekLabels();
  },
  methods: {
    parseDate(str) {
      // Converte string YYYY-MM-DD em Date UTC (sem considerar timezone)
      const [year, month, day] = str.split("-").map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    },
    dateDiffInDays(a, b) {
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      return Math.floor((b - a) / _MS_PER_DAY);
    },
    renderWeekLabels() {
      const container = this.$refs.weekLabels;
      container.innerHTML = "";

      // Pega o primeiro dia da primeira tarefa
      const firstStartDate = this.tasks.reduce((earliest, task) => {
        const taskDate = this.parseDate(task.start);
        return taskDate < earliest ? taskDate : earliest;
      }, this.parseDate(this.tasks[0].start));

      // Pega o último dia da última tarefa
      const lastEndDate = this.tasks.reduce((latest, task) => {
        const taskDate = this.parseDate(task.end);
        return taskDate > latest ? taskDate : latest;
      }, this.parseDate(this.tasks[0].end));

      const totalDays = this.dateDiffInDays(firstStartDate, lastEndDate) + 1;

      // Número total de semanas (arredondado para cima)
      const totalWeeks = Math.ceil(totalDays / 7);

      for (let i = 0; i < totalWeeks; i++) {
        // Cria div para a semana i+1
        const weekDiv = document.createElement("div");
        weekDiv.textContent = `Semana ${i + 1}`;

        weekDiv.style.minWidth = this.pixelsPerDay * 7 + "px";
        weekDiv.style.textAlign = "center";
        weekDiv.style.border = "1px solid #ccc";
        weekDiv.style.backgroundColor = "#f5f5f5";
        weekDiv.style.padding = "2px 0";
        weekDiv.style.fontSize = "12px";
        weekDiv.style.userSelect = "none";

        container.appendChild(weekDiv);
      }
    },
  },
};
</script>

<style scoped>
.gantt-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #fff;
}

.gantt-container {
  min-width: 1000px;
  height: 400px;
}
.week-labels {
  min-width: 1000px;
}
</style>
