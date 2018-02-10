/* Copyright 2018 Mozilla Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { EventDispatcher, ModelRef, Project, File, Directory } from "../model";

export class AppStore {
  private project: Project;

  onLoadProject = new EventDispatcher("AppStore onLoadProject");
  onDidChangeStatus = new EventDispatcher("AppStore onDidChangeStatus");
  onDidChangeProblems = new EventDispatcher("AppStore onDidChangeProblems");
  onChange = new EventDispatcher("AppStore onChange");
  onDirtyFileUsed = new EventDispatcher("AppStore onDirtyFileUsed");
  onDidChangeBuffer = new EventDispatcher("AppStore onDidChangeBuffer");
  onDidChangeData = new EventDispatcher("AppStore onDidChangeData");
  onDidChangeChildren = new EventDispatcher("AppStore onDidChangeChildren");

  constructor() {
    this.project = null;
  }

  get onRun() { return Project.onRun; }
  get onBuild() { return Project.onBuild; }

  public initStore() {
    this.project = new Project();
    this.bindProject();
  }

  public loadProject(project: Project) {
    this.project = project;
    this.bindProject();
    this.onLoadProject.dispatch();
  }

  private bindProject() {
    this.project.onDidChangeStatus.register(() => this.onDidChangeStatus.dispatch());
    this.project.onDidChangeProblems.register(() => this.onDidChangeProblems.dispatch());
    this.project.onChange.register(() => this.onChange.dispatch());
    this.project.onDirtyFileUsed.register((file: File) => this.onDirtyFileUsed.dispatch(file));
    this.project.onDidChangeBuffer.register(() => this.onDidChangeBuffer.dispatch());
    this.project.onDidChangeData.register(() => this.onDidChangeData.dispatch());
    this.project.onDidChangeChildren.register(() => this.onDidChangeChildren.dispatch());
  }

  public addFile(file: File) {
    this.project.addFile(file);
  }

  public getProject(): ModelRef<Project> {
    return ModelRef.getRef(this.project);
  }

  public getFileByName(name: string): ModelRef<File> {
    const file = this.project.getFile(name);
    return file ? ModelRef.getRef(file) : null;
  }

  public getFileSource(file: ModelRef<File>): string {
    return file.getModel().getData() as string;
  }

  public getFileBuffer(file: ModelRef<File>) {
    return file.getModel().buffer;
  }

  public getParent(file: ModelRef<File>): ModelRef<Directory> {
    const { parent } = file.getModel();
    return parent ? ModelRef.getRef(parent) : null;
  }

  public getImmediateChild(directory: ModelRef<Directory>, name: string): ModelRef<File> {
    const child = directory.getModel().getImmediateChild(name);
    return child ? ModelRef.getRef(child) : null;
  }

  public getPath(directory: ModelRef<Directory>): string;
  public getPath(file: ModelRef<File>): string {
    return file.getModel().getPath();
  }

  public getStatus(): string {
    return this.project.status;
  }
}

const appStore = new AppStore();

export default appStore;
