import React, { useState } from "react";
import { ClipboardCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import TaskCard from "./TaskCard";
const TaskList = ({isLoading = false, tasks = [],onEditTask,
  onstateChange,
}) => {

  const [searchTerm, setSearchTerm] = useState('')
  
  const filterTask = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(searchTerm.toLocaleLowerCase()) || (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchSearch;
  })
 const getTaskStats = () => {
   const AllTasksByStatus = {
     pending: tasks.filter((task) => task.status === "pending").length,
     inProgress: tasks.filter((task) => task.status === "in progress").length,
     completed: tasks.filter((task) => task.status === "completed").length,
   };

   const categorizedTasks = {
     all: filterTask,
     pending: filterTask.filter((task) => task.status === "pending"),
     inProgress: filterTask.filter((task) => task.status === "in progress"),
     completed: filterTask.filter((task) => task.status === "completed"),
   };

   const stats = {
     total: tasks.length,
     pending: AllTasksByStatus.pending,
     inProgress: AllTasksByStatus.inProgress,
     completed: AllTasksByStatus.completed,
   };

   const total = tasks.length;

   return { total, stats, categorizedTasks };
 };



  const { total, stats, categorizedTasks } = getTaskStats();
  const taskGrid = (tasks, emptyMessage) => {
    if (tasks.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-sm font-medium text-foreground">
              No tasks found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tasks.map((task) => (
          <div key={task._id}>
            <TaskCard
              task={task}
              onEditTask={onEditTask}
              onstateChange={onstateChange}
            />
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        <div className="bg-card p-4 rounded-sm shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.total}</p>
        </div>
        <div className="bg-card p-4 rounded-sm shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-muted-foreground">pending</p>
            <div className="h-2 w-2  rounded-full bg-blue-500"></div>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.pending}</p>
        </div>
        <div className="bg-card p-4 rounded-sm shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-muted-foreground">
              in progress
            </p>
            <div className="h-2 w-2  rounded-full bg-blue-500"></div>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {stats.inProgress}
          </p>
        </div>
        <div className="bg-card p-4 rounded-sm shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-muted-foreground">
              completed
            </p>
            <div className="h-2 w-2  rounded-full bg-blue-500"></div>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>
      {/* search input */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-100 dark:bg-gray-100"
          />
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
            <Badge variant="secondary">{stats.total}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pending
            <Badge variant="secondary">{stats.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="flex items-center gap-2">
            In Progress
            <Badge variant="secondary">{stats.inProgress}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            Completed
            <Badge variant="secondary">{stats.completed}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">{taskGrid(categorizedTasks.all, "No tasks found.")}</TabsContent>
        <TabsContent value="pending">
          {taskGrid(categorizedTasks.pending ,"No pending tasks found.")}
        </TabsContent>
        <TabsContent value="inProgress">
          {taskGrid(categorizedTasks.inProgress, "No tasks in progress found.")}
        </TabsContent>
        <TabsContent value="completed">
          {taskGrid(categorizedTasks.completed, "No completed tasks found.")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskList;
