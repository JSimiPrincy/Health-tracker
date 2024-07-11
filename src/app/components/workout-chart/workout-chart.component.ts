import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UserService } from '../../services/user.service';
import { User, Workout } from '../../models/user';

Chart.register(...registerables);


@Component({
  selector: 'app-workout-chart',
  templateUrl: './workout-chart.component.html',
  styleUrls: ['./workout-chart.component.css']
})
export class WorkoutChartComponent implements OnInit {
  chart: Chart | undefined;
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.createOrUpdateChart();
  }

  createOrUpdateChart(): void {
    if (!this.selectedUser) return;

    const labels = this.selectedUser.workouts.map(w => w.type);
    const data = this.selectedUser.workouts.map(w => w.minutes);

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    } else {
      this.chart = new Chart('workoutChart', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Minutes',
            data: data,
            backgroundColor: this.getRandomColor()
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Minutes'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `${this.selectedUser.name}'s Workouts`
            }
          }
        }
      });
    }
  }

  getRandomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
}


