<template>
  <div class="main-container">
    <div id="container"></div>

    <div id="buttonGroup" class="button-row">
      <button id="btnShowDialog">
        <i class="fa fa-plus"></i>
        Add task
      </button>
      <button id="btnRemoveSelected" disabled>
        <i class="fa fa-remove"></i>
        Remove selected
      </button>
    </div>

    <div id="addTaskDialog" class="hidden overlay">
      <div class="popup">
        <h3>Add task</h3>

        <label>Task name <input id="inputName" type="text" /></label>

        <label>
          Department
          <select id="selectDepartment">
            <option value="0">Tech</option>
            <option value="1">Marketing</option>
            <option value="2">Sales</option>
          </select>
        </label>

        <label>
          Dependency
          <select id="selectDependency"></select>
        </label>

        <label>
          Milestone
          <input id="chkMilestone" type="checkbox" />
        </label>

        <div class="button-row">
          <button id="btnAddTask">Add</button>
          <button id="btnCancelAddTask">Cancel</button>
        </div>

        <div class="clear"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GanttChart',
  mounted() {
    const scriptUrls = [
      'https://code.highcharts.com/gantt/highcharts-gantt.js',
      'https://code.highcharts.com/gantt/modules/draggable-points.js',
      'https://code.highcharts.com/gantt/modules/accessibility.js'
    ];

    // Carrega scripts externos sequencialmente
    const loadScripts = (urls) => {
      return urls.reduce((promise, url) => {
        return promise.then(() => {
          return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            document.head.appendChild(script);
          });
        });
      }, Promise.resolve());
    };

    loadScripts(scriptUrls).then(() => {
      this.initGanttChart();
    });
  },
  methods: {
    initGanttChart() {
      // Seu JS original aqui ↓ (pode colocar exatamente como está, só remova a tag <script>)

      let today = new Date(),
        isAddingTask = false;

      const day = 1000 * 60 * 60 * 24,
        btnShowDialog = document.getElementById('btnShowDialog'),
        btnRemoveTask = document.getElementById('btnRemoveSelected'),
        btnAddTask = document.getElementById('btnAddTask'),
        btnCancelAddTask = document.getElementById('btnCancelAddTask'),
        addTaskDialog = document.getElementById('addTaskDialog'),
        inputName = document.getElementById('inputName'),
        selectDepartment = document.getElementById('selectDepartment'),
        selectDependency = document.getElementById('selectDependency'),
        chkMilestone = document.getElementById('chkMilestone');

      today.setUTCHours(0, 0, 0, 0);
      today = today.getTime();

      function updateRemoveButtonStatus() {
        const chart = this.series.chart;
        setTimeout(() => {
          btnRemoveTask.disabled = !chart.getSelectedPoints().length || isAddingTask;
        }, 10);
      }

      const chart = Highcharts.ganttChart('container', {
        title: { text: 'Interactive Gantt Chart' },
        subtitle: { text: 'Drag and drop points to edit' },
        accessibility: {
          point: {
            descriptionFormat: '{#if milestone}{name}, milestone for {yCategory} at {x:%Y-%m-%d}.{else}{name}, assigned to {yCategory} from {x:%Y-%m-%d} to {x2:%Y-%m-%d}.{/if}'
          }
        },
        plotOptions: {
          series: {
            animation: false,
            dragDrop: {
              draggableX: true,
              draggableY: true,
              dragMinY: 0,
              dragMaxY: 2,
              dragPrecisionX: day / 3
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}',
              style: { cursor: 'default', pointerEvents: 'none' }
            },
            allowPointSelect: true,
            point: {
              events: {
                select: updateRemoveButtonStatus,
                unselect: updateRemoveButtonStatus,
                remove: updateRemoveButtonStatus
              }
            }
          }
        },
        yAxis: {
          visible: false
        },
        xAxis: { currentDateIndicator: true },
        tooltip: { xDateFormat: '%a %b %d, %H:%M' },
        series: [{
          name: 'Project 1',
          data: [
            { start: today + 2 * day, end: today + 5 * day, name: 'Prototype', id: 'prototype', y: 0 },
            { start: today + 6 * day, name: 'Prototype done', milestone: true, dependency: 'prototype', id: 'proto_done', y: 0 },
            { start: today + 7 * day, end: today + 11 * day, name: 'Testing', dependency: 'proto_done', y: 0 },
            { start: today + 5 * day, end: today + 8 * day, name: 'Product pages', y: 1 },
            { start: today + 9 * day, end: today + 10 * day, name: 'Newsletter', y: 1 },
            { start: today + 9 * day, end: today + 11 * day, name: 'Licensing', id: 'testing', y: 2 },
            { start: today + 11.5 * day, end: today + 12.5 * day, name: 'Publish', dependency: 'testing', y: 2 }
          ]
        }]
      });

      // Handlers
      btnRemoveTask.onclick = () => {
        chart.getSelectedPoints().forEach(p => p.remove());
      };

      btnShowDialog.onclick = () => {
        let depInnerHTML = '<option value=""></option>';
        chart.series[0].points.forEach(point => {
          depInnerHTML += `<option value="${point.id}">${point.name}</option>`;
        });
        selectDependency.innerHTML = depInnerHTML;

        addTaskDialog.className = 'overlay';
        isAddingTask = true;
        inputName.value = '';
        inputName.focus();
      };

      btnAddTask.onclick = () => {
        const series = chart.series[0],
          name = inputName.value,
          dependency = chart.get(selectDependency.value),
          y = parseInt(selectDepartment.value, 10);

        let maxEnd = series.points.reduce((acc, p) =>
          p.y === y && p.end ? Math.max(acc, p.end) : acc, 0);

        const milestone = chkMilestone.checked;

        if (maxEnd === 0) maxEnd = today;

        series.addPoint({
          start: maxEnd + (milestone ? day : 0),
          end: milestone ? undefined : maxEnd + day,
          y,
          name,
          dependency: dependency ? dependency.id : undefined,
          milestone
        });

        addTaskDialog.className += ' hidden';
        isAddingTask = false;
      };

      btnCancelAddTask.onclick = () => {
        addTaskDialog.className += ' hidden';
        isAddingTask = false;
      };
    }
  }
};
</script>

<style scoped>
/* Cole o CSS aqui direto */
* {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
#container,
#buttonGroup {
  max-width: 1200px;
  min-width: 320px;
  margin: 10px;
}
.hidden {
  display: none;
}
.main-container button {
  font-size: 12px;
  border-radius: 2px;
  border: 0;
  background-color: #ddd;
  padding: 13px 18px;
  transition: background-color 0.3s;
  cursor: pointer;
}
.main-container button:hover {
  background-color: #ccc;
}
.main-container button[disabled] {
  color: silver;
  cursor: not-allowed;
}
.button-row button {
  display: inline-block;
  margin: 0;
}
.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0 0 0 / 30%);
  transition: opacity 500ms;
  z-index: 1;
}
.popup {
  margin: 70px auto;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  width: 300px;
  position: relative;
}
.popup input,
.popup select {
  width: 100%;
  margin: 5px 0 15px;
}
.popup button {
  float: right;
  margin-left: 0.2em;
}
.popup .clear {
  height: 50px;
}
.popup input[type="text"],
.popup select {
  height: 2em;
  font-size: 16px;
}
</style>
