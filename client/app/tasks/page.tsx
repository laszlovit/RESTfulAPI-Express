import { Task, columns } from "./columns";
import { DataTable } from "./data-table";

async function getTasks(): Promise<Task[]> {
  const res = await fetch("http://localhost:3000/api/tasks/getAll");
  const data = await res.json();
  return data.map((task: any) => ({ ...task, id: task._id }));
}

export default async function Page() {
  const data = await getTasks();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
