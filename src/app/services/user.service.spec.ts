import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { User, Workout } from '../models/user';

describe('UserService', () => {
  let service: UserService;
  const mockUsers: User[] = [
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

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);

    // Clear localStorage and set up initial state
    localStorage.clear();
    service['users'] = [...mockUsers];
    service['usersSubject'] = new BehaviorSubject<User[]>([...mockUsers]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all users', (done: DoneFn) => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(3);
      expect(users).toEqual(mockUsers);
      done();
    });
  });

  it('should add a new user', (done: DoneFn) => {
    const newUser: User = {
      id: 4,
      name: 'Alice Wonderland',
      workouts: [{ type: 'Running', minutes: 30 }]
    };

    service.addUser(newUser.name, newUser.workouts[0]);

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(4);
      expect(users.find(u => u.name === newUser.name)).toEqual(newUser);
      done();
    });
  });

  it('should add a new workout to an existing user', (done: DoneFn) => {
    const additionalWorkout: Workout = { type: 'Swimming', minutes: 15 };

    service.addUser('Jane Smith', additionalWorkout);

    service.getUsers().subscribe(users => {
      const user = users.find(u => u.name === 'Jane Smith');
      expect(user?.workouts.length).toBe(3);
      expect(user?.workouts.find(w => w.type === 'Swimming')?.minutes).toBe(75);
      done();
    });
  });

  it('should update localStorage after adding a user', () => {
    spyOn(localStorage, 'setItem');

    const newUser: User = {
      id: 4,
      name: 'Alice Wonderland',
      workouts: [{ type: 'Running', minutes: 30 }]
    };

    service.addUser(newUser.name, newUser.workouts[0]);

    expect(localStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(service['users']));
  });

  it('should update localStorage after adding a workout', () => {
    spyOn(localStorage, 'setItem');

    const additionalWorkout: Workout = { type: 'Swimming', minutes: 15 };

    service.addUser('Jane Smith', additionalWorkout);

    expect(localStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(service['users']));
  });

  it('should merge users from localStorage on initialization', () => {
    const storedUsers = [
      {
        id: 4,
        name: 'John Doe',
        workouts: [
          { type: 'Yoga', minutes: 20 }
        ]
      }
    ];
    localStorage.setItem('userData', JSON.stringify(storedUsers));
    
    const newService = new UserService();

    expect(newService['users'].length).toBe(4);
    expect(newService['users'].find(u => u.name === 'John Doe')?.workouts.length).toBe(3);
  });
});
