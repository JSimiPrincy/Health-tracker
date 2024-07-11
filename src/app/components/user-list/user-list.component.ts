import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User, Workout } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'workouts'];
  dataSource: MatTableDataSource<User>;
  workoutTypes: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.dataSource.data = users;
      this.workoutTypes = Array.from(new Set(users.flatMap(u => u.workouts.map(w => w.type))));
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
  }

  applyFilter(filterValue: string | Event) {
    let filter = '';
    if (typeof filterValue === 'string') {
      filter = filterValue;
    } else {
      filter = (filterValue.target as HTMLInputElement).value;
    }
    this.dataSource.filter = filter.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByWorkoutType(type: string) {
    this.dataSource.filter = type;
  }

  customFilterPredicate(data: User, filter: string): boolean {
    const searchStr = filter.toLowerCase();
    return data.name.toLowerCase().indexOf(searchStr) !== -1 ||
           data.workouts.some(workout => workout.type.toLowerCase().indexOf(searchStr) !== -1);
  }

  getTotalMinutes(workouts: Workout[]): number {
    return workouts.reduce((sum, workout) => sum + workout.minutes, 0);
  }
}
