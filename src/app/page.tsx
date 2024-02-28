"use client";
import { Provider, atom, useAtom, useSetAtom } from "jotai";
import { a, useTransition } from "@react-spring/web";

import { CloseOutlined } from "@ant-design/icons";
import { Radio } from "antd";
import { atomFamily } from "jotai/utils";
import { FormEvent } from "react";
import { nanoid } from "nanoid";

type Param = { id: string; title?: string };
const todoAtomFamily = atomFamily(
  (param: Param) =>
    atom({ title: param.title || "No title", completed: false }),
  (a: Param, b: Param) => a.id === b.id
);

const filterAtom = atom("all");
const todosAtom = atom<string[]>([]);
const filteredAtom = atom((get) => {
  const filter = get(filterAtom);
  const todos = get(todosAtom);
  if (filter === "all") return todos;
  else if (filter === "completed")
    return todos.filter((id) => get(todoAtomFamily({ id })).completed);
  else return todos.filter((id) => !get(todoAtomFamily({ id })).completed);
});

const TodoItem = ({
  id,
  remove,
}: {
  id: string;
  remove: (id: string) => void;
}) => {
  const [item, setItem] = useAtom(todoAtomFamily({ id }));
  const toggleCompleted = () =>
    setItem({ ...item, completed: !item.completed });
  return (
    <>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={toggleCompleted}
      />
      <span style={{ textDecoration: item.completed ? "line-through" : "" }}>
        {item.title}
      </span>
      <CloseOutlined onClick={() => remove(id)} />
    </>
  );
};

const Filter = () => {
  const [filter, set] = useAtom(filterAtom);
  return (
    <Radio.Group onChange={(e) => set(e.target.value)} value={filter}>
      <Radio value="all">All</Radio>
      <Radio value="completed">Completed</Radio>
      <Radio value="incompleted">Incompleted</Radio>
    </Radio.Group>
  );
};

const Filtered = ({ remove }: { remove: (id: string) => void }) => {
  const [todos] = useAtom(filteredAtom);
  const transitions = useTransition(todos, {
    keys: (id: string) => id,
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: 40 },
    leave: { opacity: 0, height: 0 },
  });
  return transitions((style, id) => (
    <a.div className="item" style={style}>
      <TodoItem id={id} remove={remove} />
    </a.div>
  ));
};

const ToDoList = () => {
  const setTodos = useSetAtom(todosAtom);
  const remove = (id: string) => {
    setTodos((prev) => prev.filter((item) => item !== id));
    todoAtomFamily.remove({ id });
  };

  const add = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = e.currentTarget.inputTitle.value;
    e.currentTarget.inputTitle = "";
    const id = nanoid();
  };
};

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Jōtai ToDo App</p>
      <div className="backdrop-blur-sm bg-white/30 w-3/4 p-20 h-[800px] rounded-md max-w-5xl">
        <div className="z-10 max-w-5xl w-full mb-[30px] items-center justify-between text-sm lg:flex">
          <input
            type="text"
            placeholder="Add Task..."
            className="p-2 w-[330px] text-black border-none"
          />
          <div className="lg:flex gap-6 lg:justify-between justify-center">
            <div>
              <input type="radio" name="All" id="" />
              <label htmlFor="" className="ml-2">
                All
              </label>
            </div>
            <div>
              <input type="radio" name="Completed" id="" />
              <label htmlFor="" className="ml-2">
                Complete
              </label>
            </div>
            <div>
              <input type="radio" name="Incomplete" id="" />
              <label htmlFor="" className="ml-2">
                Incomplete
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div>by Kūan</div>
      </div>
    </main>
  );
}

//fetaures needed in creating a tofo app in jōtai:

//goals:
//press enter to add task
//add feature that allows to add, delete and update a todo list with jotai
//make sure that the added tasks are save on the local storage
