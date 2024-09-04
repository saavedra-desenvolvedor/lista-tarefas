import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tarefa } from '../models/tarefa.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public tarefas: Tarefa[] = [];
  public title: string = "Minhas tarefas";
  public form: FormGroup;
  public editMode: boolean[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.required
      ])]
    });
    this.load();  // Certifique-se de que o método load() está sendo chamado no construtor.
  }

  add() {
    const title = this.form.controls['title'].value;
    const id = this.tarefas.length + 1;
    this.tarefas.push(new Tarefa(id, title, false));
    this.save();
    this.clear();
  }

  clear() {
    this.form.reset();
  }

  remove(tarefa: Tarefa): void {
    if (confirm('Tem certeza que deseja remover esta tarefa?')) {
      // Código para remover a tarefa
      this.tarefas = this.tarefas.filter(t => t !== tarefa);
      this.updateIds(); // Reordena as tarefas após a remoção
      this.save();
    }
  }

  updateIds() {
    this.tarefas.forEach((tarefa, index) => {
      tarefa.id = index + 1;
    });
  }

  markAsDone(tarefa: Tarefa) {
    tarefa.done = true;
    this.save();
  }

  markAsUnDone(tarefa: Tarefa) {
    tarefa.done = false;
    this.save();
  }

  save() {
    const data = JSON.stringify(this.tarefas);
    localStorage.setItem('tarefas', data);
  }

  load() {
    const data = localStorage.getItem('tarefas');
    if (data) {
      this.tarefas = JSON.parse(data);
      this.editMode = new Array(this.tarefas.length).fill(false);
    } else {
      this.tarefas = [];
    }
  }

  edit(tarefa: Tarefa) {
    const index = this.tarefas.indexOf(tarefa);
    this.editMode[index] = true;
  }

  saveEdit(tarefa: Tarefa, newTitle: string): void {
    if (confirm('Tem certeza que deseja salvar as alterações desta tarefa?')) {
      // Código para salvar as alterações da tarefa
      tarefa.title = newTitle;
      this.editMode[this.tarefas.indexOf(tarefa)] = false;
      this.save();
    }
  }

  cancelEdit(tarefa: Tarefa): void {
    if (confirm('Tem certeza que deseja cancelar a edição? As alterações não serão salvas.')) {
      // Código para cancelar a edição
      this.editMode[this.tarefas.indexOf(tarefa)] = false;
    }
  }

  // No seu componente TypeScript
  toggleAnimation(target: EventTarget | null, shouldAnimate: boolean): void {
    const icon = target as HTMLElement;
    if (icon) {
      if (shouldAnimate) {
        // Remove a classe de animação removida e restaura a animação
        icon.classList.remove('icon-no-animation');
      } else {
        // Adiciona a classe de animação removida
        icon.classList.add('icon-no-animation');
      }
    }
  }
}
