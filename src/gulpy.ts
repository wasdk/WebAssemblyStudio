import { resolve } from "url";

export type PromiseMaker = () => Promise<any>;

class Task {
  dependencies: Task [];
  promiseMaker: PromiseMaker;
  
  constructor(dependencies: Task [], promiseMaker: PromiseMaker) {
    this.dependencies = dependencies;
    this.promiseMaker = promiseMaker;
  }
}

class TaskInstance {
  task: Task;
  promise: Promise<any>;
  constructor(task: Task) {
    this.task = task;
    this.promise = null;
  }
  makePromise(): Promise<any> {
    if (this.promise) {
      return this.promise;
    }
    return this.promise = this.task.promiseMaker();
  }
}

class GulpySession {
  private gulpy: Gulpy;
  private tasks: Map<Task, TaskInstance> = new Map();
  constructor(gulpy: Gulpy) {
    this.gulpy = gulpy;
  }
  ensureInstance(task: Task): TaskInstance {
    let instance = this.tasks.get(task);
    if (instance) {
      return instance;
    }
    instance = new TaskInstance(task);
    this.tasks.set(task, instance);
    return instance;
  }
  async runInstance(instance: TaskInstance): Promise<any> {
    let dependencies = instance.task.dependencies.map(x => this.ensureInstance(x));
    await Promise.all(dependencies.map(x => this.runInstance(x)));
    return instance.makePromise();
  }
  run(task: Task): Promise<any> {
    return this.runInstance(this.ensureInstance(task))
  }
}
export class Gulpy {
  private tasks: { [name: string]: Task } = {};
  private session: GulpySession;
  
  constructor() {

  }

  task(name: string, fn: PromiseMaker): void;
  task(name: string, dependencies: string[], fn: PromiseMaker): void;
  task(name: string, a: string [] | PromiseMaker, b?: PromiseMaker): void {
    let dependencies: string [] = [];
    let fn: PromiseMaker = null;
    if (arguments.length == 3) {
      dependencies = a as string [];
      fn = b;
    } else if (arguments.length == 2) {
      fn = a as PromiseMaker;
    }
    this.tasks[name] = new Task(dependencies.map(x => this.tasks[x]), fn);
  }
  series(tasks: string[]): PromiseMaker {
    return null;
  }
  parallel(tasks: string[]): PromiseMaker {
    return null;
  }
  run(name: string) {
    let session = new GulpySession(this);
    session.run(this.tasks[name]);
  }
}

export function testGulpy() {
  let gulp = new Gulpy();

  gulp.task("b", () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Running Task B " + performance.now());
        resolve();
      }, 50);
    });
  });

  gulp.task("c", [], () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Running Task C " + performance.now());
        resolve();
      }, 100);
    });
  });

   gulp.task("a", ["b", "c"], () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Running Task A " + performance.now());
        resolve();
      }, 200);
    });
  });

  gulp.run("a");
}