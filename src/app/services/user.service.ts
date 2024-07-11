import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Workout } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      workouts: [
        { type: 'Swimming', minutes: 60 },
        { type: 'Running', minutes: 20 }
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      workouts: [
        { type: 'Yoga', minutes: 50 },
        { type: 'Cycling', minutes: 40 }
      ]
    }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);

  constructor() {
    const storedUsers = localStorage.getItem('userData');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
      this.usersSubject.next(this.users);
    }
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  addUser(name: string, workout: Workout): void {
    const existingUser = this.users.find(u => u.name.toLowerCase() === name.toLowerCase());
    
    if (existingUser) {
      this.addWorkout(existingUser.id, workout);
    } else {
      const newUser: User = {
        id: this.getNextId(),
        name,
        workouts: [workout]
      };
      this.users.push(newUser);
      this.updateLocalStorage();
    }
  }

  addWorkout(userId: number, workout: Workout): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      const existingWorkoutIndex = user.workouts.findIndex(w => w.type.toLowerCase() === workout.type.toLowerCase());
      
      if (existingWorkoutIndex !== -1) {
        // Update existing workout
        user.workouts[existingWorkoutIndex].minutes += workout.minutes;
      } else {
        // Add new workout
        user.workouts.push(workout);
      }
      
      this.updateLocalStorage();
    }
  }

  private updateLocalStorage(): void {
    localStorage.setItem('userData', JSON.stringify(this.users));
    this.usersSubject.next(this.users);
  }

  private getNextId(): number {
    return Math.max(...this.users.map(u => u.id), 0) + 1;
  }
}
