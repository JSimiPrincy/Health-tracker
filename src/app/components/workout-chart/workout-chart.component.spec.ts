import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutChartComponent } from './workout-chart.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { Chart } from 'chart.js';

describe('WorkoutChartComponent', () => {
  let component: WorkoutChartComponent;
  let fixture: ComponentFixture<WorkoutChartComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      declarations: [ WorkoutChartComponent ],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    const testUsers = [
      { id: 1, name: 'Test User', workouts: [{ type: 'Running', minutes: 30 }] }
    ];
    userServiceSpy.getUsers.and.returnValue(of(testUsers));

    fixture.detectChanges();

    expect(component.users).toEqual(testUsers);
  });

  it('should select user and create chart', () => {
    const testUser = { id: 1, name: 'Test User', workouts: [{ type: 'Running', minutes: 30 }] };
    component.users = [testUser];
    
    spyOn(component, 'createOrUpdateChart');
    component.selectUser(testUser);

    expect(component.selectedUser).toEqual(testUser);
    expect(component.createOrUpdateChart).toHaveBeenCalled();
  });

  it('should create new chart when no chart exists', () => {
    const testUser = { id: 1, name: 'Test User', workouts: [{ type: 'Running', minutes: 30 }] };
    component.selectedUser = testUser;

    spyOn(Chart, 'register').and.callThrough();
    component.createOrUpdateChart();

    expect(component.chart).toBeTruthy();
  });

  it('should update existing chart', () => {
    const testUser = { id: 1, name: 'Test User', workouts: [{ type: 'Running', minutes: 30 }] };
    component.selectedUser = testUser;
    component.chart = new Chart('test', { type: 'bar', data: { labels: [], datasets: [{ data: [] }] } });

    spyOn(component.chart, 'update');
    component.createOrUpdateChart();

    expect(component.chart.update).toHaveBeenCalled();
  });

  it('should not create or update chart when no user is selected', () => {
    component.selectedUser = null;
    spyOn(Chart, 'register');

    component.createOrUpdateChart();

    expect(Chart.register).not.toHaveBeenCalled();
    expect(component.chart).toBeUndefined();
  });

  it('should generate random color', () => {
    const color = component.getRandomColor();
    expect(color).toMatch(/^#[0-9A-F]{6}$/i);
  });
});
