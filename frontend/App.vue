<template>
  <div class="container py-5">
    <ul>
      <li
        v-for="todo in todos"
        :key="todo._id"
        :class="{ done: todo.done, 'my-3': true }"
      >
        {{ todo.text }}
        <button @click="markDone(todo)" class="btn btn-primary btn-sm ml-2">
          Done
        </button>
        <button @click="deleteOne(todo)" class="btn btn-danger btn-sm ml-1">
          Delete
        </button>
      </li>
      <li>
        <input v-model="newTodo" type="text" placeholder="Text of your todo" />
        <button
          :disabled="!newTodo"
          @click="addTodo()"
          class="btn btn-primary btn-sm ml-2"
        >
          Add Todo
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todos: [],
      newTodo: ""
    };
  },
  methods: {
    async addTodo() {
      const res = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: this.newTodo })
      });
      if (!res.ok) {
        return alert("Unable to add todo, please refresh the page");
      }
      const data = await res.json();
      this.todos.push(data);
      this.newTodo = "";
    },
    async markDone(todo) {
      const res = await fetch(`http://localhost:3000/todos/${todo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !todo.done })
      });
      if (!res.ok) {
        return alert("Unable to update todo, please refresh the page");
      }
      const data = await res.json();
      const i = this.todos.indexOf(todo);
      // Vue requires that we update the array like this
      // it doesn't support directly setting an index
      this.todos.splice(i, 1, data);
    },
    async deleteOne(todo) {
      const res = await fetch(`http://localhost:3000/todos/${todo._id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        return alert("Unable to delete todo, please refresh the page");
      }
      const i = this.todos.indexOf(todo);
      this.todos.splice(i, 1);
    }
  },
  async mounted() {
    const res = await fetch("http://localhost:3000/todos");
    if (!res.ok) {
      return alert("Unable to fetch todos, try again later");
    }
    const data = await res.json();
    this.todos = data;
  }
};
</script>

<style>
@import url("./bootstrap.min.css");
.done {
  text-decoration: line-through black;
}
</style>
